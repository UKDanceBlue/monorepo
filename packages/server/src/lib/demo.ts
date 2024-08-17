import { PersonRepository } from "#repositories/person/PersonRepository.js";

import { Container } from "typedi";


export async function getOrMakeDemoUser() {
  return Container.get(PersonRepository).getDemoUser();
}
