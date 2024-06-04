## Updating library version in package-lock.json.

Since the version of dependency `@orchestrator-ui/orchestrator-ui-components` is `*` for proper usage in our Turborepo, we still need to update package-lock.json to make the build command build the app with the latest library version.
After publishing a new version to npm, the current repository need to be manually updated.

Note: the command below can only be executed when the app is not part of the monorepo setup.

```bash
npm update @orchestrator-ui/orchestrator-ui-components
npm update @orchestrator-ui/eslint-config-custom
npm update @orchestrator-ui/jest-config
npm update @orchestrator-ui/tsconfig
```
