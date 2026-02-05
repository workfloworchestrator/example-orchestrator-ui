import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { SessionProvider } from 'next-auth/react';
import { NextAdapter } from 'next-query-params';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { QueryParamProvider } from 'use-query-params';

import { EuiSideNavItemType, EuiThemeColorMode } from '@elastic/eui';
import { EuiProvider } from '@elastic/eui';
import {
    ColorModes,
    ConfirmationDialogContextWrapper,
    OrchestratorConfig,
    OrchestratorConfigProvider,
    StoreProvider,
    WfoAuth,
    WfoErrorBoundary,
    WfoErrorMonitoring,
    WfoErrorMonitoringProvider,
    WfoLogoSpinner,
    WfoMenuItemLink,
    WfoPageTemplate,
    WfoToastsList,
    emptyOrchestratorConfig,
    wfoThemeModifications,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getAppLogo } from '@/components/AppLogo/AppLogo';
import { getInitialOrchestratorConfig } from '@/configuration';
import { TranslationsProvider } from '@/translations/translationsProvider';

import '../font/inter.css';

type AppOwnProps = { orchestratorConfig: OrchestratorConfig };

function CustomApp({ Component, pageProps }: AppProps & AppOwnProps) {
    const router = useRouter();
    const { orchestratorConfig } = pageProps;
    const [orchestratorLoadedConfig, setOrchestratorLoadedConfig] =
        useState<OrchestratorConfig | null>(null);
    const colorModeState = useState<EuiThemeColorMode>(ColorModes.LIGHT);

    useEffect(() => {
        if (
            orchestratorConfig &&
            !_.isEqual(orchestratorConfig, emptyOrchestratorConfig)
        ) {
            setOrchestratorLoadedConfig(orchestratorConfig);
        }
    }, [orchestratorConfig]);

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
        {
            name: 'Search',
            id: '20',
            isSelected: router.pathname === '/search',
            href: '/search',
            renderItem: () => (
                <WfoMenuItemLink
                    path={'/search'}
                    translationString="Search"
                    isSelected={router.pathname === '/search'}
                />
            ),
        },
        {
            name: 'Agent',
            id: '30',
            isSelected: router.pathname === '/agent',
            href: '/agent',
            renderItem: () => (
                <WfoMenuItemLink
                    path={'/agent'}
                    translationString="Agent"
                    isSelected={router.pathname === '/agent'}
                />
            ),
        },
    ];

    const errorMonitoringHandler: WfoErrorMonitoring | undefined = {
        reportError: (error) => console.error(error),
        reportMessage: () => {},
    };

    if (!orchestratorLoadedConfig) return <WfoLogoSpinner />;

    return (
        <WfoErrorBoundary>
            <OrchestratorConfigProvider
                initialOrchestratorConfig={orchestratorLoadedConfig}
            >
                <StoreProvider
                    initialOrchestratorConfig={orchestratorLoadedConfig}
                >
                    <SessionProvider session={pageProps.session}>
                        <WfoErrorMonitoringProvider
                            errorMonitoringHandler={errorMonitoringHandler}
                        >
                            <WfoAuth>
                                <EuiProvider
                                    colorMode={colorModeState[0]}
                                    modify={wfoThemeModifications}
                                >
                                    <TranslationsProvider>
                                        <Head>
                                            <link
                                                rel="icon"
                                                href="/favicon.png"
                                            />
                                            <title>
                                                Welcome to
                                                example-orchestrator-ui!
                                            </title>
                                        </Head>
                                        <main className="app">
                                            <ConfirmationDialogContextWrapper>
                                                <WfoPageTemplate
                                                    getAppLogo={getAppLogo}
                                                    overrideMenuItems={
                                                        addMenuItems
                                                    }
                                                    colorModeState={
                                                        colorModeState
                                                    }
                                                >
                                                    <QueryParamProvider
                                                        adapter={NextAdapter}
                                                        options={{
                                                            removeDefaultsFromUrl: false,
                                                            enableBatching: true,
                                                        }}
                                                    >
                                                        <Component
                                                            {...pageProps}
                                                        />
                                                    </QueryParamProvider>
                                                </WfoPageTemplate>
                                                <WfoToastsList />
                                            </ConfirmationDialogContextWrapper>
                                        </main>
                                    </TranslationsProvider>
                                </EuiProvider>
                            </WfoAuth>
                        </WfoErrorMonitoringProvider>
                    </SessionProvider>
                </StoreProvider>
            </OrchestratorConfigProvider>
        </WfoErrorBoundary>
    );
}

CustomApp.getInitialProps = async (context: AppContext) => {
    const isServerside = typeof window === 'undefined';
    const appProps = await App.getInitialProps(context);

    return {
        ...appProps,
        pageProps: {
            ...appProps.pageProps,
            orchestratorConfig: isServerside
                ? getInitialOrchestratorConfig()
                : null,
        },
    };
};

export default CustomApp;
