import { ErrorCode, PersonResource } from "@ukdanceblue/common";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";

import { PersonIntermediate, PersonModel } from "../models/Person.js";

import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";

const CreatePersonResponse = defineGraphQlCreatedResponse("CreatePersonResponse", PersonResource);
const GetPersonByUuidResponse = defineGraphQlOkResponse("GetPersonByUuidResponse", PersonResource);
const DeletePersonResponse = defineGraphQlOkResponse("DeletePersonResponse", Boolean);

@InputType()
class CreatePersonInput {
  @Field()
  email!: string;
}

const CreatePersonResponseUnion = withGraphQLErrorUnion(CreatePersonResponse, "CreatePersonResponse");
const GetPersonByUuidResponseUnion = withGraphQLErrorUnion(GetPersonByUuidResponse, "GetPersonByUuidResponse");
const DeletePersonResponseUnion = withGraphQLErrorUnion(DeletePersonResponse, "DeletePersonResponse");

@Resolver(() => PersonResource)
export class PersonResolver implements ResolverInterface<PersonResource> {
  @Query(() => GetPersonByUuidResponseUnion, { name: "getPersonByUuid" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<typeof GetPersonByUuidResponseUnion> {
    const row = await PersonModel.findOne({ where: { uuid } });

    if (row == null) {
      return GraphQLErrorResponse.from("Person not found", ErrorCode.NotFound);
    }

    return GetPersonByUuidResponse.newOk(new PersonIntermediate(row).toResource());
  }

  @Mutation(() => CreatePersonResponseUnion, { name: "create" })
  async create(@Arg("input") input: CreatePersonInput): Promise<typeof CreatePersonResponseUnion> {
    const result = await PersonModel.create({
      email: input.email,
      authIds: {}
    });

    return CreatePersonResponse.newOk(new PersonIntermediate(result).toResource());
  }

  @Mutation(() => DeletePersonResponseUnion, { name: "delete" })
  async delete(@Arg("id") id: string): Promise<typeof DeletePersonResponseUnion> {
    const row = await PersonModel.findOne({ where: { uuid: id }, attributes: ["id"] });

    if (row == null) {
      return GraphQLErrorResponse.from("Person not found", ErrorCode.NotFound);
    }

    await row.destroy();

    return DeletePersonResponse.newOk(true);
  }
}
