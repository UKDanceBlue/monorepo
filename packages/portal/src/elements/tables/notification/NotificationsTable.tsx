import { EyeOutlined, SendOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import { Button, Flex, Table } from "antd";
import { DateTime } from "luxon";
import { useQuery } from "urql";

import { graphql, readFragment } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const NotificationsTableFragment = graphql(/* GraphQL */ `
  fragment NotificationsTableFragment on NotificationNode {
    id
    title
    body
    deliveryIssue
    deliveryIssueAcknowledgedAt
    sendAt
    startedSendingAt
  }
`);

const notificationsTableQueryDocument = graphql(
  /* GraphQL */ `
    query NotificationsTableQuery(
      $page: Int
      $pageSize: Int
      $sortBy: [String!]
      $sortDirection: [SortDirection!]
      $dateFilters: [NotificationResolverKeyedDateFilterItem!]
      $isNullFilters: [NotificationResolverKeyedIsNullFilterItem!]
      $oneOfFilters: [NotificationResolverKeyedOneOfFilterItem!]
      $stringFilters: [NotificationResolverKeyedStringFilterItem!]
    ) {
      notifications(
        page: $page
        pageSize: $pageSize
        sortBy: $sortBy
        sortDirection: $sortDirection
        dateFilters: $dateFilters
        isNullFilters: $isNullFilters
        oneOfFilters: $oneOfFilters
        stringFilters: $stringFilters
      ) {
        page
        pageSize
        total
        data {
          ...NotificationsTableFragment
        }
      }
    }
  `,
  [NotificationsTableFragment]
);

export const NotificationsTable = () => {
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
    },
    {
      allFields: [
        "createdAt",
        "updatedAt",
        "title",
        "body",
        "deliveryIssue",
        "sendAt",
        "startedSendingAt",
      ],
      dateFields: ["createdAt", "updatedAt", "sendAt", "startedSendingAt"],
      booleanFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: ["deliveryIssue"],
      stringFields: ["title", "body"],
    }
  );

  const [{ fetching, error, data: notificationsDocument }] = useQuery({
    query: notificationsTableQueryDocument,
    variables: queryOptions,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading notifications...",
  });

  const listEventsData =
    notificationsDocument?.notifications.data &&
    readFragment(
      NotificationsTableFragment,
      notificationsDocument.notifications.data
    );

  return (
    <>
      <Table
        dataSource={listEventsData ?? undefined}
        rowKey={({ id }) => id}
        loading={fetching}
        pagination={
          notificationsDocument
            ? {
                current: notificationsDocument.notifications.page,
                pageSize: notificationsDocument.notifications.pageSize,
                total: notificationsDocument.notifications.total,
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
              field: sort.field as "title" | "body" | "createdAt" | "updatedAt",
              direction:
                sort.order === "ascend"
                  ? SortDirection.asc
                  : SortDirection.desc,
            });
          }
        }}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
            ...useMakeStringSearchFilterProps(
              "title",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Body",
            dataIndex: "body",
            key: "body",
            sorter: true,
            ...useMakeStringSearchFilterProps(
              "body",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Delivery Issue",
            dataIndex: "deliveryIssue",
            key: "deliveryIssue",
            sorter: true,
            render: (
              deliveryIssue: boolean,
              { deliveryIssueAcknowledgedAt }
            ) => {
              if (deliveryIssue && deliveryIssueAcknowledgedAt) {
                return "Acknowledged";
              } else if (deliveryIssue) {
                return "Yes";
              } else {
                return "No";
              }
            },
          },
          {
            title: "Scheduled for",
            dataIndex: "sendAt",
            key: "sendAt",
            sorter: true,
            render: (sendAt: string) => {
              if (!sendAt) return "Manual";
              return DateTime.fromISO(sendAt).toLocaleString(
                DateTime.DATETIME_SHORT
              );
            },
          },
          {
            title: "Sent",
            dataIndex: "startedSendingAt",
            key: "startedSendingAt",
            sorter: true,
            render: (startedSendingAt: string) => {
              return startedSendingAt
                ? DateTime.fromISO(startedSendingAt).toLocaleString(
                    DateTime.DATETIME_SHORT
                  )
                : "No";
            },
          },
          {
            title: "Actions",
            dataIndex: "id",
            render: (uuid: string) => (
              <Flex gap="small" align="center">
                <Link
                  to="$notificationId"
                  from="/notifications"
                  params={{ notificationId: uuid }}
                >
                  <Button icon={<EyeOutlined />} />
                </Link>
                <Link
                  to="$notificationId/manage"
                  from="/notifications"
                  params={{ notificationId: uuid }}
                >
                  <Button icon={<SendOutlined />} />
                </Link>
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
