import { datasetItems } from './datasetManifest.js';

const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
const aliases = {
    'bohemian': 'boho', 'luxury': 'sang trong', 'modern': 'hien dai', 'natural': 'tu nhien',
    'plain': 'nong', 'dan nong': 'nong', 'ring weave': 'nong', 'herringbone': 'xuong ca', 'dan xuong ca': 'xuong ca',
    'openwork': 'mat cao', 'dan mat cao': 'mat cao', 'slats': 'nan', 'dan nan': 'nan',
    'dyed': 'nhuom mau', 'nhuom': 'nhuom mau', 'lacquer': 'son mai', 'small': 'nho', 'medium': 'vua', 'large': 'lon',
};
const choice = value => aliases[normalize(value)] || normalize(value);
const includesPhrase = (text, phrase) => (' ' + text + ' ').includes(' ' + phrase + ' ');
const productWords = {
    lampshade: ['den', 'lamp', 'lampshade', 'pendant'], chair: ['ghe', 'chair', 'sofa'],
    swing: ['xich du', 'swing'], mirror: ['guong', 'mirror'], table: ['ban', 'table'],
    bag: ['tui', 'bag', 'handbag'], basket: ['gio', 'ro', 'basket'], tray: ['khay', 'tray'],
    vase: ['lo', 'binh', 'vase'], shelf: ['ke', 'shelf'],
};

export function getDatasetManifest() { return datasetItems; }

export function findMatchingDatasetItems(params = {}, limit = 6) {
    const prompt = normalize(params.prompt);
    const weave = choice(params.weave || params.pattern), finish = choice(params.finish), size = choice(params.size), style = choice(params.style);
    const usable = datasetItems.filter(item => item.status === 'generated' && /^images\/[a-zA-Z0-9_-]+\.(png|jpe?g|webp)$/.test(item.file));
    // Lock the most specific named object before ranking styles. A lamp must not become a chair.
    const exactNames = usable.filter(item => prompt && (includesPhrase(prompt, normalize(item.name_vi)) || includesPhrase(prompt, normalize(item.object_type))));
    const longest = Math.max(0, ...exactNames.map(item => normalize(item.name_vi).length));
    const exactTypes = new Set(exactNames.filter(item => normalize(item.name_vi).length === longest).map(item => item.object_type));
    let candidates = usable.filter(item => {
        if (exactTypes.size && !exactTypes.has(item.object_type)) return false;
        const itemText = normalize(item.name_vi + ' ' + item.object_type);
        if (params.productType && productWords[params.productType] && !productWords[params.productType].some(word => includesPhrase(itemText, word))) return false;
        if (params.category && ![item.category, item.category_vi].some(value => normalize(value) === normalize(params.category))) return false;
        if (weave && ![item.weave, item.weave_vi].some(value => choice(value) === weave)) return false;
        if (finish && ![item.finish, item.finish_vi].some(value => choice(value) === finish)) return false;
        return true;
    });
    if (!prompt && !weave && !params.productType && !params.category) return [];
    candidates = candidates.map(item => {
        const name = normalize(item.name_vi);
        const words = prompt.split(' ').filter(word => word.length > 2);
        let score = words.filter(word => includesPhrase(name, word)).length * 20;
        if (style && [item.style, item.style_vi, item.inspiration_style].some(value => choice(value) === style)) score += 25;
        if (size && [item.size, item.size_vi].some(value => choice(value) === size)) score += 10;
        return { item, score };
    }).filter(row => !prompt || exactTypes.size || params.productType || row.score > 0);
    candidates.sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id));
    return candidates.slice(0, limit).map(row => row.item);
}

export function selectDatasetReferences(input, brief) {
    const base = { prompt: input.prompt, productType: brief.productType, style: brief.style, size: input.size };
    const exact = findMatchingDatasetItems({ ...base, weave: brief.weaveId, finish: brief.finishId }, 1)[0];
    if (exact) return [{ item: exact, role: 'dataset_product', purpose: 'Product form and weaving example. Locked customer specifications override reference style, size, finish and optional details.' }];
    const shape = findMatchingDatasetItems(base, 1)[0];
    const weave = findMatchingDatasetItems({ weave: brief.weaveId, finish: brief.finishId, style: brief.style }, 1)[0];
    return [
        shape && { item: shape, role: 'dataset_shape', purpose: 'SHAPE ONLY. Ignore the reference weave, colors, finish, size and accessories. Apply the locked specification instead.' },
        weave && { item: weave, role: 'dataset_weave', purpose: 'WEAVE SURFACE ONLY. Ignore this reference product type, shape, colors, size and accessories.' },
    ].filter(Boolean).filter((ref, index, rows) => rows.findIndex(other => other.item.id === ref.item.id) === index);
}
