import process from 'process';

import {
    Environment,
    OrchestratorConfig,
} from '@orchestrator-ui/orchestrator-ui-components';

export const DEFAULT_GRAPHQL_CORE_ENDPOINT =
    'http://localhost:8080/api/graphql';
export const DEFAULT_ORCHESTRATOR_API_BASE_URL = 'http://localhost:8080/api';
export const DEFAULT_ORCHESTRATOR_WEBSOCKET_URL = 'ws://localhost:8080';

export const ENGINE_STATUS_ENDPOINT = '/settings/status';
export const PROCESS_STATUS_COUNTS_ENDPOINT = '/processes/status-counts';
export const PROCESSES_ENDPOINT = '/processes';
export const SUBSCRIPTION_ACTIONS_ENDPOINT = '/subscriptions/workflows';
export const SUBSCRIPTION_PROCESSES_ENDPOINT =
    '/processes/process-subscriptions-by-subscription-id';
export const DEFAULT_WORKFLOW_INFORMATION_LINK_URL = 'http://localhost:8080';

export const getInitialOrchestratorConfig = (): OrchestratorConfig => {
    const orchestratorGraphqlBaseUrl =
        process.env.ORCHESTRATOR_GRAPHQL_HOST &&
        process.env.ORCHESTRATOR_GRAPHQL_PATH
            ? `${process.env.ORCHESTRATOR_GRAPHQL_HOST}${process.env.ORCHESTRATOR_GRAPHQL_PATH}`
            : DEFAULT_GRAPHQL_CORE_ENDPOINT;

    const orchestratorApiBaseUrl =
        process.env.ORCHESTRATOR_API_HOST && process.env.ORCHESTRATOR_API_PATH
            ? `${process.env.ORCHESTRATOR_API_HOST}${process.env.ORCHESTRATOR_API_PATH}`
            : DEFAULT_ORCHESTRATOR_API_BASE_URL;

    return {
        orchestratorApiBaseUrl,
        graphqlEndpointCore: orchestratorGraphqlBaseUrl,
        environmentName:
            process.env.ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
        orchestratorWebsocketUrl:
            process.env.ORCHESTRATOR_WEBSOCKET_URL ||
            DEFAULT_ORCHESTRATOR_WEBSOCKET_URL,
        authActive: process.env.AUTH_ACTIVE?.toLowerCase() != 'false',
        useWebSockets: process.env.USE_WEB_SOCKETS?.toLowerCase() === 'true',
        useThemeToggle: process.env.USE_THEME_TOGGLE?.toLowerCase() === 'true',
        workflowInformationLinkUrl:
            process.env.WORKFLOW_INFORMATION_LINK_URL ??
            DEFAULT_WORKFLOW_INFORMATION_LINK_URL,
        showWorkflowInformationLink:
            process.env.SHOW_WORKFLOW_INFORMATION_LINK?.toLowerCase() ===
            'true',
    };
};
