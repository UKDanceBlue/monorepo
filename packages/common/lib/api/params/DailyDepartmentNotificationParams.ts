import { LocalDateResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { DailyDepartmentNotificationNode } from "../resources/DailyDepartmentNotification.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

export interface DDNInit {
  division?: string | undefined;
  department?: string | undefined;
  effectiveDate?: LocalDate | undefined;
  processDate?: LocalDate | undefined;
  pledgedDate?: LocalDate | undefined;
  transactionDate?: LocalDate | undefined;
  transactionType: string;
  donor1Amount?: number | undefined;
  donor2Amount?: number | undefined;
  combinedAmount: number;
  pledgedAmount: number;
  accountNumber: string;
  accountName: string;
  holdingDestination?: string | undefined;
  comment?: string | undefined;
  secShares?: string | undefined;
  secType?: string | undefined;
  gikType?: string | undefined;
  gikDescription?: string | undefined;
  onlineGift: boolean;
  solicitationCode: string;
  solicitation?: string | undefined;
  behalfHonorMemorial?: string | undefined;
  matchingGift?: string | undefined;
  batchId: string;
  ukFirstGift: boolean;
  divFirstGift: boolean;
  idSorter: string;
  combinedDonorName: string;
  combinedDonorSalutation: string;
  combinedDonorSort?: string | undefined;
  donor1Id?: string | undefined;
  donor1GiftKey?: number | undefined;
  donor1Name?: string | undefined;
  donor1Deceased?: boolean | undefined;
  donor1Constituency?: string | undefined;
  donor1TitleBar?: string | undefined;
  donor1Pm?: string | undefined;
  donor1Degrees?: string | undefined;
  donor2Id?: string | undefined;
  donor2GiftKey?: number | undefined;
  donor2Name?: string | undefined;
  donor2Deceased?: boolean | undefined;
  donor2Constituency?: string | undefined;
  donor2TitleBar?: string | undefined;
  donor2Pm?: string | undefined;
  donor2Degrees?: string | undefined;
  donor1Relation?: string | undefined;
  donor2Relation?: string | undefined;
  transmittalSn?: string | undefined;
  sapDocNum?: string | undefined;
  sapDocDate?: LocalDate | undefined;
  jvDocNum?: string | undefined;
  jvDocDate?: LocalDate | undefined;
  advFeeCcPhil?: string | undefined;
  advFeeAmtPhil?: number | undefined;
  advFeeCcUnit?: string | undefined;
  advFeeAmtUnit?: number | undefined;
  advFeeStatus?: string | undefined;
  hcUnit?: string | undefined;
}

@ObjectType("ListDailyDepartmentNotificationsResponse", {
  implements: AbstractGraphQLPaginatedResponse<
    DailyDepartmentNotificationNode[]
  >,
})
export class ListDailyDepartmentNotificationsResponse extends AbstractGraphQLPaginatedResponse<DailyDepartmentNotificationNode> {
  @Field(() => [DailyDepartmentNotificationNode])
  data!: DailyDepartmentNotificationNode[];
}

@InputType()
export class DailyDepartmentNotificationInput implements DDNInit {
  @Field(() => String, { nullable: true })
  division?: string | undefined;

  @Field(() => String, { nullable: true })
  department?: string | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  effectiveDate?: LocalDate | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  processDate?: LocalDate | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  pledgedDate?: LocalDate | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  transactionDate?: LocalDate | undefined;

  @Field(() => String)
  transactionType!: string;

  @Field(() => Number, { nullable: true })
  donor1Amount?: number | undefined;

  @Field(() => Number, { nullable: true })
  donor2Amount?: number | undefined;

  @Field(() => Number)
  combinedAmount!: number;

  @Field(() => Number)
  pledgedAmount!: number;

  @Field(() => String)
  accountNumber!: string;

  @Field(() => String)
  accountName!: string;

  @Field(() => String, { nullable: true })
  holdingDestination?: string | undefined;

  @Field(() => String, { nullable: true })
  comment?: string | undefined;

  @Field(() => String, { nullable: true })
  secShares?: string | undefined;

  @Field(() => String, { nullable: true })
  secType?: string | undefined;

  @Field(() => String, { nullable: true })
  gikType?: string | undefined;

  @Field(() => String, { nullable: true })
  gikDescription?: string | undefined;

  @Field(() => Boolean)
  onlineGift!: boolean;

  @Field(() => String)
  solicitationCode!: string;

  @Field(() => String, { nullable: true })
  solicitation?: string | undefined;

  @Field(() => String, { nullable: true })
  behalfHonorMemorial?: string | undefined;

  @Field(() => String, { nullable: true })
  matchingGift?: string | undefined;

  @Field(() => String)
  batchId!: string;

  @Field(() => Boolean)
  ukFirstGift!: boolean;

  @Field(() => Boolean)
  divFirstGift!: boolean;

  @Field(() => String)
  idSorter!: string;

  @Field(() => String)
  combinedDonorName!: string;

  @Field(() => String)
  combinedDonorSalutation!: string;

  @Field(() => String, { nullable: true })
  combinedDonorSort?: string | undefined;
}

@ArgsType()
export class ListDailyDepartmentNotificationsArgs extends FilteredListQueryArgs<
  never,
  never,
  never,
  never,
  never,
  never
>("DailyDepartmentNotificationResolver", {
  all: [],
}) {}
