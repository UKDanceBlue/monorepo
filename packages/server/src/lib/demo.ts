import { PersonRepository } from "#repositories/person/PersonRepository.js";

import { Container } from "@freshgum/typedi";

export async function getOrMakeDemoUser() {
  return Container.get(PersonRepository).getDemoUser();
}
