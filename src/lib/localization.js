import phrases from './localePhrases.json';
import supplement from './localeSupplement.tsv?raw';

export const SUPPORTED_LANGUAGES = ['vi', 'en', 'zh'];
export const LOCALES = { vi: 'vi-VN', en: 'en-GB', zh: 'zh-CN' };
export const normalizeLanguage = value => SUPPORTED_LANGUAGES.includes(value) ? value : 'vi';
const normalize = value => value.trim().replace(/\s+/g, ' ');
const dictionary = new Map();
const records = new Map(phrases.map(row => [normalize(row.vi), row]));
const aliases = new Map(phrases.map(row => [normalize(row.vi), new Set([row.vi, row.en, row.zh].filter(Boolean))]));

for (const line of supplement.split(/\r?\n/)) {
    const [vi, en, zh] = line.split('\t');
    if (!vi) continue;
    const old = records.get(normalize(vi)) || { vi };
    records.set(normalize(vi), { vi, en: en || old.en, zh: zh || old.zh });
    const sources = aliases.get(normalize(vi)) || new Set();
    [vi, en, zh].filter(Boolean).forEach(source => sources.add(source));
    aliases.set(normalize(vi), sources);
}
for (const row of records.values()) {
    for (const source of aliases.get(normalize(row.vi)) || []) {
        if (source) {
            const key = normalize(source);
            const previous = dictionary.get(key);
            dictionary.set(key, { ...previous, ...Object.fromEntries(Object.entries(row).filter(([, value]) => value != null)) });
        }
    }
}

/** Translate presentation text only. Unknown names and customer content stay intact. */
export function translateText(value, language) {
    if (typeof value !== 'string' || !value.trim()) return value;
    const lang = normalizeLanguage(language);
    const priceRange = value.match(/^(\d[\d.,]*đ)\s*[-–]\s*(\d[\d.,]*đ)(?:\/cái \(SL≥(\d+)\))?$/);
    if (priceRange && lang !== 'vi') {
        const unit = priceRange[3] ? (lang === 'zh' ? `/件（数量≥${priceRange[3]}）` : `/item (qty≥${priceRange[3]})`) : '';
        return `${translateText(priceRange[1], lang)}–${translateText(priceRange[2], lang)}${unit}`;
    }
    // VND amounts in the catalog are integers; keep the amount and only change
    // its display format. Already formatted "₫" amounts remain untouched.
    const price = value.match(/^(\d[\d.,]*)\s*đ(\/kg)?$/);
    if (price && lang !== 'vi') {
        const amount = Number(price[1].replace(/[.,]/g, ''));
        if (Number.isFinite(amount)) return `${new Intl.NumberFormat(LOCALES[lang]).format(amount)}₫${price[2] ? (lang === 'zh' ? '/千克' : '/kg') : ''}`;
    }
    const row = dictionary.get(normalize(value));
    if (row?.[lang] != null) {
        const leading = value.match(/^\s*/)[0];
        const trailing = value.match(/\s*$/)[0];
        return leading + row[lang].trim() + trailing;
    }
    const artisan = value.match(/^Nghệ nhân (.+)$/);
    if (artisan && lang !== 'vi') return lang === 'en' ? `Artisan ${artisan[1]}` : `工匠 ${artisan[1]}`;
    const portfolio = value.match(/^Portfolio (\d+)$/);
    if (portfolio) return { vi: `Tác phẩm ${portfolio[1]}`, en: value, zh: `作品 ${portfolio[1]}` }[lang];
    const threshold = value.match(/^(?:Từ|From) (\d+) (?:đơn hàng|đơn|orders)$/);
    if (threshold) return {vi:`Từ ${threshold[1]} đơn hàng`,en:`From ${threshold[1]} orders`,zh:`${threshold[1]}笔订单起`}[lang];
    const nextTier = value.match(/^(?:Chỉ cần (\d+) đơn nữa để lên hạng|Only (\d+) more orders to reach)$/);
    if (nextTier) { const n = nextTier[1] || nextTier[2]; return {vi:`Chỉ cần ${n} đơn nữa để lên hạng`,en:`Only ${n} more orders to reach`,zh:`再完成${n}笔订单即可升至`}[lang]; }
    // Catalog production times retain their numbers and ranges in every language.
    const time = value.match(/^(\d+(?:[.,]\d+)?(?:\s*[-–]\s*\d+)?)\s*(giờ|hours?|ngày|days?|phút|minutes?)$/i);
    if (time) {
        const unit = /giờ|hour/i.test(time[2]) ? { vi: 'giờ', en: 'hours', zh: '小时' }
            : /ngày|day/i.test(time[2]) ? { vi: 'ngày', en: 'days', zh: '天' }
                : { vi: 'phút', en: 'minutes', zh: '分钟' };
        return `${time[1]} ${unit[lang]}`;
    }
    return value;
}

export function formatDate(value, lang, options) {
    return new Intl.DateTimeFormat(LOCALES[normalizeLanguage(lang)], options).format(value);
}
