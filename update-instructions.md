## Updating library version in package-lock.json.

The version of dependency `@orchestrator-ui/orchestrator-ui-components` is set to `*`. This is needed for proper usage in our Turborepo setup in
our [component library repository](https://github.com/workfloworchestrator/orchestrator-ui-library/). The current version of the component
library that the example app downloads from NPM is fixed in package-lock.json. When a new version of any of the `@orchestrator-ui/...` namespace packages
is available this repository needs to be explicitly updated.

When a new version of the component library packages is published to npm, a webhook is called that triggers a workflow that updates the packages and
opens a pull request in this repo. This way they should stay aligned. In some cases the component library needs an accompanying change in this
repository to build correctly. In that case the workflow checks fail and a manual fix is needed.

To manually update the versions use `update-orchestrator-ui-components.sh` or run these commands

```bash
npm update @orchestrator-ui/orchestrator-ui-components
npm update @orchestrator-ui/eslint-config-custom
npm update @orchestrator-ui/jest-config
npm update @orchestrator-ui/tsconfig
```
