import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';
import type {
    WfoDataSorting,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDateTime,
    WfoProductBlockBadge,
    WfoTableWithFilter,
    WfoWorkflowTargetBadge,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    useGetWorkflowsQuery,
    useLazyGetWorkflowsQuery,
} from '@orchestrator-ui/orchestrator-ui-components';
import type {
    GraphqlQueryVariables,
    WorkflowDefinition,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    BadgeType,
    SortOrder,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    getQueryVariablesForExport,
    onlyUnique,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@orchestrator-ui/orchestrator-ui-components';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@orchestrator-ui/orchestrator-ui-components';
import { WfoMetadataPageLayout } from '@orchestrator-ui/orchestrator-ui-components';
import {
    graphQlWorkflowListMapper,
    mapWorkflowDefinitionToWorkflowListItem,
} from '@orchestrator-ui/orchestrator-ui-components';

import { configurationTabs } from './configurationTabs';

export type WorkflowListItem = Pick<
    WorkflowDefinition,
    'name' | 'description' | 'target' | 'createdAt'
> & {
    productTags: string[];
};

export default function RoutinesPage() {
    const t = useTranslations('configurations.routines');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();

    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<WorkflowListItem>>();

    const getStoredTableConfig = useStoredTableConfig<WorkflowListItem>(
        METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<WorkflowListItem>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: 'name',
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoTableColumns<WorkflowListItem> = {
        name: {
            field: 'name',
            name: t('name'),
            width: '200',
            render: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.WORKFLOW}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '300',
        },
        target: {
            field: 'target',
            name: t('target'),
            width: '90',
            render: (target) => <WfoWorkflowTargetBadge target={target} />,
        },
        productTags: {
            field: 'productTags',
            name: t('productTags'),
            render: (productTags) => (
                <>
                    {productTags
                        ?.filter(onlyUnique)
                        .map((productTag, index) => (
                            <WfoProductBlockBadge
                                key={index}
                                badgeType={BadgeType.PRODUCT_TAG}
                            >
                                {productTag}
                            </WfoProductBlockBadge>
                        ))}
                </>
            ),
            renderDetails: (productTags) => (
                <EuiBadgeGroup gutterSize="s">
                    {productTags
                        ?.filter(onlyUnique)
                        .map((productTag, index) => (
                            <WfoProductBlockBadge
                                key={index}
                                badgeType={BadgeType.PRODUCT_TAG}
                            >
                                {productTag}
                            </WfoProductBlockBadge>
                        ))}
                </EuiBadgeGroup>
            ),
        },
        createdAt: {
            field: 'createdAt',
            name: t('createdAt'),
            width: '110',
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;

    const workflowListQueryVariables: GraphqlQueryVariables<WorkflowDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: graphQlWorkflowListMapper(sortBy),
            query: queryString || undefined,
        };
    const { data, isFetching, isError } = useGetWorkflowsQuery(
        workflowListQueryVariables,
    );

    const [getWorkflowsTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetWorkflowsQuery();

    const getWorkflowsForExport = () =>
        getWorkflowsTrigger(
            getQueryVariablesForExport(workflowListQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<WorkflowListItem> = {
        field: sortBy?.field ?? 'name',
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    const { totalItems, sortFields, filterFields } = data?.pageInfo || {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    return (
        <WfoMetadataPageLayout tabs={configurationTabs}>
            <WfoTableWithFilter<WorkflowListItem>
                data={
                    data
                        ? mapWorkflowDefinitionToWorkflowListItem(
                              data.workflows,
                          )
                        : []
                }
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<WorkflowListItem>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                hasError={isError}
                queryString={queryString}
                localStorageKey={METADATA_WORKFLOWS_TABLE_LOCAL_STORAGE_KEY}
                onExportData={csvDownloadHandler(
                    getWorkflowsForExport,
                    (data) => data.workflows,
                    (data) => data.pageInfo,
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('Workflows'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
}
