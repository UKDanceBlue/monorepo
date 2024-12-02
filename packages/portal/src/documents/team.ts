import { PointEntryTableFragment } from "#elements/tables/point-entry/PointEntryTable.tsx";
import { TeamViewerFragment } from "#elements/viewers/team/TeamViewer.tsx";
import { graphql } from "#graphql/index.js";

import { PointEntryCreatorFragment } from "./pointEntry";

export const teamPageDocument = graphql(
  /* GraphQL */ `
    query ViewTeamPage($teamUuid: GlobalId!) {
      team(uuid: $teamUuid) {
        ...PointEntryCreatorFragment
        ...TeamViewerFragment
        pointEntries {
          ...PointEntryTableFragment
        }
      }
    }
  `,
  [PointEntryCreatorFragment, TeamViewerFragment, PointEntryTableFragment]
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
  mutation TeamEditor($uuid: GlobalId!, $input: SetTeamInput!) {
    setTeam(uuid: $uuid, input: $input) {
      id
    }
  }
`);

export const TeamSelectFragment = graphql(/* GraphQL */ `
  fragment TeamSelect on TeamNode {
    id
    name
    type
  }
`);

export const PaginationFragment = graphql(/* GraphQL */ `
  fragment PaginationFragment on AbstractGraphQLPaginatedResponse {
    page
    pageSize
    total
  }
`);
