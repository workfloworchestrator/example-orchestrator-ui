import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoSubscriptionsListPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function SubscriptionsPage() {
    return (
        <WfoPolicyRenderPageFallback
            resource={PolicyResource.NAVIGATION_SUBSCRIPTIONS}
        >
            <WfoSubscriptionsListPage />
        </WfoPolicyRenderPageFallback>
    );
}
