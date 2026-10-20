## Updating library version in package-lock.json.

The version of dependency `@orchestrator-ui/orchestrator-ui-components` is set to `*`. This is needed for proper usage in our Turborepo setup in
our [component library repository](https://github.com/workfloworchestrator/orchestrator-ui-library/). The current version of the component library that the example app downloads from NPM is fixed in package-lock.json. 
When a new version of any of the `@orchestrator-ui/...` namespace packages is available this repository needs to be explicitly updated.

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

## Upgrading an app based on this example from 8.x to 10.x

Doing a fresh install from this example should work without problems. If you have created your own app based on this example and want to upgrade
that to the latest version of the component library additional steps are needed. 

Version 10 of `@orchestrator-ui/orchestrator-ui-components` requires `@elastic/eui@^122.1.0` and `next@^16`. Apps based on an older
version of this example pin `@elastic/eui` to `^113.0.0`, so `npm update @orchestrator-ui/orchestrator-ui-components` fails with an
`ERESOLVE` error. Editing only the EUI version is not enough either: because the dependency is declared as `*`, npm keeps the
locked 8.x version, which in turn pins EUI 113. Follow these steps instead. See [breaking-changes.md](breaking-changes.md) for what
changes in behaviour.

1. Use Node.js 20.9 or higher everywhere you build, including CI and the `FROM` lines in your `Dockerfile` (e.g. `node:24-alpine`).

2. Update these entries in `package.json`:

    ```json
    "dependencies": {
        "@elastic/charts": "^73.2.1",
        "@elastic/eui": "^122.1.0",
        "next": "^16.3.5",
        "next-intl": "^4.14.6"
    },
    "overrides": {
        "next-query-params": {
            "next": "$next"
        }
    }
    ```

    The override is needed because `next-query-params` does not yet list Next.js 16 as a supported peer. `next-intl` must be
    updated as well: the app's `IntlProvider` and the component library have to use the same major version.

3. Install the component library with an explicit version, then update the related packages:

    ```bash
    npm install @orchestrator-ui/orchestrator-ui-components@^10.2.0
    npm update @orchestrator-ui/eslint-config-custom @orchestrator-ui/jest-config @orchestrator-ui/tsconfig
    ```

    This replaces `*` with `^10.2.0` in `package.json`, which is fine for apps outside the Turborepo setup. If npm still reports
    `ERESOLVE`, run `rm -rf node_modules package-lock.json && npm install`.

4. Apply the code changes:

    - In `pages/api/auth/[...nextauth].ts` import `OAuthConfig` from `next-auth/providers/oauth` instead of `next-auth/providers`.
    - Add `'pydantic-forms'` to `transpilePackages` in `next.config.js`.
    - Add `next-env.d.ts` to `.prettierignore`. Next.js 16 regenerates it on every build in a format prettier rejects.
    - If you have Jest tests: `next-intl` is now ESM-only. Replace `transformIgnorePatterns` with the one from
      `@orchestrator-ui/jest-config` after calling `createJestConfig` (see the comment in that package's `jest-base.config.js`).

5. Verify:

    ```bash
    npm run tsc && npm run lint && npm run prettier && npm run test && npm run build
    npm ls @elastic/eui next next-intl   # each should be listed with a single version
    ```

    Type errors at this point usually come from your own code using removed exports or renamed EUI tokens; see
    [breaking-changes.md](breaking-changes.md).
