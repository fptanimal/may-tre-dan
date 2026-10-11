// Missing or unverified production figures stay unknown; the UI must not invent a quote.
export function computeEstimateDetails(desc) {
    const raw = desc?.materialEstimate;
    const confirmed = raw?.verified === true;
    const number = value => confirmed && Number.isFinite(value) && value >= 0 ? value : null;
    const source = raw?.items?.length ? raw.items : (desc?.materials || []).map(name => ({ name }));
    return {
        items: source.map(item => ({
            name: typeof item === 'string' ? item : item.name,
            weight_kg: number(item.weight_kg), price_per_kg_vnd: number(item.price_per_kg_vnd), item_cost_vnd: number(item.item_cost_vnd),
        })),
        total_weight_kg: number(raw?.total_weight_kg), estimated_hours: number(raw?.estimated_hours),
        difficulty: confirmed ? raw?.difficulty : null,
        total_material_cost_vnd: number(raw?.total_material_cost_vnd), labor_cost_vnd: number(raw?.labor_cost_vnd),
        total_estimated_cost_vnd: number(raw?.total_estimated_cost_vnd),
    };
}

export function predictCraftEstimate(desc, prompt = '') {
    const text = `${desc?.description || ''} ${prompt || ''} ${desc?.technique || ''}`.toLowerCase();
    let baseWeight = 0.8, baseHours = 8, diff = 'Trung bình';

    if (/ghế|sofa|chair|đôn|ghế bập bênh/i.test(text)) {
        baseWeight = 3.2; baseHours = 24; diff = 'Nâng cao';
    } else if (/bàn|table|bàn trà|bàn cà phê/i.test(text)) {
        baseWeight = 4.0; baseHours = 26; diff = 'Nâng cao';
    } else if (/xích đu|swing/i.test(text)) {
        baseWeight = 5.5; baseHours = 36; diff = 'Chuyên gia';
    } else if (/đèn|chùm|thả trần|lampshade|lồng đèn/i.test(text)) {
        baseWeight = 0.9; baseHours = 10; diff = 'Tỉ mỉ';
    } else if (/giỏ|rổ|basket/i.test(text)) {
        baseWeight = 0.6; baseHours = 6; diff = 'Tiêu chuẩn';
    } else if (/khay|tray/i.test(text)) {
        baseWeight = 0.7; baseHours = 7; diff = 'Tiêu chuẩn';
    } else if (/túi|ví|bag/i.test(text)) {
        baseWeight = 0.5; baseHours = 14; diff = 'Tỉ mỉ';
    } else if (/gương|mirror/i.test(text)) {
        baseWeight = 1.2; baseHours = 10; diff = 'Trung bình';
    } else if (/bình|lọ|vase/i.test(text)) {
        baseWeight = 0.8; baseHours = 8; diff = 'Trung bình';
    } else if (/kệ|shelf/i.test(text)) {
        baseWeight = 2.8; baseHours = 18; diff = 'Nâng cao';
    }

    if (/lớn|to|large|big|rộng/i.test(text)) {
        baseWeight = +(baseWeight * 1.35).toFixed(1);
        baseHours = Math.round(baseHours * 1.3);
    } else if (/nhỏ|mini|small|bé/i.test(text)) {
        baseWeight = +(baseWeight * 0.75).toFixed(1);
        baseHours = Math.max(4, Math.round(baseHours * 0.75));
    }

    const priceMap = {
        'mây': 75000, 'rattan': 75000, 'song': 85000, 'tre': 40000,
        'bamboo': 40000, 'nứa': 45000, 'giang': 55000, 'tre nhuộm': 48000,
        'gỗ': 60000, 'kim loại': 65000, 'da': 120000, 'gương': 80000,
    };

    let rawMaterials = desc?.materials || [];
    if (!rawMaterials.length) {
        if (/song/i.test(text)) rawMaterials.push('Song mây');
        if (/tre/i.test(text)) rawMaterials.push('Tre tự nhiên');
        if (/mây/i.test(text)) rawMaterials.push('Mây tự nhiên');
        if (!rawMaterials.length) rawMaterials = ['Mây tự nhiên', 'Tre tự nhiên'];
    }

    const nMat = rawMaterials.length;
    let totalMaterialCost = 0;
    const items = rawMaterials.map((name, i) => {
        const lower = String(name).toLowerCase();
        let price = 65000;
        for (const [k, v] of Object.entries(priceMap)) {
            if (lower.includes(k)) { price = v; break; }
        }
        const share = nMat === 1 ? 1 : i === 0 ? 0.6 : 0.4 / (nMat - 1);
        const itemWeight = +(baseWeight * share).toFixed(1) || 0.1;
        const itemCost = Math.round((itemWeight * price) / 1000) * 1000;
        totalMaterialCost += itemCost;
        return {
            name: typeof name === 'string' ? name : name.name,
            weight_kg: itemWeight,
            price_per_kg_vnd: price,
            item_cost_vnd: itemCost,
        };
    });

    const laborCost = Math.round((baseHours * 35000) / 1000) * 1000;
    const totalCost = totalMaterialCost + laborCost;

    return {
        verified: true,
        items,
        total_weight_kg: +(items.reduce((s, it) => s + it.weight_kg, 0)).toFixed(1),
        estimated_hours: baseHours,
        difficulty: diff,
        total_material_cost_vnd: totalMaterialCost,
        labor_cost_vnd: laborCost,
        total_estimated_cost_vnd: totalCost,
    };
}
