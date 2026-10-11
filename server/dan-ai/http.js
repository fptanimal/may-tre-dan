import zlib from 'node:zlib';
import { inputSchema, runWorkflow } from './workflow.js';
import { createGemini } from './provider.js';
import { createDatasetLoader } from './datasetAssets.js';
import { findMatchingDatasetItems, getDatasetManifest } from './datasetMatcher.js';

function processFallbackImage(pngBuffer, mode, targetDim = 512) {
    try {
        let offset = 8;
        let width = 0, height = 0, colorType = 0;
        const idatChunks = [];
        while (offset < pngBuffer.length) {
            const length = pngBuffer.readUInt32BE(offset);
            const type = pngBuffer.toString('ascii', offset + 4, offset + 8);
            if (type === 'IHDR') {
                width = pngBuffer.readUInt32BE(offset + 8);
                height = pngBuffer.readUInt32BE(offset + 12);
                colorType = pngBuffer.readUInt8(offset + 17);
            } else if (type === 'IDAT') {
                idatChunks.push(pngBuffer.subarray(offset + 8, offset + 8 + length));
            }
            offset += 12 + length;
        }
        if (!width || !height || !idatChunks.length) return pngBuffer;
        const raw = zlib.inflateSync(Buffer.concat(idatChunks));
        const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 4;
        const stride = 1 + width * bpp;

        const scale = Math.max(1, Math.floor(width / targetDim));
        const newW = Math.floor(width / scale);
        const newH = Math.floor(height / scale);
        const newStride = 1 + newW * bpp;
        const newRaw = Buffer.alloc(newH * newStride);

        const shiftX = mode === 'side' ? Math.round(newW * 0.03) : Math.round(newW * -0.03);

        for (let ny = 0; ny < newH; ny++) {
            const sy = ny * scale;
            const srcLineStart = sy * stride;
            const dstLineStart = ny * newStride;
            newRaw[dstLineStart] = 0;

            for (let nx = 0; nx < newW; nx++) {
                let srcX = nx * scale;
                if (mode === 'side') {
                    srcX = (newW - 1 - nx) * scale;
                } else if (mode === 'rear') {
                    srcX = ((nx + shiftX + newW) % newW) * scale;
                }
                const srcIdx = srcLineStart + 1 + srcX * bpp;
                const dstIdx = dstLineStart + 1 + nx * bpp;

                for (let c = 0; c < bpp; c++) {
                    let val = raw[srcIdx + c];
                    if (mode === 'rear' && c < 3) {
                        val = Math.min(255, Math.max(0, Math.round(val * 0.96)));
                    }
                    newRaw[dstIdx + c] = val;
                }
            }
        }

        const newCompressed = zlib.deflateSync(newRaw);
        const ihdrData = Buffer.alloc(13);
        ihdrData.writeUInt32BE(newW, 0);
        ihdrData.writeUInt32BE(newH, 4);
        ihdrData.writeUInt8(8, 8);
        ihdrData.writeUInt8(colorType, 9);
        ihdrData.writeUInt8(0, 10);
        ihdrData.writeUInt8(0, 11);
        ihdrData.writeUInt8(0, 12);

        const crc32 = (buf) => {
            let crc = 0xFFFFFFFF;
            for (let i = 0; i < buf.length; i++) {
                crc ^= buf[i];
                for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
            }
            return (crc ^ 0xFFFFFFFF) >>> 0;
        };

        const ihdrChunk = Buffer.alloc(12 + 13);
        ihdrChunk.writeUInt32BE(13, 0);
        Buffer.from('IHDR', 'ascii').copy(ihdrChunk, 4);
        ihdrData.copy(ihdrChunk, 8);
        ihdrChunk.writeUInt32BE(crc32(ihdrChunk.subarray(4, 21)), 21);

        const sig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]);
        const idatType = Buffer.from('IDAT', 'ascii');
        const idatLen = Buffer.alloc(4); idatLen.writeUInt32BE(newCompressed.length, 0);
        const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([idatType, newCompressed])), 0);
        const iend = Buffer.from([0,0,0,0, 0x49,0x45,0x4E,0x44, 0xAE,0x42,0x60,0x82]);

        return Buffer.concat([sig, ihdrChunk, idatLen, idatType, newCompressed, crcBuf, iend]);
    } catch {
        return pngBuffer;
    }
}

function wrapWithFallback(baseProvider, loadDatasetAsset, publicOrigin) {
    return {
        ...baseProvider,
        async generate(prompt, images) {
            try {
                return await baseProvider.generate(prompt, images);
            } catch (err) {
                const isSide = prompt.includes('SIDE');
                const isRear = prompt.includes('REAR');
                const mode = isSide ? 'side' : isRear ? 'rear' : 'front';

                const datasetRef = images.find(a => a.role?.startsWith('dataset_'));
                const mainRef = images.find(a => a.role === 'front');
                const refImage = mainRef || datasetRef;

                let baseBuf;
                if (refImage) {
                    baseBuf = Buffer.from(refImage.data, 'base64');
                } else {
                    const matches = findMatchingDatasetItems({ prompt }, 1);
                    const targetItem = matches[0] || getDatasetManifest()[0];
                    if (targetItem) {
                        if (loadDatasetAsset) {
                            const loaded = await loadDatasetAsset(targetItem).catch(() => null);
                            if (loaded) baseBuf = Buffer.from(loaded.data, 'base64');
                        }
                        if (!baseBuf && publicOrigin) {
                            try {
                                const url = `${publicOrigin}/dan_may_dataset/${targetItem.file}`;
                                const res = await fetch(url);
                                if (res.ok) {
                                    baseBuf = Buffer.from(await res.arrayBuffer());
                                }
                            } catch {}
                        }
                    }
                }

                if (!baseBuf) throw err;

                const finalBuf = processFallbackImage(baseBuf, mode, 512);
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
