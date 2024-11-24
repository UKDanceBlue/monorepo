import { LocalDateResolver, NonEmptyStringResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import type { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { DailyDepartmentNotificationNode } from "../resources/DailyDepartmentNotification.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

export interface DDNInit {
  division?: string | undefined;
  department?: string | undefined;
  effectiveDate?: LocalDate | undefined;
  processDate: LocalDate;
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
  donor1GiftKey?: string | undefined;
  donor1Name?: string | undefined;
  donor1Deceased?: boolean | undefined;
  donor1Constituency?: string | undefined;
  donor1TitleBar?: string | undefined;
  donor1Pm?: string | undefined;
  donor1Degrees?: string | undefined;
  donor2Id?: string | undefined;
  donor2GiftKey?: string | undefined;
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
  email?: string | undefined;
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
  @Field(() => NonEmptyStringResolver, { nullable: true })
  division?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  department?: string | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  effectiveDate?: LocalDate | undefined;

  @Field(() => LocalDateResolver)
  processDate!: LocalDate;

  @Field(() => LocalDateResolver, { nullable: true })
  pledgedDate?: LocalDate | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  transactionDate?: LocalDate | undefined;

  @Field(() => NonEmptyStringResolver)
  transactionType!: string;

  @Field(() => Number, { nullable: true })
  donor1Amount?: number | undefined;

  @Field(() => Number, { nullable: true })
  donor2Amount?: number | undefined;

  @Field(() => Number)
  combinedAmount!: number;

  @Field(() => Number)
  pledgedAmount!: number;

  @Field(() => NonEmptyStringResolver)
  accountNumber!: string;

  @Field(() => NonEmptyStringResolver)
  accountName!: string;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  holdingDestination?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  comment?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  secShares?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  secType?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  gikType?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  gikDescription?: string | undefined;

  @Field(() => Boolean)
  onlineGift!: boolean;

  @Field(() => NonEmptyStringResolver)
  solicitationCode!: string;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  solicitation?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  behalfHonorMemorial?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  matchingGift?: string | undefined;

  @Field(() => NonEmptyStringResolver)
  batchId!: string;

  @Field(() => Boolean)
  ukFirstGift!: boolean;

  @Field(() => Boolean)
  divFirstGift!: boolean;

  @Field(() => NonEmptyStringResolver)
  idSorter!: string;

  @Field(() => NonEmptyStringResolver)
  combinedDonorName!: string;

  @Field(() => NonEmptyStringResolver)
  combinedDonorSalutation!: string;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  combinedDonorSort?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Id?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1GiftKey?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Name?: string | undefined;

  @Field(() => Boolean, { nullable: true })
  donor1Deceased?: boolean | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Constituency?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1TitleBar?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Pm?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Degrees?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Id?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2GiftKey?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Name?: string | undefined;

  @Field(() => Boolean, { nullable: true })
  donor2Deceased?: boolean | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Constituency?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2TitleBar?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Pm?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Degrees?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor1Relation?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  donor2Relation?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  transmittalSn?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  sapDocNum?: string | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  sapDocDate?: LocalDate | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  jvDocNum?: string | undefined;

  @Field(() => LocalDateResolver, { nullable: true })
  jvDocDate?: LocalDate | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  advFeeCcPhil?: string | undefined;

  @Field(() => Number, { nullable: true })
  advFeeAmtPhil?: number | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  advFeeCcUnit?: string | undefined;

  @Field(() => Number, { nullable: true })
  advFeeAmtUnit?: number | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  advFeeStatus?: string | undefined;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  hcUnit?: string | undefined;
}

@ArgsType()
export class ListDailyDepartmentNotificationsArgs extends FilteredListQueryArgs<
  | "Amount"
  | "Donor"
  | "Comment"
  | "SolicitationCodeName"
  | "SolicitationCodeNumber"
  | "SolicitationCodePrefix"
  | "BatchType",
  "Donor" | "Comment" | "SolicitationCodeName",
  "SolicitationCodePrefix" | "SolicitationCodeNumber" | "BatchType",
  "Amount",
  never,
  never
>("DailyDepartmentNotificationResolver", {
  all: [
    "Amount",
    "Donor",
    "Comment",
    "SolicitationCodeName",
    "SolicitationCodeNumber",
    "SolicitationCodePrefix",
    "BatchType",
  ],
  string: ["Donor", "Comment", "SolicitationCodeName"],
  numeric: ["Amount"],
  oneOf: ["BatchType", "SolicitationCodePrefix", "SolicitationCodeNumber"],
}) {}
