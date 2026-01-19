import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoScheduledTasksPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const ScheduledTasksPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoScheduledTasksPage />
    </WfoPolicyRenderPageFallback>
);

export default ScheduledTasksPage;
