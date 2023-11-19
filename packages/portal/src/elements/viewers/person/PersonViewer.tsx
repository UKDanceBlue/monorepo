import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { stringifyDbRole } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Descriptions, Flex, Typography } from "antd";

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
      <>
        <Typography.Title level={2}>
          <Button
            style={{ display: "inline", marginLeft: "1em" }}
            onClick={showModal}
            icon={<DeleteOutlined />}
            danger
            shape="circle"
          />
        </Typography.Title>
        {PersonDeletePopup}
      </>
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
          {
            label: "Committee identifier",
            children: personData.role.committeeIdentifier ?? "Unknown",
          },
          {
            label: "Teams",
            children: (
              <Descriptions
                column={2}
                bordered
                size="small"
                items={personData.teams.map((team) => ({
                  label: team.team.name,
                  children: team.position,
                }))}
              />
            ),
          },
        ]}
      />
    </Flex>
  );
}
