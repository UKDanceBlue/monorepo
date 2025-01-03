import type { Person } from "@prisma/client";
import { PersonNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";
import type { AsyncResult } from "ts-results-es";
import { Ok } from "ts-results-es";

import type { RepositoryError } from "#repositories/shared.js";

import type { PersonRepository } from "./PersonRepository.js";

export function personModelToResource(
  person: Person,
  _personRepository?: PersonRepository
): AsyncResult<PersonNode, RepositoryError> {
  return Ok(
    PersonNode.init({
      id: person.uuid,
      name: person.name,
      email: person.email,
      linkblue: person.linkblue?.toLowerCase(),
      createdAt: DateTime.fromJSDate(person.createdAt),
      updatedAt: DateTime.fromJSDate(person.updatedAt),
    })
  ).toAsyncResult();
}
