/* eslint-disable */
import type { AuthSource } from "@ukdanceblue/common";
import type { AccessLevel } from "@ukdanceblue/common";
import type { DbRole } from "@ukdanceblue/common";
import type { CommitteeRole } from "@ukdanceblue/common";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import type { MembershipPositionType } from "@ukdanceblue/common";
import type { TeamLegacyStatus } from "@ukdanceblue/common";
import type { TeamType } from "@ukdanceblue/common";
import type { SortDirection } from "@ukdanceblue/common";
import type { NumericComparator } from "@ukdanceblue/common";
import type { StringComparator } from "@ukdanceblue/common";
import type { BatchType } from "@ukdanceblue/common";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: Date | string; output: Date | string };
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: string; output: string };
  /** GlobalId custom scalar type */
  GlobalId: { input: string; output: string };
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: { input: string; output: string };
  /** A string that cannot be passed as an empty value */
  NonEmptyString: { input: string; output: string };
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: { input: number; output: number };
  /** Integers that will have a value greater than 0. */
  PositiveInt: { input: number; output: number };
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: URL | string; output: URL | string };
  /** Represents NULL values */
  Void: { input: void; output: void };
}

export { AccessLevel };

export interface AssignEntryToPersonInput {
  readonly amount: Scalars["Float"]["input"];
}

export { AuthSource };

export { BatchType };

export interface BulkPersonInput {
  readonly committee?: InputMaybe<CommitteeIdentifier>;
  readonly email: Scalars["EmailAddress"]["input"];
  readonly linkblue: Scalars["NonEmptyString"]["input"];
  readonly name: Scalars["NonEmptyString"]["input"];
  readonly role?: InputMaybe<CommitteeRole>;
}

export interface BulkTeamInput {
  readonly captainLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["NonEmptyString"]["input"]>
  >;
  readonly legacyStatus: TeamLegacyStatus;
  readonly memberLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["NonEmptyString"]["input"]>
  >;
  readonly name: Scalars["NonEmptyString"]["input"];
  readonly type: TeamType;
}

export { CommitteeIdentifier };

export { CommitteeRole };

