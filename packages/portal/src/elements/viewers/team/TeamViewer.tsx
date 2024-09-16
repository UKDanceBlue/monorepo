import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAuthorizationRequirement } from "@hooks/useLoginState";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  MembershipPositionType,
} from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-portal";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-portal";
import { Button, Descriptions, Empty, Flex } from "antd";

import { useTeamDeletePopup } from "../../components/team/TeamDeletePopup";

export const TeamViewerFragment = graphql(/* GraphQL */ `
  fragment TeamViewerFragment on TeamNode {
    id
    name
    marathon {
      id
      year
    }
    legacyStatus
    totalPoints
    type
    members {
      person {
        id
        name
        linkblue
      }
      position
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

  const canEditTeams = useAuthorizationRequirement(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      committeeIdentifier: CommitteeIdentifier.dancerRelationsCommittee,
      minCommitteeRole: CommitteeRole.Coordinator,
    }
  );

  const canViewPeople = useAuthorizationRequirement({
    accessLevel: AccessLevel.Committee,
  });

  const navigate = useNavigate();
  const { TeamDeletePopup, showModal } = useTeamDeletePopup({
    uuid: teamData?.id ?? "",
    onDelete: () => {
      navigate({ to: "/teams" }).catch((error: unknown) =>
        console.error(error)
      );
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
            {teamData.marathon.year}
          </Descriptions.Item>
          <Descriptions.Item label="Legacy Status">
            {teamData.legacyStatus}
          </Descriptions.Item>
          <Descriptions.Item label="Total Points">
            {teamData.totalPoints}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{teamData.type}</Descriptions.Item>
        </Descriptions>
        {canEditTeams && (
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
            <Link from="/teams/$teamId" to="edit">
              <Button
                style={{ width: "18ch" }}
                icon={<EditOutlined />}
                shape="round"
              >
                Edit Team
              </Button>
            </Link>
          </Flex>
        )}
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
            {teamData.members
              .filter(
                ({ position }) => position === MembershipPositionType.Captain
              )
              .map((captain) =>
                canViewPeople ? (
                  <li key={captain.person.id}>
                    <Link
                      to="/people/$personId"
                      params={{
                        personId: captain.person.id,
                      }}
                    >
                      {captain.person.name ?? "Never logged in"} (
                      {captain.person.linkblue ?? "No linkblue"})
                    </Link>
                  </li>
                ) : (
                  <li key={captain.person.id}>
                    {captain.person.name ?? "Never logged in"} (
                    {captain.person.linkblue ?? "No linkblue"})
                  </li>
                )
              )}
          </ul>
        </Descriptions.Item>
        <Descriptions.Item label="Members">
          <div style={{ maxHeight: "10rem", overflowY: "scroll" }}>
            <ul>
              {teamData.members.map((member) =>
                canViewPeople ? (
                  <li key={member.person.id}>
                    <Link
                      to="/people/$personId"
                      params={{
                        personId: member.person.id,
                      }}
                    >
                      {member.person.name ?? "Never logged in"} (
                      {member.person.linkblue ?? "No linkblue"})
                    </Link>
                  </li>
                ) : (
                  <li key={member.person.id}>
                    {member.person.name ?? "Never logged in"} (
                    {member.person.linkblue ?? "No linkblue"})
                  </li>
                )
              )}
            </ul>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}
