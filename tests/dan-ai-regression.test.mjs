import test from 'node:test';
import assert from 'node:assert/strict';
import { createGemini } from '../server/dan-ai/provider.js';
import { runWorkflow } from '../server/dan-ai/workflow.js';
import { digest } from '../server/dan-ai/knowledge.js';
import { findMatchingDatasetItems, selectDatasetReferences } from '../server/dan-ai/datasetMatcher.js';
import { createDatasetLoader } from '../server/dan-ai/datasetAssets.js';
import { computeEstimateDetails } from '../src/lib/danEstimates.js';
import { input, brief, png, fakeProvider } from './fixtures/dan-provider.mjs';

const settings = { apiKey: 'test-only-key', textModel: 'test-text', imageModel: 'test-image', logger: { warn() {} } };
const output = value => Response.json({ candidates: [{ content: { parts: [{ text: JSON.stringify(value) }] } }] });

test('the real provider preserves failed/uncertain checks and their actual evidence', async () => {
    for (const status of ['fail','manual_review']) {
        const original = { checks: [{ id: 'S4C04', status, reason: 'Visible product has the wrong shape.', observations: ['Floor lamp, not the requested pendant'], assetIds: ['actual-id'] }] };
        const provider = createGemini({ ...settings, fetcher: async () => output(original) });
        assert.deepEqual(await provider.inspect('inspect', {}, [{ id: 'actual-id', role: 'front', ...png() }]), original);
    }
});

test('API errors never fabricate briefs, checklist approval or replacement images, with either transport', async () => {
    const originalFetch = globalThis.fetch;
    try {
        for (const custom of [true,false]) for (const [status,code] of [[400,'AI_INVALID_REQUEST'],[401,'AI_ACCESS_DENIED'],[403,'AI_ACCESS_DENIED'],[404,'AI_MODEL_UNAVAILABLE'],[429,'AI_QUOTA'],[500,'AI_PROVIDER_ERROR']]) {
            const calls = [];
            const fetcher = async url => { calls.push(url); return new Response('{"error":{"message":"private provider details"}}', { status }); };
            globalThis.fetch = fetcher;
            const provider = createGemini({ ...settings, ...(custom ? { fetcher } : {}) });
            for (const action of [() => provider.analyze('analyze', {}, []), () => provider.inspect('inspect', {}, []), () => provider.generate('lotus pendant', [])]) {
                await assert.rejects(action, error => error.message === code && !error.message.includes('private'));
            }
            assert.equal(calls.length, status === 500 ? 6 : 3);
            assert.ok(calls.every(url => url.startsWith('https://generativelanguage.googleapis.com/') && !url.includes(settings.apiKey)));
        }
    } finally { globalThis.fetch = originalFetch; }
});

test('malformed model output and missing images remain errors', async () => {
    const provider = createGemini({ ...settings, fetcher: async () => output({ checks: [] , invented: true }) });
    await assert.rejects(() => provider.inspect('inspect', {}, []), /AI_INVALID_RESPONSE/);
    await assert.rejects(() => provider.generate('lotus pendant', []), /AI_NO_IMAGE/);
});

test('zero image quota has an actionable error and transient server failures retry the same model', async () => {
    const denied = createGemini({ ...settings, fetcher: async () => Response.json({ error: { message: 'Quota exceeded, limit: 0, model: test-image' } }, { status: 429 }) });
    await assert.rejects(() => denied.generate('pendant', []), /AI_IMAGE_QUOTA_UNAVAILABLE/);
    let count = 0;
    const fixture = png(10);
    const recovering = createGemini({ ...settings, fetcher: async () => ++count === 1 ? new Response('', { status: 503 }) : Response.json({ candidates: [{ content: { parts: [{ inlineData: { mimeType: fixture.mime, data: fixture.data } }] } }] }) });
    assert.equal((await recovering.generate('pendant', [])).model, settings.imageModel);
    assert.equal(count, 2);
});

