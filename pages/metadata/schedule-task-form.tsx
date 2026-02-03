import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoScheduleTaskFormPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const ScheduleTasksFormPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoScheduleTaskFormPage />
    </WfoPolicyRenderPageFallback>
);

export default ScheduleTasksFormPage;
