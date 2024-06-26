import React from 'react';

import { useRouter } from 'next/router';

import {
    PolicyResource,
    WfoPageUnauthorized,
    WfoProcessDetailPage,
    usePolicy,
} from '@orchestrator-ui/orchestrator-ui-components';

const TaskDetailPage = () => {
    const router = useRouter();
    const { taskId } = router.query;

    const { isAllowed } = usePolicy();
    if (!isAllowed(PolicyResource.NAVIGATION_TASKS)) {
        return <WfoPageUnauthorized />;
    }

    return (
        <>
            {(taskId && typeof taskId === 'string' && (
                <WfoProcessDetailPage processId={taskId} />
            )) || <div>Invalid taskId</div>}
        </>
    );
};

export default TaskDetailPage;
