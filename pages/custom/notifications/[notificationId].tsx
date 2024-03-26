import React from 'react';

import { useRouter } from 'next/router';

import {
    TreeProvider,
    WfoSubscription,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function WfoNotificationDetailPage() {
    const router = useRouter();
    const { notificationId } = router.query;

    return (
        (notificationId && (
            <TreeProvider>
                <WfoSubscription subscriptionId={notificationId as string} />
            </TreeProvider>
        )) || <></>
    );
}
