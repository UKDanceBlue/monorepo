import type { Person } from "@prisma/client";
import { DbRole, PersonNode } from "@ukdanceblue/common";

export function personModelToResource(person: Person): PersonNode {
  let dbRole: DbRole = DbRole.None;
  if (person.committeeRole) {
    dbRole = DbRole.Committee;
  } else if (person.linkblue) {
    dbRole = DbRole.UKY;
  } else {
    dbRole = DbRole.Public;
  }

  return PersonNode.init({
    uuid: person.uuid,
    name: person.name,
    email: person.email,
    linkblue: person.linkblue,
    dbRole,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
  });
}
