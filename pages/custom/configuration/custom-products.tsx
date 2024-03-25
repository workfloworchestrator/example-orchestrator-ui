import React, { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import type { Pagination } from '@elastic/eui/src/components';
import type {
    WfoDataSorting,
    WfoTableColumns,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    DEFAULT_PAGE_SIZE,
    DEFAULT_PAGE_SIZES,
    METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    StoredTableConfig,
    WfoDateTime,
    WfoProductBlockBadge,
    WfoProductStatusBadge,
    WfoTableWithFilter,
    getDataSortHandler,
    getPageChangeHandler,
    getQueryStringHandler,
} from '@orchestrator-ui/orchestrator-ui-components';
import { WfoFirstPartUUID } from '@orchestrator-ui/orchestrator-ui-components';
import { mapSortableAndFilterableValuesToTableColumnConfig } from '@orchestrator-ui/orchestrator-ui-components';
import {
    useDataDisplayParams,
    useShowToastMessage,
    useStoredTableConfig,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    useGetProductsQuery,
    useLazyGetProductsQuery,
} from '@orchestrator-ui/orchestrator-ui-components';
import type {
    GraphqlQueryVariables,
    ProductDefinition,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    BadgeType,
    SortOrder,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    getQueryVariablesForExport,
    parseDateToLocaleDateTimeString,
    parseIsoString,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    csvDownloadHandler,
    getCsvFileNameWithDate,
} from '@orchestrator-ui/orchestrator-ui-components';
import { WfoMetadataPageLayout } from '@orchestrator-ui/orchestrator-ui-components';

import { configurationTabs } from './configurationTabs';

const PRODUCT_FIELD_PRODUCT_ID = 'productId';
const PRODUCT_FIELD_NAME = 'name';
const PRODUCT_FIELD_DESCRIPTION = 'description';
const PRODUCT_FIELD_TAG = 'tag';
const PRODUCT_FIELD_PRODUCT_TYPE = 'productType';
const PRODUCT_FIELD_STATUS = 'status';
const PRODUCT_FIELD_PRODUCT_BLOCKS = 'productBlocks';
const PRODUCT_FIELD_FIXED_INPUTS = 'fixedInputs';
const PRODUCT_FIELD_CREATED_AT = 'createdAt';

export default function WfoProductsPage() {
    const t = useTranslations('configurations.products');
    const tError = useTranslations('errors');
    const { showToastMessage } = useShowToastMessage();
    const [tableDefaults, setTableDefaults] =
        useState<StoredTableConfig<ProductDefinition>>();

    const getStoredTableConfig = useStoredTableConfig<ProductDefinition>(
        METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY,
    );

    useEffect(() => {
        const storedConfig = getStoredTableConfig();

        if (storedConfig) {
            setTableDefaults(storedConfig);
        }
    }, [getStoredTableConfig]);

    const { dataDisplayParams, setDataDisplayParam } =
        useDataDisplayParams<ProductDefinition>({
            // TODO: Improvement: A default pageSize value is set to avoid a graphql error when the query is executed
            // the fist time before the useEffect has populated the tableDefaults. Better is to create a way for
            // the query to wait for the values to be available
            // https://github.com/workfloworchestrator/orchestrator-ui/issues/261
            pageSize: tableDefaults?.selectedPageSize || DEFAULT_PAGE_SIZE,
            sortBy: {
                field: PRODUCT_FIELD_NAME,
                order: SortOrder.ASC,
            },
        });

    const tableColumns: WfoTableColumns<ProductDefinition> = {
        productId: {
            field: PRODUCT_FIELD_PRODUCT_ID,
            name: t('id'),
            width: '90',
            render: (value) => <WfoFirstPartUUID UUID={value} />,
            renderDetails: (value) => value,
        },
        name: {
            field: PRODUCT_FIELD_NAME,
            name: t('name'),
            width: '200',
        },
        tag: {
            field: PRODUCT_FIELD_TAG,
            name: t('tag'),
            width: '120',
            render: (value) => (
                <WfoProductBlockBadge badgeType={BadgeType.PRODUCT_TAG}>
                    {value}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: PRODUCT_FIELD_DESCRIPTION,
            name: t('description'),
            width: '400',
        },
        productType: {
            field: PRODUCT_FIELD_PRODUCT_TYPE,
            name: t('productType'),
        },
        status: {
            field: PRODUCT_FIELD_STATUS,
            name: t('status'),
            width: '90',
            render: (value) => <WfoProductStatusBadge status={value} />,
        },
        fixedInputs: {
            field: PRODUCT_FIELD_FIXED_INPUTS,
            name: t('fixedInputs'),
            render: (fixedInputs) => (
                <>
                    {fixedInputs.map((fixedInput, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.FIXED_INPUT}
                        >
                            {`${fixedInput.name}: ${fixedInput.value}`}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
        },
        productBlocks: {
            field: PRODUCT_FIELD_PRODUCT_BLOCKS,
            name: t('productBlocks'),
            render: (productBlocks) => (
                <>
                    {productBlocks.map((block, index) => (
                        <WfoProductBlockBadge
                            key={index}
                            badgeType={BadgeType.PRODUCT_BLOCK}
                        >
                            {block.name}
                        </WfoProductBlockBadge>
                    ))}
                </>
            ),
        },
        createdAt: {
            field: PRODUCT_FIELD_CREATED_AT,
            name: t('createdAt'),
            render: (date) => <WfoDateTime dateOrIsoString={date} />,
            renderDetails: parseIsoString(parseDateToLocaleDateTimeString),
            clipboardText: parseIsoString(parseDateToLocaleDateTimeString),
        },
    };

    const { pageSize, pageIndex, sortBy, queryString } = dataDisplayParams;
    const graphqlQueryVariables: GraphqlQueryVariables<ProductDefinition> = {
        first: pageSize,
        after: pageIndex * pageSize,
        sortBy: sortBy,
        query: queryString || undefined,
    };
    const { data, isFetching, isError } = useGetProductsQuery(
        graphqlQueryVariables,
    );
    const [getProductsTrigger, { isFetching: isFetchingCsv }] =
        useLazyGetProductsQuery();
    const getProductsForExport = () =>
        getProductsTrigger(
            getQueryVariablesForExport(graphqlQueryVariables),
        ).unwrap();

    const { totalItems, sortFields, filterFields } = data?.pageInfo ?? {};

    const pagination: Pagination = {
        pageSize: pageSize,
        pageIndex: pageIndex,
        pageSizeOptions: DEFAULT_PAGE_SIZES,
        totalItemCount: totalItems ? totalItems : 0,
    };

    const dataSorting: WfoDataSorting<ProductDefinition> = {
        field: sortBy?.field ?? PRODUCT_FIELD_NAME,
        sortOrder: sortBy?.order ?? SortOrder.ASC,
    };

    return (
        <WfoMetadataPageLayout tabs={configurationTabs}>
            <WfoTableWithFilter<ProductDefinition>
                data={data?.products ?? []}
                tableColumns={mapSortableAndFilterableValuesToTableColumnConfig(
                    tableColumns,
                    sortFields,
                    filterFields,
                )}
                dataSorting={dataSorting}
                defaultHiddenColumns={tableDefaults?.hiddenColumns}
                onUpdateDataSort={getDataSortHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                onUpdatePage={getPageChangeHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                onUpdateQueryString={getQueryStringHandler<ProductDefinition>(
                    setDataDisplayParam,
                )}
                pagination={pagination}
                isLoading={isFetching}
                hasError={isError}
                queryString={queryString}
                localStorageKey={METADATA_PRODUCT_TABLE_LOCAL_STORAGE_KEY}
                onExportData={csvDownloadHandler(
                    getProductsForExport,
                    (data) => data?.products ?? [],
                    (data) => data?.pageInfo || {},
                    Object.keys(tableColumns),
                    getCsvFileNameWithDate('Products'),
                    showToastMessage,
                    tError,
                )}
                exportDataIsLoading={isFetchingCsv}
            />
        </WfoMetadataPageLayout>
    );
}
