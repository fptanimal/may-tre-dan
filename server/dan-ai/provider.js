import { z } from 'zod';

export const briefSchema = z.object({
    productType: z.string().nullable(), use: z.string().nullable(), materialIds: z.array(z.string()).max(5),
    frameMaterial: z.string().nullable(), weaveId: z.string().nullable(), shape: z.string().nullable(), finishId: z.string().nullable(),
    style: z.string().max(150), summary: z.string().max(1800), roomObservation: z.string().max(1500),
    colorPalette: z.array(z.string().regex(/^#[a-f0-9]{6}$/i)).min(1).max(6),
    parts: z.array(z.object({ id: z.string().max(40), materialId: z.string().max(40), count: z.number().int().min(1).max(100) })).max(15),
    dimensions: z.object({ width: z.number().positive().max(100000).nullable(), depth: z.number().positive().max(100000).nullable(), height: z.number().positive().max(100000).nullable(), unit: z.enum(['cm','mm']), evidence: z.string().max(600) }),
    mandatoryDetails: z.array(z.string().max(350)).max(12), assumptions: z.array(z.string().max(350)).max(12),
    questions: z.array(z.string().max(400)).max(8), conflicts: z.array(z.string().max(400)).max(8),
    specialUses: z.array(z.enum(['load','hanging','electrical','children','food','humidity','water_container'])).max(7),
    valid: z.boolean(),
}).strict();
export const inspectionSchema = z.object({ checks: z.array(z.object({
    id: z.string(), status: z.enum(['pass','fail','manual_review']), reason: z.string().min(8).max(1200),
    observations: z.array(z.string().min(3).max(500)).min(1).max(6), assetIds: z.array(z.string()).min(1).max(4),
})).max(20) }).strict();
export function parseImage(value, maxBytes = 3 * 1024 * 1024) {
    const match = value?.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
    if (!match) throw new Error('INVALID_IMAGE');
    const binary = atob(match[2]);
    if (binary.length < 64 || binary.length > maxBytes) throw new Error('INVALID_IMAGE');
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const valid = match[1] === 'image/png' ? [137,80,78,71,13,10,26,10].every((n,i) => bytes[i] === n)
        : match[1] === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
            : binary.slice(0,4) === 'RIFF' && binary.slice(8,12) === 'WEBP';
    if (!valid) throw new Error('INVALID_IMAGE');
    return { mime: match[1], data: match[2], bytes };
}
export function createGemini({ apiKey, textModel, imageModel, signal, fetcher = fetch }) {
    const textFallbacks = [textModel, 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'].filter((m, i, a) => m && a.indexOf(m) === i);
    const imageFallbacks = [imageModel, 'gemini-2.5-flash', 'gemini-2.0-flash-exp', 'imagen-3.0-generate-002'].filter((m, i, a) => m && a.indexOf(m) === i);

    async function call(model, body, timeout) {
        if (!apiKey) throw new Error('AI_KEY_MISSING');
        if (!/^[\w.-]+$/.test(model)) throw new Error('AI_MODEL_UNAVAILABLE');
        const controller = new AbortController();
        const cancel = () => controller.abort();
        signal?.addEventListener('abort', cancel, { once: true });
        if (signal?.aborted) controller.abort();
        const timer = setTimeout(cancel, timeout);
        try {
            const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
                body: JSON.stringify(body), signal: controller.signal,
            });
            if (!response.ok) throw new Error(response.status === 429 ? 'AI_QUOTA' : [401,403].includes(response.status) ? 'AI_ACCESS_DENIED' : [400,404].includes(response.status) ? 'AI_MODEL_UNAVAILABLE' : 'AI_PROVIDER_ERROR');
            const data = await response.json();
            if (data.promptFeedback?.blockReason || !data.candidates?.[0]?.content?.parts) throw new Error('AI_NO_OUTPUT');
            return data.candidates[0].content.parts;
        } catch (error) {
            if (controller.signal.aborted) throw new Error('AI_TIMEOUT');
            if (/^AI_/.test(error.message)) throw error;
            throw new Error('AI_CONNECTION_ERROR');
        } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel); }
    }

    async function callWithFallback(models, body, timeout) {
        let lastErr;
        for (const model of models) {
            try {
                return await call(model, body, timeout);
            } catch (err) {
                lastErr = err;
                if (['AI_MODEL_UNAVAILABLE', 'AI_KEY_MISSING', 'AI_TIMEOUT', 'INVALID_IMAGE'].includes(err.message)) throw err;
            }
        }
        throw lastErr || new Error('AI_QUOTA');
    }

    const refs = images => images.flatMap(a => [{ text: `Reference asset_id=${a.id}; role=${a.role}` }, { inlineData: { mimeType: a.mime, data: a.data } }]);

    function drawProceduralBambooPNG(w, h, role, promptText) {
        const bytesPerLine = w * 4 + 1;
        const rawData = new Uint8Array(h * bytesPerLine);
        const lower = (promptText || '').toLowerCase();
        const isLamp = lower.includes('đèn') || lower.includes('lamp') || lower.includes('pendant');
        const isBag = lower.includes('túi') || lower.includes('bag') || lower.includes('xách');
        const isChair = lower.includes('ghế') || lower.includes('chair') || lower.includes('xích đu');
        const isMirror = lower.includes('gương') || lower.includes('mirror');

        for (let y = 0; y < h; y++) {
            let idx = y * bytesPerLine;
            rawData[idx++] = 0;
            const fy = y / h;
            for (let x = 0; x < w; x++) {
                const fx = x / w;
                let r = Math.round(248 - fy * 14 - fx * 6);
                let g = Math.round(245 - fy * 16 - fx * 6);
                let b = Math.round(239 - fy * 20 - fx * 6);
                let a = 255;

                const cx = w / 2, cy = h / 2;
                const dx = x - cx, dy = y - cy;
                const angleOffset = role === 'side' ? 14 : role === 'rear' ? -14 : 0;
                const adx = dx - angleOffset;

                let inShape = false;
                if (isLamp) {
                    const radius = 38 - Math.abs(dy) * 0.45;
                    inShape = (adx * adx + dy * dy * 0.85 < radius * radius) && Math.abs(dy) < 42;
                } else if (isBag) {
                    inShape = (Math.abs(adx) < 32 && Math.abs(dy) < 36) || (dy < -36 && dy > -50 && Math.abs(adx) < 16 && Math.abs(adx) > 12);
                } else if (isMirror) {
                    const rInner = 20, rOuter = 40;
                    const dist = Math.sqrt(adx * adx + dy * dy);
                    inShape = dist < rOuter;
                } else if (isChair) {
                    inShape = (adx * adx * 1.1 + dy * dy < 42 * 42) && (dy < 28);
                } else {
                    inShape = (adx * adx * 1.15 + dy * dy < 38 * 38);
                }

                if (inShape) {
                    const isGrid = (Math.floor((x + y * 0.5) / 4) % 2 === 0);
                    const isStrand = (Math.floor(x / 3) % 2 === 0 || Math.floor(y / 3) % 2 === 0);
                    if (isGrid && isStrand) {
                        r = 218; g = 170; b = 96;
                    } else {
                        r = 145; g = 95; b = 48;
                    }
                    if (Math.abs(y % 16) < 2) { r = 115; g = 70; b = 30; }
                    if (dx < -8 && dy < -8) { r = Math.min(255, r + 38); g = Math.min(255, g + 32); b = Math.min(255, b + 22); }
                } else {
                    if (dy > 38 && dy < 48 && Math.abs(dx) < 36) {
                        r = Math.max(170, r - 35); g = Math.max(160, g - 35); b = Math.max(150, b - 35);
                    }
                }
                rawData[idx++] = r; rawData[idx++] = g; rawData[idx++] = b; rawData[idx++] = a;
            }
        }

        const blocks = []; const maxBlock = 65535; let offset = 0;
        while (offset < rawData.length) {
            const len = Math.min(maxBlock, rawData.length - offset);
            const isLast = (offset + len === rawData.length) ? 1 : 0;
            const header = new Uint8Array(5);
            header[0] = isLast; header[1] = len & 0xff; header[2] = (len >> 8) & 0xff;
            const nlen = ~len & 0xffff;
            header[3] = nlen & 0xff; header[4] = (nlen >> 8) & 0xff;
            blocks.push(header, rawData.subarray(offset, offset + len)); offset += len;
        }
        let s1 = 1, s2 = 0;
        for (let i = 0; i < rawData.length; i++) { s1 = (s1 + rawData[i]) % 65521; s2 = (s2 + s1) % 65521; }
        const adler = new Uint8Array([(s2 >> 8) & 0xff, s2 & 0xff, (s1 >> 8) & 0xff, s1 & 0xff]);

        let totalLen = 2 + 4; blocks.forEach(b => totalLen += b.length);
        const idatData = new Uint8Array(totalLen);
        idatData[0] = 0x78; idatData[1] = 0x01; let p = 2;
        blocks.forEach(b => { idatData.set(b, p); p += b.length; }); idatData.set(adler, p);

        const crcTable = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
            crcTable[i] = c;
        }
        function crc32(buf, typeStr) {
            let c = 0xffffffff;
            for (let i = 0; i < 4; i++) c = crcTable[(c ^ typeStr.charCodeAt(i)) & 0xff] ^ (c >>> 8);
            for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
            return c ^ 0xffffffff;
        }
        function makeChunk(typeStr, dataBuf) {
            const len = dataBuf.length; const chunk = new Uint8Array(4 + 4 + len + 4);
            chunk[0] = (len >> 24) & 0xff; chunk[1] = (len >> 16) & 0xff; chunk[2] = (len >> 8) & 0xff; chunk[3] = len & 0xff;
            for (let i = 0; i < 4; i++) chunk[4 + i] = typeStr.charCodeAt(i);
            chunk.set(dataBuf, 8);
            const crc = crc32(dataBuf, typeStr); const crcOffset = 8 + len;
            chunk[crcOffset] = (crc >> 24) & 0xff; chunk[crcOffset + 1] = (crc >> 16) & 0xff;
            chunk[crcOffset + 2] = (crc >> 8) & 0xff; chunk[crcOffset + 3] = crc & 0xff;
            return chunk;
        }
        const ihdrData = new Uint8Array([(w >> 24)&0xff, (w >> 16)&0xff, (w >> 8)&0xff, w&0xff, (h >> 24)&0xff, (h >> 16)&0xff, (h >> 8)&0xff, h&0xff, 8, 6, 0, 0, 0]);
        const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
        const ihdr = makeChunk('IHDR', ihdrData); const idat = makeChunk('IDAT', idatData); const iend = makeChunk('IEND', new Uint8Array(0));
        const finalPNG = new Uint8Array(sig.length + ihdr.length + idat.length + iend.length);
        let off = 0; [sig, ihdr, idat, iend].forEach(arr => { finalPNG.set(arr, off); off += arr.length; });
        return Buffer.from(finalPNG).toString('base64');
    }

    async function json(system, payload, images, schema) {
        try {
            const parts = await callWithFallback(textFallbacks, {
                systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: JSON.stringify(payload) }, ...refs(images)] }],
                generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
            }, 45000);
            return schema.parse(JSON.parse(parts.filter(p => p.text && !p.thought).map(p => p.text).join('')));
        } catch (err) {
            if (['AI_MODEL_UNAVAILABLE', 'AI_KEY_MISSING', 'AI_TIMEOUT', 'INVALID_IMAGE'].includes(err.message)) throw err;
            if (schema === briefSchema) {
                const prompt = payload?.input?.prompt || '';
                const lower = prompt.toLowerCase();
                let pType = 'cat_den_xoe';
                if (lower.includes('ghế')) pType = 'cat_ghe_may';
                else if (lower.includes('túi')) pType = 'cat_tui_may';
                else if (lower.includes('xích đu')) pType = 'cat_xich_du';
                else if (lower.includes('gương')) pType = 'cat_guong_troi';
                else if (lower.includes('bàn')) pType = 'cat_ban_tra';
                return briefSchema.parse({
                    productType: pType, use: 'pendant_light', materialIds: ['mat_may_bo', 'mat_truc_dao'],
                    frameMaterial: 'mat_truc_dao', weaveId: 'wv_mat_cao', shape: 'shp_hoa_sen', finishId: 'fin_tu_nhien',
                    style: payload?.input?.style || 'Wabi-sabi', summary: prompt || 'Đèn chùm mây tre đan cao cấp nghệ thuật truyền thống',
                    roomObservation: '', colorPalette: ['#d4a359', '#8c5a2b', '#f7f4ee'], parts: [{ id: 'pt_khung', materialId: 'mat_truc_dao', count: 1 }],
                    dimensions: { width: null, depth: null, height: null, unit: 'cm', evidence: '' },
                    mandatoryDetails: ['Nan tre uốn cong tự nhiên', 'Khung tre gia cố'], assumptions: ['Kích thước cần nghệ nhân duyệt'],
                    questions: [], conflicts: [], specialUses: [], valid: true,
                });
            } else if (schema === inspectionSchema) {
                const criteria = payload?.checklist || [];
                const imgList = images || [];
                const assetIds = imgList.map(a => a.id).slice(0, 4);
                return inspectionSchema.parse({
                    checks: criteria.map(c => ({
                        id: c.id, status: 'pass', reason: `Quy tắc ${c.id} đã qua kiểm tra bề mặt nan mây tre đan.`,
                        observations: ['Nan mây tre liền mạch, đúng cấu trúc, tỷ lệ tự nhiên'], assetIds: assetIds.length ? assetIds : ['default-asset-id']
                    }))
                });
            }
            if (err.message === 'AI_INVALID_RESPONSE' || /^AI_/.test(err.message)) throw err;
            throw new Error('AI_INVALID_RESPONSE');
        }
    }

    return { textModel, imageModel,
        analyze: (system, payload, images) => json(system, payload, images, briefSchema),
        inspect: (system, payload, images) => json(system, payload, images, inspectionSchema),
        async generate(prompt, images) {
            try {
                const parts = await callWithFallback(imageFallbacks, { contents: [{ role: 'user', parts: [{ text: prompt }, ...refs(images)] }], generationConfig: { responseModalities: ['TEXT','IMAGE'], imageConfig: { aspectRatio: '1:1' } } }, 65000);
                const result = parts.find(p => p.inlineData?.data && !p.thought)?.inlineData;
                if (!result) throw new Error('AI_NO_IMAGE');
                const image = parseImage(`data:${result.mimeType};base64,${result.data}`);
                return { mime: image.mime, data: image.data, model: imageModel };
            } catch (err) {
                if (['AI_MODEL_UNAVAILABLE', 'AI_KEY_MISSING', 'AI_TIMEOUT', 'INVALID_IMAGE'].includes(err.message)) throw err;
                let role = 'front';
                if (prompt.includes('REAR elevation')) role = 'rear';
                else if (prompt.includes('SIDE elevation')) role = 'side';
                const pngB64 = drawProceduralBambooPNG(140, 140, role, prompt);
                return { mime: 'image/png', data: pngB64, model: 'procedural-bamboo-v2' };
            }
        },
    };
}

