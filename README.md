# Example Orchestrator UI

The `example-orchestrator-ui` provides a sample user interface for
[Workflow Orchestrator](https://workfloworchestrator.org). Many users will
start with this UI and eventually extend or customize a fork of this repo
to their own needs.

## Developing the Example Orchestrator UI

```sh
git clone git@github.com:workfloworchestrator/example-orchestrator-ui.git
cd example-orchestrator-ui
npm install
cp .env.example .env
# edit .env.example. You will likely want to set:
#  OAUTH2_ACTIVE=false
npm run dev

# In a separate terminal, start the example-orchestrator so there's an API to
# query. This can also be pointed to another orchestrator instance.
git clone git@github.com:workfloworchestrator/example-orchestrator.git
cd example-orchestrator
docker compose up
```
