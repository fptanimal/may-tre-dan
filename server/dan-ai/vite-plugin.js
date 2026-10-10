import { loadEnv } from 'vite';
export function danWorkflowPlugin() {
    return { name: 'dan-ai-workflow-local', apply: 'serve',
        configResolved(config) {
            const values = loadEnv(config.mode, config.envDir, '');
            for (const key of ['GEMINI_API_KEY','GEMINI_API_KEY2']) if (!process.env[key] && values[key]) process.env[key] = values[key];
        },
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (req.url?.split('?')[0] !== '/api/ai/design') return next();
                const controller = new AbortController();
                res.on('close', () => controller.abort());
                try {
                    let length = 0; const chunks = [];
                    for await (const chunk of req) {
                        length += chunk.length;
                        if (length > 3500000) { res.statusCode = 413; res.end('{"error":"REQUEST_TOO_LARGE"}'); return; }
                        chunks.push(chunk);
                    }
                    const module = await server.ssrLoadModule('/api/ai/design.js');
                    const response = await module.default(new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, signal: controller.signal, ...(chunks.length ? { body: Buffer.concat(chunks) } : {}) }));
                    res.statusCode = response.status;
                    response.headers.forEach((v,k) => res.setHeader(k,v));
                    res.flushHeaders();
                    for await (const chunk of response.body) { if (res.destroyed) break; res.write(chunk); }
                    res.end();
                } catch { if (!res.headersSent) { res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); } res.end('{"error":"DESIGN_SERVICE_ERROR"}'); }
            });
        },
    };
}
