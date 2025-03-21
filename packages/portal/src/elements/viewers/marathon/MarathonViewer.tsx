import { Link } from "@tanstack/react-router";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { Descriptions, Empty, Flex } from "antd";
import { DateTime } from "luxon";
import { useMemo } from "react";

import type { FragmentOf } from "#gql/index.js";
import { graphql, readFragment } from "#gql/index.js";

export const MarathonViewerFragment = graphql(/* GraphQL */ `
  fragment MarathonViewerFragment on MarathonNode {
    id
    year
    startDate
    endDate
    hours {
      id
      shownStartingAt
      title
    }
  }
`);

export const MarathonViewer = ({
  marathon,
}: {
  marathon?: FragmentOf<typeof MarathonViewerFragment> | undefined | null;
}) => {
  const marathonData = readFragment(MarathonViewerFragment, marathon);

  const sortedHours = useMemo(() => {
    return [...(marathonData?.hours ?? [])]
      .map((hour) => ({
        ...hour,
        shownStartingAt: dateTimeFromSomething(hour.shownStartingAt),
      }))
      .sort(
        (a, b) => a.shownStartingAt.toMillis() - b.shownStartingAt.toMillis()
      );
  }, [marathonData?.hours]);

  return marathonData ? (
    <Flex vertical gap="large">
      <Descriptions title="Marathon" bordered>
        <Descriptions.Item label="Year">{marathonData.year}</Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {dateTimeFromSomething(marathonData.startDate)?.toLocaleString(
            DateTime.DATETIME_MED
          )}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {dateTimeFromSomething(marathonData.endDate)?.toLocaleString(
            DateTime.DATETIME_MED
          )}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title={
          <Flex justify="space-between" align="center">
            <span>Hours</span>
            <Link
              to="/marathon/$marathonId/hours/add"
              params={{ marathonId: marathonData.id }}
            >
              Add
            </Link>
          </Flex>
        }
        bordered
      >
        {sortedHours.map((hour) => (
          <Descriptions.Item
            key={hour.id}
            label={hour.shownStartingAt.toLocaleString(DateTime.DATETIME_MED)}
          >
            <Link
              to="/marathon/$marathonId/hours/$hourId"
              params={{ marathonId: marathonData.id, hourId: hour.id }}
            >
              {hour.title}
            </Link>
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Flex>
  ) : (
    <Empty description="No marathon found" />
  );
};
