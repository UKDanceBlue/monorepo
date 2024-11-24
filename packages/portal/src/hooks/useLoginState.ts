import type {
  AccessLevel,
  Authorization,
  AuthorizationRule,
} from "@ukdanceblue/common";
import {
  checkAuthorization,
  defaultAuthorization,
  roleToAccessLevel,
} from "@ukdanceblue/common";
import { useMemo } from "react";
import type { Client, OperationResult } from "urql";
import { useQuery } from "urql";

import type { LoginStateQuery } from "#graphql/graphql.js";
import { graphql } from "#graphql/index.js";

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
    me {
      name
      linkblue
      email
    }
  }
`);

export interface PortalAuthData {
  authorization: Authorization | undefined;
  loggedIn: boolean | undefined;
  me:
    | {
        name?: string | null | undefined;
        linkblue?: string | null | undefined;
        email?: string | null | undefined;
      }
    | null
    | undefined;
}

function parseLoginState(
  result: // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  { data?: OperationResult<LoginStateQuery, {}>["data"] } | undefined | null
): PortalAuthData {
  if (result?.data == null) {
    return {
      loggedIn: undefined,
      authorization: undefined,
      me: undefined,
    };
  }

  const committees = result.data.loginState.effectiveCommitteeRoles.map(
    ({ identifier, role }) => ({ identifier, role })
  );

  if (result.data.loginState.loggedIn) {
    return {
      loggedIn: true,
      authorization: {
        effectiveCommitteeRoles: committees,
        dbRole: result.data.loginState.dbRole,
        accessLevel: roleToAccessLevel({
          dbRole: result.data.loginState.dbRole,
          effectiveCommitteeRoles: committees,
        }),
      },
      me: result.data.me,
    };
  } else {
    return {
      loggedIn: false,
      authorization: defaultAuthorization,
      me: null,
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

export function useAuthorizationRequirement(
  ...rules: AuthorizationRule[] | [AccessLevel]
): boolean {
  const { authorization } = useLoginState();

  if (!authorization) {
    return false;
  }

  if (typeof rules[0] === "number") {
    return authorization.accessLevel >= rules[0];
  }

  return (rules as AuthorizationRule[]).some((r) =>
    checkAuthorization(r, authorization)
  );
}
