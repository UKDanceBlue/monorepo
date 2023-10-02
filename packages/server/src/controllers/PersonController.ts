import {
  type AuthSource,
  type OptionalNullOrUndefined,
  type PersonResource,
  isNonNullable,
} from "@ukdanceblue/common";

import { PersonModel } from ".././models/Person.js";
import { sequelizeDb } from "../data-source.js";
import { logDebug, logInfo } from "../logger.js";
import {
  type MembershipModel,
  MembershipPositionType,
} from "../models/Membership.js";
import { TeamModel } from "../models/Team.js";

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
  logDebug(`Looking for person with auth IDs: ${JSON.stringify(authIds)}`);
  return sequelizeDb.transaction(async (t) => {
    // TODO: explore using auth IDs to find a person instead of user data
    let currentPerson = await PersonModel.findOne({ where: { authIds } });
    let created = false;
    if (!currentPerson && userData.linkblue) {
      currentPerson = await PersonModel.findOne({
        where: { linkblue: userData.linkblue },
        transaction: t,
      });
      logDebug(`Found person by linkblue: ${currentPerson?.uuid ?? "ERR"}`);
    }
    if (!currentPerson && userData.email) {
      currentPerson = await PersonModel.findOne({
        where: { email: userData.email },
        transaction: t,
      });
      logDebug(`Found person by email: ${currentPerson?.uuid ?? "ERR"}`);
    }
    if (!currentPerson) {
      logDebug("No person found, creating new person");
      if (!userData.email) {
        throw new Error("No email provided for new user");
      }
      currentPerson = PersonModel.build({
        authIds,
        email: userData.email,
      });

      const { firstName, lastName, linkblue, role, memberOf, captainOf } =
        userData;

      if (firstName) {
        currentPerson.firstName = firstName;
      }
      if (lastName) {
        currentPerson.lastName = lastName;
      }
      if (linkblue) {
        currentPerson.linkblue = linkblue;
      }
      if (role) {
        currentPerson.dbRole = role.dbRole;
        currentPerson.committeeRole = role.committeeRole;
        currentPerson.committeeName = role.committee;
      }

      const savedPerson = await currentPerson.save({
        transaction: t,
        returning: ["id"],
      });

      logDebug("Creating memberships for new person");

      let nonCaptainMemberships: Promise<MembershipModel | null>[] = [];
      if (memberOf) {
        nonCaptainMemberships = memberOf.map(async (m) => {
          const team = await TeamModel.findByUuid(
            typeof m === "string" ? m : m.teamId,
            { rejectOnEmpty: true, transaction: t }
          );

          if (team) {
            return savedPerson.createMembership(
              {
                personId: savedPerson.id,
                teamId: team.id,
                position: MembershipPositionType.Member,
              },
              { transaction: t }
            );
          }

          return null;
        });
      }

      const captainMemberships: Promise<MembershipModel | null>[] = [];
      if (captainOf) {
        captainOf.map(async (m) => {
          const team = await TeamModel.findByUuid(
            typeof m === "string" ? m : m.teamId,
            { rejectOnEmpty: true, transaction: t }
          );

          if (team) {
            return savedPerson.createMembership(
              {
                personId: savedPerson.id,
                teamId: team.id,
                position: MembershipPositionType.Captain,
              },
              { transaction: t }
            );
          }

          return null;
        });
      }

      savedPerson.memberships = await Promise.all([
        ...nonCaptainMemberships,
        ...captainMemberships,
      ]).then((results) => results.filter(isNonNullable));

      const { uuid: finalPersonUuid } = await savedPerson.save({
        transaction: t,
        returning: ["uuid"],
      });

      logInfo(`Created new person: ${finalPersonUuid}`);

      created = true;
    }
    return [currentPerson, created];
  });
}
