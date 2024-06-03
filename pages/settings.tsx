import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoSettingsPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const SettingsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_SETTINGS}>
      <WfoSettingsPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default SettingsPage;
  