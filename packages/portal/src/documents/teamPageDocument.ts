import { graphql } from "@graphql/index.js";

export const teamPageDocument = graphql(/* GraphQL */ `
  query ViewTeamPage($teamUuid: GlobalId!) {
    team(uuid: $teamUuid) {
      data {
        ...PointEntryCreatorFragment
        ...TeamViewerFragment
        pointEntries {
          ...PointEntryTableFragment
        }
      }
    }
  }
`);
