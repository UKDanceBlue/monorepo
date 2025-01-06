import { FilterFilled } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import {
  BatchType,
  SortDirection,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import { InputNumber, Table } from "antd";
import { DateTime } from "luxon";

import type { FragmentOf } from "#graphql/index.js";
import { graphql, readFragment } from "#graphql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.ts";

import {
  FundraisingAssignmentsTable,
  FundraisingEntryAssignmentTableFragment,
} from "./FundraisingEntryAssignmentsTable";

export const FundraisingEntryTableFragment = graphql(
  /* GraphQL */ `
    fragment FundraisingEntryTableFragment on ListFundraisingEntriesResponse {
      data {
        id
        amount
        amountUnassigned
        donatedByText
        donatedToText
        donatedOn
        batchType
        solicitationCode {
          id
          text
        }
        ...FundraisingEntryAssignmentTableFragment
      }
      page
      pageSize
      total
    }
  `,
  [FundraisingEntryAssignmentTableFragment]
);

export function FundraisingEntriesTable({
  form: {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    updateFilter,
    clearFilter,
  },
  data,
  loading,
  refresh,
  potentialAssignees,
  showSolicitationCode = false,
}: {
  form: UseListQueryHookReturn<
    | "donatedOn"
    | "createdAt"
    | "updatedAt"
    | "amount"
    | "amountUnassigned"
    | "teamId"
    | "batchType"
    | "donatedTo"
    | "solicitationCode"
    | "donatedBy",
    "donatedOn" | "createdAt" | "updatedAt",
    "amount" | "amountUnassigned",
    "donatedTo" | "donatedBy" | "solicitationCode",
    "teamId" | "batchType",
    never,
    never
  >;
  data?: FragmentOf<typeof FundraisingEntryTableFragment>;
  loading: boolean;
  refresh: () => void;
  potentialAssignees?: { value: string; label: string }[];
  showSolicitationCode?: boolean;
}) {
  const canEditFundraising = useAuthorizationRequirement(
    "update",
    "FundraisingEntryNode"
  );

  const donatedByStringFilterProps = useMakeStringSearchFilterProps(
    "donatedBy",
    updateFilter,
    clearFilter
  );
  const donatedToStringFilterProps = useMakeStringSearchFilterProps(
    "donatedTo",
    updateFilter,
    clearFilter
  );
  const solicitationCodeStringFilterProps = useMakeStringSearchFilterProps(
    "solicitationCode",
    updateFilter,
    clearFilter
  );

  const fragmentData = readFragment(FundraisingEntryTableFragment, data);

  return (
    <Table
      style={{ width: "100%" }}
      dataSource={fragmentData?.data ?? undefined}
      rowKey={({ id }) => id}
      loading={loading}
      pagination={
        fragmentData?.data
          ? {
              current: fragmentData.page,
              pageSize: fragmentData.pageSize,
              total: fragmentData.total,
              showSizeChanger: true,
            }
          : false
      }
      sortDirections={["ascend", "descend"]}
      onChange={(pagination, filters, sorter, _extra) => {
        updatePagination({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        clearSorting();
        if (filters.batchType) {
          updateFilter("batchType", {
            field: "batchType",
            value: Array.isArray(filters.batchType)
              ? filters.batchType.map(String)
              : [filters.batchType],
          });
        } else {
          clearFilter("batchType");
        }

        for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
          let { field } = sort;
          const { order } = sort;

          if (!order) {
            continue;
          }

          if (field === "donatedToText") {
            field = "donatedTo";
          } else if (field === "donatedByText") {
            field = "donatedBy";
          }
          pushSorting({
            field: field as
              | "teamId"
              | "donatedOn"
              | "amount"
              | "donatedTo"
              | "donatedBy"
              | "createdAt"
              | "updatedAt",
            direction:
              order === "ascend" ? SortDirection.asc : SortDirection.desc,
          });
        }
      }}
      columns={[
        {
          title: "Donated By",
          dataIndex: "donatedByText",
          key: "donatedByText",
          sorter: true,
          filtered: !!queryOptions.stringFilters.find(
            ({ field }) => field === "donatedBy"
          )?.value,
          ...donatedByStringFilterProps,
        },
        {
          title: "Donated To",
          dataIndex: "donatedToText",
          key: "donatedToText",
          sorter: true,
          filtered: !!queryOptions.stringFilters.find(
            ({ field }) => field === "donatedTo"
          )?.value,
          ...donatedToStringFilterProps,
        },
        {
          title: "Donated On",
          dataIndex: "donatedOn",
          key: "donatedOn",
          sorter: true,
          render: (date: string) => DateTime.fromISO(date).toLocaleString(),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          sorter: true,
          filtered:
            queryOptions.numericFilters.find(({ field }) => field === "amount")
              ?.value != null,
          filterIcon() {
            return (
              <FilterFilled
                style={{
                  color:
                    queryOptions.numericFilters.find(
                      ({ field }) => field === "amount"
                    )?.value != null
                      ? "#1890ff"
                      : undefined,
                }}
              />
            );
          },
          filterDropdown: () => (
            <div
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <InputNumber
                addonBefore=">"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amount");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amount", {
                      field: "amount",
                      value: numericValue,
                      comparison: "GREATER_THAN",
                    });
                  }
                }}
              />
              <InputNumber
                addonBefore="≤"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amount");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amount", {
                      field: "amount",
                      value: numericValue,
                      comparison: "LESS_THAN_OR_EQUAL_TO",
                    });
                  }
                }}
              />
            </div>
          ),
        },
        {
          title: "Amount Unassigned",
          dataIndex: "amountUnassigned",
          key: "amountUnassigned",
          sorter: true,
          filtered:
            queryOptions.numericFilters.find(
              ({ field }) => field === "amountUnassigned"
            )?.value != null,
          filterIcon() {
            return (
              <FilterFilled
                style={{
                  color:
                    queryOptions.numericFilters.find(
                      ({ field }) => field === "amountUnassigned"
                    )?.value != null
                      ? "#1890ff"
                      : undefined,
                }}
              />
            );
          },
          filterDropdown: () => (
            <div
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <InputNumber
                addonBefore=">"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amountUnassigned");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amountUnassigned", {
                      field: "amountUnassigned",
                      value: numericValue,
                      comparison: "GREATER_THAN",
                    });
                  }
                }}
              />
              <InputNumber
                addonBefore="≤"
                onChange={(value) => {
                  if (value == null) {
                    clearFilter("amountUnassigned");
                  } else {
                    const numericValue = Number.parseFloat(value.toString());
                    if (Number.isNaN(numericValue)) {
                      return;
                    }
                    updateFilter("amountUnassigned", {
                      field: "amountUnassigned",
                      value: numericValue,
                      comparison: "LESS_THAN_OR_EQUAL_TO",
                    });
                  }
                }}
              />
            </div>
          ),
        },
        // TODO: replace with a picker to select a new solicitation code
        {
          hidden: !showSolicitationCode,
          title: "Solicitation Code",
          dataIndex: "solicitationCode",
          key: "solicitationCode",
          sorter: true,
          filtered: !!queryOptions.stringFilters.find(
            ({ field }) => field === "solicitationCode"
          )?.value,
          ...solicitationCodeStringFilterProps,
          render: (
            solicitationCode: {
              text: string;
              id: string;
            } | null
          ) =>
            solicitationCode?.text && (
              <Link
                to="/fundraising/solicitation-code/$solicitationCodeId"
                params={{ solicitationCodeId: solicitationCode.id }}
              >
                {solicitationCode.text}
              </Link>
            ),
        },
        {
          title: "Batch Type",
          dataIndex: "batchType",
          key: "batchType",
          sorter: true,
          render: (batchType: string) => batchType,
          filters: Object.values(BatchType).map((batchType) => ({
            text: stringifyDDNBatchType(batchType),
            value: batchType,
          })),
        },
        Table.EXPAND_COLUMN,
        {
          hidden: !canEditFundraising,
          title: "Actions",
          key: "actions",
          render: ({ id }: { id: string }) => (
            <Link to="/fundraising/$entryId/edit" params={{ entryId: id }}>
              Edit
            </Link>
          ),
        },
      ]}
      expandable={{
        rowExpandable: () => true,
        expandedRowRender: (record) => (
          <FundraisingAssignmentsTable
            fragment={record}
            potentialAssignees={potentialAssignees}
            refresh={refresh}
          />
        ),
      }}
    />
  );
}
