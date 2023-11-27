import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Descriptions, Empty, Flex } from "antd";

import { useTeamDeletePopup } from "./TeamDeletePopup";

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
        uuid
        name
        linkblue
      }
    }
    captains {
      person {
        uuid
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

  const navigate = useNavigate();
  const { TeamDeletePopup, showModal } = useTeamDeletePopup({
    uuid: teamData?.uuid ?? "",
    onDelete: () => {
      navigate({ to: "/teams/" }).catch(console.error);
    },
  });

  if (!teamData) {
    return <Empty description="Team not found" />;
  }

  return (
    <Flex gap="1em" wrap="wrap">
      {TeamDeletePopup}
      <Flex gap="1em" vertical flex={1} style={{ minWidth: "15em" }}>
        <Descriptions bordered column={1} size="small" title="Team Overview">
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
        <Flex justify="space-between">
          <Button
            style={{ width: "18ch" }}
            onClick={showModal}
            icon={<DeleteOutlined />}
            danger
            shape="round"
          >
            Delete Team
          </Button>
          <Button
            style={{ width: "18ch" }}
            onClick={() => {
              navigate({
                to: "/teams/$teamId/edit",
                params: { teamId: teamData.uuid },
              }).catch(console.error);
            }}
            icon={<EditOutlined />}
            shape="round"
          >
            Edit Team
          </Button>
        </Flex>
      </Flex>
      <Descriptions
        bordered
        column={1}
        size="small"
        style={{ flex: 1, minWidth: "15em" }}
        title="Team Members"
      >
        <Descriptions.Item label="Captains">
          <ul>
            {teamData.captains.map((captain) => (
              <li key={captain.person.uuid}>
                <Link
                  to="/people/$personId/"
                  params={{
                    personId: captain.person.uuid,
                  }}
                >
                  {captain.person.name ?? "Never logged in"} (
                  {captain.person.linkblue ?? "No linkblue"})
                </Link>
              </li>
            ))}
          </ul>
        </Descriptions.Item>
        <Descriptions.Item label="Members">
          <ul>
            {teamData.members.map((member) => (
              <li key={member.person.uuid}>
                <Link
                  to="/people/$personId/"
                  params={{
                    personId: member.person.uuid,
                  }}
                >
                  {member.person.name ?? "Never logged in"} (
                  {member.person.linkblue ?? "No linkblue"})
                </Link>
              </li>
            ))}
          </ul>
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}
