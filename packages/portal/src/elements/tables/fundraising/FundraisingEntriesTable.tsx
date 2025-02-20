import {
  DateField,
  getDefaultSortOrder,
  NumberField,
  TagField,
} from "@refinedev/antd";
import { Link } from "@tanstack/react-router";
import {
  BatchType,
  getFiscalYear,
  SolicitationCodeTag,
  SortDirection,
  stringifyDDNBatchType,
  stringifySolicitationCodeTag,
} from "@ukdanceblue/common";
import { Table } from "antd";
import { DateTime } from "luxon";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.js";
import { graphql } from "#gql/index.js";
import { useAuthorizationRequirement } from "#hooks/useLoginState.js";
import {
  useTypedTable,
  type UseTypedTableMeta,
} from "#hooks/useTypedRefine.js";

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
      createdAt
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
        permanent: [
          ...(fiscalYear?.isValid
            ? [
                {
                  field: "donatedOn",
                  operator: "between",
                  value: [fiscalYear.start!.toISO(), fiscalYear.end!.toISO()],
                } as const,
              ]
            : []),
        ],
      },
    },
    fieldTypes: {
      donatedByText: ["donatedBy", "string"],
      donatedToText: ["donatedTo", "string"],
      donatedOn: "date",
      batchType: ["batchType", "string"],
      solicitationCode: ["solicitationCodeTags", "array", "every", "one"],
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
            render: (date) => <DateField value={date} />,
            defaultSortOrder: getDefaultSortOrder("donatedOn", sorters),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            sorter: true,
            render: (value) => (
              <NumberField
                value={value}
                options={{
                  style: "currency",
                  currency: "USD",
                }}
              />
            ),
          },
          {
            title: "Amount Unassigned",
            dataIndex: "amountUnassigned",
            key: "amountUnassigned",
            sorter: true,
            hidden: potentialAssignees == null,
            render: (value) => (
              <NumberField
                value={value}
                options={{
                  style: "currency",
                  currency: "USD",
                }}
              />
            ),
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
            filters: Object.values(SolicitationCodeTag).map((value) => ({
              text: stringifySolicitationCodeTag(value),
              value,
            })),
          },
          {
            title: "Batch Type",
            dataIndex: "batchType",
            key: "batchType",
            sorter: true,
            render: (batchType) => <TagField value={batchType} />,
            filters: Object.values(BatchType).map((batchType) => ({
              text: stringifyDDNBatchType(batchType),
              value: batchType,
            })),
          },
          {
            title: "Entry Created",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (date) => <DateField value={date} />,
            defaultSortOrder: getDefaultSortOrder("createdAt", sorters),
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
