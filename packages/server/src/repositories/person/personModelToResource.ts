import type { Person } from "@prisma/client";
import { PersonNode } from "@ukdanceblue/common";
import type { Result } from "ts-results-es";

import type { RepositoryError } from "../shared.js";

import type { PersonRepository } from "./PersonRepository.js";

export async function personModelToResource(
  person: Person,
  personRepository: PersonRepository
): Promise<Result<PersonNode, RepositoryError>> {
  const dbRole = await personRepository.getDbRoleOfPerson({
    uuid: person.uuid,
  });

  return dbRole.map((dbRole) =>
    PersonNode.init({
      id: person.uuid,
      name: person.name,
      email: person.email,
      linkblue: person.linkblue,
      createdAt: person.createdAt,
      updatedAt: person.updatedAt,

      // !!! Potential source of issues !!!
      dbRole,
      // !!! Potential source of issues !!!
    })
  );
}
