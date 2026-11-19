import type { NextApiRequest, NextApiResponse } from 'next';
import process from 'node:process';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream } from 'node:stream/web';

export const config = {
    api: {
        bodyParser: { sizeLimit: '1mb' },
        responseLimit: false,
    },
    maxDuration: 300,
};

/** Same-origin transport for the popup, its history, forms and downloads. */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
): Promise<void> {
    const path = req.query.path;
    if (
        !Array.isArray(path) ||
        !['agui', 'chats'].includes(path[0]) ||
        (path[0] === 'agui' && path.length !== 1) ||
        path.some(
            (part) =>
                !part || part === '.' || part === '..' || /[\\/?#]/.test(part),
        )
    ) {
        res.status(404).json({ detail: 'Not found.' });
        return;
    }

    const upstream = process.env.ORCHESTRATOR_AGENT_UPSTREAM;
    if (!upstream) {
        res.status(503).json({ detail: 'Agent chat is not configured.' });
        return;
    }

    let target: URL;
    try {
        const base = new URL(upstream);
        if (
            !['http:', 'https:'].includes(base.protocol) ||
            base.username ||
            base.password ||
            base.search ||
            base.hash
        ) {
            throw new Error('Invalid upstream');
        }
        const route = path.map(encodeURIComponent).join('/');
        target = new URL(`${base.href.replace(/\/$/, '')}/${route}`);
        if (path.length === 1) target.pathname += '/';
        target.search = new URL(req.url ?? '', 'http://localhost').search;
    } catch {
        res.status(503).json({ detail: 'Agent chat is not configured.' });
        return;
    }

    const method = req.method ?? 'GET';
    const headers = new Headers();
    for (const name of ['accept', 'content-type', 'authorization']) {
        const value = req.headers[name];
        if (typeof value === 'string') headers.set(name, value);
    }
    const abort = new AbortController();
    const disconnected = () => abort.abort();
    res.once('close', disconnected);

    try {
        const response = await fetch(target, {
            method,
            headers,
            body:
                method === 'GET' || method === 'HEAD' || req.body == null
                    ? undefined
                    : typeof req.body === 'string'
                      ? req.body
                      : JSON.stringify(req.body),
            redirect: 'error',
            signal: AbortSignal.any([
                abort.signal,
                AbortSignal.timeout(300_000),
            ]),
        });

        res.status(response.status);
        for (const name of ['content-type', 'content-disposition']) {
            const value = response.headers.get(name);
            if (value) res.setHeader(name, value);
        }
        res.setHeader('Cache-Control', 'no-store, no-transform');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        if (response.body && method !== 'HEAD') {
            await pipeline(
                Readable.fromWeb(response.body as ReadableStream),
                res,
            );
        } else {
            res.end();
        }
    } catch {
        if (!res.destroyed && !res.writableEnded) {
            if (res.headersSent) {
                res.destroy();
            } else {
                res.status(502).json({
                    detail: 'The agent could not be reached. Try again shortly.',
                });
            }
        }
    } finally {
        res.off('close', disconnected);
    }
}
