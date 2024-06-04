import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoTasksPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const TasksPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoTasksPage />
    </WfoPolicyRenderPageFallback>
);

export default TasksPage;
