import fs from 'node:fs';
import crypto from 'node:crypto';
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/build-dan-knowledge.mjs <QUY_TAC_VA_CHECKLIST.md>');
const source = fs.readFileSync(input, 'utf8');
const rules = [...source.matchAll(/^### ([A-Z]{3}\d{2}) (.+)\r?\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm)].map(([, id, title, body]) => ({
    id, title, group: id.slice(0, 3), description: body.split(/\r?\n\r?\n/).map(x => x.trim()).find(Boolean),
    stages: (body.match(/Bước áp dụng: ([\d, ]+)/)?.[1] || '').split(',').map(Number).filter(Boolean),
    evaluator: body.match(/Bộ kiểm tra: (\w+)/)?.[1], severity: body.match(/Mức: (\w+)/)?.[1],
    evidence: body.match(/Bằng chứng: (.+)/)?.[1], missing: body.match(/Thiếu dữ liệu: (\w+)/)?.[1],
    failure: body.match(/Không đạt: (\w+)/)?.[1], sourceId: 'owner-rules-20261008',
}));
const checklist = [...source.matchAll(/^- \[ \] (S(\d)C\d{2}) (.+)\r?\n\r?\n\s+Điều kiện đạt: (.+)\r?\n\r?\n\s+Rule: ([^.]+)/gm)].map(([, id, stage, question, acceptance, refs]) => ({
    id, stage: Number(stage), question, acceptance, ruleIds: refs.split(',').map(s => s.trim()),
}));
if (rules.length !== 38 || checklist.length !== 49 || checklist.some(c => c.ruleIds.some(id => !rules.some(r => r.id === id)))) throw new Error('Source format changed; review import.');
fs.mkdirSync('data/dan-ai', { recursive: true });
const policy = JSON.stringify({ version: '1.0.0', workflowVersion: '1.0.0', scope: 'active_concept_only', sourceStatus: 'proposal_not_artisan_verified', sourceSha256: crypto.createHash('sha256').update(source).digest('hex'), rules, checklist }, null, 2);
fs.writeFileSync('data/dan-ai/policy.json', policy + '\n');
fs.writeFileSync('data/dan-ai/policy.js', 'export default ' + policy + ';\n');
console.log(`Imported ${rules.length} rules and ${checklist.length} checklist items.`);
