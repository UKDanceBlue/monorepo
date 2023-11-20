import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { committeeNames, stringifyDbRole } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Descriptions, Empty, Flex, Typography } from "antd";

import { usePersonDeletePopup } from "./PersonDeletePopup";

export const PersonViewerFragment = graphql(/* GraphQL */ `
  fragment PersonViewerFragment on PersonResource {
    uuid
    name
    linkblue
    email
    role {
      dbRole
      committeeRole
      committeeIdentifier
    }
    teams {
      position
      team {
        uuid
        name
      }
    }
  }
`);

export function PersonViewer({
  personFragment: PersonFragment,
}: {
  personFragment?: FragmentType<typeof PersonViewerFragment> | undefined;
}) {
  const personData = getFragmentData(PersonViewerFragment, PersonFragment);

  const navigate = useNavigate();
  const { PersonDeletePopup, showModal } = usePersonDeletePopup({
    uuid: personData?.uuid ?? "",
    onDelete: () => {
      navigate({ to: "/people/" }).catch(console.error);
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
        <Link
          to="/people/$personId/edit"
          params={{ personId: personData.uuid }}
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
            children: stringifyDbRole(personData.role.dbRole),
          },
          ...(personData.role.committeeRole
            ? [
                {
                  label: "Committee",
                  children: personData.role.committeeIdentifier
                    ? committeeNames[personData.role.committeeIdentifier]
                    : "N/A",
                },
                {
                  label: "Committee Position",
                  children: personData.role.committeeRole,
                },
              ]
            : []),
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
                  items={personData.teams.map((team) => ({
                    label: team.team.name,
                    key: team.team.uuid,
                    children: (
                      <Link
                        to="/teams/$teamId"
                        params={{ teamId: team.team.uuid }}
                      >
                        {team.position}
                      </Link>
                    ),
                  }))}
                />
              ),
          },
        ]}
      />
    </Flex>
  );
}
