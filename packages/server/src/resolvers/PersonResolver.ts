import { Op } from "@sequelize/core";
import {
  AccessLevel,
  AccessLevelAuthorized,
  ErrorCode,
  MembershipPositionType,
  MembershipResource,
  PersonResource,
  RoleResource,
} from "@ukdanceblue/common";
import { EmailAddressResolver } from "graphql-scalars";
import {
  Arg,
  Args,
  ArgsType,
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

import { sequelizeDb } from "../data-source.js";
import { MembershipModel } from "../models/Membership.js";
import { PersonModel } from "../models/Person.js";
import { TeamModel } from "../models/Team.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import type { ResolverInterface } from "./ResolverInterface.js";
import * as Context from "./context.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";

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
@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonResource>,
})
class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonResource> {
  @Field(() => [PersonResource])
  data!: PersonResource[];
}
@ObjectType("DeletePersonResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePersonResponse extends AbstractGraphQLOkResponse<never> {}

@ArgsType()
class ListPeopleArgs extends FilteredListQueryArgs("PersonResolver", {
  all: [
    "name",
    "email",
    "linkblue",
    "dbRole",
    "committeeRole",
    "committeeName",
  ],
  string: ["name", "email", "dbRole", "committeeRole", "committeeName"],
}) {}
@InputType()
class CreatePersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver)
  email!: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => RoleResource, { nullable: true })
  role?: RoleResource;

  @Field(() => [String], { defaultValue: [] })
  memberOf?: string[];

  @Field(() => [String], { defaultValue: [] })
  captainOf?: string[];
}
@InputType()
class SetPersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => RoleResource, { nullable: true })
  role?: RoleResource;

  @Field(() => [String], { nullable: true })
  memberOf?: string[];

  @Field(() => [String], { nullable: true })
  captainOf?: string[];
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

  @AccessLevelAuthorized(AccessLevel.Committee)
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

  @AccessLevelAuthorized(AccessLevel.Committee)
  @Query(() => ListPeopleResponse, { name: "listPeople" })
  async list(
    @Args(() => ListPeopleArgs) args: ListPeopleArgs
  ): Promise<ListPeopleResponse> {
    const { rows, count } = await PersonModel.findAndCountAll({
      ...args.toSequelizeFindOptions(
        {
          committeeName: "committeeName",
          committeeRole: "committeeRole",
          dbRole: "dbRole",
          email: "email",
          linkblue: "linkblue",
          name: "name",
        },
        PersonModel
      ),
    });

    return ListPeopleResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @Query(() => GetPersonResponse, { name: "me", nullable: true })
  me(@Ctx() ctx: Context.GraphQLContext): GetPersonResponse | null {
    return ctx.authenticatedUser == null
      ? null
      : GetPersonResponse.newOk(ctx.authenticatedUser);
  }

  @Query(() => GetPeopleResponse, { name: "searchPeopleByName" })
  async searchByName(@Arg("name") name: string): Promise<GetPeopleResponse> {
    const rows = await PersonModel.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
    });

    return GetPeopleResponse.newOk(rows.map((row) => row.toResource()));
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    return sequelizeDb.transaction(async () => {
      const creationAttributes: Partial<PersonModel> = {};
      if (input.name) {
        creationAttributes.name = input.name;
      }
      if (input.linkblue) {
        creationAttributes.linkblue = input.linkblue.toLowerCase();
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

      const promises: Promise<void>[] = [];
      for (const memberOfTeam of input.memberOf ?? []) {
        promises.push(
          TeamModel.findByUuid(memberOfTeam).then((team) =>
            team == null
              ? Promise.reject(
                  new DetailedError(ErrorCode.NotFound, "Team not found")
                )
              : void result.createMembership({
                  personId: result.id,
                  teamId: team.id,
                  position: "Member",
                })
          )
        );
      }
      for (const captainOfTeam of input.captainOf ?? []) {
        promises.push(
          TeamModel.findByUuid(captainOfTeam).then((team) =>
            team == null
              ? Promise.reject(
                  new DetailedError(ErrorCode.NotFound, "Team not found")
                )
              : void result.createMembership({
                  personId: result.id,
                  teamId: team.id,
                  position: "Captain",
                })
          )
        );
      }

      await Promise.all(promises);

      return CreatePersonResponse.newCreated(result.toResource(), result.uuid);
    });
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
  @Mutation(() => GetPersonResponse, { name: "setPerson" })
  async set(
    @Arg("uuid") id: string,
    @Arg("input") input: SetPersonInput
  ): Promise<GetPersonResponse> {
    const row = await PersonModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    return sequelizeDb.transaction(async () => {
      const updateAttributes: Partial<PersonModel> = {};
      if (input.name) {
        updateAttributes.name = input.name;
      }
      if (input.linkblue) {
        updateAttributes.linkblue = input.linkblue.toLowerCase();
      }
      if (input.role) {
        updateAttributes.dbRole = input.role.dbRole;
        updateAttributes.committeeRole = input.role.committeeRole;
        updateAttributes.committeeName = input.role.committeeIdentifier;
      }

      await row.update(updateAttributes);

      const promises: Promise<void>[] = [];
      const memberships = await row.getMemberships({
        where: { position: "Captain" },
        scope: "withTeam",
      });

      for (const membership of memberships) {
        if (!membership.team) {
          throw new DetailedError(
            ErrorCode.InternalFailure,
            "Membership has no accessible team"
          );
        }
        if (membership.position === MembershipPositionType.Captain) {
          if (
            input.captainOf != null &&
            !input.captainOf.includes(membership.team.uuid)
          ) {
            promises.push(membership.destroy());
          }
        } else if (
          input.memberOf != null &&
          !input.memberOf.includes(membership.team.uuid)
        ) {
          promises.push(membership.destroy());
        }
      }

      if (input.captainOf != null) {
        for (const captainOfTeam of input.captainOf) {
          if (
            !memberships.some(
              (membership) =>
                membership.team!.uuid === captainOfTeam &&
                membership.position === MembershipPositionType.Captain
            )
          ) {
            promises.push(
              TeamModel.findByUuid(captainOfTeam).then((team) =>
                team == null
                  ? Promise.reject(
                      new DetailedError(ErrorCode.NotFound, "Team not found")
                    )
                  : row
                      .createMembership({
                        personId: row.id,
                        teamId: team.id,
                        position: "Captain",
                      })
                      .then()
              )
            );
          }
        }
      }

      if (input.memberOf != null) {
        for (const memberOfTeam of input.memberOf) {
          if (
            !memberships.some(
              (membership) =>
                membership.team!.uuid === memberOfTeam &&
                membership.position === MembershipPositionType.Member
            )
          ) {
            promises.push(
              TeamModel.findByUuid(memberOfTeam).then((team) =>
                team == null
                  ? Promise.reject(
                      new DetailedError(ErrorCode.NotFound, "Team not found")
                    )
                  : row
                      .createMembership({
                        personId: row.id,
                        teamId: team.id,
                        position: "Member",
                      })
                      .then()
              )
            );
          }
        }
      }

      await Promise.all(promises);

      return GetPersonResponse.newOk(row.toResource());
    });
  }

  @AccessLevelAuthorized(AccessLevel.Committee)
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

  @AccessLevelAuthorized(AccessLevel.Committee)
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

  @AccessLevelAuthorized(AccessLevel.Committee)
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
