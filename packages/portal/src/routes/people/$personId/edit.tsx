import { PersonEditor } from "@elements/forms/person/edit/PersonEditor";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useQuery } from "urql";

const viewPersonPageDocument = graphql(/* GraphQL */ `
  query EditPersonPage($uuid: GlobalId!) {
    person(uuid: $uuid) {
      ...PersonEditorFragment
    }
    teams(sendAll: true, sortBy: ["name"], sortDirection: [asc]) {
      data {
        ...TeamNameFragment
      }
    }
  }
`);

export function EditPersonPage() {
  const { personId } = Route.useParams();

  const [{ data, fetching, error }, refetchPerson] = useQuery({
    query: viewPersonPageDocument,
    variables: { uuid: personId },
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
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
    ],
  },
});