const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/lib/translations.js');
let content = fs.readFileSync(file, 'utf8');

const translations = {
    'vi': 'Xem Thêm',
    'en': 'Load More',
    'es': 'Cargar Más',
    'zh': '加载更多',
    'ru': 'Загрузить еще',
    'th': 'โหลดเพิ่มเติม',
    'hi': 'और लोड करें',
    'ja': 'もっと読み込む',
    'ko': '더 보기',
    'fr': 'Voir Plus',
    'de': 'Mehr laden',
    'it': 'Carica Altro',
    'no': 'Last inn mer'
};

const lines = content.split('\n');
const newLines = [];
let currentLang = 'vi';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // detect language block
    const langMatch = line.match(/^\s*([a-z]{2,3}):\s*\{/);
    if (langMatch) {
        currentLang = langMatch[1];
    }
    
    // remove the incorrect shop.loadMore we just added
    if (line.includes("'shop.loadMore':")) {
        continue;
    }
    
    newLines.push(line);
    
    // insert after shop.results
    if (line.includes("'shop.results':")) {
        const trans = translations[currentLang] || 'Load More';
        newLines.push(`        'shop.loadMore': \`${trans}\`,`);
    }
}

fs.writeFileSync(file, newLines.join('\n'), 'utf8');
console.log('Fixed translations.js');