export interface CreateConfigurationInput {
  readonly key: Scalars["String"]["input"];
  readonly validAfter?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly validUntil?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export interface CreateEventInput {
  readonly description?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly location?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly occurrences: ReadonlyArray<CreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly title: Scalars["NonEmptyString"]["input"];
}

export interface CreateEventOccurrenceInput {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
}

export interface CreateFeedInput {
  readonly imageUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly textContent?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly title: Scalars["NonEmptyString"]["input"];
}

export interface CreateImageInput {
  readonly alt?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly url?: InputMaybe<Scalars["URL"]["input"]>;
}

export interface CreateMarathonHourInput {
  readonly details?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly durationInfo: Scalars["NonEmptyString"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["NonEmptyString"]["input"];
}

export interface CreateMarathonInput {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["NonEmptyString"]["input"];
}

export interface CreatePersonInput {
  readonly captainOf?: ReadonlyArray<MemberOf>;
  /** @deprecated DBRole can no longer be set directly */
  readonly dbRole?: InputMaybe<DbRole>;
  readonly email: Scalars["EmailAddress"]["input"];
  readonly linkblue?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly memberOf?: ReadonlyArray<MemberOf>;
  readonly name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
}

export interface CreatePointEntryInput {
  readonly comment?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly opportunityUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly personFromUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly points: Scalars["Int"]["input"];
  readonly teamUuid: Scalars["GlobalId"]["input"];
}

export interface CreatePointOpportunityInput {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly marathonUuid: Scalars["GlobalId"]["input"];
  readonly name: Scalars["NonEmptyString"]["input"];
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type: TeamType;
}

export interface CreateTeamInput {
  readonly legacyStatus: TeamLegacyStatus;
  readonly name: Scalars["NonEmptyString"]["input"];
  readonly type: TeamType;
}

export interface DailyDepartmentNotificationInput {
  readonly accountName: Scalars["NonEmptyString"]["input"];
  readonly accountNumber: Scalars["NonEmptyString"]["input"];
  readonly advFeeAmtPhil?: InputMaybe<Scalars["Float"]["input"]>;
  readonly advFeeAmtUnit?: InputMaybe<Scalars["Float"]["input"]>;
  readonly advFeeCcPhil?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly advFeeCcUnit?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly advFeeStatus?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly batchId: Scalars["NonEmptyString"]["input"];
  readonly behalfHonorMemorial?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly combinedAmount: Scalars["Float"]["input"];
  readonly combinedDonorName: Scalars["NonEmptyString"]["input"];
  readonly combinedDonorSalutation: Scalars["NonEmptyString"]["input"];
  readonly combinedDonorSort?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly comment?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly department?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly divFirstGift: Scalars["Boolean"]["input"];
  readonly division?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Amount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly donor1Constituency?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Deceased?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly donor1Degrees?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1GiftKey?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Id?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Pm?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1Relation?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor1TitleBar?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Amount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly donor2Constituency?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Deceased?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly donor2Degrees?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2GiftKey?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Id?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Pm?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2Relation?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly donor2TitleBar?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly effectiveDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly gikDescription?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly gikType?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly hcUnit?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly holdingDestination?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly idSorter: Scalars["NonEmptyString"]["input"];
  readonly jvDocDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly jvDocNum?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly matchingGift?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly onlineGift: Scalars["Boolean"]["input"];
  readonly pledgedAmount: Scalars["Float"]["input"];
  readonly pledgedDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly processDate: Scalars["LocalDate"]["input"];
  readonly sapDocDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly sapDocNum?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly secShares?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly secType?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly solicitation?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly solicitationCode: Scalars["NonEmptyString"]["input"];
  readonly transactionDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly transactionType: Scalars["NonEmptyString"]["input"];
  readonly transmittalSn?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly ukFirstGift: Scalars["Boolean"]["input"];
}

export const DailyDepartmentNotificationResolverAllKeys = {
  Amount: "Amount",
  BatchType: "BatchType",
  Comment: "Comment",
  Donor: "Donor",
  SolicitationCodeName: "SolicitationCodeName",
  SolicitationCodeNumber: "SolicitationCodeNumber",
  SolicitationCodePrefix: "SolicitationCodePrefix",
} as const;

export type DailyDepartmentNotificationResolverAllKeys =
  (typeof DailyDepartmentNotificationResolverAllKeys)[keyof typeof DailyDepartmentNotificationResolverAllKeys];
export interface DailyDepartmentNotificationResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: DailyDepartmentNotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface DailyDepartmentNotificationResolverKeyedNumericFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: DailyDepartmentNotificationResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["Float"]["input"];
}

export interface DailyDepartmentNotificationResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: DailyDepartmentNotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface DailyDepartmentNotificationResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: DailyDepartmentNotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const DailyDepartmentNotificationResolverNumericFilterKeys = {
  Amount: "Amount",
} as const;

export type DailyDepartmentNotificationResolverNumericFilterKeys =
  (typeof DailyDepartmentNotificationResolverNumericFilterKeys)[keyof typeof DailyDepartmentNotificationResolverNumericFilterKeys];
export const DailyDepartmentNotificationResolverOneOfFilterKeys = {
  BatchType: "BatchType",
  SolicitationCodeNumber: "SolicitationCodeNumber",
  SolicitationCodePrefix: "SolicitationCodePrefix",
} as const;

export type DailyDepartmentNotificationResolverOneOfFilterKeys =
  (typeof DailyDepartmentNotificationResolverOneOfFilterKeys)[keyof typeof DailyDepartmentNotificationResolverOneOfFilterKeys];
export const DailyDepartmentNotificationResolverStringFilterKeys = {
  Comment: "Comment",
  Donor: "Donor",
  SolicitationCodeName: "SolicitationCodeName",
} as const;

export type DailyDepartmentNotificationResolverStringFilterKeys =
  (typeof DailyDepartmentNotificationResolverStringFilterKeys)[keyof typeof DailyDepartmentNotificationResolverStringFilterKeys];
export { DbRole };

export const DeviceResolverAllKeys = {
  CreatedAt: "createdAt",
  ExpoPushToken: "expoPushToken",
  LastSeen: "lastSeen",
  UpdatedAt: "updatedAt",
} as const;

export type DeviceResolverAllKeys =
  (typeof DeviceResolverAllKeys)[keyof typeof DeviceResolverAllKeys];
export const DeviceResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  LastSeen: "lastSeen",
  UpdatedAt: "updatedAt",
} as const;

