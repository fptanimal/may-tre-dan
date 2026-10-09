export const config = {
    runtime: 'edge',
};

// ============ BẢNG GIÁ VẬT LIỆU (không đổi) ============
const MATERIAL_PRICES = {
    'Mây': 80000,
    'Tre': 30000,
    'Nứa': 25000,
    'Giang': 40000,
    'Song': 90000,
    'Lục bình': 50000,
    'Cói': 35000
};
const LABOR_RATE_PER_HOUR = 50000;

function calculateMaterialEstimate(materials, estimatedHours) {
    const items = [];
    let totalMaterialCost = 0;
    let totalWeight = 0;

    materials.forEach(mat => {
        const matchedKey = Object.keys(MATERIAL_PRICES).find(k => mat.toLowerCase().includes(k.toLowerCase()));
        const pricePerKg = matchedKey ? MATERIAL_PRICES[matchedKey] : 50000;
        const weight = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
        const cost = weight * pricePerKg;

        items.push({
            name: mat,
            weight_kg: weight,
            price_per_kg_vnd: pricePerKg,
            item_cost_vnd: cost
        });
        totalMaterialCost += cost;
        totalWeight += weight;
    });

    const hours = estimatedHours || 8;
    const laborCost = hours * LABOR_RATE_PER_HOUR;

    return {
        items,
        total_weight_kg: parseFloat(totalWeight.toFixed(1)),
        estimated_hours: hours,
        difficulty: hours > 20 ? "Khó" : (hours > 10 ? "Trung bình" : "Dễ"),
        total_material_cost_vnd: totalMaterialCost,
        labor_cost_vnd: laborCost,
        total_estimated_cost_vnd: totalMaterialCost + laborCost
    };
}

// ============ CẤU HÌNH MODEL (ĐÃ SỬA — model cũ gemini-1.5-flash-latest đã bị Google khai tử, luôn trả 404) ============
const TEXT_MODEL = 'gemini-1.5-flash';   // model rẻ/nhanh, dùng để "nâng cấp" prompt + sinh mô tả
const IMAGE_MODEL = 'gemini-2.0-flash'; // model tạo ảnh gốc của Gemini

// ============ BƯỚC 1: Gemini "nâng cấp" prompt của khách ============
async function enhancePrompt(apiKey, reqData) {
    const { prompt, style, size, pattern, finish } = reqData;

    const systemInstruction = `Bạn là chuyên gia prompt engineering cho image generation AI, chuyên về sản phẩm thủ công mỹ nghệ mây tre đan Việt Nam (làng nghề Phú Vinh).
Nhiệm vụ: nhận yêu cầu thô của khách hàng (có thể bằng tiếng Việt, ngắn gọn, mơ hồ) và trả về MỘT ĐOẠN JSON DUY NHẤT (không kèm text nào khác, không markdown code fence) theo schema:
{
  "image_prompt": "prompt tiếng Anh chi tiết cho image generation, PHẢI theo cấu trúc: [chủ thể sản phẩm cụ thể] + [chất liệu] + [kiểu đan] + [phong cách] + [đặt trong không gian phù hợp (tránh dùng bàn gỗ nếu là đồ nội thất lớn như ghế/xích đu)] + [ánh sáng studio] + [góc chụp]. LUÔN bắt đầu bằng chữ: 'Product photography of [sản phẩm]'. LUÔN kết thúc bằng chữ: 'STRICTLY NO HUMANS, nobody, empty room, no faces, pure product shot'.",
  "description_vi": "mô tả sản phẩm bằng tiếng Việt, 2-3 câu, viết theo đúng thiết kế khách yêu cầu, nhấn mạnh chất liệu và kỹ thuật thủ công truyền thống",
  "materials": ["danh sách vật liệu phù hợp với thiết kế, không cố định"],
  "technique": "Tên kỹ thuật đan chi tiết (ví dụ: đan lóng mốt, đan mắt cáo...)",
  "estimated_hours": 10,
  "difficulty": "Dễ",
  "color_palette": ["#f8e5c0", "#d4a373", "#8b5a2b", "#5c4033", "#e9edc9"],
  "is_valid": true
}

QUY TẮC BẮT BUỘC:
- Nếu khách không cung cấp đủ thông tin (thiếu size/pattern/finish), tự suy luận hợp lý dựa trên loại sản phẩm phổ biến của làng nghề mây tre, không được để trống.
- image_prompt LUÔN bằng tiếng Anh, các trường còn lại bằng tiếng Việt.
- Không tự ý thêm giá tiền VNĐ vào JSON (phần tính giá vật liệu sẽ được code xử lý riêng, KHÔNG phải AI tự bịa số tiền).
- Nếu vật dụng khách yêu cầu phi thực tế hoặc không thể làm bằng mây/tre (ví dụ: ô tô mây tre, điện thoại mây tre, phi thuyền), hãy set "is_valid": false.`;

    const userMessage = JSON.stringify({ prompt, style, size, pattern, finish });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: userMessage }] }],
                systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] }
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errText = await res.text();
            console.warn(`[enhancePrompt] Gemini trả lỗi ${res.status}:`, errText);
            return null;
        }

        const data = await res.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        if (!text) return null;

        return JSON.parse(text);
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn('[enhancePrompt] lỗi hoặc timeout:', e.message);
        return null;
    }
}

