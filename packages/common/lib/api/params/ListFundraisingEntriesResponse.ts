import { GraphQLScalarType, Kind } from "graphql";
import { GraphQLLocalDate, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, Float, InputType, ObjectType } from "type-graphql";

import { InvalidArgumentError } from "../../error/direct.js";
import type { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { BatchType } from "../resources/DailyDepartmentNotification.js";
import { FundraisingEntryNode } from "../resources/Fundraising.js";
import {
  type GlobalId,
  GlobalIdScalar,
  isGlobalId,
  parseGlobalId,
} from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ArgsType()
export class ListFundraisingEntriesArgs extends FilteredListQueryArgs(
  "FundraisingEntryResolver",
  [
    "donatedOn",
    "amount",
    "amountUnassigned",
    "donatedTo",
    "donatedBy",
    "batchType",
    "createdAt",
    "updatedAt",
    "solicitationCode",
    "solicitationCodeTags",
  ]
) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
export class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}

@InputType("SetFundraisingEntryInput")
export class SetFundraisingEntryInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  notes?: string;

  @Field(() => GlobalIdScalar, { nullable: true })
  solicitationCodeOverrideId?: GlobalId;

  @Field(() => Float, { nullable: true })
  amountOverride?: number;

  @Field(() => GraphQLLocalDate, { nullable: true })
  donatedOnOverride?: LocalDate;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedToOverride?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedByOverride?: string;

  @Field(() => BatchType, { nullable: true })
  batchTypeOverride?: BatchType;
}

const solicitationCodeRegex = /^(?<prefix>[A-Za-z]{2})(?<code>\d{4,})$/;

const SolicitationCodeUpsertScalar = new GraphQLScalarType<
  GlobalId | { code: number; prefix: string },
  string
>({
  name: "SolicitationCodeUpsert",
  description:
    "Either the global id of a solicitation code or a string to create a new one",
  parseValue(value) {
    if (typeof value === "string") {
      const match = solicitationCodeRegex.exec(value);
      if (match?.groups?.prefix && match.groups.code) {
        return {
          prefix: match.groups.prefix,
          code: Number.parseInt(match.groups.code, 10),
        };
      }
      const globalId = parseGlobalId(value);
      if (globalId.isOk()) {
        return globalId.value;
      }
    }
    throw new InvalidArgumentError("Invalid solicitation code");
  },
  serialize(value) {
    return isGlobalId(value)
      ? GlobalIdScalar.serialize(value)
      : `${(value as { code: string; prefix: string }).prefix}${(value as { code: string; prefix: string }).code}`;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return this.parseValue!(ast.value);
    }
    throw new InvalidArgumentError("Invalid solicitation code");
  },
});

@InputType("CreateFundraisingEntryInput")
export class CreateFundraisingEntryInput {
  @Field(() => SolicitationCodeUpsertScalar)
  solicitationCodeId!: GlobalId | { code: number; prefix: string };

  @Field(() => Float)
  amount!: number;

  @Field(() => GraphQLLocalDate, { nullable: true })
  donatedOn?: LocalDate;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedTo?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donatedBy?: string;

  @Field(() => BatchType)
  batchType!: BatchType;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  notes?: string;
}
