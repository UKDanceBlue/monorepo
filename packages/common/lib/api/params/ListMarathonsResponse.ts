import { DateTime } from "luxon";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import type { MarathonYearString } from "../../utility/primitive/SimpleTypes.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { MarathonNode } from "../resources/Marathon.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import { MarathonYearScalar } from "../scalars/MarathonYear.js";
import {
  IsAfterDateTime,
  IsBeforeDateTime,
} from "../validation/beforeAfter.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ObjectType("ListMarathonsResponse", {
  implements: AbstractGraphQLPaginatedResponse<MarathonNode[]>,
})
export class ListMarathonsResponse extends AbstractGraphQLPaginatedResponse<MarathonNode> {
  @Field(() => [MarathonNode], { nullable: false })
  data!: MarathonNode[];
}

@InputType()
export class CreateMarathonInput {
  @Field(() => MarathonYearScalar, { nullable: false })
  year!: MarathonYearString;

  @IsBeforeDateTime("endDate")
  @Field(() => DateTimeScalar, { nullable: true })
  startDate?: DateTime | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: DateTime | undefined | null;
}

@InputType()
export class SetMarathonInput {
  @Field(() => MarathonYearScalar, { nullable: false })
  year!: MarathonYearString;

  @IsBeforeDateTime("endDate")
  @Field(() => DateTimeScalar, { nullable: true })
  startDate?: DateTime | undefined | null;

  @IsAfterDateTime("startDate")
  @Field(() => DateTimeScalar, { nullable: true })
  endDate?: DateTime | undefined | null;
}

@ArgsType()
export class ListMarathonsArgs extends FilteredListQueryArgs(
  "MarathonResolver",
  ["year", "startDate", "endDate", "createdAt", "updatedAt"]
) {}
