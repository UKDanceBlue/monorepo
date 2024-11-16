import { LocalDateResolver } from "graphql-scalars";
import { Err, Ok, Result } from "ts-results-es";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { Resource } from "./Resource.js";
import { SolicitationCodeNode } from "./SolicitationCode.js";

export const BatchType = {
  /**
   * Check batches (C) include gifts to UK mailed directly to the Office of Development or to Gift Receiving, generally response to a phonathon solicitation
   */
  Check: "Check",
  /**
   * Transmittal batches (T) include gifts to UK mailed directly to another department.
   */
  Transmittal: "Transmittal",
  /**
   * Credit Card batches (D) include credit card gifts approved by Gift Receiving office or Phonathon/Annual Giving, those made by a donor through the Office of Development online giving page, or by recurring subscription
   */
  CreditCard: "CreditCard",
  /**
   * ACH batches (A) include gifts set-up by the Gift Receiving office as a recurring subscription
   */
  ACH: "ACH",
  /**
   * Non-cash batches (N) include any gift to UK that is not received, processed or approved by the Gift Receiving office – gift was deposited by another department or gift-in-kind
   */
  NonCash: "NonCash",
  /**
   * Payroll Deduction batches (X) include gifts from UK employees through bi-weekly or monthly payroll deductions
   */
  PayrollDeduction: "PayrollDeduction",
  /**
   * Fallback batch type for when the batch type is unknown
   */
  Unknown: "Unknown",
} as const;
export type BatchType = keyof typeof BatchType;

registerEnumType(BatchType, {
  name: "BatchType",
});

export function extractDDNBatchType(
  batchId: string
): Result<BatchType, string> {
  let code = "";
  for (let i = batchId.length - 1; i >= 0; i--) {
    const letter = batchId[i];
    if (!letter) {
      return Err(batchId);
    }
    // Skip anything that isn't an uppercase letter
    if (letter < "A" || letter > "Z") {
      if (code.length > 0) {
        break;
      } else {
        continue;
      }
    }
    code = letter + code;
  }
  return (BatchType[code as keyof typeof BatchType] as BatchType | undefined)
    ? Ok(BatchType[code as keyof typeof BatchType])
    : Err(code);
}

@ObjectType()
export class DailyDepartmentNotificationNode extends Resource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String, { nullable: true })
  division?: string;

  @Field(() => String, { nullable: true })
  department?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  effectiveDate?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  processDate?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  pledgedDate?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  transactionDate?: string;

  @Field(() => String)
  transactionType!: string;

  @Field(() => Number, { nullable: true })
  donor1Amount?: number;

  @Field(() => Number, { nullable: true })
  donor2Amount?: number;

  @Field(() => Number)
  combinedAmount!: number;

  @Field(() => Number)
  pledgedAmount!: number;

  @Field(() => String)
  accountNumber!: string;

  @Field(() => String)
  accountName!: string;

  @Field(() => String, { nullable: true })
  holdingDestination?: string;

  @Field(() => String, { nullable: true })
  comment?: string;

  @Field(() => String, { nullable: true })
  secShares?: string;

  @Field(() => String, { nullable: true })
  secType?: string;

  @Field(() => String, { nullable: true })
  gikType?: string;

  @Field(() => String, { nullable: true })
  gikDescription?: string;

  @Field(() => Boolean)
  onlineGift!: boolean;

  @Field(() => SolicitationCodeNode)
  solicitationCode!: SolicitationCodeNode;

  @Field(() => String, { nullable: true })
  solicitation?: string;

  @Field(() => String, { nullable: true })
  behalfHonorMemorial?: string;

  @Field(() => String, { nullable: true })
  matchingGift?: string;

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
  combinedDonorSort?: string;

  @Field(() => String, { nullable: true })
  donor1Id?: string;

  @Field(() => String, { nullable: true })
  donor1GiftKey?: string;

  @Field(() => String, { nullable: true })
  donor1Name?: string;

  @Field(() => Boolean, { nullable: true })
  donor1Deceased?: boolean;

  @Field(() => String, { nullable: true })
  donor1Constituency?: string;

  @Field(() => String, { nullable: true })
  donor1TitleBar?: string;

  @Field(() => String, { nullable: true })
  donor1Pm?: string;

  @Field(() => String, { nullable: true })
  donor1Degrees?: string;

  @Field(() => String, { nullable: true })
  donor2Id?: string;

  @Field(() => String, { nullable: true })
  donor2GiftKey?: string;

  @Field(() => String, { nullable: true })
  donor2Name?: string;

  @Field(() => Boolean, { nullable: true })
  donor2Deceased?: boolean;

  @Field(() => String, { nullable: true })
  donor2Constituency?: string;

  @Field(() => String, { nullable: true })
  donor2TitleBar?: string;

  @Field(() => String, { nullable: true })
  donor2Pm?: string;

  @Field(() => String, { nullable: true })
  donor2Degrees?: string;

  @Field(() => String, { nullable: true })
  donor1Relation?: string;

  @Field(() => String, { nullable: true })
  donor2Relation?: string;

  @Field(() => String, { nullable: true })
  transmittalSn?: string;

  @Field(() => String, { nullable: true })
  sapDocNum?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  sapDocDate?: string;

  @Field(() => String, { nullable: true })
  jvDocNum?: string;

  @Field(() => LocalDateResolver, { nullable: true })
  jvDocDate?: string;

  @Field(() => String, { nullable: true })
  advFeeCcPhil?: string;

  @Field(() => Number, { nullable: true })
  advFeeAmtPhil?: number;

  @Field(() => String, { nullable: true })
  advFeeCcUnit?: string;

  @Field(() => Number, { nullable: true })
  advFeeAmtUnit?: number;

  @Field(() => String, { nullable: true })
  advFeeStatus?: string;

  @Field(() => String, { nullable: true })
  hcUnit?: string;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    division?: string;
    department?: string;
    effectiveDate?: string;
    processDate?: string;
    pledgedDate?: string;
    transactionDate?: string;
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
    solicitationCode: string;
    solicitation?: string;
    behalfHonorMemorial?: string;
    matchingGift?: string;
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
    sapDocDate?: string;
    jvDocNum?: string;
    jvDocDate?: string;
    advFeeCcPhil?: string;
    advFeeAmtPhil?: number;
    advFeeCcUnit?: string;
    advFeeAmtUnit?: number;
    advFeeStatus?: string;
    hcUnit?: string;
  }) {
    return DailyDepartmentNotificationNode.createInstance().withValues({
      ...init,
      id: init.idSorter,
    });
  }
}

@ObjectType()
export class DailyDepartmentNotificationBatchNode extends Resource {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => BatchType)
  batchType!: BatchType;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: { batchId: string; batchType: BatchType }) {
    return DailyDepartmentNotificationBatchNode.createInstance().withValues({
      id: init.batchId,
      batchType: init.batchType,
    });
  }
}
