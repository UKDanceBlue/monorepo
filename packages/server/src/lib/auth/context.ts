import type { ContextFunction } from "@apollo/server";
import type { ExpressContextFunctionArgument } from "@apollo/server/express4";
import { Container } from "@freshgum/typedi";
import { CommitteeRole, type Person, type Session } from "@prisma/client";
import type {
  AppAbility,
  AuthorizationContext,
  EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  AuthSource,
  CommitteeIdentifier,
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
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

export interface GraphQLContext extends AuthorizationContext {
  serverUrl: URL;
  ability: AppAbility;
  session: Session | null;
}

type UserContext = Partial<
  Pick<
    AuthorizationContext,
    "authenticatedUser" | "effectiveCommitteeRoles" | "teamMemberships"
  >
>;
async function getUserInfo(
  person: Person
): Promise<ConcreteResult<UserContext>> {
  const outputContext: UserContext = {};
  const personRepository = Container.get(PersonRepository);

  // If we found a user, set the authenticated user
  // Convert the user to a resource and set it on the context
  const personResource = await personModelToResource(person, personRepository)
    .promise;
  if (personResource.isErr()) {
    return personResource;
  }
  logger.trace("graphqlContextFunction Found user", personResource.value);
  outputContext.authenticatedUser = personResource.value;

  // Set the teams the user is on
  let teamMemberships = await personRepository.findMembershipsOfPerson(
    {
      id: person.id,
    },
    {},
    undefined,
    true
  );
  if (teamMemberships.isErr()) {
    if (teamMemberships.error.tag === ErrorCode.NotFound) {
      teamMemberships = Ok([]);
    } else {
      return teamMemberships;
    }
  }
  logger.trace(
    "graphqlContextFunction Found team memberships",
    ...teamMemberships.value
  );
  outputContext.teamMemberships = teamMemberships.value.map((membership) => ({
    teamType: membership.team.type,
    position: membership.position,
    teamId: membership.team.uuid,
  }));

  // Set the effective committee roles the user has
  const effectiveCommitteeRoles =
    await personRepository.getEffectiveCommitteeRolesOfPerson({
      id: person.id,
    });
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
  let person: Person | null = null;
  let authSource: AuthSource = AuthSource.None;
  if (token) {
    ({ person, authSource } = req.session ?? {
      authSource: AuthSource.None,
      person: null,
    });
  }

  let userContext: UserContext | undefined = undefined;
  if (person) {
    const userInfo = await getUserInfo(person);
    if (userInfo.isErr()) {
      logger.error(`Failed to get user info: ${userInfo.error.toString()}`);
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
      const person = await req
        .getService(PersonRepository)
        .findPersonByUnique({ uuid: parsedId.value.id });
      if (person.isErr()) {
        logger.error(
          `Failed to get masquerade user: ${person.error.toString()}`
        );
      } else if (person.value.isNone()) {
        logger.error(`Failed to get masquerade user: not found`);
      } else {
        const userInfo = await getUserInfo(person.value.value);
        if (userInfo.isErr()) {
          logger.error(
            `Failed to get masquerade user info: ${userInfo.error.toString()}`
          );
        } else {
          userContext = userInfo.value;
        }
      }

      superAdmin = false;
    }
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
    session: req.session,
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
