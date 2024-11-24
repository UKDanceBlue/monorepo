import { SortDirection } from "@ukdanceblue/common";
import { Table } from "antd";
import { DateTime } from "luxon";
import { useQuery } from "urql";

import { getFragmentData, graphql } from "#graphql/index.js";
import { useListQuery } from "#hooks/useListQuery.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { renderDateTime } from "#tools/luxonTools.js";

const NotificationDeliveriesTableFragment = graphql(/* GraphQL */ `
  fragment NotificationDeliveriesTableFragment on NotificationDeliveryNode {
    id
    deliveryError
    receiptCheckedAt
    sentAt
  }
`);

const notificationDeliveriesTableQueryDocument = graphql(/* GraphQL */ `
  query NotificationDeliveriesTableQuery(
    $notificationId: GlobalId!
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
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    updateFilter,
    clearFilters,
  } = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
      initSorting: [],
    },
    {
      allFields: [
        "createdAt",
        "updatedAt",
        "sentAt",
        "receiptCheckedAt",
        "deliveryError",
      ],
      dateFields: ["createdAt", "updatedAt", "sentAt", "receiptCheckedAt"],
      booleanFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: ["deliveryError"],
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
    loadingMessage: "Loading deliveries...",
  });

  const listEventsData = getFragmentData(
    NotificationDeliveriesTableFragment,
    notificationDeliveriesDocument?.notificationDeliveries.data
  );

  return (
    <>
      <Table
        dataSource={listEventsData ?? undefined}
        rowKey={({ id }) => id}
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
            pushSorting({
              field: sort.field as
                | "createdAt"
                | "updatedAt"
                | "sentAt"
                | "receiptCheckedAt"
                | "deliveryError",
              direction:
                sort.order === "ascend"
                  ? SortDirection.asc
                  : SortDirection.desc,
            });
          }

          clearFilters();
          for (const key of Object.keys(filters)) {
            const value = filters[key];
            if (!value) {
              continue;
            }
            switch (key) {
              case "deliveryError": {
                updateFilter("deliveryError", {
                  field: "deliveryError",
                  value: value.map((v) => v.toString()),
                });
                break;
              }
              default: {
                console.error("Unhandled filter key", key);
                break;
              }
            }
          }
        }}
        columns={[
          {
            title: "Sent At",
            dataIndex: "sentAt",
            sorter: true,
            render: (sentAt: string | Date | null | undefined) =>
              renderDateTime(sentAt, DateTime.DATETIME_SHORT_WITH_SECONDS),
          },
          {
            title: "Receipt Checked At",
            dataIndex: "receiptCheckedAt",
            sorter: true,
            render: (receiptCheckedAt: string | Date | null | undefined) =>
              renderDateTime(
                receiptCheckedAt,
                DateTime.DATETIME_SHORT_WITH_SECONDS
              ),
          },
          {
            title: "Delivery Error",
            dataIndex: "deliveryError",
            sorter: true,
            render: (deliveryError: string | null | undefined) =>
              deliveryError ?? "None",
            filters: [
              { text: "Device Not Registered", value: "DeviceNotRegistered" },
              { text: "Invalid Credentials", value: "InvalidCredentials" },
              { text: "Message Too Big", value: "MessageTooBig" },
              { text: "Message Rate Exceeded", value: "MessageRateExceeded" },
              { text: "Mismatch Sender Id", value: "MismatchSenderId" },
              { text: "Unknown", value: "Unknown" },
            ],
          },
        ]}
      />
    </>
  );
};
