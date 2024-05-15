import type { Person } from "@prisma/client";
import { DbRole, PersonNode } from "@ukdanceblue/common";

import type { PersonRepository } from "./PersonRepository.js";

export async function personModelToResource(
  person: Person,
  personRepository: PersonRepository
): Promise<PersonNode> {
  const dbRole = await personRepository.getDbRoleOfPerson({
    uuid: person.uuid,
  });

  return PersonNode.init({
    uuid: person.uuid,
    name: person.name,
    email: person.email,
    linkblue: person.linkblue,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,

    // !!! Potential source of issues !!!
    dbRole: dbRole ?? DbRole.None,
    // !!! Potential source of issues !!!
  });
}
