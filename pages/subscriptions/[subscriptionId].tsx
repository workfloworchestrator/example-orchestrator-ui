import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoSubscriptionDetailPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  const SubscriptionDetailPage = () => (
    <WfoPolicyRenderPageFallback
      resource={PolicyResource.NAVIGATION_SUBSCRIPTIONS}
    >
      <WfoSubscriptionDetailPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default SubscriptionDetailPage;
  