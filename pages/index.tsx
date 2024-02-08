import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WfoStartPage,
    useWfoSession,
} from '@orchestrator-ui/orchestrator-ui-components';

export function Index() {
    const { session } = useWfoSession();
    const t = useTranslations('main');
    const username = session?.user?.name || '';

    return (
        <>
            <EuiPageHeader pageTitle={`${t('welcome')} ${username}`} />
            <EuiSpacer />
            <WfoStartPage />
        </>
    );
}

export default Index;
