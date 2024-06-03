import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoProductsPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import React from 'react';
  
  export const ProductsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
      <WfoProductsPage />
    </WfoPolicyRenderPageFallback>
  );
  
  export default ProductsPage;
  