/* eslint-disable @typescript-eslint/no-invalid-void-type, @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions, @typescript-eslint/array-type, unicorn/prefer-export-from */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
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
  readonly linkblue: Scalars["String"]["input"];
  readonly name: Scalars["String"]["input"];
  readonly role?: InputMaybe<CommitteeRole>;
}

export interface BulkTeamInput {
  readonly captainLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]>
  >;
  readonly legacyStatus: TeamLegacyStatus;
  readonly memberLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]>
  >;
  readonly name: Scalars["String"]["input"];
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
  readonly description?: InputMaybe<Scalars["String"]["input"]>;
  readonly location?: InputMaybe<Scalars["String"]["input"]>;
  readonly occurrences: ReadonlyArray<CreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
}

export interface CreateEventOccurrenceInput {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
}

export interface CreateFeedInput {
  readonly imageUuid?: InputMaybe<Scalars["String"]["input"]>;
  readonly textContent?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
}

export interface CreateImageInput {
  readonly alt?: InputMaybe<Scalars["String"]["input"]>;
  readonly url?: InputMaybe<Scalars["URL"]["input"]>;
}

export interface CreateMarathonHourInput {
  readonly details?: InputMaybe<Scalars["String"]["input"]>;
  readonly durationInfo: Scalars["String"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["String"]["input"];
}

export interface CreateMarathonInput {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["String"]["input"];
}

export interface CreatePersonInput {
  readonly captainOf?: ReadonlyArray<MemberOf>;
  /** @deprecated DBRole can no longer be set directly */
  readonly dbRole?: InputMaybe<DbRole>;
  readonly email: Scalars["EmailAddress"]["input"];
  readonly linkblue?: InputMaybe<Scalars["String"]["input"]>;
  readonly memberOf?: ReadonlyArray<MemberOf>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
}

export interface CreatePointEntryInput {
  readonly comment?: InputMaybe<Scalars["String"]["input"]>;
  readonly opportunityUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly personFromUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly points: Scalars["Int"]["input"];
  readonly teamUuid: Scalars["GlobalId"]["input"];
}

export interface CreatePointOpportunityInput {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly marathonUuid: Scalars["GlobalId"]["input"];
  readonly name: Scalars["String"]["input"];
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type: TeamType;
}

export interface CreateTeamInput {
  readonly legacyStatus: TeamLegacyStatus;
  readonly name: Scalars["String"]["input"];
  readonly type: TeamType;
}

export interface DailyDepartmentNotificationInput {
  readonly accountName: Scalars["String"]["input"];
  readonly accountNumber: Scalars["String"]["input"];
  readonly batchId: Scalars["String"]["input"];
  readonly behalfHonorMemorial?: InputMaybe<Scalars["String"]["input"]>;
  readonly combinedAmount: Scalars["Float"]["input"];
  readonly combinedDonorName: Scalars["String"]["input"];
  readonly combinedDonorSalutation: Scalars["String"]["input"];
  readonly combinedDonorSort?: InputMaybe<Scalars["String"]["input"]>;
  readonly comment?: InputMaybe<Scalars["String"]["input"]>;
  readonly department?: InputMaybe<Scalars["String"]["input"]>;
  readonly divFirstGift: Scalars["Boolean"]["input"];
  readonly division?: InputMaybe<Scalars["String"]["input"]>;
  readonly donor1Amount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly donor2Amount?: InputMaybe<Scalars["Float"]["input"]>;
  readonly effectiveDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly gikDescription?: InputMaybe<Scalars["String"]["input"]>;
  readonly gikType?: InputMaybe<Scalars["String"]["input"]>;
  readonly holdingDestination?: InputMaybe<Scalars["String"]["input"]>;
  readonly idSorter: Scalars["String"]["input"];
  readonly matchingGift?: InputMaybe<Scalars["String"]["input"]>;
  readonly onlineGift: Scalars["Boolean"]["input"];
  readonly pledgedAmount: Scalars["Float"]["input"];
  readonly pledgedDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly processDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly secShares?: InputMaybe<Scalars["String"]["input"]>;
  readonly secType?: InputMaybe<Scalars["String"]["input"]>;
  readonly solicitation?: InputMaybe<Scalars["String"]["input"]>;
  readonly solicitationCode?: InputMaybe<Scalars["String"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly transactionDate?: InputMaybe<Scalars["LocalDate"]["input"]>;
  readonly transactionType: Scalars["String"]["input"];
  readonly ukFirstGift: Scalars["Boolean"]["input"];
}

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
  CreatedAt: "createdAt",
  DonatedBy: "donatedBy",
  DonatedOn: "donatedOn",
  DonatedTo: "donatedTo",
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
  TeamId: "teamId",
} as const;

export type FundraisingEntryResolverOneOfFilterKeys =
  (typeof FundraisingEntryResolverOneOfFilterKeys)[keyof typeof FundraisingEntryResolverOneOfFilterKeys];
export const FundraisingEntryResolverStringFilterKeys = {
  DonatedBy: "donatedBy",
  DonatedTo: "donatedTo",
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
  readonly description?: InputMaybe<Scalars["String"]["input"]>;
  readonly location?: InputMaybe<Scalars["String"]["input"]>;
  readonly occurrences: ReadonlyArray<SetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
}

export interface SetEventOccurrenceInput {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
}

export interface SetFeedInput {
  readonly textContent?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
}

export interface SetMarathonHourInput {
  readonly details?: InputMaybe<Scalars["String"]["input"]>;
  readonly durationInfo: Scalars["String"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["String"]["input"];
}

export interface SetMarathonInput {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["String"]["input"];
}

export interface SetPersonInput {
  readonly captainOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly email?: InputMaybe<Scalars["EmailAddress"]["input"]>;
  readonly linkblue?: InputMaybe<Scalars["String"]["input"]>;
  readonly memberOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
}

export interface SetPointOpportunityInput {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type?: InputMaybe<TeamType>;
}

export interface SetTeamInput {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
  readonly persistentIdentifier?: InputMaybe<Scalars["String"]["input"]>;
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

export type ImageViewFragmentFragment = {
  readonly __typename?: "ImageNode";
  readonly id: string;
  readonly url?: URL | string | null;
  readonly thumbHash?: string | null;
  readonly alt?: string | null;
  readonly width: number;
  readonly height: number;
  readonly mimeType: string;
} & { " $fragmentName"?: "ImageViewFragmentFragment" };

export type SimpleConfigFragment = {
  readonly __typename?: "ConfigurationNode";
  readonly id: string;
  readonly key: string;
  readonly value: string;
} & { " $fragmentName"?: "SimpleConfigFragment" };

export type FullConfigFragment = ({
  readonly __typename?: "ConfigurationNode";
  readonly validAfter?: Date | string | null;
  readonly validUntil?: Date | string | null;
  readonly createdAt?: Date | string | null;
} & { " $fragmentRefs"?: { SimpleConfigFragment: SimpleConfigFragment } }) & {
  " $fragmentName"?: "FullConfigFragment";
};

export type NotificationFragmentFragment = {
  readonly __typename?: "NotificationNode";
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly url?: URL | string | null;
} & { " $fragmentName"?: "NotificationFragmentFragment" };

export type NotificationDeliveryFragmentFragment = {
  readonly __typename?: "NotificationDeliveryNode";
  readonly id: string;
  readonly sentAt?: Date | string | null;
  readonly notification: { readonly __typename?: "NotificationNode" } & {
    " $fragmentRefs"?: {
      NotificationFragmentFragment: NotificationFragmentFragment;
    };
  };
} & { " $fragmentName"?: "NotificationDeliveryFragmentFragment" };

export type UseAllowedLoginTypesQueryVariables = Exact<{
  [key: string]: never;
}>;

export type UseAllowedLoginTypesQuery = {
  readonly __typename?: "Query";
  readonly activeConfiguration: {
    readonly __typename?: "GetConfigurationByUuidResponse";
    readonly data: { readonly __typename?: "ConfigurationNode" } & {
      " $fragmentRefs"?: { SimpleConfigFragment: SimpleConfigFragment };
    };
  };
};

export type MarathonTimeQueryVariables = Exact<{ [key: string]: never }>;

export type MarathonTimeQuery = {
  readonly __typename?: "Query";
  readonly latestMarathon?: {
    readonly __typename?: "MarathonNode";
    readonly startDate?: Date | string | null;
    readonly endDate?: Date | string | null;
  } | null;
};

export type UseTabBarConfigQueryVariables = Exact<{ [key: string]: never }>;

export type UseTabBarConfigQuery = {
  readonly __typename?: "Query";
  readonly activeConfiguration: {
    readonly __typename?: "GetConfigurationByUuidResponse";
    readonly data: { readonly __typename?: "ConfigurationNode" } & {
      " $fragmentRefs"?: { SimpleConfigFragment: SimpleConfigFragment };
    };
  };
  readonly me?: {
    readonly __typename?: "PersonNode";
    readonly linkblue?: string | null;
  } | null;
};

export type TriviaCrackQueryVariables = Exact<{ [key: string]: never }>;

export type TriviaCrackQuery = {
  readonly __typename?: "Query";
  readonly activeConfiguration: {
    readonly __typename?: "GetConfigurationByUuidResponse";
    readonly data: { readonly __typename?: "ConfigurationNode" } & {
      " $fragmentRefs"?: { SimpleConfigFragment: SimpleConfigFragment };
    };
  };
  readonly me?: {
    readonly __typename?: "PersonNode";
    readonly teams: ReadonlyArray<{
      readonly __typename?: "MembershipNode";
      readonly team: {
        readonly __typename?: "TeamNode";
        readonly type: TeamType;
        readonly name: string;
      };
    }>;
  } | null;
};

export type AuthStateQueryVariables = Exact<{ [key: string]: never }>;

export type AuthStateQuery = {
  readonly __typename?: "Query";
  readonly me?: {
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly email: string;
  } | null;
  readonly loginState: {
    readonly __typename?: "LoginState";
    readonly dbRole: DbRole;
    readonly loggedIn: boolean;
    readonly authSource: AuthSource;
  };
};

export type SetDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;

export type SetDeviceMutation = {
  readonly __typename?: "Mutation";
  readonly registerDevice: {
    readonly __typename?: "RegisterDeviceResponse";
    readonly ok: boolean;
  };
};

export type EventScreenFragmentFragment = {
  readonly __typename?: "EventNode";
  readonly id: string;
  readonly title: string;
  readonly summary?: string | null;
  readonly description?: string | null;
  readonly location?: string | null;
  readonly occurrences: ReadonlyArray<{
    readonly __typename?: "EventOccurrenceNode";
    readonly id: string;
    readonly fullDay: boolean;
    readonly interval: {
      readonly __typename?: "IntervalISO";
      readonly start: Date | string;
      readonly end: Date | string;
    };
  }>;
  readonly images: ReadonlyArray<{
    readonly __typename?: "ImageNode";
    readonly thumbHash?: string | null;
    readonly url?: URL | string | null;
    readonly height: number;
    readonly width: number;
    readonly alt?: string | null;
    readonly mimeType: string;
  }>;
} & { " $fragmentName"?: "EventScreenFragmentFragment" };

export type DeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars["String"]["input"];
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  verifier: Scalars["String"]["input"];
}>;

export type DeviceNotificationsQuery = {
  readonly __typename?: "Query";
  readonly device: {
    readonly __typename?: "GetDeviceByUuidResponse";
    readonly data: {
      readonly __typename?: "DeviceNode";
      readonly notificationDeliveries: ReadonlyArray<
        { readonly __typename?: "NotificationDeliveryNode" } & {
          " $fragmentRefs"?: {
            NotificationDeliveryFragmentFragment: NotificationDeliveryFragmentFragment;
          };
        }
      >;
    };
  };
};

export type ProfileScreenAuthFragmentFragment = {
  readonly __typename?: "LoginState";
  readonly dbRole: DbRole;
  readonly authSource: AuthSource;
} & { " $fragmentName"?: "ProfileScreenAuthFragmentFragment" };

export type ProfileScreenUserFragmentFragment = {
  readonly __typename?: "PersonNode";
  readonly name?: string | null;
  readonly linkblue?: string | null;
  readonly teams: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly position: MembershipPositionType;
    readonly team: { readonly __typename?: "TeamNode"; readonly name: string };
  }>;
  readonly primaryCommittee?: {
    readonly __typename?: "CommitteeMembershipNode";
    readonly identifier: CommitteeIdentifier;
    readonly role: CommitteeRole;
  } | null;
} & { " $fragmentName"?: "ProfileScreenUserFragmentFragment" };

export type RootScreenDocumentQueryVariables = Exact<{ [key: string]: never }>;

export type RootScreenDocumentQuery = {
  readonly __typename?: "Query";
  readonly loginState: { readonly __typename?: "LoginState" } & {
    " $fragmentRefs"?: {
      ProfileScreenAuthFragmentFragment: ProfileScreenAuthFragmentFragment;
      RootScreenAuthFragmentFragment: RootScreenAuthFragmentFragment;
    };
  };
  readonly me?:
    | ({ readonly __typename?: "PersonNode" } & {
        " $fragmentRefs"?: {
          ProfileScreenUserFragmentFragment: ProfileScreenUserFragmentFragment;
        };
      })
    | null;
};

export type RootScreenAuthFragmentFragment = {
  readonly __typename?: "LoginState";
  readonly dbRole: DbRole;
} & { " $fragmentName"?: "RootScreenAuthFragmentFragment" };

export type EventsQueryVariables = Exact<{
  earliestTimestamp: Scalars["DateTimeISO"]["input"];
  lastTimestamp: Scalars["DateTimeISO"]["input"];
}>;

export type EventsQuery = {
  readonly __typename?: "Query";
  readonly events: {
    readonly __typename?: "ListEventsResponse";
    readonly data: ReadonlyArray<
      { readonly __typename?: "EventNode" } & {
        " $fragmentRefs"?: {
          EventScreenFragmentFragment: EventScreenFragmentFragment;
        };
      }
    >;
  };
};

export type ServerFeedQueryVariables = Exact<{ [key: string]: never }>;

export type ServerFeedQuery = {
  readonly __typename?: "Query";
  readonly feed: ReadonlyArray<{
    readonly __typename?: "FeedNode";
    readonly id: string;
    readonly title: string;
    readonly createdAt?: Date | string | null;
    readonly textContent?: string | null;
    readonly image?: {
      readonly __typename?: "ImageNode";
      readonly url?: URL | string | null;
      readonly alt?: string | null;
      readonly width: number;
      readonly height: number;
      readonly thumbHash?: string | null;
    } | null;
  }>;
};

export type MyTeamFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly totalPoints: number;
  readonly fundraisingTotalAmount?: number | null;
  readonly pointEntries: ReadonlyArray<{
    readonly __typename?: "PointEntryNode";
    readonly points: number;
    readonly personFrom?: {
      readonly __typename?: "PersonNode";
      readonly id: string;
      readonly name?: string | null;
      readonly linkblue?: string | null;
    } | null;
  }>;
  readonly members: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly position: MembershipPositionType;
    readonly person: {
      readonly __typename?: "PersonNode";
      readonly linkblue?: string | null;
      readonly name?: string | null;
    };
  }>;
} & { " $fragmentName"?: "MyTeamFragmentFragment" };

