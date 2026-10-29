import React from 'react';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Drag and drop measures the DOM, so the editor only renders in the browser.
const WfoWorkflowDesignerEditPage = dynamic(
    () =>
        import('@orchestrator-ui/orchestrator-ui-components').then(
            (module) => module.WfoWorkflowDesignerEditPage,
        ),
    { ssr: false },
);

export default function WorkflowDesignerEditPage() {
    const router = useRouter();
    const { name } = router.query;

    if (typeof name !== 'string') {
        return null;
    }

    // `/workflow-designer/new` designs a new workflow; designed names always carry a prefix, so they cannot be 'new'.
    return (
        <WfoWorkflowDesignerEditPage name={name === 'new' ? undefined : name} />
    );
}
