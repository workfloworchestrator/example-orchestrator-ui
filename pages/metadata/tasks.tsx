import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoTasksPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const TasksPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
      <WfoTasksPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default TasksPage;
  