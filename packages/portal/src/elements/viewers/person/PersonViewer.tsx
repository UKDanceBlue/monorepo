import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useLoginState } from "@hooks/useLoginState";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AccessLevel,
  committeeNames,
  MembershipPositionType,
  stringifyDbRole,
} from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-portal";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-portal";
import { Button, Descriptions, Empty, Flex, Typography } from "antd";

import { usePersonDeletePopup } from "./PersonDeletePopup";

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
        id
        name
      }
    }
    committees {
      identifier
      role
    }
  }
`);

export function PersonViewer({
  personFragment: PersonFragment,
}: {
  personFragment?: FragmentType<typeof PersonViewerFragment> | undefined | null;
}) {
  const { authorization } = useLoginState();

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

  if (!personData) {
    return (
      <Empty description="Person not found" style={{ marginTop: "1em" }} />
    );
  }

  return (
    <Flex vertical gap="middle" align="center">
      <Typography.Title level={2}>
        {personData.name}
        {authorization &&
          authorization.accessLevel >=
            AccessLevel.CommitteeChairOrCoordinator && (
            <>
              <Link from="/people/$personId" to="edit" color="#efefef">
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
            label: "Role",
            children: stringifyDbRole(personData.dbRole),
          },
          ...personData.committees.map((committee) => ({
            label: committeeNames[committee.identifier],
            children: stringifyDbRole(committee.role),
          })),
          {
            label: "Teams",
            children:
              personData.teams.length === 0 ? (
                "Not a member of any teams"
              ) : (
                <Descriptions
                  column={2}
                  bordered
                  size="small"
                  items={personData.teams.map((team) => {
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

                    return {
                      label: team.team.name,
                      key: team.team.id,
                      children,
                    };
                  })}
                />
              ),
          },
        ]}
      />
    </Flex>
  );
}
