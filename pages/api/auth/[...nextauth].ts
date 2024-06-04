import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { OAuthConfig } from 'next-auth/providers';

import {
    WfoSession,
    WfoUserProfile,
    getEnvironmentVariables,
} from '@orchestrator-ui/orchestrator-ui-components';

const {
    OAUTH2_ACTIVE,
    OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET,
    NEXTAUTH_PROVIDER_ID,
    NEXTAUTH_PROVIDER_NAME,
    NEXTAUTH_AUTHORIZATION_SCOPE_OVERRIDE,
    OIDC_CONF_FULL_WELL_KNOWN_URL,
} = getEnvironmentVariables([
    'OAUTH2_ACTIVE',
    'OAUTH2_CLIENT_ID',
    'OAUTH2_CLIENT_SECRET',
    'NEXTAUTH_PROVIDER_ID',
    'NEXTAUTH_PROVIDER_NAME',
    'NEXTAUTH_AUTHORIZATION_SCOPE_OVERRIDE',
    'OIDC_CONF_FULL_WELL_KNOWN_URL',
]);

const isOauth2Enabled = OAUTH2_ACTIVE?.toLowerCase() != 'false';

const token_endpoint_auth_method = OAUTH2_CLIENT_SECRET
    ? 'client_secret_basic'
    : 'none';

const wfoProvider: OAuthConfig<WfoUserProfile> = {
    id: NEXTAUTH_PROVIDER_ID,
    name: NEXTAUTH_PROVIDER_NAME,
    type: 'oauth',
    clientId: OAUTH2_CLIENT_ID,
    clientSecret: OAUTH2_CLIENT_SECRET || undefined,
    wellKnown: OIDC_CONF_FULL_WELL_KNOWN_URL,
    authorization: {
        params: {
            scope: NEXTAUTH_AUTHORIZATION_SCOPE_OVERRIDE ?? 'openid profile',
        },
    },
    idToken: true,
    checks: ['pkce', 'state'],
    userinfo: {
        request: async (context) => {
            const { client, tokens } = context;

            if (!context.provider.wellKnown || !tokens.access_token) {
                return {};
            }

            return await client.userinfo(tokens.access_token);
        },
    },
    profile(profile) {
        return {
            id: profile.sub,
            name: profile.name ?? profile.preferred_username,
            email: profile.email,
        };
    },
    client: {
        token_endpoint_auth_method,
        response_types: ['code'],
    },
};

export const authOptions: AuthOptions = {
    providers: isOauth2Enabled ? [wfoProvider] : [],
    callbacks: {
        async jwt({ token, account, profile }) {
            // The "account" is only available right after signing in -- adding useful data to the token
            if (account) {
                token.accessToken = account.access_token;
                token.profile = profile;
            }
            return token;
        },
        async session({ session, token }: { session: WfoSession; token: JWT }) {
            // Assign data to the session to be available in the client through the useSession hook
            session.profile = token.profile as WfoUserProfile | undefined;
            session.accessToken = token.accessToken
                ? String(token.accessToken)
                : '';

            return session;
        },
    },
};
export default NextAuth(authOptions);
