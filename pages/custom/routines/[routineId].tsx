import React from 'react';

import { useRouter } from 'next/router';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

export default function RoutineDetailPage() {
    const router = useRouter();
    const { routineId } = router.query;

    return (
        <>
            {(routineId && typeof routineId === 'string' && (
                <WfoProcessDetailPage processId={routineId} />
            )) || <div>Invalid workflowId</div>}
        </>
    );
}
