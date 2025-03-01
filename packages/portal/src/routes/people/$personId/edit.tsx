import { createFileRoute } from "@tanstack/react-router";

import { PersonEditorFragment, TeamNameFragment } from "#documents/person.js";
import { PersonEditor } from "#elements/forms/person/edit/PersonEditor.js";
import { graphql } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { useQuery } from "#hooks/refine/custom.js";

const viewPersonPageDocument = graphql(
  /* GraphQL */ `
    query EditPersonPage($id: GlobalId!) {
      person(id: $id) {
        ...PersonEditorFragment
      }
      teams(sendAll: true, sortBy: [{ field: name, direction: asc }]) {
        data {
          ...TeamNameFragment
        }
      }
    }
  `,
  [PersonEditorFragment, TeamNameFragment]
);

export function EditPersonPage() {
  const { personId } = Route.useParams();

  const [{ data, fetching, error }] = useQuery({
    query: viewPersonPageDocument,
    variables: { id: personId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading person...",
  });

  return (
    <div>
      <PersonEditor
        personFragment={data?.person}
        teamNamesFragment={data?.teams?.data}
      />
    </div>
  );
}

export const Route = createFileRoute("/people/$personId/edit")({
  component: EditPersonPage,
  async beforeLoad({ context, params: { personId } }) {
    await context.urqlClient.query(viewPersonPageDocument, { id: personId });
  },
});
