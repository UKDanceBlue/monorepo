import type { Person } from "@prisma/client";
import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  MembershipPositionType,
  MembershipResource,
  PersonResource,
  RoleResource,
  SortDirection,
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
import { Service } from "typedi";

import { sequelizeDb } from "../data-source.js";
import { PersonRepository } from "../repositories/person/PersonRepository.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
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
class GetPersonResponse extends AbstractGraphQLOkResponse<PersonResource | null> {
  @Field(() => PersonResource, { nullable: true })
  data!: PersonResource | null;
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
class ListPeopleArgs extends FilteredListQueryArgs<
  "name" | "email" | "linkblue" | "dbRole" | "committeeRole" | "committeeName",
  "name" | "email" | "linkblue",
  "dbRole" | "committeeRole" | "committeeName",
  never,
  never,
  never
>("PersonResolver", {
  all: [
    "name",
    "email",
    "linkblue",
    "dbRole",
    "committeeRole",
    "committeeName",
  ],
  string: ["name", "email", "linkblue"],
  oneOf: ["dbRole", "committeeRole", "committeeName"],
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
@Service()
export class PersonResolver implements ResolverInterface<PersonResource> {
  constructor(private personRepository: PersonRepository) {}

  @Query(() => GetPersonResponse, { name: "person" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetPersonResponse> {
    const row = await this.personRepository.findPersonByUuid(uuid);

    if (row == null) {
      return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
      PersonRepository.personModelToResource(row)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => GetPersonResponse, { name: "personByLinkBlue" })
  async getByLinkBlueId(
    @Arg("linkBlueId") linkBlueId: string
  ): Promise<GetPersonResponse> {
    const row = await this.personRepository.findPersonByLinkblue(linkBlueId);

    if (row == null) {
      return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
      PersonRepository.personModelToResource(row)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Query(() => ListPeopleResponse, { name: "listPeople" })
  async list(
    @Args(() => ListPeopleArgs) args: ListPeopleArgs
  ): Promise<ListPeopleResponse> {
    const [rows, total] = await Promise.all([
      this.personRepository.listPeople({
        filters: args.filters,
        order:
          args.sortBy?.map((key, i) => [
            key,
            args.sortDirection?.[i] ?? SortDirection.DESCENDING,
          ]) ?? [],
        skip:
          args.page != null && args.pageSize != null
            ? args.page * args.pageSize
            : null,
        take: args.pageSize,
      }),
      this.personRepository.countPeople({ filters: args.filters }),
    ]);

    return ListPeopleResponse.newPaginated({
      data: rows.map((row) => PersonRepository.personModelToResource(row)),
      total,
      page: args.page,
      pageSize: args.pageSize,
    });
  }

  @Query(() => GetPersonResponse, { name: "me" })
  me(@Ctx() ctx: Context.GraphQLContext): GetPersonResponse | null {
    return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
      ctx.authenticatedUser
    );
  }

  @Query(() => GetPeopleResponse, { name: "searchPeopleByName" })
  async searchByName(@Arg("name") name: string): Promise<GetPeopleResponse> {
    const rows = await this.personRepository.searchByName(name);

    return GetPeopleResponse.newOk(
      rows.map((row) => PersonRepository.personModelToResource(row))
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    return sequelizeDb.transaction(async () => {
      const creationAttributes: Partial<Person> = {};
      if (input.name) {
        creationAttributes.name = input.name;
      }
      if (input.linkblue) {
        creationAttributes.linkblue = input.linkblue.toLowerCase();
      }
      if (input.role) {
        creationAttributes.committeeRole = input.role.committeeRole;
        creationAttributes.committeeName = input.role.committeeIdentifier;
      }

      // const result = await PersonModel.create({
      //   email: input.email,
      //   ...creationAttributes,
      //   authIds: {},
      // });

      // const promises: Promise<void>[] = [];
      // for (const memberOfTeam of input.memberOf ?? []) {
      //   promises.push(
      //     TeamModel.findByUuid(memberOfTeam).then((team) =>
      //       team == null
      //         ? Promise.reject(
      //             new DetailedError(ErrorCode.NotFound, "Team not found")
      //           )
      //         : result
      //             .createMembership({
      //               personId: result.id,
      //               teamId: team.id,
      //               position: "Member",
      //             })
      //             .then()
      //     )
      //   );
      // }
      // for (const captainOfTeam of input.captainOf ?? []) {
      //   promises.push(
      //     TeamModel.findByUuid(captainOfTeam).then((team) =>
      //       team == null
      //         ? Promise.reject(
      //             new DetailedError(ErrorCode.NotFound, "Team not found")
      //           )
      //         : result
      //             .createMembership({
      //               personId: result.id,
      //               teamId: team.id,
      //               position: "Captain",
      //             })
      //             .then()
      //     )
      //   );
      // }

      // await Promise.all(promises);

      // return CreatePersonResponse.newCreated(
      //   await result.toResource(),
      //   result.uuid
      // );

      const person = await this.personRepository.createPerson({
        name: input.name,
        email: input.email,
        linkblue: input.linkblue,
        dbRole: "User",
        committeeRole: "Member",
        committeeName: "General",
        authIds: [],
      });
    });
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
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
        updateAttributes.committeeRole = input.role.committeeRole;
        updateAttributes.committeeName = input.role.committeeIdentifier;
      }

      await row.update(updateAttributes);

      const promises: Promise<void>[] = [];
      const memberships = await row.getMemberships({
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
                        position: MembershipPositionType.Captain,
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
                        position: MembershipPositionType.Member,
                      })
                      .then()
              )
            );
          }
        }
      }

      await Promise.all(promises);

      return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
        await row.toResource()
      );
    });
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
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

  @AccessControl(
    { accessLevel: AccessLevel.Committee },
    {
      rootMatch: [
        {
          root: "uuid",
          extractor: (userData) => userData.userId,
        },
      ],
    }
  )
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

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @FieldResolver(() => [MembershipResource], {
    deprecationReason: "Use teams instead and filter by position",
  })
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