export type DeviceResolverDateFilterKeys =
  (typeof DeviceResolverDateFilterKeys)[keyof typeof DeviceResolverDateFilterKeys];
export interface DeviceResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface DeviceResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: DeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface DeviceResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface DeviceResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const DeviceResolverStringFilterKeys = {
  ExpoPushToken: "expoPushToken",
} as const;

export type DeviceResolverStringFilterKeys =
  (typeof DeviceResolverStringFilterKeys)[keyof typeof DeviceResolverStringFilterKeys];
export const EventResolverAllKeys = {
  CreatedAt: "createdAt",
  Description: "description",
  Location: "location",
  Occurrence: "occurrence",
  OccurrenceEnd: "occurrenceEnd",
  OccurrenceStart: "occurrenceStart",
  Summary: "summary",
  Title: "title",
  UpdatedAt: "updatedAt",
} as const;

export type EventResolverAllKeys =
  (typeof EventResolverAllKeys)[keyof typeof EventResolverAllKeys];
export const EventResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  Occurrence: "occurrence",
  OccurrenceEnd: "occurrenceEnd",
  OccurrenceStart: "occurrenceStart",
  UpdatedAt: "updatedAt",
} as const;

export type EventResolverDateFilterKeys =
  (typeof EventResolverDateFilterKeys)[keyof typeof EventResolverDateFilterKeys];
export interface EventResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: EventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface EventResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: EventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface EventResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface EventResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const EventResolverStringFilterKeys = {
  Description: "description",
  Location: "location",
  Summary: "summary",
  Title: "title",
} as const;

export type EventResolverStringFilterKeys =
  (typeof EventResolverStringFilterKeys)[keyof typeof EventResolverStringFilterKeys];
export const FundraisingEntryResolverAllKeys = {
  Amount: "amount",
  AmountUnassigned: "amountUnassigned",
  BatchType: "batchType",
  CreatedAt: "createdAt",
  DonatedBy: "donatedBy",
  DonatedOn: "donatedOn",
  DonatedTo: "donatedTo",
  SolicitationCode: "solicitationCode",
  TeamId: "teamId",
  UpdatedAt: "updatedAt",
} as const;

export type FundraisingEntryResolverAllKeys =
  (typeof FundraisingEntryResolverAllKeys)[keyof typeof FundraisingEntryResolverAllKeys];
export const FundraisingEntryResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  DonatedOn: "donatedOn",
  UpdatedAt: "updatedAt",
} as const;

export type FundraisingEntryResolverDateFilterKeys =
  (typeof FundraisingEntryResolverDateFilterKeys)[keyof typeof FundraisingEntryResolverDateFilterKeys];
export interface FundraisingEntryResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface FundraisingEntryResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface FundraisingEntryResolverKeyedNumericFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["Float"]["input"];
}

export interface FundraisingEntryResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface FundraisingEntryResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const FundraisingEntryResolverNumericFilterKeys = {
  Amount: "amount",
  AmountUnassigned: "amountUnassigned",
} as const;

export type FundraisingEntryResolverNumericFilterKeys =
  (typeof FundraisingEntryResolverNumericFilterKeys)[keyof typeof FundraisingEntryResolverNumericFilterKeys];
export const FundraisingEntryResolverOneOfFilterKeys = {
  BatchType: "batchType",
  TeamId: "teamId",
} as const;

export type FundraisingEntryResolverOneOfFilterKeys =
  (typeof FundraisingEntryResolverOneOfFilterKeys)[keyof typeof FundraisingEntryResolverOneOfFilterKeys];
export const FundraisingEntryResolverStringFilterKeys = {
  DonatedBy: "donatedBy",
  DonatedTo: "donatedTo",
  SolicitationCode: "solicitationCode",
} as const;

export type FundraisingEntryResolverStringFilterKeys =
  (typeof FundraisingEntryResolverStringFilterKeys)[keyof typeof FundraisingEntryResolverStringFilterKeys];
