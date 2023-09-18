import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import { PersonResource } from "../object-types/Person.js";
import { personServiceToken } from "../service-declarations/PersonServiceInterface.js";

import { createBaseResolver } from "./BaseResolver.js";
import { resolverCreateHelper, resolverSetHelper } from "./helpers.js";

const BaseResolver = createBaseResolver("Person", PersonResource, personServiceToken);

// This is a different naming convention than the other resolvers, but let's try it out.
const PersonOkResponse = defineGraphQlOkResponse("Person", PersonResource);
const PersonCreatedResponse = defineGraphQlCreatedResponse("PersonCreated", PersonResource);

@InputType()
class CreatePersonInput {
  @Field()
  name!: string;
}

@InputType()
class SetPersonInput {
  @Field({ nullable: true })
  name?: string;
}

const PersonOkResponseUnion = withGraphQLErrorUnion(PersonOkResponse, "PersonOkResponse");
const PersonCreatedResponseUnion = withGraphQLErrorUnion(PersonCreatedResponse, "PersonCreatedResponse");

@Resolver()
export class PersonResolver extends BaseResolver {
  @Query(() => PersonCreatedResponseUnion)
  async createPerson(
    @Arg("input") input: CreatePersonInput,
  ): Promise<typeof PersonCreatedResponseUnion> {
    return resolverCreateHelper(PersonCreatedResponse, await this.service.create({
      firstName: input.name,
    }));
  }

  @Mutation(() => PersonOkResponseUnion)
  async setPerson(
    @Arg("id") id: string,
    @Arg("input") input: SetPersonInput,
  ): Promise<typeof PersonOkResponseUnion> {
    return resolverSetHelper(PersonOkResponse, await this.service.set(id, {
      firstName: input.name,
    }));
  }
}