// ============ BƯỚC 2a: Tạo ảnh bằng Gemini (chất lượng cao, có thể tốn phí) ============
async function generateImageWithGemini(apiKey, imagePrompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
                generationConfig: {
                    responseModalities: ['IMAGE'],
                    imageConfig: { aspectRatio: '1:1' }
                }
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errText = await res.text();
            console.warn(`[generateImageWithGemini] Gemini trả lỗi ${res.status}:`, errText);
            return null;
        }

        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find(p => p.inlineData?.data);
        if (!imagePart) return null;

        const mime = imagePart.inlineData.mimeType || 'image/png';
        return `data:${mime};base64,${imagePart.inlineData.data}`;
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn('[generateImageWithGemini] lỗi hoặc timeout:', e.message);
        return null;
    }
}

// ============ BƯỚC 2b: Fallback — Pollinations (free, luôn hoạt động) ============
function generateImageWithPollinations(imagePrompt) {
    const seed = Math.floor(Math.random() * 1000000);
    const encoded = encodeURIComponent(imagePrompt);
    return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}`;
}

// ============ HANDLER CHÍNH ============
export default async function handler(req) {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } });
    }
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    let reqData;
    try {
        reqData = await req.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    const { prompt, style, size, pattern, finish } = reqData;

    // Dữ liệu fallback mặc định (dùng khi Gemini lỗi/không có key)
    const fallbackImagePrompt = `Professional studio product photography of authentic Vietnamese bamboo and rattan handicraft. ${prompt || 'Rattan basket'}, style: ${style || 'traditional'}, size: ${size || 'medium'}, weave pattern: ${pattern || 'classic'}, finish: ${finish || 'natural'}. STRICTLY NO HUMANS, nobody, empty room, no faces, pure product shot, 4k, sharp focus.`;

    let imagePrompt = fallbackImagePrompt;
    let specs = {
        description: `Bản phác thảo thiết kế ${prompt || 'sản phẩm mây tre'} mang phong cách ${style || 'tự do'}. Sản phẩm tập trung vào kỹ thuật đan truyền thống, tôn vinh nét đẹp của vật liệu tự nhiên.`,
        colorPalette: ['#f8e5c0', '#d4a373', '#8b5a2b', '#5c4033', '#e9edc9'],
        materials: prompt && prompt.toLowerCase().includes('xích đu') ? ['Mây song cỡ lớn', 'Khung sắt chịu lực'] : ['Mây rừng', 'Tre gai'],
        technique: pattern || 'Đan truyền thống',
        materialEstimate: calculateMaterialEstimate(
            prompt && prompt.toLowerCase().includes('xích đu') ? ['Mây song cỡ lớn', 'Khung sắt chịu lực'] : ['Mây rừng', 'Tre gai'],
            prompt && prompt.toLowerCase().includes('xích đu') ? 30 : 12
        )
    };

    const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY || "";
        // ---- Bước 1: nâng cấp prompt bằng Gemini ----
        const parsed = await enhancePrompt(apiKey, reqData);

        if (parsed) {
            if (parsed.is_valid === false) {
                return new Response(JSON.stringify({
                    error: "Rất tiếc, Đan AI chưa có khả năng tạo thiết kế này. Bạn vui lòng mô tả chi tiết hơn hoặc chọn vật dụng phù hợp với chất liệu mây tre đan nhé!"
                }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }

            if (parsed.image_prompt) imagePrompt = parsed.image_prompt;

            const mats = parsed.materials && parsed.materials.length ? parsed.materials : specs.materials;
            const hrs = parsed.estimated_hours || 10;

            specs = {
                description: parsed.description_vi || specs.description,
                colorPalette: parsed.color_palette || specs.colorPalette,
                materials: mats,
                technique: parsed.technique || specs.technique,
                materialEstimate: calculateMaterialEstimate(mats, hrs)
            };
        }
    }

    // ---- Bước 2: tạo ảnh — ưu tiên Gemini, tự rơi về Pollinations nếu lỗi/hết quota/chưa bật billing ----
    let imageUrl = null;
    if (apiKey) {
        imageUrl = await generateImageWithGemini(apiKey, imagePrompt);
    }
    if (!imageUrl) {
        imageUrl = generateImageWithPollinations(imagePrompt);
    }

    return new Response(JSON.stringify({ imageUrl, specs }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}