import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoResourceTypesPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const ResourceTypesPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoResourceTypesPage />
    </WfoPolicyRenderPageFallback>
);

export default ResourceTypesPage;
