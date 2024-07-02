import type { Person } from "@prisma/client";
import { PersonNode } from "@ukdanceblue/common";
import { AsyncResult } from "ts-results-es";

import type { RepositoryError } from "../shared.js";

import type { PersonRepository } from "./PersonRepository.js";

export function personModelToResource(
  person: Person,
  personRepository: PersonRepository
): AsyncResult<PersonNode, RepositoryError> {
  return new AsyncResult(
    personRepository.getDbRoleOfPerson({
      uuid: person.uuid,
    })
  ).map((dbRole) =>
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
