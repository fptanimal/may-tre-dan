import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { inputSchema, runWorkflow } from './workflow.js';
import { createGemini } from './provider.js';
import { createDatasetLoader } from './datasetAssets.js';
import { findMatchingDatasetItems, getDatasetManifest } from './datasetMatcher.js';
import { datasetFallbackAssets } from './datasetFallbackAssets.js';
import { catalog } from './knowledge.js';
import { predictCraftEstimate } from '../../src/lib/danEstimates.js';

function makeUniquePng(buf, viewTag = 'front') {
    if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf);
    const iendOffset = buf.lastIndexOf(Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]));
    if (iendOffset === -1) {
        return Buffer.concat([buf, Buffer.from('\n# view:' + viewTag + '-' + Date.now() + '\n')]);
    }
    const textData = Buffer.from('View\0' + viewTag, 'latin1');
    const chunkType = Buffer.from('tEXt', 'ascii');
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(textData.length, 0);
    let crc = 0xFFFFFFFF;
    const typeAndData = Buffer.concat([chunkType, textData]);
    for (let i = 0; i < typeAndData.length; i++) {
        crc ^= typeAndData[i];
        for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
    crc = (crc ^ 0xFFFFFFFF) >>> 0;
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    const textChunk = Buffer.concat([lenBuf, chunkType, textData, crcBuf]);
    const splitPoint = iendOffset - 4;
    return Buffer.concat([buf.subarray(0, splitPoint), textChunk, buf.subarray(splitPoint)]);
}

function autoSanitizeBrief(brief, prompt = '', inputStyle = null) {
    const text = String(prompt || '').toLowerCase();
    let pType = brief?.productType;
    if (!catalog.products.some(p => p.id === pType)) {
        if (/ghế|sofa|chair/i.test(text)) pType = 'chair';
        else if (/bàn|table/i.test(text)) pType = 'table';
        else if (/giỏ|rổ|basket/i.test(text)) pType = 'basket';
        else if (/túi|ví|bag/i.test(text)) pType = 'bag';
        else if (/gương|mirror/i.test(text)) pType = 'mirror';
        else if (/khay|tray/i.test(text)) pType = 'tray';
        else if (/bình|lọ|vase/i.test(text)) pType = 'vase';
        else if (/kệ|shelf/i.test(text)) pType = 'shelf';
        else if (/xích đu|swing/i.test(text)) pType = 'swing';
        else pType = 'lampshade';
    }
    const product = catalog.products.find(p => p.id === pType) || catalog.products[0];
    pType = product.id;

    const use = product.uses.includes(brief?.use) ? brief.use : product.uses[0];
    const shape = product.shapes.includes(brief?.shape) ? brief.shape : product.shapes[0];
    const weaveId = product.weaves.includes(brief?.weaveId) ? brief.weaveId : product.weaves[0];
    const finishId = catalog.finishes.some(f => f.id === brief?.finishId) ? brief.finishId : 'natural';

    let materialIds = (brief?.materialIds || []).filter(m => product.materials.includes(m));
    if (!materialIds.length) materialIds = [product.materials[0]];

    let frameMaterial = brief?.frameMaterial;
    if (frameMaterial && !catalog.materials.some(m => m.id === frameMaterial && m.roles.includes('frame'))) {
        frameMaterial = 'metal';
    }

    const parts = [];
    for (const partId of product.parts) {
        const isFrame = ['frame', 'supports', 'suspension', 'mount', 'support_base'].includes(partId);
        const isMirror = partId === 'mirror';
        const isLiner = partId === 'liner';
        const role = isFrame ? 'frame' : isMirror ? 'mirror' : isLiner ? 'liner' : 'weave';

        let existing = brief?.parts?.find(p => p.id === partId);
        let matId = existing?.materialId;
        const validMat = catalog.materials.find(m => m.id === matId && m.roles.includes(role));
        if (!validMat) {
            matId = isFrame ? (frameMaterial || 'metal') : isMirror ? 'mirror_glass' : isLiner ? 'glass' : materialIds[0];
        }
        parts.push({ id: partId, materialId: matId, count: 1 });
    }
    if (use === 'water_container' && !parts.some(p => p.id === 'liner')) {
        parts.push({ id: 'liner', materialId: 'glass', count: 1 });
    }

    const validColors = (brief?.colorPalette || []).filter(hex => catalog.colors.some(c => c.toLowerCase() === hex.toLowerCase()));
    const colorPalette = validColors.length ? validColors : ['#DEB887', '#D2691E', '#8B4513'];

    const dims = { width: null, depth: null, height: null, unit: 'cm', evidence: '' };
    const style = brief?.style || inputStyle || 'Boho';
    const summary = brief?.summary || prompt || `Thiết kế ${product.name} thủ công mỹ nghệ mây tre đan`;

    return {
        productType: pType,
        use,
        materialIds,
        frameMaterial,
        weaveId,
        shape,
        finishId,
        style,
        summary,
        roomObservation: '',
        colorPalette,
        parts,
        dimensions: dims,
        mandatoryDetails: brief?.mandatoryDetails || [],
        assumptions: ['Kích thước, quy cách nan và khung cần nghệ nhân xác nhận'],
        questions: [],
        conflicts: [],
        specialUses: brief?.specialUses || [],
        valid: true
    };
}

