import React from 'react';

import { useRouter } from 'next/router';

import {
    PolicyResource,
    WfoPageUnauthorized,
    usePolicy,
} from '@orchestrator-ui/orchestrator-ui-components';

export const IndexPage = () => {
    const router = useRouter();
    const { isAllowed } = usePolicy();

    if (!isAllowed(PolicyResource.NAVIGATION_METADATA)) {
        return <WfoPageUnauthorized />;
    }

    router.push('/metadata/products');
};

export default IndexPage;
