import { PlusOutlined } from "@ant-design/icons";
import { EyeOutlined, SendOutlined } from "@ant-design/icons";
import { getDefaultSortOrder, List } from "@refinedev/antd";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Flex, Table } from "antd";
import { DateTime } from "luxon";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

const NotificationsTableFragment = graphql(/* GraphQL */ `
  fragment NotificationsTableFragment on NotificationNode {
    id
    title
    body
    deliveryIssue
    deliveryIssueAcknowledgedAt
    sendAt
    startedSendingAt
    createdAt
  }
`);

function ListNotificationsPage() {
  const { tableProps, searchFormProps, sorters } = useTypedTable({
    fragment: NotificationsTableFragment,
    props: {
      resource: "notification",
      sorters: {
        initial: [
          {
            field: "createdAt",
            order: "desc",
          },
        ],
      },
    },
    fieldTypes: {
      title: "string",
      body: "string",
      sentAt: "date",
      startedSendingAt: "date",
      createdAt: "date",
    },
  });
  return (
    <List
      title="Notifications"
      headerButtons={
        <Link from="/notifications" to="create">
          <Button icon={<PlusOutlined />} size="large">
            New Notification
          </Button>
        </Link>
      }
    >
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Table
        {...tableProps}
        rowKey="id"
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
          },
          {
            title: "Body",
            dataIndex: "body",
            key: "body",
            sorter: true,
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
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (createdAt: string) => {
              return DateTime.fromISO(createdAt).toLocaleString(
                DateTime.DATETIME_SHORT
              );
            },
            defaultSortOrder: getDefaultSortOrder("createdAt", sorters),
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
    </List>
  );
}

export const Route = createFileRoute("/notifications/")({
  component: ListNotificationsPage,
});
