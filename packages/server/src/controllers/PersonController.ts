import type {
  AuthSource,
  OptionalNullOrUndefined,
  PersonResource,
} from "@ukdanceblue/common";

import { PersonModel } from ".././models/Person.js";
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
  let currentPerson = await PersonModel.findOne({ where: { authIds } });
  let created = false;
  if (!currentPerson && userData.linkblue) {
    currentPerson = await PersonModel.findOne({
      where: { linkblue: userData.linkblue },
    });
  }
  if (!currentPerson && userData.email) {
    currentPerson = await PersonModel.findOne({
      where: { email: userData.email },
    });
  }
  if (!currentPerson) {
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

    if (memberOf) {
      const memberOfArray = await Promise.all(
        memberOf.map((c) => {
          c = typeof c === "string" ? c : c.teamId;
          return TeamModel.findOne({ where: { uuid: c } });
        })
      );
      currentPerson.memberOf = memberOfArray.filter(
        (c): c is TeamModel => c != null
      );
    }
    if (captainOf) {
      const captainOfArray = await Promise.all(
        captainOf.map((c) => {
          c = typeof c === "string" ? c : c.teamId;
          return TeamModel.findOne({ where: { uuid: c } });
        })
      );
      currentPerson.captainOf = captainOfArray.filter(
        (c): c is TeamModel => c != null
      );
    }

    created = true;
  }
  return [currentPerson, created];
}
