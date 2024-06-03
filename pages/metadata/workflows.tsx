import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoWorkflowsPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const WorkflowsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
      <WfoWorkflowsPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default WorkflowsPage;
  