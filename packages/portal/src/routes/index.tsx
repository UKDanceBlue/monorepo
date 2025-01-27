import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "antd";

import { PersonViewer } from "#elements/viewers/person/PersonViewer.js";
import { graphql, readFragment } from "#gql/index.js";
import { useLoginState } from "#hooks/useLoginState.js";
import { useTypedCustomQuery } from "#hooks/useTypedRefine.ts";

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

  return (
    <div>
      <Typography.Title>
        Welcome to the DanceBlue online portal!
      </Typography.Title>
      <Typography.Title level={2}>What's New?</Typography.Title>
      <Typography.Paragraph>
        <ul>
          <li>
            More of the portal has switched to our new forms, you may see some
            nicer layouts around the place
          </li>
          <li>
            Did some more work on permissions (sorry to those team captains and
            committee members who have had issues)
          </li>
          <li></li>
        </ul>
      </Typography.Paragraph>
      {data?.data.me && (
        <>
          <Typography.Title level={2}>Your Information</Typography.Title>
          <PersonViewer
            personData={readFragment(PersonViewerFragment, data.data.me)}
            personAuthorization={authorization}
          />
        </>
      )}
    </div>
  );
}
