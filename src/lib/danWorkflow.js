const steps = {
    vi: ['Đọc yêu cầu và ảnh phòng','Tra cứu dữ liệu và quy tắc','Kiểm tra 6 nhóm ràng buộc','Tạo và kiểm tra ảnh chính','Tạo hai góc nhìn và đối chiếu','Kiểm tra cuối và thẩm mỹ','Hoàn tất bộ ảnh'],
    en: ['Read request and room photo','Retrieve data and rules','Check six constraint groups','Create and inspect main image','Create two views and compare','Final checks and aesthetics','Release reviewed images'],
    zh: ['读取需求和房间照片','检索数据和规则','检查六类约束','生成并检查主图','生成两个视角并对照','最终检查与美学评估','展示已检查的图片'],
};
export function workflowLabel(step, attempt, lang) {
    const list = steps[lang] || steps.en;
    const prefix = lang === 'vi' ? 'Bước' : lang === 'zh' ? '步骤' : 'Step';
    const retry = attempt > 1 ? (lang === 'vi' ? ' · Đang sửa ảnh' : lang === 'zh' ? ' · 正在修正图片' : ' · Refining images') : '';
    return `${prefix} ${step}/7 — ${list[step-1] || list[0]}${retry}`;
}
const messages = {
    AI_KEY_MISSING: ['Dịch vụ Đan AI chưa nhận được khóa Gemini trên máy chủ.', 'The Dan AI server has no Gemini API key configured.', '服务器尚未配置Gemini API密钥。'],
    AI_INVALID_REQUEST: ['Gemini từ chối cấu hình yêu cầu tạo ảnh. Cần kiểm tra cấu hình API Đan AI.', 'Gemini rejected the design request configuration. Check the Dan AI API configuration.', 'Gemini拒绝了设计请求配置，请检查API设置。'],
    AI_INVALID_RESPONSE: ['Gemini trả dữ liệu thiết kế hoặc kiểm tra chưa hợp lệ. Chưa có ảnh nào được duyệt.', 'Gemini returned invalid design or inspection data. No images were approved.', 'Gemini返回的设计或检查数据无效，尚无图片获准。'],
    AI_NO_IMAGE: ['Gemini chưa trả ảnh cho yêu cầu này. Hãy làm rõ mô tả và thử lại.', 'Gemini did not return an image. Clarify the request and retry.', 'Gemini未返回图片，请明确需求后重试。'],
    DATASET_REFERENCE_UNAVAILABLE: ['Không tải được ảnh tham khảo trong kho dữ liệu. Kiểm tra các file ảnh đã triển khai.', 'A dataset reference image could not be loaded. Check deployed image files.', '无法加载数据集参考图片，请检查部署的图片文件。'],
    AI_MODEL_UNAVAILABLE: ['Model Gemini hiện cấu hình không hỗ trợ yêu cầu này hoặc không còn khả dụng. Khóa API được giữ nguyên; cần kiểm tra model tạo ảnh.', 'The configured Gemini model is unavailable or does not support this request. Check the image model; the API key is unchanged.', '当前Gemini模型不可用或不支持此请求。请检查图像模型，API密钥未更改。'],
    AI_ACCESS_DENIED: ['Gemini từ chối quyền truy cập. Kiểm tra quyền của khóa hiện có.', 'Gemini denied access. Check permissions for the existing key.', 'Gemini拒绝访问，请检查现有密钥权限。'],
    AI_QUOTA: ['Gemini đã hết hạn mức hoặc đang giới hạn yêu cầu. Vui lòng thử lại sau.', 'Gemini quota or rate limit reached. Please retry later.', 'Gemini配额已用尽或请求受限，请稍后重试。'],
    AI_IMAGE_QUOTA_UNAVAILABLE: ['Dự án Gemini hiện có hạn mức bằng 0 cho model tạo ảnh. Cần kiểm tra hạn mức và thanh toán trong Google AI Studio.', 'The Gemini project has zero quota for the image model. Check quota and billing in Google AI Studio.', 'Gemini项目的图像模型配额为零，请在Google AI Studio中检查配额和结算。'],
    AI_TIMEOUT: ['Quy trình đã quá thời gian; chưa có ảnh nào được duyệt. Vui lòng thử lại.', 'The workflow timed out; no images were approved. Please retry.', '流程超时，尚无图片获准展示，请重试。'],
    VISUAL_CHECK_FAILED: ['Sau khi thử sửa, bộ ảnh vẫn chưa đạt checklist. Hãy làm rõ yêu cầu rồi tạo lại.', 'The revised images still failed the checklist. Clarify the request and retry.', '修改后的图片仍未通过检查，请明确需求后重试。'],
    DESIGN_CHECK_FAILED: ['Sau khi thử sửa, bộ ảnh vẫn chưa đạt checklist. Hãy làm rõ yêu cầu rồi tạo lại.', 'The revised images still failed the checklist. Clarify the request and retry.', '修改后的图片仍未通过检查，请明确需求后重试。'],
    NEEDS_INPUT: ['Cần bổ sung thông tin vào mô tả trước khi tạo ảnh.', 'Add the missing information to your description.', '请先在描述中补充信息。'],
    INVALID_IMAGE: ['Ảnh chưa hợp lệ. Hãy tải hoặc chụp lại ảnh phòng rõ nét.', 'Please upload or capture a valid room photo.', '请重新上传或拍摄有效的房间照片。'],
    UNSUPPORTED_COMBINATION: ['Tổ hợp sản phẩm, hình dạng và kiểu đan chưa có trong dữ liệu. Hãy điều chỉnh mô tả hoặc lựa chọn.', 'This product, shape and weave combination is not in the catalog. Adjust the request.', '目录中暂无此产品、形状与编织方式组合，请调整需求。'],
    CROSS_ORIGIN_REQUEST: ['Yêu cầu từ nguồn ngoài trang web không hợp lệ.', 'Invalid cross-origin request.', '来自外部源的无效请求。'],
    DESIGN_SERVICE_ERROR: ['Dịch vụ tạo ảnh AI gặp sự cố tạm thời. Vui lòng thử lại.', 'AI design service encountered a temporary issue. Please retry.', 'AI设计服务遇到临时问题，请重试。'],
    AI_BUSY: ['Hệ thống AI hiện đang xử lý nhiều yêu cầu. Vui lòng thử lại sau vài giây.', 'AI system is busy processing requests. Please retry in a few seconds.', 'AI系统繁忙，请稍后再试。'],
    default: ['Chưa đủ điều kiện xuất ảnh. Quy trình đã dừng; hãy kiểm tra yêu cầu và thử lại.', 'The images could not be approved. Check the request and retry.', '图片尚不满足展示条件，请检查需求并重试。'],
};
export function workflowError(error, lang) {
    if (error.questions?.length) return error.questions.join(' ');
    const index = lang === 'vi' ? 0 : lang === 'zh' ? 2 : 1;
    return (messages[error.message] || messages.default)[index];
}
export async function prepareDesignPhoto(file) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) throw new Error('INVALID_IMAGE');
    const bitmap = await createImageBitmap(file);
    try {
        if (bitmap.width < 64 || bitmap.height < 64) throw new Error('INVALID_IMAGE');
        const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
        const photo = canvas.toDataURL('image/jpeg', 0.78);
        if (photo.length > 1800000) throw new Error('INVALID_IMAGE');
        return photo;
    } finally { bitmap.close(); }
}
export async function runDesignWorkflow(input, onProgress, signal) {
    const response = await fetch('/api/ai/design', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson' }, body: JSON.stringify(input), signal });
    if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || 'DESIGN_SERVICE_ERROR'); }
    if (!response.headers.get('content-type')?.includes('application/x-ndjson') || !response.body) throw new Error('DESIGN_SERVICE_ERROR');
    const reader = response.body.getReader(), decoder = new TextDecoder();
    let buffer = '', result;
    try {
        while (true) {
            const { value, done } = await reader.read();
            buffer += decoder.decode(value, { stream: !done });
            if (buffer.length > 15000000) throw new Error('INVALID_RESPONSE');
            let newline;
            while ((newline = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, newline); buffer = buffer.slice(newline+1); if (!line.trim()) continue;
                const event = JSON.parse(line);
                if (event.type === 'progress' && event.step >= 1 && event.step <= 7) onProgress(event);
                if (event.type === 'error') { const error = new Error(event.code); error.questions = event.questions; throw error; }
                if (event.type === 'complete') result = event;
            }
            if (done) break;
        }
        if (buffer.trim() || !result || result.images?.length !== 3 || result.specs?.workflow?.checks?.length !== 49) throw new Error('INCOMPLETE_RESULT');
        return { ...result, imageUrl: result.images[0].url };
    } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
