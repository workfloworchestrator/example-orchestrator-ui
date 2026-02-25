import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { HttpAgent } from '@ag-ui/client';
import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSPagesRouterEndpoint,
} from '@copilotkit/runtime';
import { WfoSession } from '@orchestrator-ui/orchestrator-ui-components';

import { authOptions } from './auth/[...nextauth]';

const serviceAdapter = new ExperimentalEmptyAdapter();

export default async function copilotHandler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = (await getServerSession(
        req,
        res,
        authOptions,
    )) as WfoSession;

    const headers: Record<string, string> = {};
    if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    const runtime = new CopilotRuntime({
        agents: {
            // @ts-expect-error 25-2-26: This a mismactch between the latest copilot-runtime and ag-ui/client. There is a fix upstream in coplit-runtime that will be release soon.
            query_agent: new HttpAgent({
                url:
                    process.env.AGENT_URL || 'http://localhost:8080/api/agent/',
                headers,
            }),
        },
    });

    const handler = copilotRuntimeNextJSPagesRouterEndpoint({
        runtime,
        serviceAdapter,
        endpoint: '/api/copilotkit',
    });

    return handler(req, res);
}
