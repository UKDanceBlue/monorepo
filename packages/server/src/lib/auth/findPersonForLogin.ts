import type { AuthSource, Prisma, PrismaClient } from "@prisma/client";
import type { DbRole } from "@ukdanceblue/common";
import { MembershipPositionType } from "@ukdanceblue/common";

import { logger } from "@/logging/logger.js";

// TODO: rework this whole thing, it's pretty boated and confusing

const include = {
  authIdPairs: true,
  memberships: {
    select: {
      position: true,
      team: {
        select: {
          uuid: true,
        },
      },
    },
  },
} satisfies Prisma.PersonInclude;

/**
 * Searches the database for a user with the given auth IDs or user data, or creates a new user if none is found
 *
 * @param authIds The auth IDs to search for
 * @param userInfo The user data to fall back on if no user is found with the given auth IDs
 */
export async function findPersonForLogin(
  client: PrismaClient,
  authIds: [AuthSource, string][],
  userInfo: {
    uuid?: string | undefined | null;
    email?: string | undefined | null;
    linkblue?: string | undefined | null;
    name?: string | undefined | null;
    dbRole?: DbRole | undefined | null;
  },
  memberOf?: (string | number)[],
  captainOf?: (string | number)[]
) {
  logger.trace(`Looking for person with auth IDs: ${JSON.stringify(authIds)}`);
  // TODO: pick specific values of authIds to search for, instead of all of them at once
  let currentPerson;
  let created = false;

  // If we have a UUID, search for an existing person with that UUID
  if (userInfo.uuid) {
    currentPerson = await client.person.findUnique({
      where: { uuid: userInfo.uuid },
      include,
    });
    if (currentPerson) {
      logger.trace(`Found person by uuid: ${currentPerson.uuid}`);
    }
  }

  // Search for an existing person with the given auth IDs
  for (const [source, id] of authIds) {
    if (!id) {
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    currentPerson = await client.person.findFirst({
      where: { authIdPairs: { some: { source, value: id } } },
      include,
    });
    if (currentPerson) {
      logger.trace(`Found person by ${source}: ${currentPerson.uuid}`);
      break;
    }
  }

  // Search for an existing person with the given unique user data
  if (!currentPerson && userInfo.linkblue) {
    currentPerson = await client.person.findUnique({
      where: { linkblue: userInfo.linkblue },
      include,
    });
    if (currentPerson) {
      logger.trace(`Found person by linkblue: ${currentPerson.uuid}`);
    }
  }
  if (!currentPerson && userInfo.email) {
    currentPerson = await client.person.findUnique({
      where: { email: userInfo.email },
      include,
    });
    if (currentPerson) {
      logger.trace(`Found person by email: ${currentPerson.uuid}`);
    }
  }

  if (!currentPerson) {
    logger.trace("No person found, creating new person");
    if (!userInfo.email) {
      throw new Error("No email provided for new user");
    }

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
        authIdPairs: {
          createMany: {
            data: authIds.map(([source, value]) => ({
              source,
              value,
            })),
          },
        },
        email: userInfo.email,
        name: userInfo.name ?? null,
        linkblue: userInfo.linkblue?.toLowerCase() ?? null,
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
      include,
    });

    logger.info(`Created new person: ${currentPerson.uuid}`);

    created = true;
  }
  return { currentPerson, created } as const;
}
