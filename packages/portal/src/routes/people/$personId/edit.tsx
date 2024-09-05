import { PersonEditor } from "@elements/forms/person/edit/PersonEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useQuery } from "urql";

const viewPersonPageDocument = graphql(/* GraphQL */ `
  query EditPersonPage($uuid: GlobalId!, $marathonId: GlobalId!) {
    person(uuid: $uuid) {
      ...PersonEditorFragment
    }
    teams(
      sendAll: true
      sortBy: ["name"]
      sortDirection: [asc]
      marathonId: [$marathonId]
    ) {
      data {
        ...TeamNameFragment
      }
    }
  }
`);

export function EditPersonPage() {
  const { personId } = useParams({ from: "/people/$personId/" });
  const { selectedMarathon } = useRouteContext({ from: "/" });

  const [{ data, fetching, error }, refetchPerson] = useQuery({
    query: viewPersonPageDocument,
    variables: { uuid: personId, marathonId: selectedMarathon?.id ?? "" },
    pause: !selectedMarathon,
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
});