export const ImageResolverAllKeys = {
  Alt: "alt",
  CreatedAt: "createdAt",
  Height: "height",
  UpdatedAt: "updatedAt",
  Width: "width",
} as const;

export type ImageResolverAllKeys =
  (typeof ImageResolverAllKeys)[keyof typeof ImageResolverAllKeys];
export const ImageResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
} as const;

export type ImageResolverDateFilterKeys =
  (typeof ImageResolverDateFilterKeys)[keyof typeof ImageResolverDateFilterKeys];
export interface ImageResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface ImageResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: ImageResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface ImageResolverKeyedNumericFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["Float"]["input"];
}

export interface ImageResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface ImageResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: ImageResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const ImageResolverNumericFilterKeys = {
  Height: "height",
  Width: "width",
} as const;

export type ImageResolverNumericFilterKeys =
  (typeof ImageResolverNumericFilterKeys)[keyof typeof ImageResolverNumericFilterKeys];
export const ImageResolverStringFilterKeys = {
  Alt: "alt",
} as const;

export type ImageResolverStringFilterKeys =
  (typeof ImageResolverStringFilterKeys)[keyof typeof ImageResolverStringFilterKeys];
export interface IntervalIsoInput {
  readonly end: Scalars["DateTimeISO"]["input"];
  readonly start: Scalars["DateTimeISO"]["input"];
}

export const MarathonHourResolverAllKeys = {
  CreatedAt: "createdAt",
  Details: "details",
  DurationInfo: "durationInfo",
  MarathonYear: "marathonYear",
  ShownStartingAt: "shownStartingAt",
  Title: "title",
  UpdatedAt: "updatedAt",
} as const;

export type MarathonHourResolverAllKeys =
  (typeof MarathonHourResolverAllKeys)[keyof typeof MarathonHourResolverAllKeys];
export const MarathonHourResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  ShownStartingAt: "shownStartingAt",
  UpdatedAt: "updatedAt",
} as const;

export type MarathonHourResolverDateFilterKeys =
  (typeof MarathonHourResolverDateFilterKeys)[keyof typeof MarathonHourResolverDateFilterKeys];
export interface MarathonHourResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: MarathonHourResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface MarathonHourResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: MarathonHourResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface MarathonHourResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: MarathonHourResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface MarathonHourResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: MarathonHourResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const MarathonHourResolverOneOfFilterKeys = {
  MarathonYear: "marathonYear",
} as const;

export type MarathonHourResolverOneOfFilterKeys =
  (typeof MarathonHourResolverOneOfFilterKeys)[keyof typeof MarathonHourResolverOneOfFilterKeys];
export const MarathonHourResolverStringFilterKeys = {
  Details: "details",
  DurationInfo: "durationInfo",
  Title: "title",
} as const;

export type MarathonHourResolverStringFilterKeys =
  (typeof MarathonHourResolverStringFilterKeys)[keyof typeof MarathonHourResolverStringFilterKeys];
export const MarathonResolverAllKeys = {
  CreatedAt: "createdAt",
  EndDate: "endDate",
  StartDate: "startDate",
  UpdatedAt: "updatedAt",
  Year: "year",
} as const;

export type MarathonResolverAllKeys =
  (typeof MarathonResolverAllKeys)[keyof typeof MarathonResolverAllKeys];
export const MarathonResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  EndDate: "endDate",
  StartDate: "startDate",
  UpdatedAt: "updatedAt",
} as const;

export type MarathonResolverDateFilterKeys =
  (typeof MarathonResolverDateFilterKeys)[keyof typeof MarathonResolverDateFilterKeys];
export interface MarathonResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: MarathonResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface MarathonResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface MemberOf {
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly id: Scalars["GlobalId"]["input"];
}

export { MembershipPositionType };

export interface NotificationAudienceInput {
  readonly all?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly memberOfTeamType?: InputMaybe<TeamType>;
  readonly memberOfTeams?: InputMaybe<
    ReadonlyArray<Scalars["GlobalId"]["input"]>
  >;
  readonly users?: InputMaybe<ReadonlyArray<Scalars["GlobalId"]["input"]>>;
}

