import type { Person } from "@prisma/client";
import type { DbRole } from "@ukdanceblue/common";
import { PersonResource, RoleResource } from "@ukdanceblue/common";

export function personModelToResource(
  person: Person & {
    dbRole: DbRole;
  }
): PersonResource {
  return PersonResource.init({
    uuid: person.uuid,
    name: person.name,
    email: person.email,
    linkblue: person.linkblue,
    role: RoleResource.init({
      dbRole: person.dbRole,
      committeeRole: person.committeeRole,
      committeeIdentifier: person.committeeName,
    }),
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  });
}
