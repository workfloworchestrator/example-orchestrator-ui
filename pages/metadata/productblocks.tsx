import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoProductBlocksPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const ProductBlocksPage = () => {
    return (
        <WfoPolicyRenderPageFallback
            resource={PolicyResource.NAVIGATION_METADATA}
        >
            <WfoProductBlocksPage />
        </WfoPolicyRenderPageFallback>
    );
};

export default ProductBlocksPage;
