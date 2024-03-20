import { Link } from "@tanstack/react-router";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Descriptions, Empty, Flex, Table } from "antd";
import { DateTime } from "luxon";

export const MarathonViewerFragment = graphql(/* GraphQL */ `
  fragment MarathonViewerFragment on MarathonResource {
    uuid
    year
    startDate
    endDate
    hours {
      uuid
    }
  }
`);

export const MarathonViewer = ({
  marathon,
}: {
  marathon?: FragmentType<typeof MarathonViewerFragment> | null | undefined;
}) => {
  const marathonData = getFragmentData(MarathonViewerFragment, marathon);

  return marathonData ? (
    <Flex vertical gap="large">
      <Descriptions title="Marathon" bordered>
        <Descriptions.Item label="Year">{marathonData.year}</Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {dateTimeFromSomething(marathonData.startDate).toLocaleString(
            DateTime.DATETIME_MED
          )}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {dateTimeFromSomething(marathonData.endDate).toLocaleString(
            DateTime.DATETIME_MED
          )}
        </Descriptions.Item>
      </Descriptions>
      <Table
        dataSource={marathonData.hours}
        rowKey="uuid"
        pagination={false}
        columns={[
          {
            title: "Hours",
            dataIndex: "uuid",
            render: (uuid: string) => (
              <Link
                to="/marathon/$marathonId/hours/$hourId/"
                params={{ marathonId: marathonData.uuid, hourId: uuid }}
              >
                {uuid}
              </Link>
            ),
          },
        ]}
      />
    </Flex>
  ) : (
    <Empty description="No marathon found" />
  );
};