test('incomplete extraction is repaired by Gemini once without guessing missing part materials', async () => {
    let count = 0;
    const provider = fakeProvider({ analyze: () => { const value = brief(); if (++count === 1) value.parts = value.parts.filter(part => part.id !== 'rim'); return value; } });
    const result = await runWorkflow(input(), provider);
    assert.equal(count, 2);
    assert.ok(result.specs.workflow.brief.parts.some(part => part.id === 'rim'));
    assert.deepEqual(provider.calls.analysis[1].payload.missingParts, ['rim']);
});

test('dataset matching normalizes styles and enforces product/weave/finish compatibility', () => {
    const params = { prompt: 'Đèn chùm hoa sen Boho', productType: 'lampshade', weave: 'plain', finish: 'natural' };
    const boho = findMatchingDatasetItems({ ...params, style: 'Boho' }, 1);
    const bohemian = findMatchingDatasetItems({ ...params, style: 'Bohemian' }, 1);
    assert.equal(boho[0].id, '218'); assert.equal(bohemian[0].id, '218');
    assert.deepEqual(findMatchingDatasetItems({ ...params, weave: 'openwork' }), []);
    const references = selectDatasetReferences(input(), brief());
    assert.ok(references.length > 0);
    const lotus = selectDatasetReferences({ prompt: params.prompt, size: 'medium' }, { productType: 'lampshade', style: 'Boho', weaveId: 'openwork', finishId: 'natural' });
    assert.equal(lotus[0].role, 'dataset_shape'); assert.equal(lotus[0].item.id, '218');
    assert.equal(lotus[1].role, 'dataset_weave'); assert.equal(lotus[1].item.weave, 'mat_cao');
});

test('dataset loader sends no credential, verifies real bytes and refuses paths/hash mismatches', async () => {
    const fixture = png(15), bytes = Buffer.from(fixture.data, 'base64');
    const item = { file: 'images/test.png', sha256: await digest(bytes) };
    const calls = [];
    const load = createDatasetLoader('https://example.test', undefined, async (url, options) => {
        calls.push({ url: String(url), options }); return new Response(bytes);
    });
    assert.equal((await load(item)).data, fixture.data);
    assert.equal(calls[0].url, 'https://example.test/dan_may_dataset/images/test.png');
    assert.equal(calls[0].options.headers, undefined); assert.equal(calls[0].options.redirect, 'error');
    await assert.rejects(() => load({ ...item, sha256: 'wrong' }), /DATASET_REFERENCE_UNAVAILABLE/);
    const count = calls.length;
    for (const file of ['../.env','images/../../.env','https://other.test/image.png']) await assert.rejects(() => load({ ...item, file }), /DATASET_REFERENCE_UNAVAILABLE/);
    assert.equal(calls.length, count);
});

test('dataset image bytes reach main generation and all additional views use that same front', async () => {
    const provider = fakeProvider(), loaded = [];
    const result = await runWorkflow(input(), provider, () => {}, undefined, async item => { loaded.push(item.id); return png(20); });
    assert.ok(loaded.length > 0); assert.ok(provider.calls.generated[0].images.some(a => a.role.startsWith('dataset_') && a.data === png(20).data));
    for (const call of provider.calls.generated.slice(1)) assert.equal(call.images[0].id, result.images[0].id);
    assert.equal(result.specs.workflow.datasetReferences[0].datasetId, loaded[0]);
    assert.ok(result.specs.workflow.imageModels.every(a => a.model === 'test-image'));
});

test('missing or unverified production estimates stay unknown rather than inventing money/kg/hours', () => {
    for (const materialEstimate of [undefined, { items: [{ name: 'Mây' }], total_weight_kg: null }, { total_weight_kg: 1.4, total_estimated_cost_vnd: 59000 }]) {
        const estimate = computeEstimateDetails({ materials: ['Mây','Tre'], materialEstimate });
        assert.equal(estimate.total_weight_kg, null); assert.equal(estimate.estimated_hours, null); assert.equal(estimate.total_estimated_cost_vnd, null);
        assert.ok(estimate.items.every(item => item.weight_kg === null && item.item_cost_vnd === null));
    }
    assert.equal(computeEstimateDetails({ materialEstimate: { verified: true, total_weight_kg: 2, total_estimated_cost_vnd: 0 } }).total_estimated_cost_vnd, 0);
});
