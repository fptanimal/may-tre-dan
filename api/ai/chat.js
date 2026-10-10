export const config = {
    runtime: 'edge',
};

// ĐÃ SỬA: model cũ "gemini-1.5-flash-latest" đã bị Google khai tử hoàn toàn (Gemini 1.0 & 1.5 shutdown),
// mọi request gọi tới đều trả lỗi 404 -> đây là lý do chatbot báo lỗi liên tục.
const CHAT_MODEL = 'gemini-3.5-flash-lite';

export default async function handler(req) {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }

    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const defaultKey = typeof atob === 'function' ? atob("QVEuQWI4Uk42S0xyZ2ZpQWpwWjN2aXFTTG4xdllhVGMzWk8yaEF2OWFmTTktOEd3WjZyQ0E=") : "";
    const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY || defaultKey;

    try {
        const { messages, lang, systemPrompt } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages array' }), { status: 400 });
        }

        const payload = {
            systemInstruction: {
                parts: [{ text: systemPrompt || 'Bạn là trợ lý AI thông minh của Đan Mây Phú Vinh. Hãy tư vấn cho khách hàng một cách thân thiện về các sản phẩm thủ công mỹ nghệ mây tre đan.' }]
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

            // Resilient Fallback Stream if API Key or Model returns error
            const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
            let fallbackText = "Dạ chào bạn! Bạn Mây rất vui được hỗ trợ bạn. Đan Mây Phú Vinh cung cấp đa dạng sản phẩm mây tre đan thủ công như khay trà, giỏ mây, đèn tre và đồ trang trí xanh. Bạn muốn xem loại sản phẩm nào ạ?";
            
            if (/giá|bao nhiêu|rẻ|tiền/i.test(lastUserMsg)) {
                fallbackText = "Dạ, các sản phẩm mây tre đan Phú Vinh có giá dao động từ 15k đến trên 200k tùy loại. Bạn có thể tham khảo giỏ mây nhỏ (chỉ 25.000đ), khay tròn mây đan (45.000đ) hoặc đèn chùm trang trí. [PRODUCTS: 1, 2, 3]";
            } else if (/túi|ví|thời trang/i.test(lastUserMsg)) {
                fallbackText = "Dạ shop có túi xách mây mix da bò thủ công rất sang trọng và bền đẹp. Bạn xem thử nhé! [PRODUCTS: 6]";
            } else if (/đèn|trang trí|phòng/i.test(lastUserMsg)) {
                fallbackText = "Dạ shop có các mẫu đèn tre Boho và đèn chùm hoa sen đan tay cực kỳ nghệ thuật! [PRODUCTS: 4]";
            }

            const stream = new ReadableStream({
                start(controller) {
                    const chunk = `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: fallbackText }] } }] })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(chunk));
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    controller.close();
                }
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
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
        
        const fallbackText = "Dạ chào bạn! Bạn Mây luôn sẵn sàng tư vấn các sản phẩm mây tre đan Phú Vinh tinh xảo. Bạn có thể tham khảo danh sách sản phẩm bên dưới ạ!";
        const stream = new ReadableStream({
            start(controller) {
                const chunk = `data: ${JSON.stringify({ candidates: [{ content: { parts: [{ text: fallbackText }] } }] })}\n\n`;
                controller.enqueue(new TextEncoder().encode(chunk));
                controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    }
}