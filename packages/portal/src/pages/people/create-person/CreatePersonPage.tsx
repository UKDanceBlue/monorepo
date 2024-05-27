import { PersonCreator } from "@elements/forms/person/create/PersonCreator";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const createPersonPageDocument = graphql(/* GraphQL */ `
  query CreatePersonPage {
    teams(sendAll: true, sortBy: ["name"], sortDirection: [asc]) {
      data {
        ...TeamNameFragment
      }
    }
  }
`);

export function CreatePersonPage() {
  const [{ data, fetching, error }] = useQuery({
    query: createPersonPageDocument,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading person...",
  });

  return (
    <div>
      <h1>Create Person</h1>
      <PersonCreator teamNamesFragment={data?.teams.data} />
    </div>
  );
}
