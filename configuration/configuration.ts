import {
    Environment,
    OrchestratorConfig,
    getEnvironmentVariables,
} from '@orchestrator-ui/orchestrator-ui-components';

export const getInitialOrchestratorConfig = (): OrchestratorConfig => {
    const {
        USE_THEME_TOGGLE,
        ENVIRONMENT_NAME,
        ORCHESTRATOR_API_HOST,
        ORCHESTRATOR_API_PATH,
        ORCHESTRATOR_GRAPHQL_HOST,
        ORCHESTRATOR_GRAPHQL_PATH,
        ORCHESTRATOR_WEBSOCKET_URL,
        USE_WEB_SOCKETS,
        WORKFLOW_INFORMATION_LINK_URL,
        SHOW_WORKFLOW_INFORMATION_LINK,
        OAUTH2_ACTIVE,
        ENABLE_SUPPORT_MENU_ITEM,
        SUPPORT_MENU_ITEM_URL,
    } = getEnvironmentVariables([
        'USE_THEME_TOGGLE',
        'ENVIRONMENT_NAME',
        'ORCHESTRATOR_API_HOST',
        'ORCHESTRATOR_API_PATH',
        'ORCHESTRATOR_GRAPHQL_HOST',
        'ORCHESTRATOR_GRAPHQL_PATH',
        'ORCHESTRATOR_WEBSOCKET_URL',
        'USE_WEB_SOCKETS',
        'WORKFLOW_INFORMATION_LINK_URL',
        'SHOW_WORKFLOW_INFORMATION_LINK',
        'OAUTH2_ACTIVE',
        'ENABLE_SUPPORT_MENU_ITEM',
        'SUPPORT_MENU_ITEM_URL',
    ]);

    const graphqlEndpointCore = `${ORCHESTRATOR_GRAPHQL_HOST}${ORCHESTRATOR_GRAPHQL_PATH}`;
    const orchestratorApiBaseUrl = `${ORCHESTRATOR_API_HOST}${ORCHESTRATOR_API_PATH}`;

    return {
        orchestratorApiBaseUrl,
        graphqlEndpointCore,
        environmentName: ENVIRONMENT_NAME ?? Environment.DEVELOPMENT,
        orchestratorWebsocketUrl: ORCHESTRATOR_WEBSOCKET_URL,
        authActive: OAUTH2_ACTIVE?.toLowerCase() != 'false',
        useWebSockets: USE_WEB_SOCKETS?.toLowerCase() === 'true',
        useThemeToggle: USE_THEME_TOGGLE?.toLowerCase() === 'true',
        workflowInformationLinkUrl: WORKFLOW_INFORMATION_LINK_URL,
        showWorkflowInformationLink:
            SHOW_WORKFLOW_INFORMATION_LINK?.toLowerCase() === 'true',
        enableSupportMenuItem:
            ENABLE_SUPPORT_MENU_ITEM?.toLowerCase() === 'true',
        supportMenuItemUrl: SUPPORT_MENU_ITEM_URL,
    };
};
