import fs from 'node:fs';
import path from 'node:path';
import { parseImage } from './provider.js';
import { digest } from './knowledge.js';

// Edge/Node compatible: load catalogued files directly from disk when bundled or static HTTP assets.
export function createDatasetLoader(origin, signal, fetcher = globalThis.fetch) {
    return async item => {
        if (!/^images\/[a-zA-Z0-9_/-]+\.(png|jpe?g|webp)$/.test(item.file)) throw new Error('DATASET_REFERENCE_UNAVAILABLE');
        
        // Fast local disk load when running in serverless runtime without mock fetcher
        if (fetcher === globalThis.fetch && typeof process !== 'undefined' && process.cwd) {
            try {
                const diskPath = path.join(process.cwd(), 'public/dan_may_dataset', item.file);
                if (fs.existsSync(diskPath)) {
                    const bytes = new Uint8Array(fs.readFileSync(diskPath));
                    if (bytes.length >= 64 && bytes.length <= 8 * 1024 * 1024 && (!item.sha256 || await digest(bytes) === item.sha256)) {
                        let binary = '';
                        for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
                        const mime = /\.png$/.test(item.file) ? 'image/png' : /\.webp$/.test(item.file) ? 'image/webp' : 'image/jpeg';
                        return parseImage('data:' + mime + ';base64,' + btoa(binary), 8 * 1024 * 1024);
                    }
                }
            } catch {}
        }

        const controller = new AbortController();
        const abort = () => controller.abort();
        signal?.addEventListener('abort', abort, { once: true });
        if (signal?.aborted) controller.abort();
        const timer = setTimeout(abort, 15000);
        try {
            const url = new URL('/dan_may_dataset/' + item.file, origin);
            const response = await fetcher(url, { signal: controller.signal, redirect: 'error' });
            if (!response.ok || Number(response.headers.get('content-length')) > 8 * 1024 * 1024) throw new Error('DATASET_REFERENCE_UNAVAILABLE');
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (bytes.length < 64 || bytes.length > 8 * 1024 * 1024 || (item.sha256 && await digest(bytes) !== item.sha256)) throw new Error('DATASET_REFERENCE_UNAVAILABLE');
            let binary = '';
            for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
            const mime = /\.png$/.test(item.file) ? 'image/png' : /\.webp$/.test(item.file) ? 'image/webp' : 'image/jpeg';
            return parseImage('data:' + mime + ';base64,' + btoa(binary), 8 * 1024 * 1024);
        } catch (err) {
            if (signal?.aborted) throw new Error('AI_TIMEOUT');
            throw new Error('DATASET_REFERENCE_UNAVAILABLE');
        } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
    };
}
