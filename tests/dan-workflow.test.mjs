import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { runWorkflow } from '../server/dan-ai/workflow.js';
import { designResponse } from '../server/dan-ai/http.js';
import { createGemini, parseImage } from '../server/dan-ai/provider.js';
import { catalog, policy, constraints } from '../server/dan-ai/knowledge.js';
import { input, brief, png, fakeProvider } from './fixtures/dan-provider.mjs';

test('seven actual stages, 49 checklist results and three reference-linked images; no early image release', async()=>{
    const provider=fakeProvider(), events=[];
    const result=await runWorkflow(input(),provider,e=>events.push(e));
    assert.deepEqual(events.map(e=>e.step),[1,2,3,4,5,6,7]);
    assert.ok(events.every(e=>!e.images && !e.imageUrl));
    assert.equal(result.images.length,3); assert.equal(new Set(result.images.map(a=>a.hash)).size,3);
    const wf=result.specs.workflow;
    assert.equal(wf.checks.length,49); assert.equal(wf.stages.length,7); assert.ok(wf.constraints.every(c=>c.status==='manual_review'));
    assert.equal(wf.manufacturingStatus,'pending_artisan'); assert.equal(result.specs.materialEstimate.total_estimated_cost_vnd,null);
    assert.equal(provider.calls.generated[1].images[0].role,'front'); assert.equal(provider.calls.generated[2].images[0].id,provider.calls.generated[1].images[0].id);
    assert.equal(provider.calls.inspected.at(-1).images.length,3);
    assert.ok(provider.calls.inspected.every(c=>c.payload.rules.length && c.payload.checklist.length));
});
test('missing essential information stops before generating; arbitrary IDs and incompatible selections are rejected',async()=>{
    const missing=fakeProvider({brief:{questions:['Bạn muốn giỏ hay ghế?']}});
    await assert.rejects(()=>runWorkflow(input(),missing),e=>e.message==='NEEDS_INPUT' && e.questions.length>0);
    assert.equal(missing.calls.generated.length,0);
    for(const patch of [{materialIds:['plastic']},{weaveId:'slats'},{parts:[]}]) {
        const provider=fakeProvider({brief:patch}); await assert.rejects(()=>runWorkflow(input(),provider),/UNSUPPORTED_/); assert.equal(provider.calls.generated.length,0);
    }
    await assert.rejects(()=>runWorkflow({...input(),pattern:'Đan xương cá'},fakeProvider()),/NEEDS_INPUT/);
});
test('actual room bytes reach analysis, generation and final inspection; no fabricated room measurements',async()=>{
    const room=png(9), imageUrl=`data:${room.mime};base64,${room.data}`, provider=fakeProvider();
    const result=await runWorkflow({...input(),imageUrl},provider);
    assert.equal(provider.calls.analysis[0].images[0].data,room.data);
    assert.ok(provider.calls.generated.every(c=>c.images.some(a=>a.role==='room'&&a.data===room.data)));
    assert.equal(provider.calls.inspected.at(-1).images.length,4);
    assert.equal(result.specs.workflow.brief.dimensions.width,null);
    const bad=fakeProvider({brief:{dimensions:{width:33,depth:33,height:40,unit:'cm',evidence:'estimated from room'}}});
    await assert.rejects(()=>runWorkflow({...input(),imageUrl},bad),/NEEDS_INPUT/); assert.equal(bad.calls.generated.length,0);
});
test('failed images trigger one full new revision, with old failed evidence retained, then stop',async()=>{
    const provider=fakeProvider({fail:'S4C04'}), events=[];
    await assert.rejects(()=>runWorkflow(input(),provider,e=>events.push(e)),e=>{
        assert.equal(e.message,'VISUAL_CHECK_FAILED'); assert.equal(e.workflow.revision,2); assert.equal(e.workflow.rejectedAttempts.length,2);
        assert.ok(e.workflow.checks.every(c=>c.revision===2)); return true;
    });
    assert.equal(provider.calls.generated.length,2); assert.ok(events.some(e=>e.step===1&&e.attempt===2));
    assert.ok(provider.calls.generated[1].prompt.includes('TEST fixture'));
});
test('timeout, missing checklist, invented evidence, uncertainty and duplicate images never publish',async()=>{
    for(const options of [{inspectError:'AI_TIMEOUT'},{missing:true},{wrongEvidence:true},{uncertain:'S6C07'},{duplicate:true}]) {
        const events=[]; await assert.rejects(()=>runWorkflow(input(),fakeProvider(options),e=>events.push(e)));
        assert.ok(events.every(e=>!e.images));
    }
});
test('editing uses the previous image as reference and obtains fresh checks',async()=>{
    const old=png(17), provider=fakeProvider();
    const result=await runWorkflow({...input(),previousImage:`data:${old.mime};base64,${old.data}`,previousBrief:'{"summary":"older request"}'},provider);
    assert.equal(provider.calls.generated[0].images[0].role,'previous'); assert.equal(provider.calls.generated[0].images[0].data,old.data);
    assert.equal(result.specs.workflow.checks.length,49); assert.equal(provider.calls.inspected.length,3);
});
test('verified limits are exact-scope and evidence-bound; no invented thresholds',()=>{
    const b=brief(); b.dimensions={width:30,depth:30,height:25,unit:'cm'};
    const limit={productType:'basket',weaveId:'plain',shape:'round',frameMaterial:null,materialId:'rattan',axis:'width',minMm:100,maxMm:200,verified:true,confirmedBy:'TEST',evidenceId:'TEST',validUntil:'2099-01-01'};
    catalog.verifiedLimits.push(limit);
    try { assert.equal(constraints(b)[2].status,'fail'); limit.materialId='bamboo'; assert.equal(constraints(b)[2].status,'manual_review'); limit.materialId='rattan'; limit.validUntil='invalid'; assert.equal(constraints(b)[2].status,'manual_review'); }
    finally { catalog.verifiedLimits.pop(); }
});
test('stream delivers progress immediately and images only in final checked event; HTTP cannot forge approval',async()=>{
    const request=(body,extra={})=>new Request('http://localhost/api/ai/design',{method:'POST',headers:{'content-type':'application/json',...extra},body:JSON.stringify(body)});
    const deps={provider:fakeProvider()};
    assert.equal((await designResponse(request({...input(),approved:true}),{},deps)).status,400);
    assert.equal((await designResponse(request(input(),{origin:'https://evil.example'}),{},deps)).status,403);
    const response=await designResponse(request(input()),{},deps);
    assert.equal(response.status,200); assert.ok(response.headers.get('content-type').includes('ndjson'));
    const events=(await response.text()).trim().split('\n').map(JSON.parse);
    assert.equal(events[0].type,'progress'); assert.equal(events.at(-1).type,'complete');
    assert.ok(events.slice(0,-1).every(e=>!e.images)); assert.equal(events.at(-1).images.length,3);
    const failed=await designResponse(request(input()),{},{provider:fakeProvider({imageError:'AI_QUOTA'})});
    const errorEvents=(await failed.text()).trim().split('\n').map(JSON.parse);
    assert.equal(errorEvents.at(-1).code,'AI_QUOTA'); assert.ok(errorEvents.every(e=>!e.images));
});
test('provider keeps configured models, no remote fallback or leaked credential on failure',async()=>{
    let calls=0;
    const provider=createGemini({apiKey:'test-only-key',textModel:'existing-text',imageModel:'existing-image',fetcher:async(url,request)=>{
        calls++; assert.ok(url.includes('existing-image:generateContent')); assert.ok(!url.includes('test-only-key')); assert.equal(request.headers['x-goog-api-key'],'test-only-key');
        return new Response('{"error":{"message":"secret upstream details"}}',{status:404});
    }});
    await assert.rejects(()=>provider.generate('test',[]),/^Error: AI_MODEL_UNAVAILABLE$/); assert.equal(calls,1);
    assert.throws(()=>parseImage('https://example.com/private'),/INVALID_IMAGE/);
    await assert.rejects(()=>createGemini({apiKey:'',textModel:'x',imageModel:'y'}).generate('test',[]),/AI_KEY_MISSING/);
});
test('catalog rules/checklist integrity, original API configuration and existing page styling are preserved',()=>{
    assert.equal(policy.rules.length,38); assert.equal(policy.checklist.length,49);
    assert.ok(policy.checklist.every(c=>c.ruleIds.every(id=>policy.rules.some(r=>r.id===id))));
    const before='C:/Users/Admin/Desktop/maytredan/dan-ai-before-20261010/';
    if(fs.existsSync(before+'api/ai/design.js')) {
        const original=fs.readFileSync(before+'api/ai/design.js','utf8'), current=fs.readFileSync('api/ai/design.js','utf8');
        const hash=value=>createHash('sha256').update(value).digest('hex');
        for(const name of ['defaultKey','apiKey','TEXT_MODEL']) {
            const pattern=new RegExp(`const ${name} = [^\\r\\n]+`);
            assert.ok(hash(original.match(pattern)?.[0]||'old-missing')===hash(current.match(pattern)?.[0]||'new-missing'),'Existing Gemini configuration must remain unchanged');
        }
        assert.ok(current.includes("const IMAGE_MODEL = 'gemini-nano-banana-2.1';"), 'Use the approved image model with reference-image support');
        const oldPage=fs.readFileSync(before+'src/pages/AIDesignPage.jsx','utf8'), page=fs.readFileSync('src/pages/AIDesignPage.jsx','utf8');
        const classes=source=>[...source.matchAll(/className="([^"]*)"/g)].map(m=>m[1]);
        assert.deepEqual(classes(oldPage).filter(c=>!classes(page).includes(c)),['flex gap-3 mb-6 overflow-x-auto w-full justify-start sm:justify-center pb-1 px-2 sm:flex-wrap sm:overflow-visible scrollbar-hide','mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary','text-sm font-medium animate-pulse']);
        assert.ok(page.includes("backgroundImage: 'url(/images/bg_ai_design.jpg)'"));
    }
});
