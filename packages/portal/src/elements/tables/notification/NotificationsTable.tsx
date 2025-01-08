import { EyeOutlined, SendOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Button, Flex, Table } from "antd";
import { DateTime } from "luxon";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#graphql/index.js";
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
  }
`);

export const NotificationsTable = () => {
  const { tableProps, searchFormProps } = useTypedTable({
    fragment: NotificationsTableFragment,
    props: {
      resource: "notification",
    },
    fieldTypes: {},
  });

  return (
    <>
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
