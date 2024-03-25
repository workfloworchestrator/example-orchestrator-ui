import React from 'react';

import { useRouter } from 'next/router';

import { WfoProcessDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

export default function JobDetailPage() {
    const router = useRouter();
    const { jobId } = router.query;

    return (
        <>
            {(jobId && typeof jobId === 'string' && (
                <WfoProcessDetailPage processId={jobId} />
            )) || <div>Invalid taskId</div>}
        </>
    );
}
