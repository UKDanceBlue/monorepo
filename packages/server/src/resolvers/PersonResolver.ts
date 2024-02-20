import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
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

import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

import {
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";
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
export class PersonResolver {
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
      personModelToResource(row)
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
      personModelToResource(row)
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
      data: rows.map((row) => personModelToResource(row)),
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
      rows.map((row) => personModelToResource(row))
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Mutation(() => CreatePersonResponse, { name: "createPerson" })
  async create(
    @Arg("input") input: CreatePersonInput
  ): Promise<CreatePersonResponse> {
    const person = await this.personRepository.createPerson({
      name: input.name,
      email: input.email,
      linkblue: input.linkblue,
      dbRole: input.role?.dbRole,
      committeeRole: input.role?.committeeRole,
      committeeName: input.role?.committeeIdentifier,
    });

    return CreatePersonResponse.newCreated(
      personModelToResource(person),
      person.uuid
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Mutation(() => GetPersonResponse, { name: "setPerson" })
  async set(
    @Arg("uuid") id: string,
    @Arg("input") input: SetPersonInput
  ): Promise<GetPersonResponse> {
    const row = await this.personRepository.updatePerson({
      uuid: id,
      name: input.name,
      email: input.email,
      linkblue: input.linkblue,
      dbRole: input.role?.dbRole,
      committeeRole: input.role?.committeeRole,
      committeeName: input.role?.committeeIdentifier,
    });

    if (row == null) {
      return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonResource | null, GetPersonResponse>(
      personModelToResource(row)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Mutation(() => DeletePersonResponse, { name: "deletePerson" })
  async delete(@Arg("uuid") id: string): Promise<DeletePersonResponse> {
    const row = await this.personRepository.findPersonByUuid(id);

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "Person not found");
    }

    const result = await this.personRepository.deletePerson(row);

    if (result == null) {
      throw new DetailedError(ErrorCode.DatabaseFailure, "Failed to delete");
    }

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
