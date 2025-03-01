import { createFileRoute } from "@tanstack/react-router";
import { Card, Flex, Typography } from "antd";

import { PersonViewer } from "#elements/viewers/person/PersonViewer.js";
import { graphql, readFragment } from "#gql/index.js";
import { useTypedCustomQuery } from "#hooks/refine/custom.tsx";
import {
  useAuthorizationRequirement,
  useLoginState,
} from "#hooks/useLoginState.js";

export const PersonViewerFragment = graphql(/* GraphQL */ `
  fragment PersonViewerFragment on PersonNode {
    id
    name
    linkblue
    email
    primarySpiritTeam: primaryTeam(teamType: Spirit) {
      team {
        id
      }
    }
    primaryMoraleTeam: primaryTeam(teamType: Morale) {
      team {
        id
      }
    }
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

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { authorization } = useLoginState();

  const { data } = useTypedCustomQuery({
    document: graphql(
      /* GraphQL */ `
        query HomePage {
          me {
            ...PersonViewerFragment
          }
        }
      `,
      [PersonViewerFragment]
    ),
    props: {},
  });

  const meData = readFragment(PersonViewerFragment, data?.data.me);

  return (
    <Flex vertical gap="large" align="center">
      <Typography.Title>
        Welcome to the DanceBlue online portal!
      </Typography.Title>
      <Card title="What's New?" style={{ maxWidth: "120ch" }}>
        <ul>
          <li>
            More of the portal has switched to our new forms, you may see some
            nicer layouts around the place
          </li>
          <li>
            Did some more work on permissions (sorry to those team captains and
            committee members who have had issues)
          </li>
        </ul>
      </Card>
      {!useAuthorizationRequirement("list", { kind: "TeamNode" }) && (
        <Card title="How do I use this site?" style={{ maxWidth: "120ch" }}>
          Click your
        </Card>
      )}
      {meData && (
        <Card title="Your Information" style={{ maxWidth: "120ch" }}>
          <PersonViewer
            personData={meData}
            personAuthorization={authorization}
          />
        </Card>
      )}
    </Flex>
  );
}
