import { LocalDateResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { DailyDepartmentNotificationNode } from "../resources/DailyDepartmentNotification.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

export interface DDNInit {
  division?: string;
  department?: string;
  effectiveDate?: LocalDate;
  processDate?: LocalDate;
  pledgedDate?: LocalDate;
  transactionDate?: LocalDate;
  transactionType: string;
  donor1Amount?: number;
  donor2Amount?: number;
  combinedAmount: number;
  pledgedAmount: number;
  accountNumber: string;
  accountName: string;
  holdingDestination?: string;
  comment?: string;
  secShares?: string;
  secType?: string;
  gikType?: string;
  gikDescription?: string;
  onlineGift: boolean;
  solicitationCode?: string;
  solicitation?: string;
  behalfHonorMemorial?: string;
  matchingGift?: string;
  batchId: string;
  ukFirstGift: boolean;
  divFirstGift: boolean;
  idSorter: string;
  combinedDonorName: string;
  combinedDonorSalutation: string;
  combinedDonorSort?: string;
  donor1Id?: string;
  donor1GiftKey?: number;
  donor1Name?: string;
  donor1Deceased?: boolean;
  donor1Constituency?: string;
  donor1TitleBar?: string;
  donor1Pm?: string;
  donor1Degrees?: string;
  donor2Id?: string;
  donor2GiftKey?: number;
  donor2Name?: string;
  donor2Deceased?: boolean;
  donor2Constituency?: string;
  donor2TitleBar?: string;
  donor2Pm?: string;
  donor2Degrees?: string;
  donor1Relation?: string;
  donor2Relation?: string;
  transmittalSn?: string;
  sapDocNum?: string;
  sapDocDate?: LocalDate;
  jvDocNum?: string;
  jvDocDate?: LocalDate;
  advFeeCcPhil?: string;
  advFeeAmtPhil?: number;
  advFeeCcUnit?: string;
  advFeeAmtUnit?: number;
  advFeeStatus?: string;
  hcUnit?: string;
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

  @Field(() => String, { nullable: true })
  solicitationCode?: string | undefined;

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
