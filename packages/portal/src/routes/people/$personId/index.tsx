import { Show } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Spin } from "antd";

import { PersonViewer } from "#elements/viewers/person/PersonViewer.js";
import { graphql } from "#gql/index.js";
import { prefetchTypedOne, useTypedOne } from "#hooks/useTypedRefine.js";

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

function ViewPersonPage() {
  const { personId } = useParams({ from: "/people/$personId/" });

  const { data } = useTypedOne({
    fragment: PersonViewerFragment,
    props: {
      id: personId,
      resource: "person",
    },
  });

  return (
    <Show resource="person" recordItemId={personId}>
      {data?.data == null ? (
        <Spin size="large" />
      ) : (
        <PersonViewer personData={data.data} />
      )}
    </Show>
  );
}

export const Route = createFileRoute("/people/$personId/")({
  component: ViewPersonPage,
  async beforeLoad({ params: { personId } }) {
    await prefetchTypedOne({
      fragment: PersonViewerFragment,
      props: {
        id: personId,
        resource: "person",
      },
    });
  },
});
