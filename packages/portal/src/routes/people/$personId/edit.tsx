import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "urql";

import { PersonEditorFragment, TeamNameFragment } from "#documents/person.ts";
import { PersonEditor } from "#elements/forms/person/edit/PersonEditor.js";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const viewPersonPageDocument = graphql(
  /* GraphQL */ `
    query EditPersonPage($id: GlobalId!) {
      person(id: $id) {
        ...PersonEditorFragment
      }
      teams(sendAll: true, sortBy: ["name"], sortDirection: [asc]) {
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

  const [{ data, fetching, error }, refetchPerson] = useQuery({
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
        teamNamesFragment={data?.teams.data}
        refetchPerson={refetchPerson}
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
