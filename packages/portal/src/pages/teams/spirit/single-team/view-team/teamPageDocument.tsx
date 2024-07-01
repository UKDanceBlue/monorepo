import { graphql } from "@ukdanceblue/common/graphql-client-admin";

export const teamPageDocument = graphql(/* GraphQL */ `
  query ViewTeamPage($teamUuid: GlobalId!) {
    team(uuid: $teamUuid) {
      data {
        ...TeamViewerFragment
        pointEntries {
          ...PointEntryTableFragment
        }
      }
    }
  }
`);
