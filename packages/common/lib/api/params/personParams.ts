import { IsStrongPassword } from "class-validator";
import { EmailAddressResolver, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import {
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
} from "../../authorization/structures.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { PersonNode } from "../resources/Person.js";
import { type GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ObjectType("ListPeopleResponse", {
  implements: AbstractGraphQLPaginatedResponse<PersonNode>,
})
export class ListPeopleResponse extends AbstractGraphQLPaginatedResponse<PersonNode> {
  @Field(() => [PersonNode], { nullable: false })
  data!: PersonNode[];
}

@InputType()
class MemberOf {
  @Field(() => GlobalIdScalar, { nullable: false })
  id!: GlobalId;

  @Field(() => CommitteeRole, { nullable: true })
  committeeRole?: CommitteeRole | undefined | null;
}

@ArgsType()
export class ListPeopleArgs extends FilteredListQueryArgs("PersonResolver", [
  "name",
  "email",
  "linkblue",
  "committeeRole",
  "committeeName",
]) {}
@InputType()
export class CreatePersonInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver, { nullable: false })
  email!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  linkblue?: string;

  @Field(() => DbRole, {
    nullable: true,
    deprecationReason: "DBRole can no longer be set directly",
  })
  dbRole?: DbRole;

  @Field(() => [MemberOf], { nullable: true })
  memberOf: MemberOf[] = [];

  @Field(() => [MemberOf], { nullable: true })
  captainOf: MemberOf[] = [];
}
@InputType()
export class SetPersonInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name?: string;

  @Field(() => EmailAddressResolver, { nullable: true })
  email?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  linkblue?: string;

  @Field(() => [MemberOf], { nullable: true })
  memberOf?: MemberOf[];

  @Field(() => [MemberOf], { nullable: true })
  captainOf?: MemberOf[];
}
@InputType()
export class BulkPersonInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  name!: string | null | undefined;

  @Field(() => EmailAddressResolver, { nullable: false })
  email!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  linkblue!: string | null | undefined;

  @Field(() => CommitteeIdentifier, { nullable: true })
  committee!: CommitteeIdentifier | null | undefined;

  @Field(() => CommitteeRole, { nullable: true })
  role!: CommitteeRole | null | undefined;
}

@InputType()
export class SetPasswordInput {
  @IsStrongPassword({})
  @Field(() => GraphQLNonEmptyString, {
    nullable: true,
    description:
      "If set to a string, replaces or sets the user's password. If set to null it clears any existing password",
  })
  password?: string | undefined | null;
}