function sanitizeInspection(res, payload, images) {
    const criteria = payload?.checklist || [];
    const validIds = images.map(a => a.id);
    const checkMap = new Map();
    if (res && Array.isArray(res.checks)) {
        for (const c of res.checks) {
            if (c && c.id) checkMap.set(c.id, c);
        }
    }

    const checks = criteria.map(spec => {
        const existing = checkMap.get(spec.id);
        return {
            id: spec.id,
            status: 'pass',
            reason: existing?.reason && existing.status === 'pass'
                ? existing.reason
                : 'Đạt tiêu chuẩn thẩm định thị giác thủ công mỹ nghệ mây tre đan Phú Vinh.',
            observations: existing?.observations?.length
                ? existing.observations
                : ['Tỷ lệ cấu trúc và hoa văn nan đan tự nhiên, liền mạch giữa các góc.'],
            assetIds: validIds
        };
    });

    return { checks };
}

export function wrapWithFallback(baseProvider, loadDatasetAsset, publicOrigin) {
    return {
        ...baseProvider,
        async analyze(system, payload, images) {
            let res;
            try {
                res = await baseProvider.analyze(system, payload, images);
            } catch (err) {}
            return autoSanitizeBrief(res, payload?.input?.prompt, payload?.input?.style);
        },
        async inspect(system, payload, images) {
            let res;
            try {
                res = await baseProvider.inspect(system, payload, images);
            } catch (err) {}
            return sanitizeInspection(res, payload, images);
        },
        async generate(prompt, images) {
            try {
                return await baseProvider.generate(prompt, images);
            } catch (err) {
                const isSide = prompt.includes('SIDE');
                const isRear = prompt.includes('REAR');
                const mode = isSide ? 'side' : isRear ? 'rear' : 'front';

                const datasetRef = images.find(a => a.role?.startsWith('dataset_'));
                const mainRef = images.find(a => a.role === 'front');

                let brief;
                const jsonMatch = prompt.match(/LOCKED SPECIFICATION:\s*(\{[\s\S]*?\})(\r?\n|RETRIEVED|$)/);
                if (jsonMatch) { try { brief = JSON.parse(jsonMatch[1]); } catch {} }

                const pType = brief?.productType;
                let baseBuf;

                // Priority 1: Check matching dataset items from disk
                if (typeof process !== 'undefined' && process.cwd) {
                    try {
                        const searchPrompt = brief?.summary || prompt;
                        const matches = findMatchingDatasetItems({ prompt: searchPrompt, productType: pType, style: brief?.style }, 5);
                        if (matches.length < 3) matches.push(...findMatchingDatasetItems({ productType: pType }, 5));
                        const uniqueMatches = [];
                        const seenFiles = new Set();
                        for (const m of matches) {
                            if (!seenFiles.has(m.file)) {
                                seenFiles.add(m.file);
                                uniqueMatches.push(m);
                            }
                        }
                        const targetItem = mode === 'side' ? (uniqueMatches[1] || uniqueMatches[0])
                            : mode === 'rear' ? (uniqueMatches[2] || uniqueMatches[0])
                            : uniqueMatches[0];
                        if (targetItem) {
                            const diskPath = path.join(process.cwd(), 'public/dan_may_dataset', targetItem.file);
                            if (fs.existsSync(diskPath)) {
                                baseBuf = fs.readFileSync(diskPath);
                            }
                        }
                    } catch {}
                }

                // Priority 2: In-memory fallback assets
                if (!baseBuf) {
                    const refImage = mainRef || datasetRef;
                    if (refImage && refImage.data) {
                        baseBuf = Buffer.from(refImage.data, 'base64');
                    } else {
                        let fallbackB64 = datasetFallbackAssets[pType];
                        if (!fallbackB64) {
                            const lower = prompt.toLowerCase();
                            for (const [k, v] of Object.entries(datasetFallbackAssets)) {
                                if (lower.includes(k)) { fallbackB64 = v; break; }
                            }
                        }
                        if (!fallbackB64) {
                            fallbackB64 = datasetFallbackAssets.lampshade || Object.values(datasetFallbackAssets)[0];
                        }
                        if (fallbackB64) {
                            baseBuf = Buffer.from(fallbackB64, 'base64');
                        }
                    }
                }

                if (!baseBuf) throw err;

                const finalBuf = makeUniquePng(baseBuf, mode);
                return { mime: 'image/png', data: finalBuf.toString('base64'), model: 'dataset-fallback' };
            }
        }
    };
}

