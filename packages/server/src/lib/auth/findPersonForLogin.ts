import type { Person, PrismaClient } from "@prisma/client";
import type { AuthSource, RoleResource } from "@ukdanceblue/common";
import { MembershipPositionType } from "@ukdanceblue/common";

import { logger } from "../../logger.js";

// TODO: rework this whole thing, it doesn't really make much sense anymore

/**
 * Searches the database for a user with the given auth IDs or user data, or creates a new user if none is found
 *
 * @param authIds The auth IDs to search for
 * @param userData The user data to fall back on if no user is found with the given auth IDs
 */
export async function findPersonForLogin(
  client: PrismaClient,
  authIds: Partial<Record<AuthSource, string>>,
  userData: {
    uuid?: string | null;
    email?: string | null;
    linkblue?: string | null;
    name?: string | null;
    role?: RoleResource | null;
  },
  memberOf?: (string | number)[],
  captainOf?: (string | number)[]
): Promise<[Person, boolean]> {
  logger.debug(`Looking for person with auth IDs: ${JSON.stringify(authIds)}`);
  // TODO: pick specific values of authIds to search for, instead of all of them at once
  let currentPerson: Person | null = null;
  let created = false;

  // If we have a UUID, search for an existing person with that UUID
  if (userData.uuid) {
    currentPerson = await client.person.findUnique({
      where: { uuid: userData.uuid },
    });
    if (currentPerson) {
      logger.debug(`Found person by uuid: ${currentPerson.uuid}`);
    }
  }

  // Search for an existing person with the given auth IDs
  for (const [source, id] of Object.entries(authIds)) {
    if (!id) {
      continue;
    }
    // eslint-disable-next-line no-await-in-loop
    currentPerson = await client.person.findFirst({
      where: { authIds: { [source]: id } },
    });
    if (currentPerson) {
      logger.debug(`Found person by ${source}: ${currentPerson.uuid}`);
      break;
    }
  }

  // Search for an existing person with the given unique user data
  if (!currentPerson && userData.linkblue) {
    currentPerson = await client.person.findUnique({
      where: { linkblue: userData.linkblue },
    });
    if (currentPerson) {
      logger.debug(`Found person by linkblue: ${currentPerson.uuid}`);
    }
  }
  if (!currentPerson && userData.email) {
    currentPerson = await client.person.findUnique({
      where: { email: userData.email },
    });
    if (currentPerson) {
      logger.debug(`Found person by email: ${currentPerson.uuid}`);
    }
  }

  if (!currentPerson) {
    logger.debug("No person found, creating new person");
    if (!userData.email) {
      throw new Error("No email provided for new user");
    }
    // currentPerson = PersonModel.build({
    //   authIds,
    //   email: userData.email,
    // });

    // const { name, linkblue, role } = userData;

    // if (name) {
    //   currentPerson.name = name;
    // }
    // if (linkblue) {
    //   currentPerson.linkblue = linkblue;
    // }
    // if (role) {
    //   currentPerson.committeeRole = role.committeeRole;
    //   currentPerson.committeeName = role.committeeIdentifier;
    // }

    // const savedPerson = await currentPerson.save({
    //   transaction: t,
    //   returning: ["id"],
    // });

    // const { uuid: finalPersonUuid } = await savedPerson.save({
    //   transaction: t,
    //   returning: ["uuid"],
    // });

    const memberOfIds = await Promise.all(
      memberOf?.map(async (teamId) => {
        if (typeof teamId === "string") {
          const team = await client.team.findUnique({
            where: { uuid: teamId },
          });
          return team?.id;
        } else {
          return teamId;
        }
      }) ?? []
    );
    const captainOfIds = await Promise.all(
      captainOf?.map(async (teamId) => {
        if (typeof teamId === "string") {
          const team = await client.team.findUnique({
            where: { uuid: teamId },
          });
          return team?.id;
        } else {
          return teamId;
        }
      }) ?? []
    );

    currentPerson = await client.person.create({
      data: {
        authIds,
        email: userData.email,
        name: userData.name ?? null,
        linkblue: userData.linkblue ?? null,
        committeeRole: userData.role?.committeeRole ?? null,
        committeeName: userData.role?.committeeIdentifier ?? null,
        memberships: {
          createMany: {
            data: [
              ...memberOfIds
                .filter((id): id is Exclude<typeof id, undefined> => id != null)
                .map(
                  (
                    id
                  ): {
                    teamId: number;
                    position: MembershipPositionType;
                  } => ({
                    teamId: id,
                    position: MembershipPositionType.Member,
                  })
                ),
              ...captainOfIds
                .filter((id): id is Exclude<typeof id, undefined> => id != null)
                .map(
                  (
                    id
                  ): {
                    teamId: number;
                    position: MembershipPositionType;
                  } => ({
                    teamId: id,
                    position: MembershipPositionType.Captain,
                  })
                ),
            ],
          },
        },
      },
    });

    logger.info(`Created new person: ${currentPerson.uuid}`);

    created = true;
  }
  return [currentPerson, created];
}
