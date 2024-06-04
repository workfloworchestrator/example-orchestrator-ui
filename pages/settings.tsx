import React from 'react';

import {
    PolicyResource,
    WfoPolicyRenderPageFallback,
    WfoSettingsPage,
} from '@orchestrator-ui/orchestrator-ui-components';

export const SettingsPage = () => (
    <WfoPolicyRenderPageFallback resource={PolicyResource.NAVIGATION_SETTINGS}>
        <WfoSettingsPage />
    </WfoPolicyRenderPageFallback>
);

export default SettingsPage;
