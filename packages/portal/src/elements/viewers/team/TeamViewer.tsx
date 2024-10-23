import {
  DeleteOutlined,
  EditOutlined,
  MinusCircleTwoTone,
} from "@ant-design/icons";
import { PersonSearch } from "@elements/components/person/PersonSearch";
import type { FragmentType } from "@graphql/index.js";
import { getFragmentData, graphql } from "@graphql/index.js";
import { useAuthorizationRequirement } from "@hooks/useLoginState";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  MembershipPositionType,
} from "@ukdanceblue/common";
import { Button, Descriptions, Empty, Flex } from "antd";
import { useState } from "react";
import { useMutation } from "urql";

import { useTeamDeletePopup } from "../../components/team/TeamDeletePopup";
import { AssignToTeamPopup } from "./AssignToTeamPopup";
import { assignToTeamDocument, removeFromTeamDocument } from "./TeamViewerGql";

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

  const canEditMemberships = useAuthorizationRequirement(
    {
      accessLevel: AccessLevel.Admin,
    },
    {
      accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      committeeIdentifier: CommitteeIdentifier.viceCommittee,
    }
  );

  const canViewPeople = useAuthorizationRequirement({
    accessLevel: AccessLevel.Committee,
  });

  const [personToAssignToTeam, setPersonToAssignToTeam] = useState<{
    uuid: string;
    name: string | undefined;
    linkblue: string | undefined;
  } | null>(null);
  const [{ fetching: assignFetching, error: assignError }, assignToTeam] =
    useMutation(assignToTeamDocument);
  useQueryStatusWatcher({
    error: assignError,
    fetching: assignFetching,
    loadingMessage: "Assigning person to team...",
  });

  const [{ fetching: removeFetching, error: removeError }, removeFromTeam] =
    useMutation(removeFromTeamDocument);
  useQueryStatusWatcher({
    error: removeError,
    fetching: removeFetching,
    loadingMessage: "Removing person from team...",
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
                    {canEditMemberships ? (
                      <Button
                        icon={<MinusCircleTwoTone />}
                        type="text"
                        shape="circle"
                        style={{
                          marginLeft: "0.5em",
                        }}
                        onClick={() =>
                          removeFromTeam({
                            person: captain.person.id,
                            team: teamData.id,
                          })
                        }
                      />
                    ) : null}
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
                    {canEditMemberships ? (
                      <Button
                        icon={<MinusCircleTwoTone />}
                        type="text"
                        shape="circle"
                        style={{
                          marginLeft: "0.5em",
                        }}
                        onClick={() =>
                          removeFromTeam({
                            person: member.person.id,
                            team: teamData.id,
                          })
                        }
                      />
                    ) : null}
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
        {canEditMemberships && (
          <Descriptions.Item label="Add Member">
            <PersonSearch
              onSelect={(person) => {
                setPersonToAssignToTeam(person);
              }}
              style={{ width: "100%" }}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
      <AssignToTeamPopup
        person={personToAssignToTeam}
        onClose={() => {
          setPersonToAssignToTeam(null);
        }}
        onSubmit={(position) => {
          setPersonToAssignToTeam(null);
          assignToTeam({
            person: personToAssignToTeam?.uuid ?? "",
            team: teamData.id,
            position,
          })
            .then(() => {
              window.location.reload();
            })
            .catch((error: unknown) => console.error(error));
        }}
        teamName={teamData.name}
      />
    </Flex>
  );
}
