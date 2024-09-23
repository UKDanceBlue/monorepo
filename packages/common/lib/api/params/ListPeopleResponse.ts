import { EmailAddressResolver } from "graphql-scalars";
import { ObjectType, Field, InputType, ArgsType } from "type-graphql";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";
import { PersonNode } from "../resources/Person.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import {
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../../authorization/structures.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";

@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonNode>,
})
export class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonNode> {
  @Field(() => [PersonNode])
  data!: PersonNode[];
}

@InputType()
class MemberOf {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => CommitteeRole, { nullable: true })
  committeeRole?: CommitteeRole | null | undefined;
}

@ArgsType()
export class ListPeopleArgs extends FilteredListQueryArgs<
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
export class CreatePersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver)
  email!: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => DbRole, {
    nullable: true,
    deprecationReason: "DBRole can no longer be set directly",
  })
  dbRole?: DbRole;

  @Field(() => [MemberOf], { defaultValue: [] })
  memberOf?: MemberOf[];

  @Field(() => [MemberOf], { defaultValue: [] })
  captainOf?: MemberOf[];
}
@InputType()
export class SetPersonInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  linkblue?: string;

  @Field(() => [MemberOf], { nullable: true })
  memberOf?: MemberOf[];

  @Field(() => [MemberOf], { nullable: true })
  captainOf?: MemberOf[];
}
@InputType()
export class BulkPersonInput {
  @Field(() => String)
  name!: string;

  @Field(() => EmailAddressResolver)
  email!: string;

  @Field(() => String)
  linkblue!: string;

  @Field(() => CommitteeIdentifier, { nullable: true })
  committee!: CommitteeIdentifier | null | undefined;

  @Field(() => CommitteeRole, { nullable: true })
  role!: CommitteeRole | null | undefined;
}