export type MyFundraisingFragmentFragment = {
  readonly __typename?: "PersonNode";
  readonly fundraisingTotalAmount?: number | null;
  readonly fundraisingAssignments: ReadonlyArray<{
    readonly __typename?: "FundraisingAssignmentNode";
    readonly amount: number;
    readonly entry: {
      readonly __typename?: "FundraisingEntryNode";
      readonly donatedToText?: string | null;
      readonly donatedByText?: string | null;
      readonly donatedOn: Date | string;
    };
  }>;
} & { " $fragmentName"?: "MyFundraisingFragmentFragment" };

export type HourScreenFragmentFragment = {
  readonly __typename?: "MarathonHourNode";
  readonly id: string;
  readonly title: string;
  readonly details?: string | null;
  readonly durationInfo: string;
  readonly mapImages: ReadonlyArray<
    { readonly __typename?: "ImageNode" } & {
      " $fragmentRefs"?: {
        ImageViewFragmentFragment: ImageViewFragmentFragment;
      };
    }
  >;
} & { " $fragmentName"?: "HourScreenFragmentFragment" };

export type MarathonScreenQueryVariables = Exact<{ [key: string]: never }>;

export type MarathonScreenQuery = {
  readonly __typename?: "Query";
  readonly currentMarathonHour?:
    | ({ readonly __typename?: "MarathonHourNode" } & {
        " $fragmentRefs"?: {
          HourScreenFragmentFragment: HourScreenFragmentFragment;
        };
      })
    | null;
  readonly latestMarathon?: {
    readonly __typename?: "MarathonNode";
    readonly startDate?: Date | string | null;
    readonly endDate?: Date | string | null;
    readonly hours: ReadonlyArray<
      { readonly __typename?: "MarathonHourNode" } & {
        " $fragmentRefs"?: {
          HourScreenFragmentFragment: HourScreenFragmentFragment;
        };
      }
    >;
  } | null;
};

