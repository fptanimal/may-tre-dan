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
    const refs = images => images.flatMap(a => [{ text: `Reference asset_id=${a.id}; role=${a.role}` }, { inlineData: { mimeType: a.mime, data: a.data } }]);
    async function json(system, payload, images, schema) {
        const parts = await call(textModel, {
            systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: JSON.stringify(payload) }, ...refs(images)] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
        }, 45000);
        try { return schema.parse(JSON.parse(parts.filter(p => p.text && !p.thought).map(p => p.text).join(''))); }
        catch { throw new Error('AI_INVALID_RESPONSE'); }
    }
    return { textModel, imageModel,
        analyze: (system, payload, images) => json(system, payload, images, briefSchema),
        inspect: (system, payload, images) => json(system, payload, images, inspectionSchema),
        async generate(prompt, images) {
            const parts = await call(imageModel, { contents: [{ role: 'user', parts: [{ text: prompt }, ...refs(images)] }], generationConfig: { responseModalities: ['TEXT','IMAGE'], imageConfig: { aspectRatio: '1:1' } } }, 65000);
            const result = parts.find(p => p.inlineData?.data && !p.thought)?.inlineData;
            if (!result) throw new Error('AI_NO_IMAGE');
            const image = parseImage(`data:${result.mimeType};base64,${result.data}`);
            return { mime: image.mime, data: image.data, model: imageModel };
        },
    };
}
