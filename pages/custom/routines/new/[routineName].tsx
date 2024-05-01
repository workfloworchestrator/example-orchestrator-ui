import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartProcessPage } from '@orchestrator-ui/orchestrator-ui-components';

export default function StartRoutinePage() {
    const router = useRouter();
    const { routineName } = router.query;

    if (routineName && typeof routineName === 'string') {
        return <WfoStartProcessPage isTask={false} processName={routineName} />;
    }

    return <div>Invalid arguments provided</div>;
}
