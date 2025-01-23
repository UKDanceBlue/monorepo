import { createMongoAbility } from "@casl/ability";
import type { PackRule } from "@casl/ability/extra";
import { unpackRules } from "@casl/ability/extra";
import type {
  Action,
  AppAbility,
  Authorization,
  Subject,
  SubjectObject,
} from "@ukdanceblue/common";
import { AccessLevel, caslOptions } from "@ukdanceblue/common";
import {
  defaultAuthorization,
  getAuthorizationFor,
  roleToAccessLevel,
} from "@ukdanceblue/common";
import { useMemo } from "react";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import type { Client, CombinedError, OperationResult } from "urql";

import type { ResultOf, VariablesOf } from "#gql/index.js";
import { graphql } from "#gql/index.js";
import { useQuery } from "#hooks/useTypedRefine.ts";

const loginStateDocument = graphql(/* GraphQL */ `
  query LoginState {
    loginState {
      loggedIn
      dbRole
      authSource
      effectiveCommitteeRoles {
        role
        identifier
      }
      abilityRules
    }
    me {
      id
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
        id: string;
        name?: string | null | undefined;
        linkblue?: string | null | undefined;
        email?: string | null | undefined;
      }
    | null
    | undefined;

  ability: AppAbility;
}

function parseLoginState(
  result:
    | {
        data?: OperationResult<
          ResultOf<typeof loginStateDocument>,
          VariablesOf<typeof loginStateDocument>
        >["data"];
      }
    | undefined
    | null
): PortalAuthData {
  if (result?.data == null) {
    return {
      loggedIn: undefined,
      authorization: undefined,
      me: undefined,
      ability: getAuthorizationFor({
        accessLevel: AccessLevel.None,
        effectiveCommitteeRoles: [],
        teamMemberships: [],
        userId: null,
      }),
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
        accessLevel: roleToAccessLevel(
          committees,
          result.data.loginState.authSource
        ),
        authSource: result.data.loginState.authSource,
      },
      ability: createMongoAbility(
        unpackRules(
          result.data.loginState.abilityRules as PackRule<
            AppAbility["rules"][number]
          >[]
        ),
        caslOptions
      ),
      me: result.data.me,
    };
  } else {
    return {
      loggedIn: false,
      authorization: defaultAuthorization,
      me: null,
      ability: getAuthorizationFor({
        accessLevel: AccessLevel.None,
        effectiveCommitteeRoles: [],
        teamMemberships: [],
        userId: null,
      }),
    };
  }
}

export function getLoginState(
  client: Client
): Result<PortalAuthData, CombinedError> {
  const loginState = client.readQuery(loginStateDocument, {});

  return loginState?.error
    ? Err(loginState.error)
    : Ok(parseLoginState(loginState));
}

export async function refreshLoginState(
  client: Client
): Promise<Result<PortalAuthData, CombinedError>> {
  const loginState = await client.query(
    loginStateDocument,
    {},
    { requestPolicy: "cache-and-network" }
  );

  return loginState.error
    ? Err(loginState.error)
    : Ok(parseLoginState(loginState));
}

export function useLoginState(): PortalAuthData {
  const [result] = useQuery({
    query: loginStateDocument,
  });

  return useMemo(() => parseLoginState(result), [result]);
}

export function useAuthorizationRequirement<
  S extends Exclude<Extract<Subject, string>, "all">,
>(
  action: Action,
  subject: S | "all",
  field:
    | keyof Pick<SubjectObject<S>, `.${string}` & keyof SubjectObject<S>>
    | "." = "."
): boolean {
  const { ability } = useLoginState();

  return ability.can(action, subject, field);
}
