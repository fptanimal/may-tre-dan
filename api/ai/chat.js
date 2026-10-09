export const config = {
    runtime: 'edge',
};

// ĐÃ SỬA: model cũ "gemini-1.5-flash-latest" đã bị Google khai tử hoàn toàn (Gemini 1.0 & 1.5 shutdown),
// mọi request gọi tới đều trả lỗi 404 -> đây là lý do chatbot báo lỗi liên tục.
const CHAT_MODEL = 'gemini-2.5-flash';

export default async function handler(req) {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured. Hãy thêm biến môi trường GEMINI_API_KEY trong Vercel > Settings > Environment Variables rồi deploy lại.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { messages, lang, systemPrompt } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages array' }), { status: 400 });
        }

        const payload = {
            systemInstruction: {
                parts: [{ text: systemPrompt || 'Bạn là trợ lý AI thông minh của Phú Vinh Shop. Hãy tư vấn cho khách hàng một cách thân thiện về các sản phẩm thủ công mỹ nghệ mây tre đan.' }]
            },
            contents: messages.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            })),
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google API Error:', errorText);
            return new Response(JSON.stringify({ error: `Google API returned ${response.status}: ${errorText}` }), { status: 500 });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}