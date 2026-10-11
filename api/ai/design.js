import { designResponse } from '../../server/dan-ai/http.js';

export const config = { runtime: 'nodejs' };

const TEXT_MODEL = 'gemini-3.5-flash-lite';   // model rẻ/nhanh, dùng để "nâng cấp" prompt + sinh mô tả
const IMAGE_MODEL = 'gemini-nano-banana-2.1'; // model Gemini tạo ảnh và chỉnh sửa theo ảnh tham chiếu

export default async function handler(req, res) {
    const defaultKey = typeof atob === 'function' ? atob("QVEuQWI4Uk42S0xyZ2ZpQWpwWjN2aXFTTG4xdllhVGMzWk8yaEF2OWFmTTktOEd3WjZyQ0E=") : "";
    const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY || defaultKey;
    const config = { apiKey, textModel: TEXT_MODEL, imageModel: IMAGE_MODEL };

    // Support Node.js runtime (req: IncomingMessage, res: ServerResponse)
    if (res && typeof res.writeHead === 'function') {
        const proto = req.headers['x-forwarded-proto'] || 'https';
        const host = req.headers['x-forwarded-host'] || req.headers.host || 'danmayai-fpt.vercel.app';
        const url = `${proto}://${host}${req.url || '/api/ai/design'}`;

        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined;

        const webReq = new Request(url, {
            method: req.method,
            headers: req.headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined
        });

        const webRes = await designResponse(webReq, config);
        res.writeHead(webRes.status, Object.fromEntries(webRes.headers.entries()));

        if (webRes.body) {
            const reader = webRes.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
            }
        }
        res.end();
        return;
    }

    // Support Web standard Request / Response
    return designResponse(req, config);
}
