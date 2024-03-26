import React from 'react';

import { useRouter } from 'next/router';

import { WfoStartProcessPage } from '@orchestrator-ui/orchestrator-ui-components';

export default function StartJobsPage() {
    const router = useRouter();
    const { jobName } = router.query;

    if (jobName && typeof jobName === 'string') {
        return <WfoStartProcessPage isTask={true} processName={jobName} />;
    }

    return <div>Invalid arguments provided</div>;
}
