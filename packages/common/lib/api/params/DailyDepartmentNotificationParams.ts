import { GraphQLLocalDate, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import type { LocalDate } from "../../utility/time/localDate.js";
import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { DailyDepartmentNotificationNode } from "../resources/DailyDepartmentNotification.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

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
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  division?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  department?: string | undefined;

  @Field(() => GraphQLLocalDate, { nullable: true })
  effectiveDate?: LocalDate | undefined;

  @Field(() => GraphQLLocalDate)
  processDate!: LocalDate;

  @Field(() => GraphQLLocalDate, { nullable: true })
  pledgedDate?: LocalDate | undefined;

  @Field(() => GraphQLLocalDate, { nullable: true })
  transactionDate?: LocalDate | undefined;

  @Field(() => GraphQLNonEmptyString)
  transactionType!: string;

  @Field(() => Number, { nullable: true })
  donor1Amount?: number | undefined;

  @Field(() => Number, { nullable: true })
  donor2Amount?: number | undefined;

  @Field(() => Number)
  combinedAmount!: number;

  @Field(() => Number)
  pledgedAmount!: number;

  @Field(() => GraphQLNonEmptyString)
  accountNumber!: string;

  @Field(() => GraphQLNonEmptyString)
  accountName!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  holdingDestination?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  comment?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  secShares?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  secType?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  gikType?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  gikDescription?: string | undefined;

  @Field(() => Boolean)
  onlineGift!: boolean;

  @Field(() => GraphQLNonEmptyString)
  solicitationCode!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  solicitation?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  behalfHonorMemorial?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  matchingGift?: string | undefined;

  @Field(() => GraphQLNonEmptyString)
  batchId!: string;

  @Field(() => Boolean)
  ukFirstGift!: boolean;

  @Field(() => Boolean)
  divFirstGift!: boolean;

  @Field(() => GraphQLNonEmptyString)
  idSorter!: string;

  @Field(() => GraphQLNonEmptyString)
  combinedDonorName!: string;

  @Field(() => GraphQLNonEmptyString)
  combinedDonorSalutation!: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  combinedDonorSort?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Id?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1GiftKey?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Name?: string | undefined;

  @Field(() => Boolean, { nullable: true })
  donor1Deceased?: boolean | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Constituency?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1TitleBar?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Pm?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Degrees?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Id?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2GiftKey?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Name?: string | undefined;

  @Field(() => Boolean, { nullable: true })
  donor2Deceased?: boolean | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Constituency?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2TitleBar?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Pm?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Degrees?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor1Relation?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  donor2Relation?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  transmittalSn?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  sapDocNum?: string | undefined;

  @Field(() => GraphQLLocalDate, { nullable: true })
  sapDocDate?: LocalDate | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  jvDocNum?: string | undefined;

  @Field(() => GraphQLLocalDate, { nullable: true })
  jvDocDate?: LocalDate | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  advFeeCcPhil?: string | undefined;

  @Field(() => Number, { nullable: true })
  advFeeAmtPhil?: number | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  advFeeCcUnit?: string | undefined;

  @Field(() => Number, { nullable: true })
  advFeeAmtUnit?: number | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  advFeeStatus?: string | undefined;

  @Field(() => GraphQLNonEmptyString, { nullable: true })
  hcUnit?: string | undefined;
}

@ArgsType()
export class ListDailyDepartmentNotificationsArgs extends FilteredListQueryArgs(
  "DailyDepartmentNotificationResolver",
  [
    "Amount",
    "Donor",
    "Comment",
    "SolicitationCodeName",
    "SolicitationCodeNumber",
    "SolicitationCodePrefix",
    "BatchType",
    "createdAt",
    "combinedDonorName",
    "combinedAmount",
    "comment",
    "solicitationCode",
    "batch",
  ]
) {}
