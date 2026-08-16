const fetch = require('node-fetch');

async function testChat() {
    try {
        const res = await fetch('https://dist-tau-weld-51.vercel.app/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ sender: 'user', text: 'hi' }] })
        });
        const text = await res.text();
        console.log('Chat Status:', res.status);
        console.log('Chat Response:', text);
    } catch (e) {
        console.error('Chat Error:', e);
    }
}

async function testDesign() {
    try {
        const res = await fetch('https://dist-tau-weld-51.vercel.app/api/ai/design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'cái bàn', style: 'hiện đại', size: 'nhỏ', pattern: 'đan móng', finish: 'tự nhiên' })
        });
        const text = await res.text();
        console.log('Design Status:', res.status);
        console.log('Design Response:', text);
    } catch (e) {
        console.error('Design Error:', e);
    }
}

testChat();
testDesign();
