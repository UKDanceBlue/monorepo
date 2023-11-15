import {
  ErrorCode,
  MembershipResource,
  PersonResource,
  RoleResource,
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

import { Op } from "@sequelize/core";
import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  DetailedError,
} from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";
import * as Context from "./context.js";

@ObjectType("CreatePersonResponse", {
  implements: AbstractGraphQLCreatedResponse<PersonResource>,
})
class CreatePersonResponse extends AbstractGraphQLCreatedResponse<PersonResource> {
  @Field(() => PersonResource)
  data!: PersonResource;
}
@ObjectType("GetPersonResponse", {
  implements: AbstractGraphQLOkResponse<PersonResource>,
})
class GetPersonResponse extends AbstractGraphQLOkResponse<PersonResource> {
  @Field(() => PersonResource)
  data!: PersonResource;
}
@ObjectType("GetPeopleResponse", {
  implements: AbstractGraphQLArrayOkResponse<PersonResource>,
})
class GetPeopleResponse extends AbstractGraphQLArrayOkResponse<PersonResource> {
  @Field(() => [PersonResource])
  data!: PersonResource[];
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
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => RoleResource, { nullable: true })
  role?: RoleResource;
}

@Resolver(() => PersonResource)
export class PersonResolver implements ResolverInterface<PersonResource> {
  @Query(() => GetPersonResponse, { name: "person" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetPersonResponse> {
    const row = await PersonModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return GetPersonResponse.newOk(row.toResource());
  }

  @Query(() => GetPersonResponse, { name: "personByLinkBlue" })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<GetPersonResponse> {
    const row = await PersonModel.findOne({ where: { linkblue: linkBlueId } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return GetPersonResponse.newOk(row.toResource());
  }

  @Query(() => GetPersonResponse, { name: "me" })
  me(@Ctx() ctx: Context.GraphQLContext): GetPersonResponse {
    return GetPersonResponse.newOk(ctx.authenticatedUser);
  }

  @Query(() => GetPeopleResponse, { name: "searchPeopleByName" })
  async searchByName(@Arg("name") name: string): Promise<GetPeopleResponse> {
    const rows = await PersonModel.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
    });

    return GetPeopleResponse.newOk(rows.map((row) => row.toResource()));
  }

  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    const creationAttributes: Partial<PersonModel> = {};
    if (input.name) {
      creationAttributes.name = input.name;
    }
    if (input.linkblue) {
      creationAttributes.linkblue = input.linkblue;
    }
    if (input.role) {
      creationAttributes.dbRole = input.role.dbRole;
      creationAttributes.committeeRole = input.role.committeeRole;
      creationAttributes.committeeName = input.role.committeeIdentifier;
    }

    const result = await PersonModel.create({
      email: input.email,
      ...creationAttributes,
      authIds: {},
    });

    return CreatePersonResponse.newCreated(result.toResource(), result.uuid);
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
