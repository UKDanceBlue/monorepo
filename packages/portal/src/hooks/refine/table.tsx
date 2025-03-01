import {
  ExportButton,
  useTable,
  type useTableProps,
  type useTableReturnType,
} from "@refinedev/antd";
import type { BaseRecord, CrudFilter, HttpError } from "@refinedev/core";
import { useExport } from "@refinedev/core";
import {
  type AbstractSearchFilter,
  type AbstractSortItem,
  type FilterGroupOperator,
} from "@ukdanceblue/common";
import { Result } from "antd";
import type { ResultOf, TadaDocumentNode } from "gql.tada";
import { type FC, type PropsWithChildren, useState } from "react";

import { dataProvider, type FieldTypes } from "#config/refine/graphql/data.js";
import {
  findViewLinkByGlobalId,
  refineResources,
} from "#config/refine/resources.js";
import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";

import type { PropsWithRequired } from "./core";

export interface UseTypedTableMeta<
  T extends Record<string, unknown>,
  Fields extends string,
> {
  targetPath?: string[];
  gqlQuery?: TadaDocumentNode<
    unknown,
    {
      page: number;
      pageSize: number;
      sortBy?: AbstractSortItem<Fields>[];
      filters?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        filters: any[];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: any[];
        operator: FilterGroupOperator;
      };
      search?: AbstractSearchFilter<Fields>;
    } & T
  >;
  gqlVariables?: T;
}

interface TypedTableParams<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
> extends UseTypedTableMeta<TExtraVariables, never> {
  fragment: Document;
  props: PropsWithRequired<
    useTableProps<TQueryFnData, HttpError, TSearchVariables, TData>
  >;
  fieldTypes?: FieldTypes;
  disableSearch?: boolean;
}

export function useTypedTable<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
>({
  fragment,
  props,
  fieldTypes,
  targetPath,
  gqlQuery,
  gqlVariables,
  disableSearch,
}: TypedTableParams<
  Document,
  TQueryFnData,
  TSearchVariables,
  TData,
  TExtraVariables
>): useTableReturnType<TData, HttpError, TSearchVariables> & {
  isExportLoading: boolean;
  triggerExport: () => Promise<string | undefined>;
  TableWrapper: FC<PropsWithChildren>;
} {
  const [authErrored, setAuthErrored] = useState<{
    resourceName: string;
  } | null>(null);

  const tableData: useTableReturnType<TData, HttpError, TSearchVariables> =
    useTable({
      onSearch(data) {
        const filters: CrudFilter[] = [];
        for (const [key, value] of Object.entries(data)) {
          filters.push({
            field: key,
            operator: "contains",
            value: String(value),
          });
        }
        return filters;
      },
      errorNotification: (error, _, resource) => {
        if (error?.statusCode === 403) {
          const resourceDefinition = refineResources.find(
            (r) => r.name === resource
          );
          let resourceName = resource ?? "Unknown";
          if (resourceDefinition && "label" in resourceDefinition.meta) {
            resourceName = resourceDefinition.meta.label;
          }
          setAuthErrored({ resourceName });
          return false;
        } else {
          return {
            message: "Error",
            description: error?.message,
            type: "error",
          };
        }
      },
      ...props,
      meta: {
        ...props.meta,
        targetPath,
        gqlQuery,
        gqlVariables:
          props.meta?.gqlVariables || gqlVariables
            ? {
                ...props.meta?.gqlVariables,
                ...gqlVariables,
              }
            : undefined,
        gqlFragment: fragment,
        fieldTypes,
      },
    });

  const { isLoading: isExportLoading, triggerExport } = useExport({
    resource: props.resource,
    filters: tableData.filters,
    mapData(record: Record<string, unknown>) {
      const mapped: Record<string, unknown> = {};
      for (const key in record) {
        const value = record[key];
        if (key === "id") {
          console.log(value);
          mapped.Link = findViewLinkByGlobalId(value as string);
        } else if (value instanceof Date) {
          mapped[key] = value.toISOString();
        } else if (value && typeof value === "object" && "text" in value) {
          mapped[key] = value.text;
        } else if (Array.isArray(value)) {
          if (value.some((v) => v && typeof v === "object" && !("text" in v))) {
            continue;
          } else {
            mapped[key] = value
              .map((v: unknown) => {
                if (v && typeof v === "object" && "text" in v) {
                  return String(v.text);
                }
                return v;
              })
              .join(", ");
          }
        } else {
          mapped[key] = value;
        }
      }
      return mapped;
    },
    sorters: tableData.sorters,

    meta: {
      ...props.meta,
      targetPath,
      gqlQuery,
      gqlVariables:
        props.meta?.gqlVariables || gqlVariables
          ? {
              ...props.meta?.gqlVariables,
              ...gqlVariables,
              sendAll: true,
            }
          : undefined,
      gqlFragment: fragment,
      fieldTypes,
    },
  });

  return {
    ...tableData,
    tableProps: {
      ...tableData.tableProps,
      footer: () => (
        <ExportButton onClick={triggerExport} loading={isExportLoading} />
      ),
    },
    isExportLoading,
    triggerExport,
    TableWrapper: ({ children }) =>
      authErrored ? (
        <Result
          status="403"
          title="Unauthorized"
          subTitle={`You do not have permission to view ${authErrored.resourceName}.`}
        />
      ) : (
        <>
          {disableSearch !== false && (
            <RefineSearchForm searchFormProps={tableData.searchFormProps} />
          )}
          {children}
        </>
      ),
  };
}

export function prefetchTypedTable<
  Document,
  TQueryFnData extends ResultOf<Document> & BaseRecord = ResultOf<Document> &
    BaseRecord,
  TSearchVariables extends Record<string, string> = Record<string, string>,
  TData extends BaseRecord = TQueryFnData,
  TExtraVariables extends Record<string, unknown> = Record<string, never>,
>({
  fragment,
  props,
  fieldTypes,
  gqlQuery,
  gqlVariables,
  targetPath,
}: TypedTableParams<
  Document,
  TQueryFnData,
  TSearchVariables,
  TData,
  TExtraVariables
>) {
  return dataProvider.getList({
    resource: props.resource,
    filters: [
      ...(props.filters?.permanent ?? []),
      ...(props.filters?.initial ?? []),
    ],
    pagination: props.pagination,
    sorters: [
      ...(props.sorters?.permanent ?? []),
      ...(props.sorters?.initial ?? []),
    ],
    meta: {
      ...props.meta,
      targetPath,
      gqlQuery,
      gqlVariables:
        props.meta?.gqlVariables || gqlVariables
          ? {
              ...props.meta?.gqlVariables,
              ...gqlVariables,
            }
          : undefined,
      gqlFragment: fragment,
      fieldTypes,
    },
  });
}
