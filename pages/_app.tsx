import React, { useEffect, useState } from 'react';

import { SessionProvider } from 'next-auth/react';
import { NextAdapter } from 'next-query-params';
import App, { AppContext, AppInitialProps, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { QueryParamProvider } from 'use-query-params';

import type { EuiSideNavItemType } from '@elastic/eui';
import { EuiProvider, EuiThemeColorMode } from '@elastic/eui';
import {
    ColorModes,
    ConfirmationDialogContextWrapper,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    StoreProvider,
    WfoAuth,
    WfoErrorBoundary,
    WfoMenuItemLink,
    WfoPageTemplate,
    WfoToastsList,
    defaultOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogo } from '@/components/AppLogo/AppLogo';
import { getInitialOrchestratorConfig } from '@/configuration';
import { TranslationsProvider } from '@/translations/translationsProvider';

import '../font/inter.css';

type AppOwnProps = { orchestratorConfig: OrchestratorConfig };

function CustomApp({
    Component,
    pageProps,
    orchestratorConfig,
}: AppProps & AppOwnProps) {
    const router = useRouter();

    const [themeMode, setThemeMode] = useState<EuiThemeColorMode>(
        ColorModes.LIGHT,
    );

    const handleThemeSwitch = (newThemeMode: EuiThemeColorMode) => {
        setThemeMode(newThemeMode);
        localStorage.setItem('themeMode', newThemeMode);
    };

    useEffect(() => {
        // Initialize theme mode from localStorage or set it to 'light' if not present
        const storedTheme = localStorage.getItem('themeMode');
        if (
            !storedTheme ||
            (storedTheme !== ColorModes.LIGHT &&
                storedTheme !== ColorModes.DARK)
        ) {
            handleThemeSwitch(ColorModes.LIGHT);
        }
    }, []);

    const addMenuItems = (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ): EuiSideNavItemType<object>[] => [
        ...defaultMenuItems,
        {
            name: 'Example form',
            id: '10',
            isSelected: router.pathname === '/example-form',
            href: '/example-form',
            renderItem: () => (
                <WfoMenuItemLink
                    path={'/example-form'}
                    translationString="Example form"
                    isSelected={router.pathname === '/example-form'}
                />
            ),
        },
    ];

    return (
        <WfoErrorBoundary>
            <OrchestratorConfigProvider
                initialOrchestratorConfig={orchestratorConfig}
            >
                <StoreProvider initialOrchestratorConfig={orchestratorConfig}>
                    <SessionProvider session={pageProps.session}>
                        <WfoAuth>
                            <EuiProvider
                                colorMode={themeMode}
                                modify={defaultOrchestratorTheme}
                            >
                                <TranslationsProvider>
                                    <Head>
                                        <link rel="icon" href="/favicon.png" />
                                        <title>
                                            Welcome to example-orchestrator-ui!
                                        </title>
                                    </Head>
                                    <main className="app">
                                        <ConfirmationDialogContextWrapper>
                                            <WfoPageTemplate
                                                getAppLogo={getAppLogo}
                                                onThemeSwitch={
                                                    handleThemeSwitch
                                                }
                                                overrideMenuItems={addMenuItems}
                                            >
                                                <QueryParamProvider
                                                    adapter={NextAdapter}
                                                    options={{
                                                        removeDefaultsFromUrl:
                                                            false,
                                                        enableBatching: true,
                                                    }}
                                                >
                                                    <Component {...pageProps} />
                                                </QueryParamProvider>
                                            </WfoPageTemplate>
                                            <WfoToastsList />
                                        </ConfirmationDialogContextWrapper>
                                    </main>
                                </TranslationsProvider>
                            </EuiProvider>
                        </WfoAuth>
                    </SessionProvider>
                </StoreProvider>
            </OrchestratorConfigProvider>
        </WfoErrorBoundary>
    );
}

CustomApp.getInitialProps = async (
    context: AppContext,
): Promise<AppOwnProps & AppInitialProps> => {
    const ctx = await App.getInitialProps(context);

    return {
        ...ctx,
        orchestratorConfig: getInitialOrchestratorConfig(),
    };
};

export default CustomApp;
