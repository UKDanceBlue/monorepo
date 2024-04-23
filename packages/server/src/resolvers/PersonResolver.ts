import {
  AccessControl,
  AccessLevel,
  DetailedError,
  ErrorCode,
  FilteredListQueryArgs,
  MembershipNode,
  MembershipPositionType,
  PersonNode,
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

import { auditLogger } from "../lib/logging/auditLogging.js";
import { membershipModelToResource } from "../repositories/membership/membershipModelToResource.js";
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
  implements: AbstractGraphQLCreatedResponse<PersonNode>,
})
class CreatePersonResponse extends AbstractGraphQLCreatedResponse<PersonNode> {
  @Field(() => PersonNode)
  data!: PersonNode;
}
@ObjectType("GetPersonResponse", {
  implements: AbstractGraphQLOkResponse<PersonNode>,
})
class GetPersonResponse extends AbstractGraphQLOkResponse<PersonNode | null> {
  @Field(() => PersonNode, { nullable: true })
  data!: PersonNode | null;
}
@ObjectType("GetPeopleResponse", {
  implements: AbstractGraphQLArrayOkResponse<PersonNode>,
})
class GetPeopleResponse extends AbstractGraphQLArrayOkResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}
@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonNode>,
})
class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}
@ObjectType("DeletePersonResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePersonResponse extends AbstractGraphQLOkResponse<never> {}

@ArgsType()
class ListPeopleArgs extends FilteredListQueryArgs<
  "name" | "email" | "linkblue" | "committeeRole" | "committeeName" | "dbRole",
  "name" | "email" | "linkblue",
  "committeeRole" | "committeeName" | "dbRole",
  never,
  never,
  never
>("PersonResolver", {
  all: [
    "name",
    "email",
    "linkblue",
    "committeeRole",
    "committeeName",
    "dbRole",
  ],
  string: ["name", "email", "linkblue"],
  oneOf: ["committeeRole", "committeeName", "dbRole"],
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

@Resolver(() => PersonNode)
@Service()
export class PersonResolver {
  constructor(private personRepository: PersonRepository) {}

  @Query(() => GetPersonResponse, { name: "person" })
  async getByUuid(@Arg("uuid") uuid: string): Promise<GetPersonResponse> {
    const row = await this.personRepository.findPersonByUuid(uuid);

    if (row == null) {
      return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
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
      return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
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
            ? (args.page - 1) * args.pageSize
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
    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
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
    const row = await this.personRepository.updatePerson(
      {
        uuid: id,
      },
      {
        name: input.name,
        email: input.email,
        linkblue: input.linkblue,
        committeeRole: input.role?.committeeRole,
        committeeName: input.role?.committeeIdentifier,
        memberOf: input.memberOf?.map((uuid) => ({ uuid })),
        captainOf: input.captainOf?.map((uuid) => ({ uuid })),
      }
    );

    if (row == null) {
      return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
        null
      );
    }

    return GetPersonResponse.newOk<PersonNode | null, GetPersonResponse>(
      personModelToResource(row)
    );
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @Mutation(() => DeletePersonResponse, { name: "deletePerson" })
  async delete(@Arg("uuid") uuid: string): Promise<DeletePersonResponse> {
    const result = await this.personRepository.deletePerson({ uuid });

    if (result == null) {
      throw new DetailedError(ErrorCode.DatabaseFailure, "Failed to delete");
    }

    auditLogger.sensitive("Person deleted", {
      person: {
        name: result.name,
        email: result.email,
        uuid: result.uuid,
      },
    });

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
  @FieldResolver(() => [MembershipNode])
  async teams(@Root() person: PersonNode): Promise<MembershipNode[]> {
    const models = await this.personRepository.findMembershipsOfPerson({
      uuid: person.uuid,
    });

    if (models == null) {
      return [];
    }

    return models.map((row) => membershipModelToResource(row));
  }

  @AccessControl({ accessLevel: AccessLevel.Committee })
  @FieldResolver(() => [MembershipNode], {
    deprecationReason: "Use teams instead and filter by position",
  })
  async captaincies(@Root() person: PersonNode): Promise<MembershipNode[]> {
    const models = await this.personRepository.findMembershipsOfPerson(
      { uuid: person.uuid },
      { position: MembershipPositionType.Captain }
    );

    if (models == null) {
      return [];
    }

    return models.map((row) => membershipModelToResource(row));
  }
}
