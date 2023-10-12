import {
  ErrorCode,
  MembershipResource,
  PersonResource,
} from "@ukdanceblue/common";
import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { PersonModel } from "../models/Person.js";

import { MembershipModel } from "../models/Membership.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  DetailedError,
} from "./ApiResponse.js";
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
  async delete(@Arg("id") id: string): Promise<DeletePersonResponse> {
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
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
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
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return model.memberships.map((row) => row.toResource());
  }
}
