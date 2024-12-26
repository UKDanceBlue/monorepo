import type { ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { Container } from "@freshgum/typedi";
import type {
  AppAbility,
  AuthorizationContext,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  getAuthorizationFor,
  parseGlobalId,
  roleToAccessLevel,
} from "@ukdanceblue/common";
import type { ConcreteResult } from "@ukdanceblue/common/error";
import { ErrorCode } from "@ukdanceblue/common/error";
import { Ok } from "ts-results-es";

import { getHostUrl } from "#lib/host.js";
import { logger } from "#lib/logging/standardLogging.js";
import { superAdminLinkbluesToken } from "#lib/typediTokens.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

import { parseUserJwt } from "./index.js";

export interface GraphQLContext extends AuthorizationContext {
  serverUrl: URL;
  ability: AppAbility;
}

type UserContext = Partial<
  Pick<
    AuthorizationContext,
    "authenticatedUser" | "effectiveCommitteeRoles" | "teamMemberships"
  >
>;
async function getUserInfo(
  userId: string
): Promise<ConcreteResult<UserContext>> {
  const outputContext: UserContext = {};
  const personRepository = Container.get(PersonRepository);
  const person = await personRepository.findOne({
    by: {
      uuid: userId,
    },
  }).promise;

  if (person.isErr()) {
    if (person.error.tag === ErrorCode.NotFound) {
      // Short-circuit if the user is not found
      return Ok(outputContext);
    }
    return person;
  }

  // If we found a user, set the authenticated user
  // Convert the user to a resource and set it on the context
  const personResource = person.value.toResource();
  logger.trace("graphqlContextFunction Found user", personResource);
  outputContext.authenticatedUser = personResource;

  // Set the teams the user is on
  const { memberships: teamMemberships, id: personId } = person.value.row;
  logger.trace("graphqlContextFunction Found team memberships", {
    teamMemberships,
  });
  outputContext.teamMemberships = teamMemberships.map((membership) => ({
    teamType: membership.team.type,
    position: membership.position,
    teamId: membership.team.uuid,
  }));

  // Set the effective committee roles the user has
  const effectiveCommitteeRoles =
    await personRepository.getEffectiveCommitteeRolesOfPerson({
      id: personId,
    }).promise;
  if (effectiveCommitteeRoles.isErr()) {
    return effectiveCommitteeRoles;
  }
  logger.trace(
    "graphqlContextFunction Effective committee roles",
    ...effectiveCommitteeRoles.value
  );
  outputContext.effectiveCommitteeRoles = effectiveCommitteeRoles.value;

  return Ok(outputContext);
}

export const authenticate: ContextFunction<
  [ExpressContextFunctionArgument],
  GraphQLContext
> = async ({ req }): Promise<GraphQLContext> => {
  // Get the token from the cookies or the Authorization header
  let token = (req.cookies as Partial<Record<string, string>>).token
    ? String((req.cookies as Partial<Record<string, string>>).token)
    : undefined;
  if (!token) {
    let authorizationHeader =
      req.headers.Authorization || req.headers.authorization;
    if (Array.isArray(authorizationHeader)) {
      authorizationHeader = authorizationHeader[0];
    }
    if (authorizationHeader?.startsWith("Bearer ")) {
      token = authorizationHeader.substring("Bearer ".length);
    }
  }
  let userId: string | undefined;
  let authSource: AuthSource = AuthSource.None;
  if (token) {
    ({ userId, authSource } = parseUserJwt(token));
  }

  let userContext: UserContext | undefined = undefined;
  if (userId) {
    const userInfo = await getUserInfo(userId);
    if (userInfo.isErr()) {
      logger.error("Failed to get user info", { error: userInfo.error });
    } else {
      userContext = userInfo.value;
    }
  }

  let superAdmin = isSuperAdmin(
    userContext?.effectiveCommitteeRoles ?? [],
    userContext?.authenticatedUser?.linkblue
  );

  if (
    superAdmin &&
    req.headers["x-ukdb-masquerade"] &&
    typeof req.headers["x-ukdb-masquerade"] === "string"
  ) {
    const parsedId = parseGlobalId(req.headers["x-ukdb-masquerade"]);
    if (parsedId.isErr()) {
      logger.error(
        `graphqlContextFunction Error parsing masquerade ID ${parsedId.error.toString()}`
      );
    } else {
      logger.trace(
        `graphqlContextFunction Masquerading as ${parsedId.value.id}`
      );
      // We need to reset the dbRole to the default one in case the masquerade user is not a committee member
      const masqueradeUserInfo = await getUserInfo(parsedId.value.id);
      if (masqueradeUserInfo.isErr()) {
        logger.error(
          `Failed to get masquerade user info: ${masqueradeUserInfo.error.toString()}`
        );
      } else {
        userContext = masqueradeUserInfo.value;
      }

      superAdmin = false;
    }
  }

  if (
    superAdmin &&
    (!userContext?.effectiveCommitteeRoles ||
      userContext.effectiveCommitteeRoles.length === 0)
  ) {
    userContext = {
      ...userContext,
      effectiveCommitteeRoles: [
        {
          identifier: CommitteeIdentifier.techCommittee,
          role: CommitteeRole.Chair,
        },
      ],
    };
  }

  const authorizationContext: AuthorizationContext = {
    authenticatedUser: userContext?.authenticatedUser ?? null,
    effectiveCommitteeRoles: userContext?.effectiveCommitteeRoles ?? [],
    teamMemberships: userContext?.teamMemberships ?? [],
    accessLevel: superAdmin
      ? AccessLevel.SuperAdmin
      : roleToAccessLevel(
          userContext?.effectiveCommitteeRoles ?? [],
          authSource
        ),
    authSource,
  };

  return {
    ...authorizationContext,
    serverUrl: getHostUrl(req),
    ability: getAuthorizationFor({
      accessLevel: authorizationContext.accessLevel,
      effectiveCommitteeRoles: authorizationContext.effectiveCommitteeRoles,
      teamMemberships: authorizationContext.teamMemberships,
      userId: userContext?.authenticatedUser?.id.id ?? null,
    }),
  };
};

function isSuperAdmin(
  committeeRoles: EffectiveCommitteeRole[],
  linkblue?: string | null
): boolean {
  const superAdminLinkblues = Container.get(superAdminLinkbluesToken);

  return (
    (typeof superAdminLinkblues !== "symbol" &&
      linkblue &&
      superAdminLinkblues.includes(linkblue)) ||
    committeeRoles.some(
      (role) =>
        role.identifier === CommitteeIdentifier.techCommittee &&
        role.role === CommitteeRole.Chair
    )
  );
}
