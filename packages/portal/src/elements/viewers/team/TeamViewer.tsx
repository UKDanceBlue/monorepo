import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Descriptions, Empty, Flex } from "antd";

export const TeamViewerFragment = graphql(/* GraphQL */ `
  fragment TeamViewerFragment on TeamResource {
    uuid
    name
    marathonYear
    legacyStatus
    totalPoints
    type
    members {
      person {
        name
        linkblue
      }
    }
    captains {
      person {
        name
        linkblue
      }
    }
  }
`);

export function TeamViewer({
  teamFragment,
}: {
  teamFragment: FragmentType<typeof TeamViewerFragment> | undefined;
}) {
  const teamData =
    getFragmentData(TeamViewerFragment, teamFragment) ?? undefined;

  if (!teamData) {
    return <Empty description="Team not found" />;
  }

  return (
    <Flex gap="1em">
      <Descriptions
        bordered
        column={1}
        size="small"
        style={{ flex: 1 }}
        title="Team Overview"
      >
        <Descriptions.Item label="Name">{teamData.name}</Descriptions.Item>
        <Descriptions.Item label="Marathon Year">
          {teamData.marathonYear}
        </Descriptions.Item>
        <Descriptions.Item label="Legacy Status">
          {teamData.legacyStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Total Points">
          {teamData.totalPoints}
        </Descriptions.Item>
        <Descriptions.Item label="Type">{teamData.type}</Descriptions.Item>
      </Descriptions>
      <Descriptions
        bordered
        column={1}
        size="small"
        style={{ flex: 1 }}
        title="Team Members"
      >
        <Descriptions.Item label="Captains">
          <ul>
            {teamData.captains.map((captain) => (
              <li>
                {captain.person.name} ({captain.person.linkblue})
              </li>
            ))}
          </ul>
        </Descriptions.Item>
        <Descriptions.Item label="Members">
          <ul>
            {teamData.members.map((member) => (
              <li>
                {member.person.name ?? "Never logged in"} (
                {member.person.linkblue ?? "No linkblue"})
              </li>
            ))}
          </ul>
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}
