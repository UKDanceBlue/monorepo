import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

import { MarathonViewer } from "./MarathonViewer";

const marathonPageDocument = graphql(/* GraphQL */ `
  query MarathonPage($marathonUuid: GlobalId!) {
    marathon(uuid: $marathonUuid) {
      ...MarathonViewerFragment
    }
  }
`);

export function ViewMarathonPage() {
  const { marathonId } = useParams({ from: "/marathon/$marathonId" });

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
