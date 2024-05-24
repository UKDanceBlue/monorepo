import { EyeOutlined, SendOutlined } from "@ant-design/icons";
import { useListQuery } from "@hooks/useListQuery";
import { useMakeStringSearchFilterProps } from "@hooks/useMakeSearchFilterProps";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useNavigate } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Flex, Table } from "antd";
import { DateTime } from "luxon";
import { useQuery } from "urql";

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

const notificationsTableQueryDocument = graphql(/* GraphQL */ `
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
`);

export const NotificationsTable = () => {
  const navigate = useNavigate();

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

  const listEventsData = getFragmentData(
    NotificationsTableFragment,
    notificationsDocument?.notifications.data
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
                  ? SortDirection.ASCENDING
                  : SortDirection.DESCENDING,
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
            dataIndex: "uuid",
            render: (uuid: string) => (
              <Flex gap="small" align="center">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/notifications/$notificationId/",
                      params: { notificationId: uuid },
                    }).catch((error: unknown) => console.error(error))
                  }
                  icon={<EyeOutlined />}
                />
                <Button
                  onClick={() =>
                    navigate({
                      to: "/notifications/$notificationId/manage",
                      params: { notificationId: uuid },
                    }).catch((error: unknown) => console.error(error))
                  }
                  icon={<SendOutlined />}
                />
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
