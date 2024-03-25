import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { EuiBadgeGroup } from '@elastic/eui';
import type { Pagination } from '@elastic/eui/src/components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    WfoProductBlockBadge,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '@orchestrator-ui/orchestrator-ui-components';
import type {
    StoredTableConfig,
    WfoDataSorting,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    useGetResourceTypesQuery,
    useLazyGetResourceTypesQuery,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    BadgeType,
    GraphqlQueryVariables,
    ResourceTypeDefinition,
    SortOrder,
} from '@orchestrator-ui/orchestrator-ui-components';
import { getQueryVariablesForExport } from '@orchestrator-ui/orchestrator-ui-components';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@orchestrator-ui/orchestrator-ui-components';
import { WfoFirstPartUUID } from '@orchestrator-ui/orchestrator-ui-components';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@orchestrator-ui/orchestrator-ui-components';
import { WfoMetadataPageLayout } from '@orchestrator-ui/orchestrator-ui-components';

import { configurationTabs } from './configurationTabs';

export const RESOURCE_TYPE_FIELD_ID = 'resourceTypeId';
export const RESOURCE_TYPE_FIELD_TYPE = 'resourceType';
export const RESOURCE_TYPE_FIELD_DESCRIPTION = 'description';
export const RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS = 'productBlocks';

export default function WfoResourceTypesPage() {
    const t = useTranslations('configurations.fixedVersionTypes');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ResourceTypeDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ResourceTypeDefinition>(
        METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ResourceTypeDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: RESOURCE_TYPE_FIELD_TYPE,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoTableColumns<ResourceTypeDefinition> = {
        resourceTypeId: {
            field: RESOURCE_TYPE_FIELD_ID,
            name: t('resourceId'),
            width: '90',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        resourceType: {
            field: RESOURCE_TYPE_FIELD_TYPE,
            name: t('type'),
            width: '200',
            render: (value) => (
                <WfoProductBlockBadge badgeType={BadgeType.RESOURCE_TYPE}>
                    {value}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: RESOURCE_TYPE_FIELD_DESCRIPTION,
            name: t('description'),
        },
        productBlocks: {
            field: RESOURCE_TYPE_FIELD_PRODUCT_BLOCKS,
            name: t('usedInProductBlocks'),
            render: (productBlocks) => (
                <>
                    {productBlocks.map((productBlock, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {productBlock.name}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
            renderDetails: (productBlocks) => (
                <EuiBadgeGroup gutterSize="s">
                    {productBlocks.map((productBlock, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {productBlock.name}
                        </WfoProductBlockBadge>
                    ))}
                </EuiBadgeGroup>
            ),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ResourceTypeDefinition> =
        {
            first: pageSize,
            after: pageIndex * pageSize,
            sortBy: sortBy,
            query: queryString || undefined,
        };
    const { data, isFetching, isError } = useGetResourceTypesQuery(
        graphqlQueryVariables,
    );

    const [getResourceTypesTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetResourceTypesQuery();

    const getResourceTypesForExport = () =>
        getResourceTypesTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const dataSorting: WfoDataSorting<ResourceTypeDefinition> = {
        field: sortBy?.field ?? RESOURCE_TYPE_FIELD_TYPE,
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
            <WfoTableWithFilter<ResourceTypeDefinition>
                data={data ? data.resourceTypes : []}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ResourceTypeDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                hasError={isError}
                queryString={queryString}
                localStorageKey={
                    METADATA_RESOURCE_TYPES_TABLE_LOCAL_STORAGE_KEY
                }
                onExportData={csvDownloadHandler(
                    getResourceTypesForExport,
                    (data) => data.resourceTypes,
                    (data) => data.pageInfo,
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('ResourceTypes'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
}
