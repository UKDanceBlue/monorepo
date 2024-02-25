import type {
  AuthSource,
  OptionalNullOrUndefined,
  PersonResource,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { logger } from "../logger.js";

// TODO: rework this whole thing, it doesn't really make much sense anymore

/**
 * Searches the database for a user with the given auth IDs or user data, or creates a new user if none is found
 *
 * @param authIds The auth IDs to search for
 * @param userData The user data to fall back on if no user is found with the given auth IDs
 */
export async function findPersonForLogin(
  authIds: Partial<Record<AuthSource, string>>,
  userData: OptionalNullOrUndefined<PersonResource>
): Promise<[PersonModel, boolean]> {
  logger.debug(`Looking for person with auth IDs: ${JSON.stringify(authIds)}`);
  return sequelizeDb.transaction(async (t) => {
    // TODO: pick specific values of authIds to search for, instead of all of them at once
    let currentPerson: PersonModel | null = null;
    let created = false;
    for (const [source, id] of Object.entries(authIds)) {
      if (!id) {
        continue;
      }
      // eslint-disable-next-line no-await-in-loop
      currentPerson = await PersonModel.findOne({
        where: { authIds: { [source]: id } },
        transaction: t,
      });
      logger.debug(
        `Found person by ${source}: ${currentPerson?.uuid ?? "ERR"}`
      );
      if (currentPerson) {
        break;
      }
    }
    if (!currentPerson && userData.linkblue) {
      currentPerson = await PersonModel.findOne({
        where: { linkblue: userData.linkblue },
        transaction: t,
      });
      logger.debug(`Found person by linkblue: ${currentPerson?.uuid ?? "ERR"}`);
    }
    if (!currentPerson && userData.email) {
      currentPerson = await PersonModel.findOne({
        where: { email: userData.email },
        transaction: t,
      });
      logger.debug(`Found person by email: ${currentPerson?.uuid ?? "ERR"}`);
    }
    if (!currentPerson) {
      logger.debug("No person found, creating new person");
      if (!userData.email) {
        throw new Error("No email provided for new user");
      }
      currentPerson = PersonModel.build({
        authIds,
        email: userData.email,
      });

      const { name, linkblue, role } = userData;

      if (name) {
        currentPerson.name = name;
      }
      if (linkblue) {
        currentPerson.linkblue = linkblue;
      }
      if (role) {
        currentPerson.committeeRole = role.committeeRole;
        currentPerson.committeeName = role.committeeIdentifier;
      }

      const savedPerson = await currentPerson.save({
        transaction: t,
        returning: ["id"],
      });

      logger.debug("Creating memberships for new person");

      // let nonCaptainMemberships: Promise<MembershipModel | null>[] = [];
      // if (memberOf) {
      //   nonCaptainMemberships = memberOf.map(async (m) => {
      //     const team = await TeamModel.findByUuid(
      //       typeof m === "string" ? m : m.uuid,
      //       { rejectOnEmpty: true, transaction: t }
      //     );

      //     if (team) {
      //       return savedPerson.createMembership(
      //         {
      //           personId: savedPerson.id,
      //           teamId: team.id,
      //           position: MembershipPositionType.Member,
      //         },
      //         { transaction: t }
      //       );
      //     }

      //     return null;
      //   });
      // }

      // const captainMemberships: Promise<MembershipModel | null>[] = [];
      // if (captainOf) {
      //   captainOf.map(async (m) => {
      //     const team = await TeamModel.findByUuid(
      //       typeof m === "string" ? m : m.uuid,
      //       { rejectOnEmpty: true, transaction: t }
      //     );

      //     if (team) {
      //       return savedPerson.createMembership(
      //         {
      //           personId: savedPerson.id,
      //           teamId: team.id,
      //           position: MembershipPositionType.Captain,
      //         },
      //         { transaction: t }
      //       );
      //     }

      //     return null;
      //   });
      // }

      // savedPerson.memberships = await Promise.all([
      //   ...nonCaptainMemberships,
      //   ...captainMemberships,
      // ]).then((results) => results.filter(isNonNullable));

      const { uuid: finalPersonUuid } = await savedPerson.save({
        transaction: t,
        returning: ["uuid"],
      });

      logger.info(`Created new person: ${finalPersonUuid}`);

      created = true;
    }
    return [currentPerson, created];
  });
}
