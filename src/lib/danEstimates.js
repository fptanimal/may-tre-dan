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
