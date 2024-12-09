import { EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import type { SolicitationCodeNode } from "@ukdanceblue/common";
import { BatchType } from "@ukdanceblue/common";
import { SortDirection, stringifyDDNBatchType } from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";
import { useQuery } from "urql";

import { graphql, readFragment } from "#graphql/index.js";
import { useListQuery } from "#hooks/useListQuery.js";
import {
  useMakeNumberSearchFilterProps,
  useMakeStringSearchFilterProps,
} from "#hooks/useMakeSearchFilterProps";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const DDNsTableFragment = graphql(/* GraphQL */ `
  fragment DDNsTableFragment on DailyDepartmentNotificationNode {
    id
    combinedDonorName
    comment
    combinedAmount
    solicitationCode {
      prefix
      code
      name
    }
    batch {
      id
      batchType
      batchNumber
    }
  }
`);

const ddnsTableQueryDocument = graphql(
  /* GraphQL */ `
    query DdnsTable(
      $page: Int
      $pageSize: Int
      $sortBy: [String!]
      $sortDirection: [SortDirection!]
      $isNullFilters: [DailyDepartmentNotificationResolverKeyedIsNullFilterItem!]
      $oneOfFilters: [DailyDepartmentNotificationResolverKeyedOneOfFilterItem!]
      $stringFilters: [DailyDepartmentNotificationResolverKeyedStringFilterItem!]
      $numericFilters: [DailyDepartmentNotificationResolverKeyedNumericFilterItem!]
    ) {
      dailyDepartmentNotifications(
        page: $page
        pageSize: $pageSize
        sortBy: $sortBy
        sortDirection: $sortDirection
        isNullFilters: $isNullFilters
        oneOfFilters: $oneOfFilters
        stringFilters: $stringFilters
        numericFilters: $numericFilters
      ) {
        page
        pageSize
        total
        data {
          ...DDNsTableFragment
        }
      }
    }
  `,
  [DDNsTableFragment]
);

export const DDNTable = () => {
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    updateFilter,
    clearFilter,
  } = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
      initSorting: [],
      initialFilters: {},
    },
    {
      allFields: [
        "Amount",
        "BatchType",
        "Comment",
        "Donor",
        "SolicitationCodeName",
        "SolicitationCodeNumber",
        "SolicitationCodePrefix",
      ],
      dateFields: [],
      booleanFields: [],
      isNullFields: [],
      numericFields: ["Amount"],
      oneOfFields: [
        "BatchType",
        "SolicitationCodePrefix",
        "SolicitationCodeNumber",
      ],
      stringFields: ["Donor", "Comment", "SolicitationCodeName"],
    }
  );

  const [{ fetching, error, data: ddnsDocument }] = useQuery({
    query: ddnsTableQueryDocument,
    variables: queryOptions,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading ddns...",
  });

  const listDDNsData = readFragment(
    DDNsTableFragment,
    ddnsDocument?.dailyDepartmentNotifications.data ?? []
  );

  return (
    <Table
      dataSource={listDDNsData}
      rowKey={({ id }) => id}
      loading={fetching}
      pagination={
        ddnsDocument
          ? {
              current: ddnsDocument.dailyDepartmentNotifications.page,
              pageSize: ddnsDocument.dailyDepartmentNotifications.pageSize,
              total: ddnsDocument.dailyDepartmentNotifications.total,
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
        for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
          if (!sort.order) {
            continue;
          }
          let field:
            | "Amount"
            | "Donor"
            | "Comment"
            | "SolicitationCodeName"
            | "SolicitationCodeNumber"
            | "SolicitationCodePrefix"
            | "BatchType";
          switch (sort.field) {
            case "combinedAmount": {
              field = "Amount";
              break;
            }
            case "combinedDonorName": {
              field = "Donor";
              break;
            }
            case "comment": {
              field = "Comment";
              break;
            }
            case "solicitationCode": {
              field = "SolicitationCodeName";
              break;
            }
            case "batch": {
              field = "BatchType";
              break;
            }
            default: {
              throw new Error(`Unsupported sort field: ${String(sort.field)}`);
            }
          }
          pushSorting({
            field,
            direction:
              sort.order === "ascend" ? SortDirection.asc : SortDirection.desc,
          });
        }
        clearFilter("BatchType");
        for (const key of Object.keys(filters)) {
          const value = filters[key];
          if (!value) {
            continue;
          }
          switch (key) {
            case "batch": {
              updateFilter("BatchType", {
                field: "BatchType",
                value: value.map((v) => v.toString()),
              });
              break;
            }
          }
        }
      }}
      columns={[
        {
          title: "Donor",
          dataIndex: "combinedDonorName",
          sorter: true,
          ...useMakeStringSearchFilterProps("Donor", updateFilter, clearFilter),
        },
        {
          title: "Amount",
          dataIndex: "combinedAmount",
          sorter: true,
          ...useMakeNumberSearchFilterProps(
            "Amount",
            updateFilter,
            clearFilter
          ),
        },
        {
          title: "Comment",
          dataIndex: "comment",
          sorter: true,
          ...useMakeStringSearchFilterProps(
            "Comment",
            updateFilter,
            clearFilter
          ),
        },
        {
          title: "Solicitation Code",
          dataIndex: "solicitationCode",
          sorter: true,
          render: (solicitationCode: SolicitationCodeNode) =>
            solicitationCode.name ? (
              <>
                <b>{`${solicitationCode.prefix}${solicitationCode.code
                  .toString()
                  .padStart(4, "0")}`}</b>
                {` ${solicitationCode.name}`}
              </>
            ) : (
              <b>{`${solicitationCode.prefix}${solicitationCode.code
                .toString()
                .padStart(4, "0")}`}</b>
            ),
          ...useMakeStringSearchFilterProps(
            "SolicitationCodeName",
            updateFilter,
            clearFilter
          ),
        },
        {
          title: "Batch",
          dataIndex: "batch",
          sorter: true,
          render: (batch: { batchType: BatchType; batchNumber: string }) => (
            <abbr title={batch.batchNumber}>
              {stringifyDDNBatchType(batch.batchType)}
            </abbr>
          ),
          filters: Object.keys(BatchType)
            .filter((type) => type !== "Unknown")
            .map((type) => ({
              text: stringifyDDNBatchType(type as BatchType),
              value: type,
            })),
        },
        {
          title: "Actions",
          dataIndex: "id",
          render: (uuid: string) => (
            <Flex gap="small" align="center">
              <Link to="/fundraising/ddn/$ddnId" params={{ ddnId: uuid }}>
                <Button icon={<EyeOutlined />} />
              </Link>
              {/* <Link
                from="/ddns"
                to="$ddnId/edit"
                params={{ ddnId: uuid }}
              >
                <Button icon={<EditOutlined />} />
              </Link> */}
            </Flex>
          ),
        },
      ]}
    />
  );
};
