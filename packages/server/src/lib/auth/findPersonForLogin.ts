import type { AuthSource, DbRole } from "@ukdanceblue/common";
import { and, eq } from "drizzle-orm";

import type { Drizzle } from "#db";
import { logger } from "#logging/logger.js";
import { authIdPair, person } from "#schema/tables/person.sql.js";

// TODO: rework this whole thing, it's pretty boated and confusing

const withData = {
  authIdPairs: true,
  memberships: {
    columns: {
      position: true,
    },
    with: {
      team: {
        columns: {
          uuid: true,
        },
      },
    },
  },
} as const;

/**
 * Searches the database for a user with the given auth IDs or user data, or creates a new user if none is found
 *
 * @param authIds The auth IDs to search for
 * @param userInfo The user data to fall back on if no user is found with the given auth IDs
 */
export async function findPersonForLogin(
  client: Drizzle,
  authIds: [Exclude<AuthSource, "None">, string][],
  userInfo: {
    uuid?: string | undefined | null;
    email?: string | undefined | null;
    linkblue?: string | undefined | null;
    name?: string | undefined | null;
    dbRole?: DbRole | undefined | null;
  }
) {
  logger.trace(`Looking for person with auth IDs: ${JSON.stringify(authIds)}`);
  // TODO: pick specific values of authIds to search for, instead of all of them at once
  let currentPerson;
  let created = false;

  // If we have a UUID, search for an existing person with that UUID
  if (userInfo.uuid) {
    currentPerson = await client.query.person.findFirst({
      where: eq(person.uuid, userInfo.uuid),
      with: withData,
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
    currentPerson = await client.query.person.findFirst({
      // where: { authIdPairs: { some: { source, value: id } } },
      // where: sql`EXISTS (SELECT 1 FROM "authIdPairs" WHERE "personId" = person.id AND source = ${source} AND value = ${id})`,
      where: eq(
        person.id,
        client
          .select({
            personId: authIdPair.personId,
          })
          .from(authIdPair)
          .where(and(eq(authIdPair.source, source), eq(authIdPair.value, id)))
          .limit(1)
      ),
      with: withData,
    });
    if (currentPerson) {
      logger.trace(`Found person by ${source}: ${currentPerson.uuid}`);
      break;
    }
  }

  // Search for an existing person with the given unique user data
  if (!currentPerson && userInfo.linkblue) {
    currentPerson = await client.query.person.findFirst({
      where: eq(person.linkblue, userInfo.linkblue),
      with: withData,
    });
    if (currentPerson) {
      logger.trace(`Found person by linkblue: ${currentPerson.uuid}`);
    }
  }
  if (!currentPerson && userInfo.email) {
    currentPerson = await client.query.person.findFirst({
      where: eq(person.email, userInfo.email),
      with: withData,
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

    const createdPerson = await client
      .insert(person)
      .values({
        // authIdPairs: {
        //   createMany: {
        //     data: authIds.map(([source, value]) => ({
        //       source,
        //       value,
        //     })),
        //   },
        // },
        email: userInfo.email,
        name: userInfo.name ?? null,
        linkblue: userInfo.linkblue?.toLowerCase() ?? null,
      })
      .returning();
    if (createdPerson.length !== 1) {
      throw new Error("Failed to create new person");
    }
    const personId = createdPerson[0]!.id;
    await client
      .insert(authIdPair)
      .values(
        authIds.map(([source, value]) => ({
          source,
          value,
          personId,
        }))
      )
      .returning();

    currentPerson = await client.query.person.findFirst({
      where: eq(person.id, personId),
      with: withData,
    });

    if (!currentPerson) {
      throw new Error("Failed to find newly created person");
    } else {
      logger.info(`Created new person: ${currentPerson.uuid}`);

      created = true;
    }
  }
  return { currentPerson, created } as const;
}
