import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { WfoAgent } from '@orchestrator-ui/orchestrator-ui-components';

export default function SearchPage() {
    return (
        <CopilotKit runtimeUrl="/api/copilotkit" agent="query_agent">
            <WfoAgent />
        </CopilotKit>
    );
}
