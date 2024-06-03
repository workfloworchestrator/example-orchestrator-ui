import {
    PolicyResource,
    usePolicy,
    WfoPageUnauthorized,
    WfoProcessDetailPage,
  } from '@orchestrator-ui/orchestrator-ui-components';
  import { useRouter } from 'next/router';
  import React from 'react';
  
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
  