export const NotificationDeliveryResolverAllKeys = {
  CreatedAt: "createdAt",
  DeliveryError: "deliveryError",
  ReceiptCheckedAt: "receiptCheckedAt",
  SentAt: "sentAt",
  UpdatedAt: "updatedAt",
} as const;

export type NotificationDeliveryResolverAllKeys =
  (typeof NotificationDeliveryResolverAllKeys)[keyof typeof NotificationDeliveryResolverAllKeys];
export const NotificationDeliveryResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  ReceiptCheckedAt: "receiptCheckedAt",
  SentAt: "sentAt",
  UpdatedAt: "updatedAt",
} as const;

export type NotificationDeliveryResolverDateFilterKeys =
  (typeof NotificationDeliveryResolverDateFilterKeys)[keyof typeof NotificationDeliveryResolverDateFilterKeys];
export interface NotificationDeliveryResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface NotificationDeliveryResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export const NotificationResolverAllKeys = {
  Body: "body",
  CreatedAt: "createdAt",
  DeliveryIssue: "deliveryIssue",
  SendAt: "sendAt",
  StartedSendingAt: "startedSendingAt",
  Title: "title",
  UpdatedAt: "updatedAt",
} as const;

export type NotificationResolverAllKeys =
  (typeof NotificationResolverAllKeys)[keyof typeof NotificationResolverAllKeys];
export const NotificationResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  SendAt: "sendAt",
  StartedSendingAt: "startedSendingAt",
  UpdatedAt: "updatedAt",
} as const;

export type NotificationResolverDateFilterKeys =
  (typeof NotificationResolverDateFilterKeys)[keyof typeof NotificationResolverDateFilterKeys];
export interface NotificationResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface NotificationResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: NotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface NotificationResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: NotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface NotificationResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: NotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const NotificationResolverOneOfFilterKeys = {
  DeliveryIssue: "deliveryIssue",
} as const;

export type NotificationResolverOneOfFilterKeys =
  (typeof NotificationResolverOneOfFilterKeys)[keyof typeof NotificationResolverOneOfFilterKeys];
export const NotificationResolverStringFilterKeys = {
  Body: "body",
  Title: "title",
} as const;

export type NotificationResolverStringFilterKeys =
  (typeof NotificationResolverStringFilterKeys)[keyof typeof NotificationResolverStringFilterKeys];
export { NumericComparator };

export const PersonResolverAllKeys = {
  CommitteeName: "committeeName",
  CommitteeRole: "committeeRole",
  DbRole: "dbRole",
  Email: "email",
  Linkblue: "linkblue",
  Name: "name",
} as const;

export type PersonResolverAllKeys =
  (typeof PersonResolverAllKeys)[keyof typeof PersonResolverAllKeys];
export interface PersonResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: PersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface PersonResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: PersonResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface PersonResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const PersonResolverOneOfFilterKeys = {
  CommitteeName: "committeeName",
  CommitteeRole: "committeeRole",
  DbRole: "dbRole",
} as const;

export type PersonResolverOneOfFilterKeys =
  (typeof PersonResolverOneOfFilterKeys)[keyof typeof PersonResolverOneOfFilterKeys];
export const PersonResolverStringFilterKeys = {
  Email: "email",
  Linkblue: "linkblue",
  Name: "name",
} as const;

export type PersonResolverStringFilterKeys =
  (typeof PersonResolverStringFilterKeys)[keyof typeof PersonResolverStringFilterKeys];
export const PointEntryResolverAllKeys = {
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
} as const;

export type PointEntryResolverAllKeys =
  (typeof PointEntryResolverAllKeys)[keyof typeof PointEntryResolverAllKeys];
export const PointEntryResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  UpdatedAt: "updatedAt",
} as const;

export type PointEntryResolverDateFilterKeys =
  (typeof PointEntryResolverDateFilterKeys)[keyof typeof PointEntryResolverDateFilterKeys];
export interface PointEntryResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface PointEntryResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export const PointOpportunityResolverAllKeys = {
  CreatedAt: "createdAt",
  MarathonUuid: "marathonUuid",
  Name: "name",
  OpportunityDate: "opportunityDate",
  Type: "type",
  UpdatedAt: "updatedAt",
} as const;

