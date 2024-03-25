import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import type {
    StoredTableConfig,
    SubscriptionListItem,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    DEFAULT_PAGE_SIZE,
    SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    SortOrder,
    WfoFilterTabs,
    WfoSubscriptionListTab,
    WfoSubscriptionsList,
    subscriptionListTabs,
    useDataDisplayParams,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function NotificationsPage() {
    const t = useTranslations('notifications');

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<SubscriptionListItem>>();

    const getStoredTableConfig = useStoredTableConfig<SubscriptionListItem>(
        SUBSCRIPTIONS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<SubscriptionListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'startDate',
                order: SortOrder.DESC,
            },
        });

    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoSubscriptionListTab.ACTIVE),
    );

    const selectedTab = ((): WfoSubscriptionListTab => {
        return (
            subscriptionListTabs.find(({ id }) => id === activeTab)?.id ||
            WfoSubscriptionListTab.ACTIVE
        );
    })();

    const handleChangeSubscriptionsTab = (
        updatedSubscriptionsTab: WfoSubscriptionListTab,
    ) => {
        setActiveTab(updatedSubscriptionsTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = subscriptionListTabs.find(
        ({ id }) => id === activeTab,
    )?.alwaysOnFilters;

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle={t('title')} />
            <EuiSpacer size="m" />

            <WfoFilterTabs
                tabs={subscriptionListTabs}
                selectedTab={selectedTab}
                translationNamespace="notifications.tabs"
                onChangeTab={handleChangeSubscriptionsTab}
            />
            <EuiSpacer size="xxl" />

            <WfoSubscriptionsList
                hiddenColumns={tableDefaults?.hiddenColumns}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
                alwaysOnFilters={alwaysOnFilters}
            />
        </>
    );
}