export type ScoreBoardFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly totalPoints: number;
  readonly legacyStatus: TeamLegacyStatus;
  readonly type: TeamType;
} & { " $fragmentName"?: "ScoreBoardFragmentFragment" };

export type HighlightedTeamFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly legacyStatus: TeamLegacyStatus;
  readonly type: TeamType;
} & { " $fragmentName"?: "HighlightedTeamFragmentFragment" };

export type ScoreBoardDocumentQueryVariables = Exact<{
  type: TeamType;
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type ScoreBoardDocumentQuery = {
  readonly __typename?: "Query";
  readonly me?:
    | ({
        readonly __typename?: "PersonNode";
        readonly id: string;
        readonly primaryTeam?: {
          readonly __typename?: "MembershipNode";
          readonly team: { readonly __typename?: "TeamNode" } & {
            " $fragmentRefs"?: {
              HighlightedTeamFragmentFragment: HighlightedTeamFragmentFragment;
              MyTeamFragmentFragment: MyTeamFragmentFragment;
            };
          };
        } | null;
      } & {
        " $fragmentRefs"?: {
          MyFundraisingFragmentFragment: MyFundraisingFragmentFragment;
        };
      })
    | null;
  readonly teams: {
    readonly __typename?: "ListTeamsResponse";
    readonly data: ReadonlyArray<
      { readonly __typename?: "TeamNode" } & {
        " $fragmentRefs"?: {
          ScoreBoardFragmentFragment: ScoreBoardFragmentFragment;
        };
      }
    >;
  };
};

export type ActiveMarathonDocumentQueryVariables = Exact<{
  [key: string]: never;
}>;

export type ActiveMarathonDocumentQuery = {
  readonly __typename?: "Query";
  readonly currentMarathon?: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
  } | null;
  readonly latestMarathon?: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
  } | null;
};