export type PointOpportunityResolverAllKeys =
  (typeof PointOpportunityResolverAllKeys)[keyof typeof PointOpportunityResolverAllKeys];
export const PointOpportunityResolverDateFilterKeys = {
  CreatedAt: "createdAt",
  OpportunityDate: "opportunityDate",
  UpdatedAt: "updatedAt",
} as const;

export type PointOpportunityResolverDateFilterKeys =
  (typeof PointOpportunityResolverDateFilterKeys)[keyof typeof PointOpportunityResolverDateFilterKeys];
export interface PointOpportunityResolverKeyedDateFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
}

export interface PointOpportunityResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: PointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface PointOpportunityResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: PointOpportunityResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface PointOpportunityResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const PointOpportunityResolverOneOfFilterKeys = {
  MarathonUuid: "marathonUuid",
  Type: "type",
} as const;

export type PointOpportunityResolverOneOfFilterKeys =
  (typeof PointOpportunityResolverOneOfFilterKeys)[keyof typeof PointOpportunityResolverOneOfFilterKeys];
export const PointOpportunityResolverStringFilterKeys = {
  Name: "name",
} as const;

export type PointOpportunityResolverStringFilterKeys =
  (typeof PointOpportunityResolverStringFilterKeys)[keyof typeof PointOpportunityResolverStringFilterKeys];
export interface RegisterDeviceInput {
  /** For legacy reasons, this can be a GlobalId or a raw UUID */
  readonly deviceId: Scalars["String"]["input"];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars["String"]["input"]>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars["GlobalId"]["input"]>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  readonly verifier: Scalars["String"]["input"];
}

export interface SetEventInput {
  readonly description?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly location?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly occurrences: ReadonlyArray<SetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly title: Scalars["String"]["input"];
}

export interface SetEventOccurrenceInput {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
}

export interface SetFeedInput {
  readonly textContent?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly title: Scalars["NonEmptyString"]["input"];
}

export interface SetMarathonHourInput {
  readonly details?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly durationInfo: Scalars["NonEmptyString"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["NonEmptyString"]["input"];
}

export interface SetMarathonInput {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["NonEmptyString"]["input"];
}

export interface SetPersonInput {
  readonly captainOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly email?: InputMaybe<Scalars["EmailAddress"]["input"]>;
  readonly linkblue?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly memberOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
}

export interface SetPointOpportunityInput {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type?: InputMaybe<TeamType>;
}

export interface SetTeamInput {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly name?: InputMaybe<Scalars["NonEmptyString"]["input"]>;
  readonly persistentIdentifier?: InputMaybe<
    Scalars["NonEmptyString"]["input"]
  >;
  readonly type?: InputMaybe<TeamType>;
}

export { SortDirection };

export { StringComparator };

export { TeamLegacyStatus };

export const TeamResolverAllKeys = {
  LegacyStatus: "legacyStatus",
  MarathonId: "marathonId",
  Name: "name",
  Type: "type",
} as const;

export type TeamResolverAllKeys =
  (typeof TeamResolverAllKeys)[keyof typeof TeamResolverAllKeys];
export interface TeamResolverKeyedIsNullFilterItem {
  /** The field to filter on */
  readonly field: TeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface TeamResolverKeyedOneOfFilterItem {
  /** The field to filter on */
  readonly field: TeamResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
}

export interface TeamResolverKeyedStringFilterItem {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: TeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
}

export const TeamResolverOneOfFilterKeys = {
  LegacyStatus: "legacyStatus",
  MarathonId: "marathonId",
  Type: "type",
} as const;

export type TeamResolverOneOfFilterKeys =
  (typeof TeamResolverOneOfFilterKeys)[keyof typeof TeamResolverOneOfFilterKeys];
export const TeamResolverStringFilterKeys = {
  Name: "name",
} as const;

export type TeamResolverStringFilterKeys =
  (typeof TeamResolverStringFilterKeys)[keyof typeof TeamResolverStringFilterKeys];
export { TeamType };

export interface UpdateFundraisingAssignmentInput {
  readonly amount: Scalars["Float"]["input"];
}
