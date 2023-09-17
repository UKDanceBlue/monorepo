import type { ApiError, GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";
import { PersonModel, PersonIntermediate } from "../models/Person.js";

export class PersonService implements GraphQLService.PersonServiceInterface {
  async getByUuid(uuid: string) {
    return modelServiceGetByUuidHelper("Person", "uuid", uuid, PersonModel, PersonIntermediate);
  }

  async set(uuid: string, input: Partial<GraphQLResource.PersonResource>): Promise<GraphQLResource.PersonResource | ApiError<boolean>> {
    const [affected, result] = await PersonModel.update(
      {
        // TODO: Implement
      },
      {
        where: {
          uuid,
        },
        returning: true,
      },
    );
    return modelServiceSetHelper("Person", uuid, affected, result, PersonIntermediate);
  }

  async create(input: GraphQLResource.PersonResource): Promise<ApiError<boolean> | { data?: GraphQLResource.PersonResource; uuid: string; }> {
    const person = await PersonModel.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      authIds: input.authIds,
      // TODO: Finish
    });
    const data = new PersonIntermediate(person).toResource();
    return {
      data,
      uuid: person.uuid,
    };
  }

  async delete(uuid: string): Promise<ApiError<boolean> | boolean> {
    return modelServiceDeleteHelper("Person", "uuid", uuid, PersonModel);
  }
}

GraphQLService.graphQLServiceContainer.set({ id: GraphQLService.personServiceToken, type: PersonService });
