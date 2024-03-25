import React from 'react';

import { EuiHorizontalRule, EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    WfoFlushSettings,
    WfoModifySettings,
    WfoStatus,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function CustomSettingsPage() {
    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle="Custom Settings" />
            <EuiHorizontalRule />
            <WfoFlushSettings />
            <EuiSpacer />
            <WfoModifySettings />
            <EuiSpacer />
            <WfoStatus />
        </>
    );
}
