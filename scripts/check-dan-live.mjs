import fs from 'node:fs';
import path from 'node:path';

// Explicit live verification: uses the existing server configuration, never prints keys.
// This makes real Gemini requests and may consume the configured account's quota.
const origin = process.env.DAN_CHECK_ORIGIN || 'http://127.0.0.1:5178';
if (!/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/.test(origin)) throw new Error('Use the local Dan AI server for this check.');
const response = await fetch(origin + '/api/ai/design', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson' },
    body: JSON.stringify({
        prompt: 'Đèn chùm hoa sen Boho treo trần: các cánh hoa sen bằng mây tre đan cong chồng lên nhau, đan mắt cáo, hoàn thiện tự nhiên, khung kim loại bên trong, một dây treo màu đen và một bóng đèn ở giữa. Không có chân đế, không phải đèn đứng. Ảnh studio nền kem, toàn bộ sản phẩm hiện rõ.',
        style: 'Boho', size: 'medium', pattern: 'Đan mắt cáo', finish: 'Tự nhiên', lang: 'vi',
    }), signal: AbortSignal.timeout(290000),
});
if (!response.ok) throw new Error('HTTP_' + response.status);
const reader = response.body.getReader(), decoder = new TextDecoder();
let buffer = '', result, failure;
while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
        const event = JSON.parse(buffer.slice(0, newline)); buffer = buffer.slice(newline + 1);
        if (event.type === 'progress') console.log('Stage ' + event.step + '/7, attempt ' + event.attempt);
        if (event.type === 'error') failure = event;
        if (event.type === 'complete') result = event;
    }
    if (done) break;
}
const directory = path.resolve('scratch/dan-ai-live');
fs.mkdirSync(directory, { recursive: true });
if (failure) {
    fs.writeFileSync(path.join(directory, 'failure.json'), JSON.stringify({ code: failure.code, questions: failure.questions, workflow: failure.workflow }, null, 2));
    console.log(JSON.stringify({ liveCheck: 'failed', code: failure.code, questions: failure.questions, report: path.join(directory, 'failure.json') }));
    process.exitCode = 1;
} else if (result) {
    for (const image of result.images) {
        const match = image.url.match(/^data:image\/(png|jpeg|webp);base64,(.+)$/);
        fs.writeFileSync(path.join(directory, image.role + '.' + match[1]), Buffer.from(match[2], 'base64'));
    }
    fs.writeFileSync(path.join(directory, 'workflow.json'), JSON.stringify(result.specs, null, 2));
    console.log(JSON.stringify({ liveCheck: 'passed', stages: result.specs.workflow.stages.length, checks: result.specs.workflow.checks.length, models: result.specs.workflow.imageModels, references: result.specs.workflow.datasetReferences, outputDirectory: directory }));
} else throw new Error('INCOMPLETE_RESULT');
