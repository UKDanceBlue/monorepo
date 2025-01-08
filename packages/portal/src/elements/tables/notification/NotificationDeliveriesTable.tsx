import { Table } from "antd";
import { DateTime } from "luxon";

import { PaginationFragment } from "#documents/shared.ts";
import { graphql } from "#graphql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";
import { renderDateTime } from "#tools/luxonTools.js";

const NotificationDeliveriesTableFragment = graphql(/* GraphQL */ `
  fragment NotificationDeliveriesTableFragment on NotificationDeliveryNode {
    id
    deliveryError
    receiptCheckedAt
    sentAt
  }
`);

const notificationDeliveriesTableQueryDocument = graphql(
  /* GraphQL */ `
    query NotificationDeliveriesTableQuery(
      $notificationId: GlobalId!
      $page: PositiveInt
      $pageSize: NonNegativeInt
      $sortBy: [NotificationDeliveryResolverSort!]
      $filter: NotificationDeliveryResolverFilterGroup
      $search: NotificationDeliveryResolverSearchFilter
    ) {
      notificationDeliveries(
        notificationUuid: $notificationId
        page: $page
        pageSize: $pageSize
        sortBy: $sortBy
        filters: $filter
        search: $search
      ) {
        ...PaginationFragment
        data {
          ...NotificationDeliveriesTableFragment
        }
      }
    }
  `,
  [PaginationFragment, NotificationDeliveriesTableFragment]
);

export const NotificationDeliveriesTable = ({
  notificationUuid,
}: {
  notificationUuid: string;
}) => {
  const { tableProps } = useTypedTable({
    fragment: NotificationDeliveriesTableFragment,
    props: {
      resource: "notification",
    },
    fieldTypes: {},
    gqlQuery: notificationDeliveriesTableQueryDocument,
    gqlVariables: { notificationId: notificationUuid },
    targetPath: ["notificationDeliveries"],
  });

  return (
    <Table
      {...tableProps}
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
  );
};