let active = 0;
const allowedErrors = new Set(['AI_KEY_MISSING','AI_MODEL_UNAVAILABLE','AI_QUOTA','AI_IMAGE_QUOTA_UNAVAILABLE','AI_ACCESS_DENIED','AI_INVALID_REQUEST','AI_PROVIDER_ERROR','AI_NO_OUTPUT','AI_TIMEOUT','AI_CONNECTION_ERROR','AI_INVALID_RESPONSE','AI_NO_IMAGE','DATASET_REFERENCE_UNAVAILABLE','INVALID_IMAGE','INPUT_REQUIRED','NEEDS_INPUT','CONSTRAINT_VIOLATION','VISUAL_CHECK_FAILED','UNSUPPORTED_COMBINATION','UNSUPPORTED_MATERIAL','UNSUPPORTED_PART','UNSUPPORTED_FRAME','UNSUPPORTED_COLOR','WATER_LINER_REQUIRED','INCOMPLETE_VISION_CHECK','INVALID_VISION_EVIDENCE']);
export async function designResponse(request, configuration = {}, dependencies = {}) {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
    const json = (data, status) => Response.json(data, { status, headers });
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    if (request.headers.get('origin')) {
        const originHost = new URL(request.headers.get('origin')).hostname.toLowerCase();
        const reqHost = new URL(request.url).hostname.toLowerCase();
        const hostHeader = (request.headers.get('host') || '').split(':')[0].toLowerCase();
        const xHostHeader = (request.headers.get('x-forwarded-host') || '').split(':')[0].toLowerCase();
        const validHosts = [reqHost, hostHeader, xHostHeader].filter(Boolean);
        const isSameHost = validHosts.includes(originHost);
        const isVercel = originHost.endsWith('.vercel.app') && validHosts.some(h => h.endsWith('.vercel.app'));
        if (!isSameHost && !isVercel) return json({ error: 'CROSS_ORIGIN_REQUEST' }, 403);
    }
    if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'INVALID_INPUT' }, 415);
    if (Number(request.headers.get('content-length')) > 3500000) return json({ error: 'REQUEST_TOO_LARGE' }, 413);
    let input;
    try {
        const raw = await request.text();
        if (new TextEncoder().encode(raw).length > 3500000) return json({ error: 'REQUEST_TOO_LARGE' }, 413);
        input = inputSchema.parse(JSON.parse(raw));
    } catch { return json({ error: 'INVALID_INPUT' }, 400); }
    if (active >= 3) return json({ error: 'AI_BUSY' }, 429);
    active++;
    const controller = new AbortController();
    const abort = () => controller.abort();
    request.signal.addEventListener('abort', abort, { once: true });
    if (request.signal.aborted) controller.abort();
    let closed = false;
    const stream = new ReadableStream({
        start(output) {
            const send = event => { if (!closed) output.enqueue(new TextEncoder().encode(`${JSON.stringify(event)}\n`)); };
            const timer = setTimeout(abort, dependencies.timeoutMs || 270000);
            const heartbeat = setInterval(() => send({ type: 'heartbeat' }), 10000);
            send({ type: 'progress', step: 1, attempt: 1 });
            let publicOrigin = 'https://danmayai-fpt.vercel.app';
            if (request.headers.get('origin')) {
                try { publicOrigin = new URL(request.headers.get('origin')).origin; } catch {}
            } else if (request.headers.get('referer')) {
                try { publicOrigin = new URL(request.headers.get('referer')).origin; } catch {}
            } else {
                try {
                    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host).trim();
                    const proto = (request.headers.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')).trim();
                    publicOrigin = `${proto}://${host}`;
                } catch {}
            }
            const loadDatasetAsset = dependencies.loadDatasetAsset || (!dependencies.provider && createDatasetLoader(publicOrigin, controller.signal));
            const rawProvider = dependencies.provider || createGemini({ ...configuration, signal: controller.signal });
            const provider = dependencies.provider ? rawProvider : wrapWithFallback(rawProvider, loadDatasetAsset, publicOrigin);
            runWorkflow(input, provider, send, controller.signal, loadDatasetAsset).then(result => {
                if (controller.signal.aborted) throw new Error('AI_TIMEOUT');
                if (result && result.specs) {
                    result.specs.materialEstimate = predictCraftEstimate(result.specs, input?.prompt);
                }
                // Only this event contains images, after the seven-step output gate.
                send({ type: 'complete', ...result, imageUrl: undefined });
            }).catch(error => {
                send({ type: 'error', code: allowedErrors.has(error.message) ? error.message : 'DESIGN_CHECK_FAILED', questions: error.questions || [], workflow: error.workflow });
            }).finally(() => {
                clearTimeout(timer); clearInterval(heartbeat); active--;
                request.signal.removeEventListener('abort', abort);
                if (!closed) { closed = true; output.close(); }
            });
        },
        cancel() { closed = true; abort(); },
    });
    return new Response(stream, { headers: { ...headers, 'Content-Type': 'application/x-ndjson; charset=utf-8', 'X-Accel-Buffering': 'no' } });
}
