import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoTasksListPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export function TasksPage() {
    return (
        <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_TASKS}>
            <WfoTasksListPage />
        </WfoPolicyRenderPageFallback>
    );
}

export default TasksPage;
