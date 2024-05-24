import type { Authorization } from "@ukdanceblue/common";
import { AccessLevel, defaultAuthorization } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const loginStateDocument = graphql(/* GraphQL */ `
  query LoginState {
    loginState {
      loggedIn
      dbRole
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

  return {
    loggedIn: data.loginState.loggedIn,
    authorization: {
      dbRole: data.loginState.dbRole,
      // TODO: Add committee info back here
      accessLevel: AccessLevel.Public,
      committees: [],
    },
  };
}
