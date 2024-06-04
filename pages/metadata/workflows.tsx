import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoWorkflowsPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const WorkflowsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoWorkflowsPage />
    </WfoPolicyRenderPageFallback>
);

export default WorkflowsPage;
