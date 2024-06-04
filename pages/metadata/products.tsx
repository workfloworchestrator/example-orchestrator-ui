import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoProductsPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const ProductsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_METADATA}>
        <WfoProductsPage />
    </WfoPolicyRenderPageFallback>
);

export default ProductsPage;
