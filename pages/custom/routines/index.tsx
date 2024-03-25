import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { EuiPageHeader, EuiSpacer } from '@elastic/eui';
import {
    ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY,
    DEFAULT_PAGE_SIZE,
    SortOrder,
    WfoFilterTabs,
    WfoProcessesList,
    WfoWorkflowsListTabType,
    defaultWorkflowsListTabs,
    getWorkflowsListTabTypeFromString,
    useDataDisplayParams,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import type {
    ProcessListItem,
    StoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';

export default function RoutineListPage() {
    const router = useRouter();
    const t = useTranslations('routines');
    const [activeTab, setActiveTab] = useQueryParam(
        'activeTab',
        withDefault(StringParam, WfoWorkflowsListTabType.ACTIVE),
    );

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProcessListItem>>();

    const selectedWorkflowsListTab =
        getWorkflowsListTabTypeFromString(activeTab);

    const localStorageKey =
        selectedWorkflowsListTab === WfoWorkflowsListTabType.ACTIVE
            ? ACTIVE_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY
            : COMPLETED_PROCESSES_LIST_TABLE_LOCAL_STORAGE_KEY;

    const getStoredTableConfig =
        useStoredTableConfig<ProcessListItem>(localStorageKey);

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProcessListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'lastModifiedAt',
                order: SortOrder.DESC,
            },
        });

    const handleChangeWorkflowsListTab = (
        updatedWorkflowsListTab: WfoWorkflowsListTabType,
    ) => {
        setActiveTab(updatedWorkflowsListTab);
        setDataDisplayParam('pageIndex', 0);
    };

    const alwaysOnFilters = defaultWorkflowsListTabs.find(
        ({ id }) => id === selectedWorkflowsListTab,
    )?.alwaysOnFilters;

    if (!selectedWorkflowsListTab) {
        router.replace('/custom/routines');
        return null;
    }

    return (
        <>
            <EuiSpacer />

            <EuiPageHeader pageTitle={t('title')} />
            <EuiSpacer size="m" />

            <WfoFilterTabs
                tabs={defaultWorkflowsListTabs}
                translationNamespace="routines.tabs"
                selectedTab={selectedWorkflowsListTab}
                onChangeTab={handleChangeWorkflowsListTab}
            />
            <EuiSpacer size="xxl" />

            <WfoProcessesList
                alwaysOnFilters={alwaysOnFilters}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                localStorageKey={localStorageKey}
                dataDisplayParams={dataDisplayParams}
                setDataDisplayParam={setDataDisplayParam}
            />
        </>
    );
}
