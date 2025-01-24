import { getDefaultSortOrder } from "@refinedev/antd";
import { Link } from "@tanstack/react-router";
import {
  BatchType,
  getFiscalYear,
  SortDirection,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import { Table } from "antd";
import { DateTime } from "luxon";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.ts";
import {
  useTypedTable,
  type UseTypedTableMeta,
} from "#hooks/useTypedRefine.ts";

import {
  FundraisingAssignmentsTable,
  FundraisingEntryAssignmentTableFragment,
} from "./FundraisingEntryAssignmentsTable";

export const FundraisingEntryTableFragment = graphql(
  /* GraphQL */ `
    fragment FundraisingEntryTableFragment on FundraisingEntryNode {
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
  `,
  [FundraisingEntryAssignmentTableFragment]
);

export function FundraisingEntriesTable<T extends Record<string, unknown>>({
  potentialAssignees,
  showSolicitationCode = false,
  extraMeta,
  year,
}: {
  potentialAssignees?: { value: string; label: string }[];
  showSolicitationCode?: boolean;
  extraMeta?: UseTypedTableMeta<T, never>;
  year?: string;
}) {
  const canEditFundraising = useAuthorizationRequirement(
    "update",
    "FundraisingEntryNode"
  );

  const fiscalYear =
    year != null
      ? getFiscalYear(
          DateTime.fromObject({
            year: Number.parseInt(`20${year.substring(2)}`, 10),
          })
        )
      : undefined;

  console.log(
    fiscalYear,
    fiscalYear?.isValid,
    fiscalYear?.isValid
      ? [
          {
            field: "donatedOn",
            operator: "between",
            value: [fiscalYear.start!.toISO(), fiscalYear.end!.toISO()],
          },
        ]
      : undefined
  );

  const {
    tableProps,
    searchFormProps,
    tableQuery: { refetch },
    sorters,
  } = useTypedTable({
    fragment: FundraisingEntryTableFragment,
    props: {
      resource: "fundraisingEntry",
      sorters: {
        initial: [
          {
            field: "donatedOn",
            order: SortDirection.desc,
          },
        ],
      },
      filters: {
        permanent: fiscalYear?.isValid
          ? [
              {
                field: "donatedOn",
                operator: "between",
                value: [fiscalYear.start!.toISO(), fiscalYear.end!.toISO()],
              },
            ]
          : undefined,
      },
    },
    fieldTypes: {
      donatedByText: ["donatedBy", "string"],
      donatedToText: ["donatedTo", "string"],
      donatedOn: "date",
      batchType: ["batchType", "string"],
    },
    ...extraMeta,
  });

  return (
    <>
      <RefineSearchForm searchFormProps={searchFormProps} />
      {fiscalYear && (
        <p>
          Showing entries for {fiscalYear.end!.toFormat("yyyy")} fiscal year
        </p>
      )}
      <Table
        {...tableProps}
        style={{ width: "100%" }}
        rowKey="id"
        columns={[
          {
            title: "Donated By",
            dataIndex: "donatedByText",
            key: "donatedByText",
            sorter: true,
          },
          {
            title: "Donated To",
            dataIndex: "donatedToText",
            key: "donatedToText",
            sorter: true,
          },
          {
            title: "Donated On",
            dataIndex: "donatedOn",
            key: "donatedOn",
            sorter: true,
            render: (date: string) => DateTime.fromISO(date).toLocaleString(),
            defaultSortOrder: getDefaultSortOrder("donatedOn", sorters),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            sorter: true,
            // filtered:
            //   queryOptions.numericFilters.find(({ field }) => field === "amount")
            //     ?.value != null,
            // filterIcon() {
            //   return (
            //     <FilterFilled
            //       style={{
            //         color:
            //           queryOptions.numericFilters.find(
            //             ({ field }) => field === "amount"
            //           )?.value != null
            //             ? "#1890ff"
            //             : undefined,
            //       }}
            //     />
            //   );
            // },
            // filterDropdown: () => (
            //   <div
            //     style={{
            //       padding: 8,
            //       display: "flex",
            //       flexDirection: "column",
            //     }}
            //   >
            //     <InputNumber
            //       addonBefore=">"
            //       onChange={(value) => {
            //         if (value == null) {
            //           clearFilter("amount");
            //         } else {
            //           const numericValue = Number.parseFloat(value.toString());
            //           if (Number.isNaN(numericValue)) {
            //             return;
            //           }
            //           updateFilter("amount", {
            //             field: "amount",
            //             value: numericValue,
            //             comparison: "GREATER_THAN",
            //           });
            //         }
            //       }}
            //     />
            //     <InputNumber
            //       addonBefore="≤"
            //       onChange={(value) => {
            //         if (value == null) {
            //           clearFilter("amount");
            //         } else {
            //           const numericValue = Number.parseFloat(value.toString());
            //           if (Number.isNaN(numericValue)) {
            //             return;
            //           }
            //           updateFilter("amount", {
            //             field: "amount",
            //             value: numericValue,
            //             comparison: "LESS_THAN_OR_EQUAL_TO",
            //           });
            //         }
            //       }}
            //     />
            //   </div>
            // ),
          },
          {
            title: "Amount Unassigned",
            dataIndex: "amountUnassigned",
            key: "amountUnassigned",
            sorter: true,
            // filtered:
            //   queryOptions.numericFilters.find(
            //     ({ field }) => field === "amountUnassigned"
            //   )?.value != null,
            // filterIcon() {
            //   return (
            //     <FilterFilled
            //       style={{
            //         color:
            //           queryOptions.numericFilters.find(
            //             ({ field }) => field === "amountUnassigned"
            //           )?.value != null
            //             ? "#1890ff"
            //             : undefined,
            //       }}
            //     />
            //   );
            // },
            // filterDropdown: () => (
            //   <div
            //     style={{
            //       padding: 8,
            //       display: "flex",
            //       flexDirection: "column",
            //     }}
            //   >
            //     <InputNumber
            //       addonBefore=">"
            //       onChange={(value) => {
            //         if (value == null) {
            //           clearFilter("amountUnassigned");
            //         } else {
            //           const numericValue = Number.parseFloat(value.toString());
            //           if (Number.isNaN(numericValue)) {
            //             return;
            //           }
            //           updateFilter("amountUnassigned", {
            //             field: "amountUnassigned",
            //             value: numericValue,
            //             comparison: "GREATER_THAN",
            //           });
            //         }
            //       }}
            //     />
            //     <InputNumber
            //       addonBefore="≤"
            //       onChange={(value) => {
            //         if (value == null) {
            //           clearFilter("amountUnassigned");
            //         } else {
            //           const numericValue = Number.parseFloat(value.toString());
            //           if (Number.isNaN(numericValue)) {
            //             return;
            //           }
            //           updateFilter("amountUnassigned", {
            //             field: "amountUnassigned",
            //             value: numericValue,
            //             comparison: "LESS_THAN_OR_EQUAL_TO",
            //           });
            //         }
            //       }}
            //     />
            //   </div>
            // ),
          },
          // TODO: replace with a picker to select a new solicitation code
          {
            hidden: !showSolicitationCode,
            title: "Solicitation Code",
            dataIndex: "solicitationCode",
            key: "solicitationCode",
            sorter: true,
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
              refresh={() => refetch()}
            />
          ),
        }}
      />
    </>
  );
}
