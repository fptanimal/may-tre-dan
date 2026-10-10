import catalog from '../../data/dan-ai/catalog.js';
import policy from '../../data/dan-ai/policy.js';

export { catalog, policy };
export async function digest(value) {
    const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(typeof value === 'string' ? value : JSON.stringify(value));
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
}
export const contextHash = () => digest({ catalog, policy });
export const rulesFor = stage => policy.rules.filter(r => r.stages.includes(stage));
export function lookup(brief) {
    const product = catalog.products.find(p => p.id === brief.productType);
    const weave = catalog.weaves.find(w => w.id === brief.weaveId);
    const finish = catalog.finishes.find(f => f.id === brief.finishId);
    if (!product || !weave || !finish || !product.shapes.includes(brief.shape) || !product.weaves.includes(weave.id) || !product.uses.includes(brief.use)) throw new Error('UNSUPPORTED_COMBINATION');
    if (!brief.materialIds.length || brief.materialIds.some(id => !product.materials.includes(id))) throw new Error('UNSUPPORTED_MATERIAL');
    const allowedParts = [...product.parts, 'handles', 'lid', 'liner', 'cushion', 'decoration'];
    if (!brief.parts.length || brief.parts.some(p => !allowedParts.includes(p.id) || !catalog.materials.some(m => m.id === p.materialId))) throw new Error('UNSUPPORTED_PART');
    if (product.parts.some(id => !brief.parts.some(p => p.id === id))) throw new Error('UNSUPPORTED_PART');
    for (const part of brief.parts) {
        const material = catalog.materials.find(m => m.id === part.materialId);
        const role = ['frame','supports','suspension','mount','support_base'].includes(part.id) ? 'frame' : part.id === 'mirror' ? 'mirror' : part.id === 'liner' ? 'liner' : 'weave';
        if (!material.roles.includes(role)) throw new Error('UNSUPPORTED_PART');
    }
    if (brief.frameMaterial && !catalog.materials.some(m => m.id === brief.frameMaterial && m.roles.includes('frame'))) throw new Error('UNSUPPORTED_FRAME');
    if (brief.use === 'water_container' && !brief.parts.some(p => p.id === 'liner' && p.materialId === 'glass')) throw new Error('WATER_LINER_REQUIRED');
    if (brief.colorPalette.some(hex => !catalog.colors.some(c => c.toLowerCase() === hex.toLowerCase()))) throw new Error('UNSUPPORTED_COLOR');
    return { product, weave, finish, materials: catalog.materials.filter(m => brief.materialIds.includes(m.id)), sources: catalog.sources, status: catalog.status };
}
export function constraints(brief) {
    const rows = [
        ['material', 'MAT', 'Chưa có phiếu xác nhận vật liệu, quy cách nan và hoàn thiện.'],
        ['weave', 'WEA', 'Nhãn kiểu đan có trong danh mục; mẫu đan, mật độ và khóa mép cần nghệ nhân xác nhận.'],
        ['dimensions', 'DIM', 'Kích thước chưa được xưởng xác nhận; nhãn nhỏ/vừa/lớn không phải giới hạn chế tác.'],
        ['geometry', 'GEO', 'Cần xác nhận khuôn, bán kính uốn và trình tự gia công theo đúng vật liệu.'],
        ['structure', 'STR', 'Khung, liên kết, ổn định và thử tải chưa có bằng chứng chế tác.'],
        ['capacity', 'CAP', 'Chưa có xác nhận năng lực, vật tư và tiến độ của xưởng cho thiết kế này.'],
    ].map(([group, prefix, reason]) => ({ group, prefix, status: 'manual_review', reason, sourceIds: ['report', 'owner-rules-20261008'] }));
    for (const limit of catalog.verifiedLimits) {
        if (!limit.verified || !limit.confirmedBy || !limit.evidenceId || !Number.isFinite(Date.parse(limit.validUntil)) || Date.parse(limit.validUntil) < Date.now()) continue;
        if (!['productType', 'weaveId', 'shape', 'frameMaterial'].every(k => limit[k] === brief[k]) || !brief.materialIds.includes(limit.materialId)) continue;
        const value = brief.dimensions[limit.axis];
        if (value == null || !Number.isFinite(limit.minMm) || !Number.isFinite(limit.maxMm)) continue;
        const mm = value * (brief.dimensions.unit === 'cm' ? 10 : 1);
        if (mm < limit.minMm || mm > limit.maxMm) rows[2] = { ...rows[2], status: 'fail', reason: 'Kích thước ngoài giới hạn đã xác minh cho đúng mẫu.', sourceIds: [limit.evidenceId] };
    }
    return rows;
}
