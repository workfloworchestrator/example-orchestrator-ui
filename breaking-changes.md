# Breaking Changes

## orchestrator-ui-components 10.x (EUI 122, Next.js 16)

Upgrading from `@orchestrator-ui/orchestrator-ui-components` 8.x to 10.x requires changes in apps based on this example. See
[update-instructions.md](update-instructions.md) for the upgrade steps.

Required versions:

| Package / tool                | Old        | New        |
| ----------------------------- | ---------- | ---------- |
| Node.js                       | 18         | >= 20.9    |
| `@elastic/eui`                | `^113.0.0` | `^122.1.0` |
| `next`                        | `^15`      | `^16`      |
| `next-intl`                   | `^3`       | `^4`       |
| `pydantic-forms` (transitive) | 3.x        | 4.x        |

Changes that can affect your own code:

- **Removed exports (9.0):** `WfoSearchPocPage`, `PATH_SUBSCRIPTIONS_BETA`, the GraphQL based `WfoSubscriptionsList`,
  `mapGraphQlSubscriptionsResultToSubscriptionListItems`, `mapGraphQlSubscriptionsResultToPageInfo`, the
  `useGetSubscriptionSummaryListQuery` hook and related summary types, mappers and query variables. `SubscriptionListItem` no
  longer has a `customerId` field.
- **Subscription list URLs (9.0):** links should use the `activeTab`, `queryString` and `filterString` (CEL) parameters;
  `sortBy`, `page` and `pageSize` are no longer read.
- **Form payloads (10.0):** pydantic-forms 4 also submits properties without a default or with `null` as default. Set
  `pydanticFormsLegacyNullHandling: true` in your `OrchestratorConfig` to restore the previous behaviour.
- **EUI 122 (10.0):** many design tokens and icon names changed. Tokens fail type checking, but icon names are plain strings:
  check icons visually.
- **Next.js 16:** `next build` uses Turbopack and fails when `next.config.js` contains a custom `webpack` function (migrate it or
  build with `--webpack`). `publicRuntimeConfig`/`serverRuntimeConfig` are removed. See the
  [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16).
- **Module resolution:** `@orchestrator-ui/tsconfig` now uses `moduleResolution: "bundler"`, so deep imports must match a
  package's `exports`, e.g. `next-auth/providers/oauth` instead of `next-auth/providers`.
- **Workflow user guides (9.0.1):** require orchestrator-core >= 5.5.0.
- **Theme (10.1):** the theme toggle now has an automatic mode that follows the OS. Saved light/dark choices are reset to auto.
- **HTTP 403 (10.1):** a 403 from the REST API no longer signs the user out; only a 401 does.

## Commit: edec88ccce4ac168d7e23c29477ee42748d20778 (Tue Jun 4 16:09:42 2024 +0200)

Renaming environment variables:

| Old                          | New                           |
| ---------------------------- | ----------------------------- |
| AUTH_ACTIVE                  | OAUTH2_ACTIVE                 |
| NEXTAUTH_CLIENT_ID           | OAUTH2_CLIENT_ID              |
| NEXTAUTH_CLIENT_SECRET       | OAUTH2_CLIENT_SECRET          |
| NEXTAUTH_ID                  | NEXTAUTH_PROVIDER_ID          |
| NEXTAUTH_ID                  | NEXTAUTH_PROVIDER_NAME        |
| NEXTAUTH_ISSUER              | OIDC_CONF_FULL_WELL_KNOWN_URL |
| NEXTAUTH_WELL_KNOWN_OVERRIDE | OIDC_CONF_FULL_WELL_KNOWN_URL |

Note: `NEXTAUTH_ID` is split up in 2 new environment variables. The `NEXTAUTH_ISSUER` and `NEXTAUTH_WELL_KNOWN_OVERRIDE` are replaced by one new environment variable.
