import { deflateSync } from 'node:zlib';
// Valid PNGs only for automated tests. They are not design photos or AI evidence.
function chunk(type, data) {
    const bytes = Buffer.concat([Buffer.from(type), data]); let crc = 0xffffffff;
    for (const b of bytes) { crc ^= b; for (let i=0;i<8;i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }
    const head = Buffer.alloc(4), tail = Buffer.alloc(4); head.writeUInt32BE(data.length); tail.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([head,bytes,tail]);
}
export function png(seed=0) {
    const header = Buffer.alloc(13); header.writeUInt32BE(128,0); header.writeUInt32BE(128,4); header[8]=8; header[9]=2;
    const pixels = Buffer.alloc(128*(128*3+1));
    for(let y=0;y<128;y++) for(let x=0;x<128;x++) { const n=y*385+1+x*3; pixels[n]=140+seed%70; pixels[n+1]=160+(x%25); pixels[n+2]=120+(y%35); }
    return { mime:'image/png', data:Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(pixels)),chunk('IEND',Buffer.alloc(0))]).toString('base64') };
}
export const input = () => ({ prompt: 'Giỏ mây tròn đựng đồ, không có quai', size: 'medium', lang: 'vi' });
export const brief = () => ({
    productType:'basket', use:'storage', materialIds:['rattan'], frameMaterial:null, weaveId:'plain', shape:'round', finishId:'natural', style:'', summary:'Giỏ mây tròn đựng đồ (ảnh kiểm thử).', roomObservation:'',
    colorPalette:['#DEB887','#8B4513'], parts:[{id:'base',materialId:'rattan',count:1},{id:'body',materialId:'rattan',count:1},{id:'rim',materialId:'rattan',count:1}],
    dimensions:{width:null,depth:null,height:null,unit:'cm',evidence:''}, mandatoryDetails:['không có quai'], assumptions:['Hình dáng minh họa theo danh mục.'], questions:[], conflicts:[], specialUses:[], valid:true,
});
export function fakeProvider(options={}) {
    let imageCount=0;
    const calls={analysis:[],generated:[],inspected:[]};
    return { textModel:'test-vision', imageModel:'test-image', calls,
        async analyze(system,payload,images) { calls.analysis.push({system,payload,images}); return options.analyze ? options.analyze(payload,images) : { ...brief(), ...options.brief }; },
        async generate(prompt,images) { calls.generated.push({prompt,images}); if(options.imageError) throw new Error(options.imageError); return { ...png(options.duplicate ? 1 : ++imageCount), model:'test-image' }; },
        async inspect(system,payload,images) {
            calls.inspected.push({system,payload,images});
            if(options.inspectError) throw new Error(options.inspectError);
            let checks=payload.checklist.map(c=>({id:c.id,status:c.id===options.fail?'fail':c.id===options.uncertain?'manual_review':'pass',reason:'TEST fixture: visible structure and colors match requested view.',observations:['TEST visible pattern fixture'],assetIds:images.map(a=>a.id)}));
            if(options.missing) checks=checks.slice(1);
            if(options.wrongEvidence) checks[0].assetIds=['not-an-image'];
            return {checks};
        },
    };
}
