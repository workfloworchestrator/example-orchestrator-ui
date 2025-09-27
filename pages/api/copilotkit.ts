import { HttpAgent } from '@ag-ui/client';
import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSPagesRouterEndpoint,
} from '@copilotkit/runtime';

const runtime = new CopilotRuntime({
    agents: {
        query_agent: new HttpAgent({
            url: process.env.AGENT_URL || 'http://localhost:8080/agent/',
        }),
    },
});

const serviceAdapter = new ExperimentalEmptyAdapter();

export default copilotRuntimeNextJSPagesRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
});
