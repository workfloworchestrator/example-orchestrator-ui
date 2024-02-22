import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoWorkflowsListPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function WorkflowsPage() {
    return (
        <WfoPolicyRenderPageFallback
            resource={PolicyResource.NAVIGATION_WORKFLOWS}
        >
            <WfoWorkflowsListPage />
        </WfoPolicyRenderPageFallback>
    );
}
