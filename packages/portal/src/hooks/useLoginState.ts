import type { Authorization } from "@ukdanceblue/common";
import { defaultAuthorization, roleToAccessLevel } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const loginStateDocument = graphql(/* GraphQL */ `
  query LoginState {
    loginState {
      loggedIn
      dbRole
      effectiveCommitteeRoles {
        role
        identifier
      }
    }
  }
`);

export function useLoginState(): {
  loggedIn: boolean | undefined;
  authorization: Authorization | undefined;
} {
  const [{ data, fetching }] = useQuery({
    query: loginStateDocument,
    requestPolicy: "network-only",
  });

  if (fetching) {
    return {
      loggedIn: undefined,
      authorization: undefined,
    };
  }

  if (data == null) {
    return {
      loggedIn: false,
      authorization: defaultAuthorization,
    };
  }

  const committees = data.loginState.effectiveCommitteeRoles.map(
    ({ identifier, role }) => ({ identifier, role })
  );

  return {
    loggedIn: data.loginState.loggedIn,
    authorization: {
      committees,
      dbRole: data.loginState.dbRole,
      accessLevel: roleToAccessLevel({
        dbRole: data.loginState.dbRole,
        committees,
      }),
    },
  };
}
