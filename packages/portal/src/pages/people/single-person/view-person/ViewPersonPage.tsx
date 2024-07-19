import { PersonViewer } from "@elements/viewers/person/PersonViewer";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useQuery } from "urql";

const viewPersonPageDocument = graphql(/* GraphQL */ `
  query ViewPersonPage($uuid: GlobalId!) {
    person(uuid: $uuid) {
      ...PersonViewerFragment
    }
  }
`);

export function ViewPersonPage() {
  const { personId } = useParams({ from: "/people/$personId" });

  const [{ data, fetching, error }] = useQuery({
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
      <PersonViewer personFragment={data?.person} />
    </div>
  );
}
