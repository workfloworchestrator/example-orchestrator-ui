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

const getCurrentDateInSeconds = () => Math.floor(Date.now() / 1000);

const calculateExpirationDate = (expiresIn?: number) => {
    if (!expiresIn) {
        return undefined;
    }

    return getCurrentDateInSeconds() + expiresIn;
};
const getWellKnownData = async () => {
    const wellKnownUrl = new URL(OIDC_CONF_FULL_WELL_KNOWN_URL);
    const wellKnown = await fetch(wellKnownUrl);
    return await wellKnown.json();
};
async function refreshAccessToken(token: JWT): Promise<JWT> {
    const { token_endpoint } = await getWellKnownData();

    try {
        const raw = {
            client_id: OAUTH2_CLIENT_ID,
            client_secret: OAUTH2_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken as string,
        };

        const response = await fetch(token_endpoint, {
            method: 'POST',
            body: new URLSearchParams(raw),
        });

        if (response.ok) {
            const data: {
                access_token: string;
                expires_in: number;
                refresh_token: string;
                refresh_expires_in: number;
            } = await response.json();

            return {
                ...token,
                accessToken: data.access_token,
                accessTokenExpiresAt: calculateExpirationDate(data.expires_in),
                refreshToken: data.refresh_token,
                refreshTokenExpiresAt: calculateExpirationDate(
                    data.refresh_expires_in,
                ),
            };
        } else {
            console.error(
                'An error occurred while refreshing the access token: ',
                response.statusText,
            );
            return token;
        }
    } catch (error) {
        console.error(
            'An error occurred while refreshing the access token: ',
            error,
        );
        return token;
    }
}

const wfoProvider: OAuthConfig<WfoUserProfile> = {
    id: NEXTAUTH_PROVIDER_ID,
    name: NEXTAUTH_PROVIDER_NAME,
    type: 'oauth',
    clientId: OAUTH2_CLIENT_ID,
    clientSecret: OAUTH2_CLIENT_SECRET || undefined,
    wellKnown: OIDC_CONF_FULL_WELL_KNOWN_URL,
    authorization: {
        params: {
            scope: NEXTAUTH_AUTHORIZATION_SCOPE_OVERRIDE || 'openid profile',
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
            // First time after signing in
            // The "account" is only available right after signing in -- adding useful data to the token
            if (account) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpiresAt: account.expires_at as number,
                    refreshTokenExpiresAt: calculateExpirationDate(
                        account.refresh_expires_in as number,
                    ),
                    profile,
                };
            }

            const now = getCurrentDateInSeconds();
            if (
                typeof token.accessTokenExpiresAt === 'number' &&
                now < token.accessTokenExpiresAt
            ) {
                return token;
            }

            return await refreshAccessToken(token);
        },
        async session({
            session,
            token,
        }: {
            session: WfoSession;
            token: JWT;
        }): Promise<WfoSession> {
            // Assign data to the session to be available in the client through the useSession hook
            return {
                ...session,
                profile: token.profile as WfoUserProfile | undefined,
                accessToken: token.accessToken ? String(token.accessToken) : '',
                accessTokenExpiresAt: token.accessTokenExpiresAt as number,
                refreshTokenExpiresAt: token.refreshTokenExpiresAt as number,
            };
        },
    },
};
export default NextAuth(authOptions);
