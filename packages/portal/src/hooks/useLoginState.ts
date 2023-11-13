import type { Authorization } from "@ukdanceblue/common";
import { RoleResource, defaultAuthorization } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { useQuery } from "urql";

const loginStateDocument = graphql(/* GraphQL */ `
  query LoginState {
    loginState {
      loggedIn
      role {
        dbRole
        committeeRole
        committeeIdentifier
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

  return {
    loggedIn: data.loginState.loggedIn,
    authorization: RoleResource.init(data.loginState.role).toAuthorization(),
  };
}
