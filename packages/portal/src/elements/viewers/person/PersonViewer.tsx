import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { FragmentType } from "@graphql/index.js";
import { getFragmentData, graphql } from "@graphql/index.js";
import { useAuthorizationRequirement } from "@hooks/useLoginState";
import { Link, useNavigate } from "@tanstack/react-router";
import type {
  Authorization,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  committeeNames,
  MembershipPositionType,
  roleToAccessLevel,
  stringifyAccessLevel,
} from "@ukdanceblue/common";
import { Button, Card, Descriptions, Empty, Flex, Typography } from "antd";

import { usePersonDeletePopup } from "../../components/person/PersonDeletePopup";

export const PersonViewerFragment = graphql(/* GraphQL */ `
  fragment PersonViewerFragment on PersonNode {
    id
    name
    linkblue
    email
    dbRole
    teams {
      position
      team {
        marathon {
          year
        }
        id
        name
        committeeIdentifier
      }
      committeeRole
    }
  }
`);

export function PersonViewer({
  personFragment: PersonFragment,
  authorization,
}: {
  personFragment?: FragmentType<typeof PersonViewerFragment> | undefined | null;
  authorization: Authorization | undefined;
}) {
  const personData = getFragmentData(PersonViewerFragment, PersonFragment);

  const navigate = useNavigate();
  const { PersonDeletePopup, showModal } = usePersonDeletePopup({
    uuid: personData?.id ?? "",
    onDelete: () => {
      navigate({ to: "/people" }).catch((error: unknown) =>
        console.error(error)
      );
    },
  });

  const canEditPerson = useAuthorizationRequirement(
    AccessLevel.CommitteeChairOrCoordinator
  );

  if (!personData) {
    return (
      <Empty description="Person not found" style={{ marginTop: "1em" }} />
    );
  }

  const committees: {
    identifier: CommitteeIdentifier;
    role: CommitteeRole;
    year: string;
  }[] = [];
  for (const team of personData.teams) {
    if (team.team.committeeIdentifier && team.committeeRole) {
      committees.push({
        identifier: team.team.committeeIdentifier,
        role: team.committeeRole,
        year: team.team.marathon.year,
      });
    }
  }

  return (
    <Flex gap="middle" justify="center">
      <Flex vertical gap="middle" align="center">
        <Card
          title={
            <Typography.Title level={2}>
              {personData.name}
              {canEditPerson && (
                <>
                  <Link
                    to="/people/$personId/edit"
                    params={{ personId: personData.id }}
                    color="#efefef"
                  >
                    <EditOutlined style={{ marginLeft: "1em" }} />
                  </Link>
                  <Button
                    style={{ display: "inline", marginLeft: "1em" }}
                    onClick={showModal}
                    icon={<DeleteOutlined />}
                    danger
                    shape="circle"
                  />
                </>
              )}
            </Typography.Title>
          }
          style={{ maxWidth: "800px" }}
        >
          {PersonDeletePopup}
          <Descriptions
            column={1}
            layout="vertical"
            items={[
              {
                label: "Linkblue",
                children: personData.linkblue,
              },
              {
                label: "Email",
                children: personData.email,
              },
              {
                label: "Access Level",
                children: stringifyAccessLevel(
                  roleToAccessLevel({
                    dbRole: personData.dbRole,
                    effectiveCommitteeRoles: committees,
                  })
                ),
              },
              ...committees.map((committee) => ({
                label: `${committeeNames[committee.identifier]} (${committee.year})`,
                children: committee.role,
              })),
              {
                label: "Teams",
                children:
                  personData.teams.length === 0 ? (
                    "Not a member of any teams"
                  ) : (
                    <dl style={{ marginTop: "0" }}>
                      {personData.teams.map((team) => {
                        let children;

                        if (
                          authorization &&
                          (authorization.accessLevel >= AccessLevel.Committee ||
                            team.position === MembershipPositionType.Captain)
                        ) {
                          children = (
                            <Link
                              to="/teams/$teamId"
                              params={{ teamId: team.team.id }}
                            >
                              {team.position}
                            </Link>
                          );
                        } else {
                          children = team.position;
                        }

                        return (
                          <div key={team.team.id}>
                            <dt>
                              {team.team.name} ({team.team.marathon.year})
                            </dt>
                            <dd>{children}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  ),
              },
            ]}
          />
        </Card>
      </Flex>
    </Flex>
  );
}
