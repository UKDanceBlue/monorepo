import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "urql";

import {
  MarathonViewer,
  MarathonViewerFragment,
} from "#elements/viewers/marathon/MarathonViewer.js";
import { graphql } from "#gql/index.js";

const marathonPageDocument = graphql(
  /* GraphQL */ `
    query MarathonPage($marathonUuid: GlobalId!) {
      marathon(id: $marathonUuid) {
        ...MarathonViewerFragment
      }
    }
  `,
  [MarathonViewerFragment]
);

function ViewMarathonPage() {
  const { marathonId } = Route.useParams();

  const [result] = useQuery({
    query: marathonPageDocument,
    variables: { marathonUuid: marathonId },
  });

  return (
    <div>
      <MarathonViewer marathon={result.data?.marathon} />
    </div>
  );
}

export const Route = createFileRoute("/marathon/$marathonId/")({
  component: ViewMarathonPage,
  beforeLoad({ context, params: { marathonId } }) {
    context.urqlClient.query(marathonPageDocument, {
      marathonUuid: marathonId,
    });
  },
});
