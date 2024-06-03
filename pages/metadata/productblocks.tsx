import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoProductBlocksPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const ProductBlocksPage = () => {
    return (
      <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoProductBlocksPage />
      </WfoPolicyRenderPageFallback>
    );
  };
  
  export default ProductBlocksPage;
  