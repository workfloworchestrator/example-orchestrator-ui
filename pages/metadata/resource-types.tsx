import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoResourceTypesPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const ResourceTypesPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
      <WfoResourceTypesPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default ResourceTypesPage;
  