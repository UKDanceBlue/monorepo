import type { Person } from "@prisma/client";
import { DbRole, PersonResource, RoleResource } from "@ukdanceblue/common";

export function personModelToResource(person: Person): PersonResource {
  let dbRole: DbRole = DbRole.None;
  if (person.committeeRole) {
    dbRole = DbRole.Committee;
  } else if (person.linkblue) {
    dbRole = DbRole.UKY;
  } else {
    dbRole = DbRole.Public;
  }

  return PersonResource.init({
    uuid: person.uuid,
    name: person.name,
    email: person.email,
    linkblue: person.linkblue,
    role: RoleResource.init({
      dbRole,
      committeeRole: person.committeeRole,
      committeeIdentifier: person.committeeName,
    }),
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  });
}
