import { PointEntryTableFragment } from "#elements/tables/point-entry/PointEntryTable.js";
import { TeamViewerFragment } from "#elements/viewers/team/TeamViewer.js";
import { graphql } from "#gql/index.js";

import { PointEntryCreatorFragment } from "./pointEntry";

export const teamPagePointsDocument = graphql(
  /* GraphQL */ `
    query ViewTeamPage($teamUuid: GlobalId!) {
      team(id: $teamUuid) {
        ...PointEntryCreatorFragment
        pointEntries {
          ...PointEntryTableFragment
        }
      }
    }
  `,
  [PointEntryCreatorFragment, PointEntryTableFragment]
);

export const teamPageDocument = graphql(
  /* GraphQL */ `
    query ViewTeamPage($teamUuid: GlobalId!) {
      team(id: $teamUuid) {
        ...TeamViewerFragment
      }
    }
  `,
  [TeamViewerFragment]
);

export const teamCreatorDocument = graphql(/* GraphQL */ `
  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: GlobalId!) {
    createTeam(input: $input, marathon: $marathonUuid) {
      id
    }
  }
`);

export const TeamEditorFragment = graphql(/* GraphQL */ `
  fragment TeamEditorFragment on TeamNode {
    id
    name
    marathon {
      id
      year
    }
    legacyStatus
    type
  }
`);

export const teamEditorDocument = graphql(/* GraphQL */ `
  mutation TeamEditor($id: GlobalId!, $input: SetTeamInput!) {
    setTeam(id: $id, input: $input) {
      id
    }
  }
`);

export const TeamSelectFragment = graphql(/* GraphQL */ `
  fragment TeamSelect on TeamNode {
    id
    name
    type
    marathon {
      id
      year
    }
  }
`);
