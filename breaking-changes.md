# Breaking Changes

## <Todo: commit hash here>

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

Note: `NEXTAUTH_ID` is split up in 2 new environment variables. The `NEXTAUTH_ISSUER` and `NEXTAUTH_WELL_KNOWN_OVERRIDE` are replaces by one new environment variable.
