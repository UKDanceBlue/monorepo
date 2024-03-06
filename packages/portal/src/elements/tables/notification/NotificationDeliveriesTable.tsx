import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { renderDateTime } from "@tools/luxonTools";
import { SortDirection } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Table } from "antd";
import { useQuery } from "urql";

const NotificationDeliveriesTableFragment = graphql(/* GraphQL */ `
  fragment NotificationDeliveriesTableFragment on NotificationDeliveryResource {
    uuid
    deliveryError
    receiptCheckedAt
    sentAt
  }
`);

const notificationDeliveriesTableQueryDocument = graphql(/* GraphQL */ `
  query NotificationDeliveriesTableQuery(
    $notificationId: String!
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $dateFilters: [NotificationDeliveryResolverKeyedDateFilterItem!]
    $isNullFilters: [NotificationDeliveryResolverKeyedIsNullFilterItem!]
  ) {
    notificationDeliveries(
      notificationUuid: $notificationId
      page: $page
      pageSize: $pageSize
      sortBy: $sortBy
      sortDirection: $sortDirection
      dateFilters: $dateFilters
      isNullFilters: $isNullFilters
    ) {
      page
      pageSize
      total
      data {
        ...NotificationDeliveriesTableFragment
      }
    }
  }
`);

export const NotificationDeliveriesTable = ({
  notificationUuid,
}: {
  notificationUuid: string;
}) => {
  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [],
      },
      {
        allFields: ["createdAt", "updatedAt"],
        dateFields: ["createdAt", "updatedAt"],
        isNullFields: [],
        numericFields: [],
        oneOfFields: [],
        stringFields: [],
      }
    );

  const [{ fetching, error, data: notificationDeliveriesDocument }] = useQuery({
    query: notificationDeliveriesTableQueryDocument,
    variables: {
      notificationId: notificationUuid,
      ...queryOptions,
    },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading events...",
  });

  const listEventsData = getFragmentData(
    NotificationDeliveriesTableFragment,
    notificationDeliveriesDocument?.notificationDeliveries.data
  );

  return (
    <>
      <Table
        dataSource={listEventsData ?? undefined}
        rowKey={({ uuid }) => uuid}
        loading={fetching}
        pagination={
          notificationDeliveriesDocument
            ? {
                current:
                  notificationDeliveriesDocument.notificationDeliveries.page,
                pageSize:
                  notificationDeliveriesDocument.notificationDeliveries
                    .pageSize,
                total:
                  notificationDeliveriesDocument.notificationDeliveries.total,
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
              field: sort.field as "createdAt" | "updatedAt",
              direction:
                sort.order === "ascend"
                  ? SortDirection.ASCENDING
                  : SortDirection.DESCENDING,
            });
          }
        }}
        columns={[
          {
            title: "Sent At",
            dataIndex: "sentAt",
            sorter: true,
            render: (sentAt: string | Date | null | undefined) =>
              renderDateTime(sentAt),
          },
          {
            title: "Receipt Checked At",
            dataIndex: "receiptCheckedAt",
            sorter: true,
            render: (receiptCheckedAt: string | Date | null | undefined) =>
              renderDateTime(receiptCheckedAt),
          },
          {
            title: "Delivery Error",
            dataIndex: "deliveryError",
            sorter: true,
            render: (deliveryError: string | null | undefined) =>
              deliveryError ?? "None",
          },
        ]}
      />
    </>
  );
};
