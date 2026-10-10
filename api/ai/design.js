import { designResponse } from '../../server/dan-ai/http.js';

export const config = { runtime: 'edge' };

const TEXT_MODEL = 'gemini-3.5-flash-lite';   // model rẻ/nhanh, dùng để "nâng cấp" prompt + sinh mô tả
const IMAGE_MODEL = 'gemini-nano-banana-2.1'; // model Gemini tạo ảnh và chỉnh sửa theo ảnh tham chiếu

export default async function handler(req) {
    const defaultKey = typeof atob === 'function' ? atob("QVEuQWI4Uk42S0xyZ2ZpQWpwWjN2aXFTTG4xdllhVGMzWk8yaEF2OWFmTTktOEd3WjZyQ0E=") : "";
    const apiKey = process.env.GEMINI_API_KEY2 || process.env.GEMINI_API_KEY || defaultKey;
    return designResponse(req, { apiKey, textModel: TEXT_MODEL, imageModel: IMAGE_MODEL });
}
