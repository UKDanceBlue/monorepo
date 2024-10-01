import { graphql } from "@graphql";

export const assignToTeamDocument = graphql(/* GraphQL */ `
  mutation AssignToTeam(
    $person: GlobalId!
    $team: GlobalId!
    $position: MembershipPositionType
  ) {
    addPersonToTeam(personUuid: $person, teamUuid: $team, position: $position) {
      id
    }
  }
`);

export const removeFromTeamDocument = graphql(/* GraphQL */ `
  mutation RemoveFromTeam($person: GlobalId!, $team: GlobalId!) {
    removePersonFromTeam(personUuid: $person, teamUuid: $team) {
      id
    }
  }
`);
