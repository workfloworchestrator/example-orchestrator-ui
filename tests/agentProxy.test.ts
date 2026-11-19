/** @jest-environment node */
import type { NextApiRequest, NextApiResponse } from 'next';
import { PassThrough } from 'node:stream';

import { afterEach, expect, jest, test } from '@jest/globals';

import handler from '../pages/api/agent/[...path]';

class ResponseStream extends PassThrough {
    statusCode = 200;
    headers = new Map<string, string>();
    headersSent = false;
    chunks: Buffer[] = [];

    constructor() {
        super();
        this.on('data', (chunk) => this.chunks.push(Buffer.from(chunk)));
    }

    status(code: number) {
        this.statusCode = code;
        return this;
    }

    setHeader(name: string, value: string) {
        this.headers.set(name.toLowerCase(), value);
        return this;
    }

    flushHeaders() {
        this.headersSent = true;
    }

    json(body: unknown) {
        this.setHeader('content-type', 'application/json');
        this.end(JSON.stringify(body));
        return this;
    }
}

const request = (
    path: string[],
    overrides: Partial<NextApiRequest> = {},
): NextApiRequest =>
    ({
        query: { path },
        method: 'GET',
        url: `/api/agent/${path.join('/')}`,
        headers: {},
        ...overrides,
    }) as NextApiRequest;

const respond = (req: NextApiRequest, res: ResponseStream) =>
    handler(req, res as unknown as NextApiResponse);

const originalUpstream = process.env.ORCHESTRATOR_AGENT_UPSTREAM;

afterEach(() => {
    jest.restoreAllMocks();
    if (originalUpstream === undefined) {
        delete process.env.ORCHESTRATOR_AGENT_UPSTREAM;
    } else {
        process.env.ORCHESTRATOR_AGENT_UPSTREAM = originalUpstream;
    }
});

test('is disabled when no agent upstream is configured', async () => {
    delete process.env.ORCHESTRATOR_AGENT_UPSTREAM;
    const fetch = jest.spyOn(globalThis, 'fetch');
    const res = new ResponseStream();
    await respond(request(['chats']), res);
    expect(res.statusCode).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
});

test.each([
    ['mcp'],
    ['chats', '..', 'mcp'],
    ['chats', '../mcp'],
    ['chats', 'a/b'],
    ['agui', 'elsewhere'],
])(
    'does not proxy paths outside the chat API: %j',
    async (...path: string[]) => {
        process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
        const fetch = jest.spyOn(globalThis, 'fetch');
        const res = new ResponseStream();
        await respond(request(path), res);
        expect(res.statusCode).toBe(404);
        expect(fetch).not.toHaveBeenCalled();
    },
);

test('forwards the bearer token and JSON without forwarding UI cookies', async () => {
    process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
    const fetch = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('data: done\n\n'));
    const res = new ResponseStream();
    await respond(
        request(['agui'], {
            method: 'POST',
            headers: {
                authorization: 'Bearer user-token',
                'content-type': 'application/json',
                cookie: 'ui-session=private',
            },
            body: { threadId: 'thread-1' },
        }),
        res,
    );
    const [url, init] = fetch.mock.calls[0];
    expect(String(url)).toBe('http://agent:8080/agui/');
    expect(new Headers(init?.headers).get('authorization')).toBe(
        'Bearer user-token',
    );
    expect(new Headers(init?.headers).has('cookie')).toBe(false);
    expect(init?.body).toBe('{"threadId":"thread-1"}');
    expect(init?.redirect).toBe('error');
});

test('delivers SSE chunks before the upstream response ends', async () => {
    process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const body = new ReadableStream<Uint8Array>({
        start(controller) {
            stream = controller;
        },
    });
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(body, {
            headers: { 'content-type': 'text/event-stream' },
        }),
    );
    const res = new ResponseStream();
    const firstChunk = new Promise((resolve) => res.once('data', resolve));
    const pending = respond(request(['agui'], { method: 'POST' }), res);
    stream.enqueue(new TextEncoder().encode('data: first\n\n'));
    await firstChunk;
    expect(res.headers.get('x-accel-buffering')).toBe('no');
    expect(res.writableEnded).toBe(false);
    stream.enqueue(new TextEncoder().encode('data: second\n\n'));
    stream.close();
    await pending;
    expect(Buffer.concat(res.chunks).toString()).toContain('data: second');
});

test('preserves history queries and download headers', async () => {
    process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
    const fetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response('id\nsub-1\n', {
            headers: {
                'content-type': 'text/csv',
                'content-disposition':
                    'attachment; filename="subscriptions.csv"',
            },
        }),
    );
    const res = new ResponseStream();
    await respond(
        request(['chats', 'thread-1', 'exports', 'query-1'], {
            url: '/api/agent/chats/thread-1/exports/query-1?offset=2&limit=10',
        }),
        res,
    );
    expect(String(fetch.mock.calls[0][0])).toBe(
        'http://agent:8080/chats/thread-1/exports/query-1?offset=2&limit=10',
    );
    expect(res.headers.get('content-disposition')).toContain(
        'subscriptions.csv',
    );
    expect(Buffer.concat(res.chunks).toString()).toBe('id\nsub-1\n');
});

test('preserves upstream authorization failures and hides connection errors', async () => {
    process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
    const fetch = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(
            new Response('{"detail":"Forbidden"}', { status: 403 }),
        )
        .mockRejectedValueOnce(new Error('private upstream address'));
    const forbidden = new ResponseStream();
    await respond(request(['chats']), forbidden);
    expect(forbidden.statusCode).toBe(403);
    const unavailable = new ResponseStream();
    await respond(request(['chats']), unavailable);
    expect(unavailable.statusCode).toBe(502);
    expect(Buffer.concat(unavailable.chunks).toString()).not.toContain(
        'private',
    );
    expect(fetch).toHaveBeenCalledTimes(2);
});

// FastAPI redirects the history collection to its trailing slash. Resolve that
// internally so browser traffic never follows a redirect to the private agent.
test('uses the canonical history URL and retains pagination', async () => {
    process.env.ORCHESTRATOR_AGENT_UPSTREAM = 'http://agent:8080';
    const fetch = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response('[]'));
    await respond(
        request(['chats'], { url: '/api/agent/chats?limit=50' }),
        new ResponseStream(),
    );
    expect(String(fetch.mock.calls[0][0])).toBe(
        'http://agent:8080/chats/?limit=50',
    );
});
