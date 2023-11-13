import {
  ErrorCode,
  MembershipResource,
  PersonResource,
} from "@ukdanceblue/common";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { MembershipModel } from "../models/Membership.js";
import { PersonModel } from "../models/Person.js";

import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  DetailedError,
} from "./ApiResponse.js";
import * as Context from "./Context.js";
import type { ResolverInterface } from "./ResolverInterface.js";

@ObjectType("CreatePersonResponse", {
  implements: AbstractGraphQLCreatedResponse<PersonResource>,
})
class CreatePersonResponse extends AbstractGraphQLCreatedResponse<PersonResource> {
  @Field(() => PersonResource)
  data!: PersonResource;
}
@ObjectType("GetPersonByUuidResponse", {
  implements: AbstractGraphQLOkResponse<PersonResource>,
})
class GetPersonByUuidResponse extends AbstractGraphQLOkResponse<PersonResource> {
  @Field(() => PersonResource)
  data!: PersonResource;
}
@ObjectType("GetMeResponse", {
  implements: AbstractGraphQLOkResponse<PersonResource>,
})
class GetMeResponse extends AbstractGraphQLOkResponse<PersonResource> {
  @Field(() => PersonResource)
  data!: PersonResource;
}
@ObjectType("DeletePersonResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePersonResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}
@InputType()
class CreatePersonInput {
  @Field()
  email!: string;
}

@Resolver(() => PersonResource)
export class PersonResolver implements ResolverInterface<PersonResource> {
  @Query(() => GetPersonByUuidResponse, { name: "person" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetPersonByUuidResponse> {
    const row = await PersonModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return GetPersonByUuidResponse.newOk(row.toResource());
  }

  @Query(() => GetMeResponse, { name: "me" })
  me(@Ctx() ctx: Context.GraphQLContext): GetMeResponse {
    return GetMeResponse.newOk(ctx.authenticatedUser);
  }

  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    const result = await PersonModel.create({
      email: input.email,
      authIds: {},
    });

    return CreatePersonResponse.newOk(result.toResource());
  }

  @Mutation(() => DeletePersonResponse, { name: "deletePerson" })
  async delete(@Arg("uuid") id: string): Promise<DeletePersonResponse> {
    const row = await PersonModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    await row.destroy();

    return DeletePersonResponse.newOk(true);
  }

  @FieldResolver(() => [MembershipResource])
  async teams(@Root() person: PersonResource): Promise<MembershipResource[]> {
    const model = await PersonModel.findByUuid(person.uuid, {
      attributes: ["id"],
      include: [MembershipModel.withScope("withTeam")],
    });

    if (model == null) {
      // I guess this is fine? May need more robust error handling
      return [];
    }

    return model.memberships.map((row) => row.toResource());
  }

  @FieldResolver(() => [MembershipResource])
  async captaincies(
    @Root() person: PersonResource
  ): Promise<MembershipResource[]> {
    const model = await PersonModel.findByUuid(person.uuid, {
      attributes: ["id"],
      include: [MembershipModel.withScope("withTeam").withScope("captains")],
    });

    if (model == null) {
      // I guess this is fine? May need more robust error handling
      return [];
    }

    return model.memberships.map((row) => row.toResource());
  }
}
