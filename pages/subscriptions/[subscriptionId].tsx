import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoSubscriptionDetailPage,
} from '@orchestrator-ui/orchestrator-ui-components';

const SubscriptionDetailPage = () => (
    <WfoPolicyRenderPageFallback
        resource={PolicyResource.NAVIGATION_SUBSCRIPTIONS}
    >
        <WfoSubscriptionDetailPage />
    </WfoPolicyRenderPageFallback>
);

export default SubscriptionDetailPage;
