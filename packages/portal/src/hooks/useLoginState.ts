import { defaultAuthorization, roleToAccessLevel } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { useMemo } from "react";
import { Client, OperationResult, useQuery } from "urql";

import type { Authorization } from "@ukdanceblue/common";
import { LoginStateQuery } from "@ukdanceblue/common/graphql-client-portal/raw-types";

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

export interface PortalAuthData {
  authorization: Authorization | undefined;
  loggedIn: boolean | undefined;
}

function parseLoginState(
  result:
    | { data?: OperationResult<LoginStateQuery, {}>["data"] }
    | undefined
    | null
): PortalAuthData {
  if (result?.data == null) {
    return {
      loggedIn: undefined,
      authorization: undefined,
    };
  }

  const committees = result.data.loginState.effectiveCommitteeRoles.map(
    ({ identifier, role }) => ({ identifier, role })
  );

  if (result.data.loginState.loggedIn) {
    return {
      loggedIn: true,
      authorization: {
        committees,
        dbRole: result.data.loginState.dbRole,
        accessLevel: roleToAccessLevel({
          dbRole: result.data.loginState.dbRole,
          committees,
        }),
      },
    };
  } else {
    return {
      loggedIn: false,
      authorization: defaultAuthorization,
    };
  }
}

export function getLoginState(client: Client): PortalAuthData {
  const loginState = client.readQuery(loginStateDocument, {});

  return parseLoginState(loginState);
}

export async function refreshLoginState(
  client: Client
): Promise<PortalAuthData> {
  const loginState = await client.query(
    loginStateDocument,
    {},
    { requestPolicy: "cache-and-network" }
  );

  return parseLoginState(loginState);
}

export function useLoginState(): PortalAuthData {
  const [result] = useQuery({
    query: loginStateDocument,
    requestPolicy: "cache-only",
  });

  return useMemo(() => parseLoginState(result), [result]);
}
