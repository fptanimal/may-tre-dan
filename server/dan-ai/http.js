import { inputSchema, runWorkflow } from './workflow.js';
import { createGemini } from './provider.js';

let active = 0;
const allowedErrors = new Set(['AI_KEY_MISSING','AI_MODEL_UNAVAILABLE','AI_QUOTA','AI_ACCESS_DENIED','AI_PROVIDER_ERROR','AI_NO_OUTPUT','AI_TIMEOUT','AI_CONNECTION_ERROR','AI_INVALID_RESPONSE','AI_NO_IMAGE','INVALID_IMAGE','INPUT_REQUIRED','NEEDS_INPUT','CONSTRAINT_VIOLATION','VISUAL_CHECK_FAILED','UNSUPPORTED_COMBINATION','UNSUPPORTED_MATERIAL','UNSUPPORTED_PART','UNSUPPORTED_FRAME','UNSUPPORTED_COLOR','WATER_LINER_REQUIRED','INCOMPLETE_VISION_CHECK','INVALID_VISION_EVIDENCE']);
export async function designResponse(request, configuration = {}, dependencies = {}) {
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
    const json = (data, status) => Response.json(data, { status, headers });
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405);
    if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'CROSS_ORIGIN_REQUEST' }, 403);
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
            const provider = dependencies.provider || createGemini({ ...configuration, signal: controller.signal });
            runWorkflow(input, provider, send, controller.signal).then(result => {
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