export const SimpleConfigFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SimpleConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "key" } },
          { kind: "Field", name: { kind: "Name", value: "value" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SimpleConfigFragment, unknown>;
export const FullConfigFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "FullConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "FragmentSpread",
            name: { kind: "Name", value: "SimpleConfig" },
          },
          { kind: "Field", name: { kind: "Name", value: "validAfter" } },
          { kind: "Field", name: { kind: "Name", value: "validUntil" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SimpleConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "key" } },
          { kind: "Field", name: { kind: "Name", value: "value" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FullConfigFragment, unknown>;
export const NotificationFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "body" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NotificationFragmentFragment, unknown>;
export const NotificationDeliveryFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationDeliveryFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationDeliveryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "sentAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "notification" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "NotificationFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "body" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NotificationDeliveryFragmentFragment, unknown>;
export const EventScreenFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventScreenFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EventNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "summary" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "occurrences" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interval" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "start" } },
                      { kind: "Field", name: { kind: "Name", value: "end" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "fullDay" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "images" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
                { kind: "Field", name: { kind: "Name", value: "mimeType" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventScreenFragmentFragment, unknown>;
export const ProfileScreenAuthFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProfileScreenAuthFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "LoginState" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
          { kind: "Field", name: { kind: "Name", value: "authSource" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProfileScreenUserFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "team" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryCommittee" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "identifier" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "RootScreenAuthFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "LoginState" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RootScreenAuthFragmentFragment, unknown>;
export const MyTeamFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MyTeamFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingTotalAmount" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "pointEntries" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "personFrom" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "linkblue" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "points" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "linkblue" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyTeamFragmentFragment, unknown>;
export const MyFundraisingFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MyFundraisingFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingTotalAmount" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingAssignments" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "amount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "entry" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedToText" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedByText" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedOn" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MyFundraisingFragmentFragment, unknown>;
export const ImageViewFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ImageViewFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ImageNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
          { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
          { kind: "Field", name: { kind: "Name", value: "alt" } },
          { kind: "Field", name: { kind: "Name", value: "width" } },
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "mimeType" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImageViewFragmentFragment, unknown>;
export const HourScreenFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HourScreenFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonHourNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "details" } },
          { kind: "Field", name: { kind: "Name", value: "durationInfo" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "mapImages" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ImageViewFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ImageViewFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ImageNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
          { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
          { kind: "Field", name: { kind: "Name", value: "alt" } },
          { kind: "Field", name: { kind: "Name", value: "width" } },
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "mimeType" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HourScreenFragmentFragment, unknown>;
export const ScoreBoardFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ScoreBoardFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ScoreBoardFragmentFragment, unknown>;
export const HighlightedTeamFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HighlightedTeamFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HighlightedTeamFragmentFragment, unknown>;
export const UseAllowedLoginTypesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "useAllowedLoginTypes" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "activeConfiguration" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "key" },
                value: {
                  kind: "StringValue",
                  value: "ALLOWED_LOGIN_TYPES",
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "SimpleConfig" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SimpleConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "key" } },
          { kind: "Field", name: { kind: "Name", value: "value" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UseAllowedLoginTypesQuery,
  UseAllowedLoginTypesQueryVariables
>;
export const MarathonTimeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MarathonTime" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "latestMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "endDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarathonTimeQuery, MarathonTimeQueryVariables>;
export const UseTabBarConfigDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "useTabBarConfig" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "activeConfiguration" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "key" },
                value: {
                  kind: "StringValue",
                  value: "TAB_BAR_CONFIG",
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "SimpleConfig" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SimpleConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "key" } },
          { kind: "Field", name: { kind: "Name", value: "value" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UseTabBarConfigQuery,
  UseTabBarConfigQueryVariables
>;
export const TriviaCrackDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TriviaCrack" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "activeConfiguration" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "key" },
                value: {
                  kind: "StringValue",
                  value: "TRIVIA_CRACK",
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "SimpleConfig" },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "teams" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "team" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "type" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SimpleConfig" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ConfigurationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "key" } },
          { kind: "Field", name: { kind: "Name", value: "value" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TriviaCrackQuery, TriviaCrackQueryVariables>;
export const AuthStateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "AuthState" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "loginState" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "dbRole" } },
                { kind: "Field", name: { kind: "Name", value: "loggedIn" } },
                { kind: "Field", name: { kind: "Name", value: "authSource" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AuthStateQuery, AuthStateQueryVariables>;
export const SetDeviceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SetDevice" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RegisterDeviceInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "registerDevice" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "ok" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SetDeviceMutation, SetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DeviceNotifications" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "deviceUuid" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "pageSize" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "verifier" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "device" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "deviceUuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "notificationDeliveries" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "pageSize" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "pageSize" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "page" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "page" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "verifier" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "verifier" },
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value: "NotificationDeliveryFragment",
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "body" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationDeliveryFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationDeliveryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "sentAt" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "notification" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "NotificationFragment" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeviceNotificationsQuery,
  DeviceNotificationsQueryVariables
>;
export const RootScreenDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "RootScreenDocument" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "loginState" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ProfileScreenAuthFragment" },
                },
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "RootScreenAuthFragment" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ProfileScreenUserFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProfileScreenAuthFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "LoginState" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
          { kind: "Field", name: { kind: "Name", value: "authSource" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "RootScreenAuthFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "LoginState" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ProfileScreenUserFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "team" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "primaryCommittee" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "identifier" } },
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RootScreenDocumentQuery,
  RootScreenDocumentQueryVariables
>;
export const EventsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "Events" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "earliestTimestamp" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DateTimeISO" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "lastTimestamp" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "DateTimeISO" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "events" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "dateFilters" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "comparison" },
                          value: {
                            kind: "EnumValue",
                            value: "GREATER_THAN_OR_EQUAL_TO",
                          },
                        },
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "field" },
                          value: {
                            kind: "EnumValue",
                            value: "occurrenceStart",
                          },
                        },
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "value" },
                          value: {
                            kind: "Variable",
                            name: { kind: "Name", value: "earliestTimestamp" },
                          },
                        },
                      ],
                    },
                    {
                      kind: "ObjectValue",
                      fields: [
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "comparison" },
                          value: {
                            kind: "EnumValue",
                            value: "LESS_THAN_OR_EQUAL_TO",
                          },
                        },
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "field" },
                          value: {
                            kind: "EnumValue",
                            value: "occurrenceStart",
                          },
                        },
                        {
                          kind: "ObjectField",
                          name: { kind: "Name", value: "value" },
                          value: {
                            kind: "Variable",
                            name: { kind: "Name", value: "lastTimestamp" },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: { kind: "EnumValue", value: "asc" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "StringValue",
                  value: "occurrence",
                  block: false,
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "EventScreenFragment" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventScreenFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EventNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "summary" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "location" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "occurrences" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "interval" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "start" } },
                      { kind: "Field", name: { kind: "Name", value: "end" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "fullDay" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "images" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
                { kind: "Field", name: { kind: "Name", value: "mimeType" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const ServerFeedDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ServerFeed" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "feed" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "limit" },
                value: { kind: "IntValue", value: "20" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "textContent" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "image" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "url" } },
                      { kind: "Field", name: { kind: "Name", value: "alt" } },
                      { kind: "Field", name: { kind: "Name", value: "width" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "height" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "thumbHash" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ServerFeedQuery, ServerFeedQueryVariables>;
export const MarathonScreenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MarathonScreen" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentMarathonHour" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "HourScreenFragment" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "latestMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "endDate" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "hours" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "HourScreenFragment" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ImageViewFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "ImageNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "url" } },
          { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
          { kind: "Field", name: { kind: "Name", value: "alt" } },
          { kind: "Field", name: { kind: "Name", value: "width" } },
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "mimeType" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HourScreenFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonHourNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "details" } },
          { kind: "Field", name: { kind: "Name", value: "durationInfo" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "mapImages" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "ImageViewFragment" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarathonScreenQuery, MarathonScreenQueryVariables>;
export const ScoreBoardDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ScoreBoardDocument" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "type" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "TeamType" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "primaryTeam" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "teamType" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "type" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "team" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value: "HighlightedTeamFragment",
                              },
                            },
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "MyTeamFragment" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "MyFundraisingFragment" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sendAll" },
                value: { kind: "BooleanValue", value: true },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "ListValue",
                  values: [
                    { kind: "StringValue", value: "totalPoints", block: false },
                    { kind: "StringValue", value: "name", block: false },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "ListValue",
                  values: [
                    { kind: "EnumValue", value: "desc" },
                    { kind: "EnumValue", value: "asc" },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "type" },
                value: {
                  kind: "ListValue",
                  values: [
                    { kind: "Variable", name: { kind: "Name", value: "type" } },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonId" },
                value: {
                  kind: "ListValue",
                  values: [
                    {
                      kind: "Variable",
                      name: { kind: "Name", value: "marathonId" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "ScoreBoardFragment" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "HighlightedTeamFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MyTeamFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingTotalAmount" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "pointEntries" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "personFrom" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "linkblue" },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "points" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "linkblue" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MyFundraisingFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingTotalAmount" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "fundraisingAssignments" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "amount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "entry" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedToText" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedByText" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "donatedOn" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ScoreBoardFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ScoreBoardDocumentQuery,
  ScoreBoardDocumentQueryVariables
>;
export const ActiveMarathonDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ActiveMarathonDocument" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "latestMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ActiveMarathonDocumentQuery,
  ActiveMarathonDocumentQueryVariables
>;
