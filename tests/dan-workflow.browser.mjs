import http from 'node:http';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { designResponse } from '../server/dan-ai/http.js';
import { fakeProvider, brief } from './fixtures/dan-provider.mjs';

// A local proxy substitutes ONLY /api/ai/design with the actual workflow and a test provider.
// No credential is read here; no request is sent to Gemini or another external service.
const provider=fakeProvider({analyze:payload=>({...brief(),style:payload.input.style||'',colorPalette:payload.input.prompt.includes('nâu')?['#8B4513']:brief().colorPalette})});
for(const method of ['analyze','generate','inspect']) { const original=provider[method]; provider[method]=async(...args)=>{await new Promise(r=>setTimeout(r,220));return original(...args);}; }
let outcomes=[], injectedImageError=null;
const generate=provider.generate;
provider.generate=async(...args)=>{if(injectedImageError)throw new Error(injectedImageError);return generate(...args);};
const server=http.createServer(async(req,res)=>{
    try {
        let response;
        if(req.url.split('?')[0]==='/api/ai/design') {
            const chunks=[];for await(const chunk of req)chunks.push(chunk);
            response=await designResponse(new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:req.headers,body:Buffer.concat(chunks)}),{},{provider});
        } else response=await fetch(`http://127.0.0.1:${process.env.DAN_TEST_VITE_PORT||5178}${req.url}`);
        res.statusCode=response.status;
        response.headers.forEach((v,k)=>{if(!['content-encoding','content-length','transfer-encoding'].includes(k))res.setHeader(k,v);});
        res.flushHeaders();let record='';
        for await(const chunk of response.body){res.write(chunk);if(req.url==='/api/ai/design')record+=Buffer.from(chunk).toString();}
        if(record)outcomes.push(record.trim().split('\n').map(JSON.parse));
        res.end();
    }catch(error){res.statusCode=500;res.end('TEST_PROXY_ERROR');console.error('Local proxy:', req.url.split('?')[0], error.message, error.cause?.code);}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
try {
    const page=await browser.newPage();page.setDefaultTimeout(25000);await page.setViewport({width:1440,height:1050});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setRequestInterception(true);
    page.on('request',request=>request.url().startsWith(origin)||request.url().startsWith('data:')||request.url().startsWith('blob:')?request.continue():request.abort());
    await page.goto(`${origin}/ai-design`,{waitUntil:'domcontentloaded'});
    try { await page.waitForSelector('button[title="Chụp ảnh bằng camera"]'); }
    catch(error) { console.error('Page errors:',errors);console.error('Page text:',await page.$eval('body',e=>e.innerText.slice(0,500)));throw error; }
    // Skip the pre-existing intro, without modifying any site component.
    for(let n=0;n<3;n++){
        await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Bỏ qua')?.click());
        await new Promise(r=>setTimeout(r,1700));
    }
    await page.waitForFunction(()=>![...document.querySelectorAll('div')].some(e=>e.classList.contains('z-[9998]')||e.classList.contains('z-[9999]')));
    fs.mkdirSync('scratch/dan-ai-final',{recursive:true});
    await page.screenshot({path:'scratch/dan-ai-final/idle.png'});
    await page.type('section input[type=text]','Giỏ mây tròn đựng đồ, không có quai');
    await page.click('button[title="Chụp ảnh bằng camera"]');
    await page.waitForFunction(()=>[...document.querySelectorAll('video')].some(v=>v.videoWidth>0&&v.readyState>=2));
    await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.className.includes('w-16 h-16 rounded-full border-4 border-white')).at(-1).click());
    await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.trim()==='Dùng ảnh'));
    await page.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.textContent.trim()==='Dùng ảnh').at(-1).click());
    await page.waitForFunction(()=>document.querySelector('img[alt="Ảnh tham khảo"]')?.src.startsWith('data:image/jpeg'));
    await page.focus('section input[type=text]');await page.keyboard.press('Enter');
    await page.waitForSelector('section [role=status]');
    assert.equal(await page.$('img[alt="AI Generated"]'),null);
    await page.$eval('section [role=status]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await page.screenshot({path:'scratch/dan-ai-final/progress.png'});
    await page.waitForSelector('img[alt="AI Generated"]');
    assert.equal(await page.$$eval('button[aria-pressed]',e=>e.length),3);
    assert.ok(await page.$eval('section',e=>e.innerText.includes('Chờ xác nhận')));
    assert.ok(!await page.$eval('section',e=>e.innerText.includes('85.000đ/kg')));
    assert.ok(provider.calls.analysis[0].images.some(a=>a.role==='room'&&a.data.length>100));
    await page.evaluate(()=>[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Góc bên').click());
    assert.equal(await page.$eval('button[aria-pressed="true"]',e=>e.textContent.trim()),'Góc bên');
    await page.$eval('section input[type=text]',e=>e.select());await page.keyboard.type('Giỏ mây tròn màu nâu, giữ cấu tạo cũ');await page.keyboard.press('Enter');
    await page.waitForFunction(()=>!document.querySelector('img[alt="AI Generated"]'));
    await page.waitForSelector('img[alt="AI Generated"]');
    assert.ok(provider.calls.generated.slice(3).some(c=>c.images.some(a=>a.role==='previous')));
    await page.waitForFunction(()=>!document.querySelector('section [role=status]'));
    assert.equal(outcomes.length,2);
    for(const events of outcomes){assert.equal(events.at(-1).type,'complete');assert.equal(events.at(-1).specs.workflow.checks.length,49);assert.ok(events.slice(0,-1).every(e=>!e.images));}
    await page.setViewport({width:390,height:844});
    await page.$eval('img[alt="AI Generated"]',e=>e.scrollIntoView({block:'center',behavior:'instant'}));
    await page.waitForFunction(()=>{const r=document.querySelector('img[alt="AI Generated"]').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;});
    await page.screenshot({path:'scratch/dan-ai-final/mobile-result.png'});
    injectedImageError='AI_IMAGE_QUOTA_UNAVAILABLE';
    await page.$eval('section input[type=text]',e=>e.select());await page.keyboard.type('Giỏ mây tròn đựng đồ');await page.keyboard.press('Enter');
    await page.waitForSelector('section [role=alert]');
    assert.ok(await page.$eval('section [role=alert]',e=>e.innerText.includes('hạn mức bằng 0')));
    assert.equal(await page.$('img[alt="AI Generated"]'),null);
    assert.deepEqual(errors,[]);
    console.log('PASS: existing UI, camera path (Chrome fixture), streamed progress, 3 views, revisions, 49 checks, unknown estimates and truthful quota errors. No live Gemini request.');
} finally {await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
