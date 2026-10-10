import fs from 'node:fs';
import path from 'node:path';

let datasetItems = null;

function removeDiacritics(str) {
    if (!str) return '';
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D')
              .toLowerCase();
}

export function getDatasetManifest() {
    if (datasetItems) return datasetItems;
    try {
        const manifestPath = path.resolve(process.cwd(), 'public/dan_may_dataset/manifest.json');
        if (fs.existsSync(manifestPath)) {
            const raw = fs.readFileSync(manifestPath, 'utf8');
            const data = JSON.parse(raw);
            datasetItems = data.items || [];
            return datasetItems;
        }
    } catch (e) {
        console.error('Failed to load dataset manifest:', e);
    }
    return [];
}

export function findMatchingDatasetItems(params = {}, limit = 6) {
    const items = getDatasetManifest();
    if (!items.length) return [];

    const { prompt = '', category = '', style = '', pattern = '', weave = '', finish = '', size = '' } = params;
    const normPrompt = removeDiacritics(prompt);
    const normStyle = removeDiacritics(style);
    const normWeave = removeDiacritics(weave || pattern);
    const normFinish = removeDiacritics(finish);
    const normSize = removeDiacritics(size);

    const categoryKeywords = {
        guong: ['guong', 'mirror', 'mat troi', 'oval', 'vom'],
        den: ['den', 'lamp', 'pendant', 'hoa sen', 'chum', 'chieu sang'],
        ghe: ['ghe', 'chair', 'to chim', 'armchair', 'sofa', 'don'],
        xich_du: ['xich du', 'swing', 'giot nuoc', 'treo'],
        tui: ['tui', 'bag', 'xach', 'handbag'],
        ban: ['ban', 'table', 'tra', 'ban tra', 'cafe'],
        gio: ['gio', 'ro', 'basket', 'khay', 'hop', 'dung do'],
    };

    const scored = items.map(item => {
        let score = 0;
        const normName = removeDiacritics(item.name_vi);
        const normObjType = removeDiacritics(item.object_type);
        const normCat = removeDiacritics(item.category_vi || item.category);
        const normItemStyle = removeDiacritics(item.style_vi || item.style);
        const normItemWeave = removeDiacritics(item.weave_vi || item.weave);
        const normItemFinish = removeDiacritics(item.finish_vi || item.finish);
        const normItemSize = removeDiacritics(item.size_vi || item.size);
        const normItemPrompt = removeDiacritics(item.prompt);

        if (normPrompt) {
            const keywords = [...normName.split(/\s+/), ...normObjType.split('_')].filter(w => w.length > 2);
            for (const kw of keywords) {
                if (normPrompt.includes(kw)) {
                    score += 20;
                }
            }

            for (const [cat, words] of Object.entries(categoryKeywords)) {
                const promptMatchesCat = words.some(w => normPrompt.includes(w));
                const itemMatchesCat = words.some(w => normObjType.includes(w) || normName.includes(w));
                if (promptMatchesCat && itemMatchesCat) {
                    score += 50;
                }
            }
        }

        if (normStyle && (normItemStyle.includes(normStyle) || normStyle.includes(normItemStyle))) score += 25;
        if (normWeave && (normItemWeave.includes(normWeave) || normWeave.includes(normItemWeave))) score += 25;
        if (normFinish && (normItemFinish.includes(normFinish) || normFinish.includes(normItemFinish))) score += 15;
        if (normSize && (normItemSize.includes(normSize) || normSize.includes(normItemSize))) score += 10;

        if (normPrompt) {
            const promptWords = normPrompt.split(/\s+/).filter(w => w.length > 3);
            for (const word of promptWords) {
                if (normItemPrompt.includes(word)) score += 3;
            }
        }

        return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.item);
}
