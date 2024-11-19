import type {
  DailyDepartmentNotificationBatchNode,
  SolicitationCodeNode,
} from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";
import { Table } from "antd";
import { useQuery } from "urql";

import { getFragmentData, graphql } from "@/graphql/index.js";
import { useListQuery } from "@/hooks/useListQuery.js";
import { useQueryStatusWatcher } from "@/hooks/useQueryStatusWatcher.js";

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
    }
  }
`);

const ddnsTableQueryDocument = graphql(/* GraphQL */ `
  query DdnsTable(
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
  ) {
    dailyDepartmentNotifications(
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      page
      pageSize
      total
      data {
        ...DDNsTableFragment
      }
    }
  }
`);

export const DDNTable = () => {
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    // updateFilter,
    // clearFilter,
  } = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
      initSorting: [],
      initialStateOverride: {},
    },
    {
      allFields: [],
      dateFields: [],
      booleanFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: [],
      stringFields: [],
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

  const listDDNsData = getFragmentData(
    DDNsTableFragment,
    ddnsDocument?.dailyDepartmentNotifications.data
  );

  return (
    <Table
      dataSource={listDDNsData ?? undefined}
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
      onChange={(pagination, _filters, sorter, _extra) => {
        updatePagination({
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        clearSorting();
        for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
          if (!sort.order) {
            continue;
          }
          pushSorting({
            field: sort.field as never,
            direction:
              sort.order === "ascend" ? SortDirection.asc : SortDirection.desc,
          });
        }
      }}
      columns={[
        {
          title: "Donor",
          dataIndex: "combinedDonorName",
        },
        {
          title: "Amount",
          dataIndex: "combinedAmount",
        },
        {
          title: "Comment",
          dataIndex: "comment",
        },
        {
          title: "Solicitation Code",
          dataIndex: "solicitationCode",
          render: (solicitationCode: SolicitationCodeNode) =>
            solicitationCode.name
              ? `${solicitationCode.prefix}${solicitationCode.code}: ${solicitationCode.name}`
              : `${solicitationCode.prefix}${solicitationCode.code}`,
        },
        {
          title: "Batch",
          dataIndex: "batch",
          render: (batch: DailyDepartmentNotificationBatchNode) =>
            batch.batchType,
        },
        {
          title: "Actions",
          dataIndex: "id",
          render: (uuid: string) =>
            // <Flex gap="small" align="center">
            //   <Link from="/" to="$ddnId" params={{ ddnId: uuid }}>
            //     <Button icon={<EyeOutlined />} />
            //   </Link>
            //   <Link
            //     from="/ddns"
            //     to="$ddnId/edit"
            //     params={{ ddnId: uuid }}
            //   >
            //     <Button icon={<EditOutlined />} />
            //   </Link>
            // </Flex>
            uuid,
        },
      ]}
    />
  );
};
