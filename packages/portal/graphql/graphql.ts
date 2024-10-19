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
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
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
export type Scalars = {
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
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: { input: number; output: number };
  /** Integers that will have a value greater than 0. */
  PositiveInt: { input: number; output: number };
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: URL | string; output: URL | string };
  /** Represents NULL values */
  Void: { input: void; output: void };
};

export { AccessLevel };

export type AssignEntryToPersonInput = {
  readonly amount: Scalars["Float"]["input"];
};

export { AuthSource };

export type BulkPersonInput = {
  readonly committee?: InputMaybe<CommitteeIdentifier>;
  readonly email: Scalars["EmailAddress"]["input"];
  readonly linkblue: Scalars["String"]["input"];
  readonly name: Scalars["String"]["input"];
  readonly role?: InputMaybe<CommitteeRole>;
};

export type BulkTeamInput = {
  readonly captainLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]>
  >;
  readonly legacyStatus: TeamLegacyStatus;
  readonly memberLinkblues?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]>
  >;
  readonly name: Scalars["String"]["input"];
  readonly type: TeamType;
};

export { CommitteeIdentifier };

export { CommitteeRole };

export type CreateConfigurationInput = {
  readonly key: Scalars["String"]["input"];
  readonly validAfter?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly validUntil?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

export type CreateEventInput = {
  readonly description?: InputMaybe<Scalars["String"]["input"]>;
  readonly location?: InputMaybe<Scalars["String"]["input"]>;
  readonly occurrences: ReadonlyArray<CreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
};

export type CreateEventOccurrenceInput = {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
};

export type CreateFeedInput = {
  readonly imageUuid?: InputMaybe<Scalars["String"]["input"]>;
  readonly textContent?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
};

export type CreateImageInput = {
  readonly alt?: InputMaybe<Scalars["String"]["input"]>;
  readonly url?: InputMaybe<Scalars["URL"]["input"]>;
};

export type CreateMarathonHourInput = {
  readonly details?: InputMaybe<Scalars["String"]["input"]>;
  readonly durationInfo: Scalars["String"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["String"]["input"];
};

export type CreateMarathonInput = {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["String"]["input"];
};

export type CreatePersonInput = {
  readonly captainOf?: ReadonlyArray<MemberOf>;
  /** @deprecated DBRole can no longer be set directly */
  readonly dbRole?: InputMaybe<DbRole>;
  readonly email: Scalars["EmailAddress"]["input"];
  readonly linkblue?: InputMaybe<Scalars["String"]["input"]>;
  readonly memberOf?: ReadonlyArray<MemberOf>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
};

export type CreatePointEntryInput = {
  readonly comment?: InputMaybe<Scalars["String"]["input"]>;
  readonly opportunityUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly personFromUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly points: Scalars["Int"]["input"];
  readonly teamUuid: Scalars["GlobalId"]["input"];
};

export type CreatePointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly marathonUuid: Scalars["GlobalId"]["input"];
  readonly name: Scalars["String"]["input"];
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type: TeamType;
};

export type CreateTeamInput = {
  readonly legacyStatus: TeamLegacyStatus;
  readonly name: Scalars["String"]["input"];
  readonly type: TeamType;
};

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
export type DeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type DeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: DeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type DeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type DeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type EventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: EventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type EventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: EventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type EventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type FundraisingEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type FundraisingEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type FundraisingEntryResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["Float"]["input"];
};

export type FundraisingEntryResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type FundraisingEntryResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type ImageResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type ImageResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: ImageResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ImageResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["Float"]["input"];
};

export type ImageResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars["Void"]["input"];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type ImageResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: ImageResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type IntervalIsoInput = {
  readonly end: Scalars["DateTimeISO"]["input"];
  readonly start: Scalars["DateTimeISO"]["input"];
};

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
export type MarathonHourResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: MarathonHourResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type MarathonHourResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: MarathonHourResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MarathonHourResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: MarathonHourResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type MarathonHourResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: MarathonHourResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type MarathonResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: MarathonResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type MarathonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type MemberOf = {
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly id: Scalars["GlobalId"]["input"];
};

export { MembershipPositionType };

export type NotificationAudienceInput = {
  readonly all?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly memberOfTeamType?: InputMaybe<TeamType>;
  readonly memberOfTeams?: InputMaybe<
    ReadonlyArray<Scalars["GlobalId"]["input"]>
  >;
  readonly users?: InputMaybe<ReadonlyArray<Scalars["GlobalId"]["input"]>>;
};

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
export type NotificationDeliveryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type NotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

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
export type NotificationResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type NotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type NotificationResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: NotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type NotificationResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: NotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type PersonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PersonResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: PersonResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type PersonResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type PointEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type PointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

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
export type PointOpportunityResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["DateTimeISO"]["input"];
};

export type PointOpportunityResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type PointOpportunityResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: PointOpportunityResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type PointOpportunityResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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
export type RegisterDeviceInput = {
  /** For legacy reasons, this can be a GlobalId or a raw UUID */
  readonly deviceId: Scalars["String"]["input"];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars["String"]["input"]>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars["GlobalId"]["input"]>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  readonly verifier: Scalars["String"]["input"];
};

export type SetEventInput = {
  readonly description?: InputMaybe<Scalars["String"]["input"]>;
  readonly location?: InputMaybe<Scalars["String"]["input"]>;
  readonly occurrences: ReadonlyArray<SetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
};

export type SetEventOccurrenceInput = {
  readonly fullDay: Scalars["Boolean"]["input"];
  readonly interval: IntervalIsoInput;
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
};

export type SetFeedInput = {
  readonly textContent?: InputMaybe<Scalars["String"]["input"]>;
  readonly title: Scalars["String"]["input"];
};

export type SetMarathonHourInput = {
  readonly details?: InputMaybe<Scalars["String"]["input"]>;
  readonly durationInfo: Scalars["String"]["input"];
  readonly shownStartingAt: Scalars["DateTimeISO"]["input"];
  readonly title: Scalars["String"]["input"];
};

export type SetMarathonInput = {
  readonly endDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly startDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly year: Scalars["String"]["input"];
};

export type SetPersonInput = {
  readonly captainOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly email?: InputMaybe<Scalars["EmailAddress"]["input"]>;
  readonly linkblue?: InputMaybe<Scalars["String"]["input"]>;
  readonly memberOf?: InputMaybe<ReadonlyArray<MemberOf>>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
};

export type SetPointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars["GlobalId"]["input"]>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
  readonly opportunityDate?: InputMaybe<Scalars["DateTimeISO"]["input"]>;
  readonly type?: InputMaybe<TeamType>;
};

export type SetTeamInput = {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly name?: InputMaybe<Scalars["String"]["input"]>;
  readonly persistentIdentifier?: InputMaybe<Scalars["String"]["input"]>;
  readonly type?: InputMaybe<TeamType>;
};

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
export type TeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type TeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: ReadonlyArray<Scalars["String"]["input"]>;
};

export type TeamResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: TeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars["Boolean"]["input"]>;
  readonly value: Scalars["String"]["input"];
};

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

export type UpdateFundraisingAssignmentInput = {
  readonly amount: Scalars["Float"]["input"];
};

export type ActiveMarathonQueryVariables = Exact<{ [key: string]: never }>;

export type ActiveMarathonQuery = {
  readonly __typename?: "Query";
  readonly latestMarathon?: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
    readonly year: string;
    readonly startDate?: Date | string | null;
    readonly endDate?: Date | string | null;
  } | null;
  readonly marathons: {
    readonly __typename?: "ListMarathonsResponse";
    readonly data: ReadonlyArray<{
      readonly __typename?: "MarathonNode";
      readonly id: string;
      readonly year: string;
    }>;
  };
};

export type SelectedMarathonQueryVariables = Exact<{
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type SelectedMarathonQuery = {
  readonly __typename?: "Query";
  readonly marathon: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
    readonly year: string;
    readonly startDate?: Date | string | null;
    readonly endDate?: Date | string | null;
  };
};

export type ViewTeamPageQueryVariables = Exact<{
  teamUuid: Scalars["GlobalId"]["input"];
}>;

export type ViewTeamPageQuery = {
  readonly __typename?: "Query";
  readonly team: {
    readonly __typename?: "SingleTeamResponse";
    readonly data: {
      readonly __typename?: "TeamNode";
      readonly pointEntries: ReadonlyArray<
        { readonly __typename?: "PointEntryNode" } & {
          " $fragmentRefs"?: {
            PointEntryTableFragmentFragment: PointEntryTableFragmentFragment;
          };
        }
      >;
    } & {
      " $fragmentRefs"?: {
        PointEntryCreatorFragmentFragment: PointEntryCreatorFragmentFragment;
        TeamViewerFragmentFragment: TeamViewerFragmentFragment;
      };
    };
  };
};

export type DeleteEventMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type DeleteEventMutation = {
  readonly __typename?: "Mutation";
  readonly deleteEvent: {
    readonly __typename?: "DeleteEventResponse";
    readonly ok: boolean;
  };
};

export type CreateImageMutationVariables = Exact<{
  input: CreateImageInput;
}>;

export type CreateImageMutation = {
  readonly __typename?: "Mutation";
  readonly createImage: {
    readonly __typename?: "ImageNode";
    readonly id: string;
  };
};

export type ImagePickerQueryVariables = Exact<{
  stringFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedStringFilterItem>
    | ImageResolverKeyedStringFilterItem
  >;
}>;

export type ImagePickerQuery = {
  readonly __typename?: "Query";
  readonly images: {
    readonly __typename?: "ListImagesResponse";
    readonly data: ReadonlyArray<{
      readonly __typename?: "ImageNode";
      readonly id: string;
      readonly alt?: string | null;
      readonly url?: URL | string | null;
    }>;
  };
};

export type DeletePersonMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type DeletePersonMutation = {
  readonly __typename?: "Mutation";
  readonly deletePerson: {
    readonly __typename?: "PersonNode";
    readonly id: string;
  };
};

export type PersonSearchQueryVariables = Exact<{
  search: Scalars["String"]["input"];
}>;

export type PersonSearchQuery = {
  readonly __typename?: "Query";
  readonly searchPeopleByName: ReadonlyArray<{
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
    readonly linkblue?: string | null;
  }>;
  readonly personByLinkBlue?: {
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
    readonly linkblue?: string | null;
  } | null;
};

export type DeletePointEntryMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type DeletePointEntryMutation = {
  readonly __typename?: "Mutation";
  readonly deletePointEntry: {
    readonly __typename?: "DeletePointEntryResponse";
    readonly ok: boolean;
  };
};

export type DeleteTeamMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type DeleteTeamMutation = {
  readonly __typename?: "Mutation";
  readonly deleteTeam: {
    readonly __typename?: "DeleteTeamResponse";
    readonly ok: boolean;
  };
};

export type CommitConfigChangesMutationVariables = Exact<{
  changes: ReadonlyArray<CreateConfigurationInput> | CreateConfigurationInput;
}>;

export type CommitConfigChangesMutation = {
  readonly __typename?: "Mutation";
  readonly createConfigurations: {
    readonly __typename?: "CreateConfigurationResponse";
    readonly ok: boolean;
  };
};

export type ConfigFragmentFragment = {
  readonly __typename?: "ConfigurationNode";
  readonly id: string;
  readonly key: string;
  readonly value: string;
  readonly validAfter?: Date | string | null;
  readonly validUntil?: Date | string | null;
  readonly createdAt?: Date | string | null;
} & { " $fragmentName"?: "ConfigFragmentFragment" };

export type ConfigQueryQueryVariables = Exact<{ [key: string]: never }>;

export type ConfigQueryQuery = {
  readonly __typename?: "Query";
  readonly allConfigurations: {
    readonly __typename?: "GetAllConfigurationsResponse";
    readonly data: ReadonlyArray<
      { readonly __typename?: "ConfigurationNode" } & {
        " $fragmentRefs"?: { ConfigFragmentFragment: ConfigFragmentFragment };
      }
    >;
  };
};

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;

export type CreateEventMutation = {
  readonly __typename?: "Mutation";
  readonly createEvent: {
    readonly __typename?: "CreateEventResponse";
    readonly data: { readonly __typename?: "EventNode"; readonly id: string };
  };
};

export type EventEditorFragmentFragment = {
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
    readonly url?: URL | string | null;
    readonly width: number;
    readonly height: number;
    readonly thumbHash?: string | null;
    readonly alt?: string | null;
  }>;
} & { " $fragmentName"?: "EventEditorFragmentFragment" };

export type SaveEventMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
  input: SetEventInput;
}>;

export type SaveEventMutation = {
  readonly __typename?: "Mutation";
  readonly setEvent: {
    readonly __typename?: "SetEventResponse";
    readonly data: { readonly __typename?: "EventNode" } & {
      " $fragmentRefs"?: {
        EventEditorFragmentFragment: EventEditorFragmentFragment;
      };
    };
  };
};

export type CreateMarathonMutationVariables = Exact<{
  input: CreateMarathonInput;
}>;

export type CreateMarathonMutation = {
  readonly __typename?: "Mutation";
  readonly createMarathon: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
  };
};

export type EditMarathonMutationVariables = Exact<{
  input: SetMarathonInput;
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type EditMarathonMutation = {
  readonly __typename?: "Mutation";
  readonly setMarathon: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
  };
};

export type GetMarathonQueryVariables = Exact<{
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type GetMarathonQuery = {
  readonly __typename?: "Query";
  readonly marathon: {
    readonly __typename?: "MarathonNode";
    readonly year: string;
    readonly startDate?: Date | string | null;
    readonly endDate?: Date | string | null;
  };
};

export type SingleNotificationFragmentFragment = {
  readonly __typename?: "NotificationNode";
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly deliveryIssue?: string | null;
  readonly deliveryIssueAcknowledgedAt?: Date | string | null;
  readonly sendAt?: Date | string | null;
  readonly startedSendingAt?: Date | string | null;
  readonly createdAt?: Date | string | null;
  readonly deliveryCount: number;
  readonly deliveryIssueCount: {
    readonly __typename?: "NotificationDeliveryIssueCount";
    readonly DeviceNotRegistered: number;
    readonly InvalidCredentials: number;
    readonly MessageRateExceeded: number;
    readonly MessageTooBig: number;
    readonly MismatchSenderId: number;
    readonly Unknown: number;
  };
} & { " $fragmentName"?: "SingleNotificationFragmentFragment" };

export type CreateNotificationMutationVariables = Exact<{
  title: Scalars["String"]["input"];
  body: Scalars["String"]["input"];
  audience: NotificationAudienceInput;
  url?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type CreateNotificationMutation = {
  readonly __typename?: "Mutation";
  readonly stageNotification: {
    readonly __typename?: "StageNotificationResponse";
    readonly uuid: string;
  };
};

export type CancelNotificationScheduleMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type CancelNotificationScheduleMutation = {
  readonly __typename?: "Mutation";
  readonly abortScheduledNotification: {
    readonly __typename?: "AbortScheduledNotificationResponse";
    readonly ok: boolean;
  };
};

export type DeleteNotificationMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
  force?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type DeleteNotificationMutation = {
  readonly __typename?: "Mutation";
  readonly deleteNotification: {
    readonly __typename?: "DeleteNotificationResponse";
    readonly ok: boolean;
  };
};

export type SendNotificationMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type SendNotificationMutation = {
  readonly __typename?: "Mutation";
  readonly sendNotification: {
    readonly __typename?: "SendNotificationResponse";
    readonly ok: boolean;
  };
};

export type ScheduleNotificationMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
  sendAt: Scalars["DateTimeISO"]["input"];
}>;

export type ScheduleNotificationMutation = {
  readonly __typename?: "Mutation";
  readonly scheduleNotification: {
    readonly __typename?: "ScheduleNotificationResponse";
    readonly ok: boolean;
  };
};

export type TeamNameFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly committeeIdentifier?: CommitteeIdentifier | null;
  readonly marathon: {
    readonly __typename?: "MarathonNode";
    readonly year: string;
  };
} & { " $fragmentName"?: "TeamNameFragmentFragment" };

export type PersonBulkCreatorMutationVariables = Exact<{
  input: ReadonlyArray<BulkPersonInput> | BulkPersonInput;
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type PersonBulkCreatorMutation = {
  readonly __typename?: "Mutation";
  readonly bulkLoadPeople: ReadonlyArray<{
    readonly __typename?: "PersonNode";
    readonly id: string;
  }>;
};

export type PersonCreatorMutationVariables = Exact<{
  input: CreatePersonInput;
}>;

export type PersonCreatorMutation = {
  readonly __typename?: "Mutation";
  readonly createPerson: {
    readonly __typename?: "PersonNode";
    readonly id: string;
  };
};

export type PersonEditorFragmentFragment = {
  readonly __typename?: "PersonNode";
  readonly id: string;
  readonly name?: string | null;
  readonly linkblue?: string | null;
  readonly email: string;
  readonly teams: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly position: MembershipPositionType;
    readonly committeeRole?: CommitteeRole | null;
    readonly team: {
      readonly __typename?: "TeamNode";
      readonly id: string;
      readonly name: string;
      readonly committeeIdentifier?: CommitteeIdentifier | null;
      readonly marathon: {
        readonly __typename?: "MarathonNode";
        readonly year: string;
      };
    };
  }>;
} & { " $fragmentName"?: "PersonEditorFragmentFragment" };

export type PersonEditorMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
  input: SetPersonInput;
}>;

export type PersonEditorMutation = {
  readonly __typename?: "Mutation";
  readonly setPerson: {
    readonly __typename?: "PersonNode";
    readonly id: string;
  };
};

export type PointEntryCreatorFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly members: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly person: {
      readonly __typename?: "PersonNode";
      readonly id: string;
    };
  }>;
} & { " $fragmentName"?: "PointEntryCreatorFragmentFragment" };

export type CreatePointEntryMutationVariables = Exact<{
  input: CreatePointEntryInput;
}>;

export type CreatePointEntryMutation = {
  readonly __typename?: "Mutation";
  readonly createPointEntry: {
    readonly __typename?: "CreatePointEntryResponse";
    readonly data: {
      readonly __typename?: "PointEntryNode";
      readonly id: string;
    };
  };
};

export type CreatePointEntryAndAssignMutationVariables = Exact<{
  input: CreatePointEntryInput;
  person: Scalars["GlobalId"]["input"];
  team: Scalars["GlobalId"]["input"];
}>;

export type CreatePointEntryAndAssignMutation = {
  readonly __typename?: "Mutation";
  readonly addPersonToTeam: {
    readonly __typename?: "MembershipNode";
    readonly id: string;
  };
  readonly createPointEntry: {
    readonly __typename?: "CreatePointEntryResponse";
    readonly data: {
      readonly __typename?: "PointEntryNode";
      readonly id: string;
    };
  };
};

export type GetPersonByUuidQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type GetPersonByUuidQuery = {
  readonly __typename?: "Query";
  readonly person: {
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
    readonly linkblue?: string | null;
    readonly teams: ReadonlyArray<{
      readonly __typename?: "MembershipNode";
      readonly team: { readonly __typename?: "TeamNode"; readonly id: string };
    }>;
  };
};

export type GetPersonByLinkBlueQueryVariables = Exact<{
  linkBlue: Scalars["String"]["input"];
}>;

export type GetPersonByLinkBlueQuery = {
  readonly __typename?: "Query";
  readonly personByLinkBlue?: {
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
  } | null;
};

export type SearchPersonByNameQueryVariables = Exact<{
  name: Scalars["String"]["input"];
}>;

export type SearchPersonByNameQuery = {
  readonly __typename?: "Query";
  readonly searchPeopleByName: ReadonlyArray<{
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
  }>;
};

export type CreatePersonByLinkBlueMutationVariables = Exact<{
  linkBlue: Scalars["String"]["input"];
  email: Scalars["EmailAddress"]["input"];
}>;

export type CreatePersonByLinkBlueMutation = {
  readonly __typename?: "Mutation";
  readonly createPerson: {
    readonly __typename?: "PersonNode";
    readonly id: string;
  };
};

export type PointEntryOpportunityLookupQueryVariables = Exact<{
  name: Scalars["String"]["input"];
  marathonUuid: Scalars["String"]["input"];
}>;

export type PointEntryOpportunityLookupQuery = {
  readonly __typename?: "Query";
  readonly pointOpportunities: {
    readonly __typename?: "ListPointOpportunitiesResponse";
    readonly data: ReadonlyArray<{
      readonly __typename?: "PointOpportunityNode";
      readonly name: string;
      readonly id: string;
    }>;
  };
};

export type CreatePointOpportunityMutationVariables = Exact<{
  input: CreatePointOpportunityInput;
}>;

export type CreatePointOpportunityMutation = {
  readonly __typename?: "Mutation";
  readonly createPointOpportunity: {
    readonly __typename?: "CreatePointOpportunityResponse";
    readonly uuid: string;
  };
};

export type TeamBulkCreatorMutationVariables = Exact<{
  input: ReadonlyArray<BulkTeamInput> | BulkTeamInput;
  marathonId: Scalars["GlobalId"]["input"];
}>;

export type TeamBulkCreatorMutation = {
  readonly __typename?: "Mutation";
  readonly bulkLoadTeams: ReadonlyArray<{
    readonly __typename?: "TeamNode";
    readonly id: string;
  }>;
};

export type TeamCreatorMutationVariables = Exact<{
  input: CreateTeamInput;
  marathonUuid: Scalars["GlobalId"]["input"];
}>;

export type TeamCreatorMutation = {
  readonly __typename?: "Mutation";
  readonly createTeam: {
    readonly __typename?: "CreateTeamResponse";
    readonly ok: boolean;
    readonly uuid: string;
  };
};

export type TeamEditorFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly legacyStatus: TeamLegacyStatus;
  readonly type: TeamType;
  readonly marathon: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
    readonly year: string;
  };
} & { " $fragmentName"?: "TeamEditorFragmentFragment" };

export type TeamEditorMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
  input: SetTeamInput;
}>;

export type TeamEditorMutation = {
  readonly __typename?: "Mutation";
  readonly setTeam: {
    readonly __typename?: "SingleTeamResponse";
    readonly ok: boolean;
  };
};

export type MasqueradeSelectorQueryVariables = Exact<{
  search: Scalars["String"]["input"];
}>;

export type MasqueradeSelectorQuery = {
  readonly __typename?: "Query";
  readonly searchPeopleByName: ReadonlyArray<{
    readonly __typename?: "PersonNode";
    readonly id: string;
    readonly name?: string | null;
  }>;
};

export type EventsTableFragmentFragment = {
  readonly __typename?: "EventNode";
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly summary?: string | null;
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
} & { " $fragmentName"?: "EventsTableFragmentFragment" };

export type EventsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<
    | ReadonlyArray<EventResolverKeyedDateFilterItem>
    | EventResolverKeyedDateFilterItem
  >;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<EventResolverKeyedIsNullFilterItem>
    | EventResolverKeyedIsNullFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<EventResolverKeyedOneOfFilterItem>
    | EventResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<EventResolverKeyedStringFilterItem>
    | EventResolverKeyedStringFilterItem
  >;
}>;

export type EventsTableQuery = {
  readonly __typename?: "Query";
  readonly events: {
    readonly __typename?: "ListEventsResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "EventNode" } & {
        " $fragmentRefs"?: {
          EventsTableFragmentFragment: EventsTableFragmentFragment;
        };
      }
    >;
  };
};

export type ImagesTableFragmentFragment = {
  readonly __typename?: "ImageNode";
  readonly id: string;
  readonly url?: URL | string | null;
  readonly thumbHash?: string | null;
  readonly height: number;
  readonly width: number;
  readonly alt?: string | null;
  readonly mimeType: string;
  readonly createdAt?: Date | string | null;
} & { " $fragmentName"?: "ImagesTableFragmentFragment" };

export type ImagesTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedDateFilterItem>
    | ImageResolverKeyedDateFilterItem
  >;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedIsNullFilterItem>
    | ImageResolverKeyedIsNullFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedOneOfFilterItem>
    | ImageResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedStringFilterItem>
    | ImageResolverKeyedStringFilterItem
  >;
  numericFilters?: InputMaybe<
    | ReadonlyArray<ImageResolverKeyedNumericFilterItem>
    | ImageResolverKeyedNumericFilterItem
  >;
}>;

export type ImagesTableQuery = {
  readonly __typename?: "Query";
  readonly images: {
    readonly __typename?: "ListImagesResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "ImageNode" } & {
        " $fragmentRefs"?: {
          ImagesTableFragmentFragment: ImagesTableFragmentFragment;
        };
      }
    >;
  };
};

export type PeopleTableFragmentFragment = {
  readonly __typename?: "PersonNode";
  readonly id: string;
  readonly name?: string | null;
  readonly linkblue?: string | null;
  readonly email: string;
  readonly dbRole: DbRole;
  readonly primaryCommittee?: {
    readonly __typename?: "CommitteeMembershipNode";
    readonly identifier: CommitteeIdentifier;
    readonly role: CommitteeRole;
  } | null;
} & { " $fragmentName"?: "PeopleTableFragmentFragment" };

export type PeopleTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<PersonResolverKeyedIsNullFilterItem>
    | PersonResolverKeyedIsNullFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<PersonResolverKeyedOneOfFilterItem>
    | PersonResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<PersonResolverKeyedStringFilterItem>
    | PersonResolverKeyedStringFilterItem
  >;
}>;

export type PeopleTableQuery = {
  readonly __typename?: "Query";
  readonly listPeople: {
    readonly __typename?: "ListPeopleResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "PersonNode" } & {
        " $fragmentRefs"?: {
          PeopleTableFragmentFragment: PeopleTableFragmentFragment;
        };
      }
    >;
  };
};

export type TeamsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<TeamResolverKeyedIsNullFilterItem>
    | TeamResolverKeyedIsNullFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<TeamResolverKeyedOneOfFilterItem>
    | TeamResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<TeamResolverKeyedStringFilterItem>
    | TeamResolverKeyedStringFilterItem
  >;
}>;

export type TeamsTableQuery = {
  readonly __typename?: "Query";
  readonly teams: {
    readonly __typename?: "ListTeamsResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "TeamNode" } & {
        " $fragmentRefs"?: {
          TeamsTableFragmentFragment: TeamsTableFragmentFragment;
        };
      }
    >;
  };
};

export type TeamsTableFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly type: TeamType;
  readonly name: string;
  readonly legacyStatus: TeamLegacyStatus;
  readonly totalPoints: number;
} & { " $fragmentName"?: "TeamsTableFragmentFragment" };

export type MarathonTableFragmentFragment = {
  readonly __typename?: "MarathonNode";
  readonly id: string;
  readonly year: string;
  readonly startDate?: Date | string | null;
  readonly endDate?: Date | string | null;
} & { " $fragmentName"?: "MarathonTableFragmentFragment" };

export type NotificationDeliveriesTableFragmentFragment = {
  readonly __typename?: "NotificationDeliveryNode";
  readonly id: string;
  readonly deliveryError?: string | null;
  readonly receiptCheckedAt?: Date | string | null;
  readonly sentAt?: Date | string | null;
} & { " $fragmentName"?: "NotificationDeliveriesTableFragmentFragment" };

export type NotificationDeliveriesTableQueryQueryVariables = Exact<{
  notificationId: Scalars["GlobalId"]["input"];
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<
    | ReadonlyArray<NotificationDeliveryResolverKeyedDateFilterItem>
    | NotificationDeliveryResolverKeyedDateFilterItem
  >;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<NotificationDeliveryResolverKeyedIsNullFilterItem>
    | NotificationDeliveryResolverKeyedIsNullFilterItem
  >;
}>;

export type NotificationDeliveriesTableQueryQuery = {
  readonly __typename?: "Query";
  readonly notificationDeliveries: {
    readonly __typename?: "ListNotificationDeliveriesResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "NotificationDeliveryNode" } & {
        " $fragmentRefs"?: {
          NotificationDeliveriesTableFragmentFragment: NotificationDeliveriesTableFragmentFragment;
        };
      }
    >;
  };
};

export type NotificationsTableFragmentFragment = {
  readonly __typename?: "NotificationNode";
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly deliveryIssue?: string | null;
  readonly deliveryIssueAcknowledgedAt?: Date | string | null;
  readonly sendAt?: Date | string | null;
  readonly startedSendingAt?: Date | string | null;
} & { " $fragmentName"?: "NotificationsTableFragmentFragment" };

export type NotificationsTableQueryQueryVariables = Exact<{
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<
    | ReadonlyArray<NotificationResolverKeyedDateFilterItem>
    | NotificationResolverKeyedDateFilterItem
  >;
  isNullFilters?: InputMaybe<
    | ReadonlyArray<NotificationResolverKeyedIsNullFilterItem>
    | NotificationResolverKeyedIsNullFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<NotificationResolverKeyedOneOfFilterItem>
    | NotificationResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<NotificationResolverKeyedStringFilterItem>
    | NotificationResolverKeyedStringFilterItem
  >;
}>;

export type NotificationsTableQueryQuery = {
  readonly __typename?: "Query";
  readonly notifications: {
    readonly __typename?: "ListNotificationsResponse";
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly data: ReadonlyArray<
      { readonly __typename?: "NotificationNode" } & {
        " $fragmentRefs"?: {
          NotificationsTableFragmentFragment: NotificationsTableFragmentFragment;
        };
      }
    >;
  };
};

export type PointEntryTableFragmentFragment = {
  readonly __typename?: "PointEntryNode";
  readonly id: string;
  readonly points: number;
  readonly comment?: string | null;
  readonly personFrom?: {
    readonly __typename?: "PersonNode";
    readonly name?: string | null;
    readonly linkblue?: string | null;
  } | null;
  readonly pointOpportunity?: {
    readonly __typename?: "PointOpportunityNode";
    readonly name: string;
    readonly opportunityDate?: Date | string | null;
  } | null;
} & { " $fragmentName"?: "PointEntryTableFragmentFragment" };

export type EventViewerFragmentFragment = {
  readonly __typename?: "EventNode";
  readonly id: string;
  readonly title: string;
  readonly summary?: string | null;
  readonly description?: string | null;
  readonly location?: string | null;
  readonly createdAt?: Date | string | null;
  readonly updatedAt?: Date | string | null;
  readonly occurrences: ReadonlyArray<{
    readonly __typename?: "EventOccurrenceNode";
    readonly fullDay: boolean;
    readonly interval: {
      readonly __typename?: "IntervalISO";
      readonly start: Date | string;
      readonly end: Date | string;
    };
  }>;
  readonly images: ReadonlyArray<{
    readonly __typename?: "ImageNode";
    readonly url?: URL | string | null;
    readonly width: number;
    readonly height: number;
    readonly thumbHash?: string | null;
    readonly alt?: string | null;
  }>;
} & { " $fragmentName"?: "EventViewerFragmentFragment" };

export type MarathonViewerFragmentFragment = {
  readonly __typename?: "MarathonNode";
  readonly id: string;
  readonly year: string;
  readonly startDate?: Date | string | null;
  readonly endDate?: Date | string | null;
  readonly hours: ReadonlyArray<{
    readonly __typename?: "MarathonHourNode";
    readonly id: string;
    readonly shownStartingAt: Date | string;
    readonly title: string;
  }>;
} & { " $fragmentName"?: "MarathonViewerFragmentFragment" };

export type PersonViewerFragmentFragment = {
  readonly __typename?: "PersonNode";
  readonly id: string;
  readonly name?: string | null;
  readonly linkblue?: string | null;
  readonly email: string;
  readonly dbRole: DbRole;
  readonly teams: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly position: MembershipPositionType;
    readonly committeeRole?: CommitteeRole | null;
    readonly team: {
      readonly __typename?: "TeamNode";
      readonly id: string;
      readonly name: string;
      readonly committeeIdentifier?: CommitteeIdentifier | null;
      readonly marathon: {
        readonly __typename?: "MarathonNode";
        readonly year: string;
      };
    };
  }>;
} & { " $fragmentName"?: "PersonViewerFragmentFragment" };

export type TeamViewerFragmentFragment = {
  readonly __typename?: "TeamNode";
  readonly id: string;
  readonly name: string;
  readonly legacyStatus: TeamLegacyStatus;
  readonly totalPoints: number;
  readonly type: TeamType;
  readonly marathon: {
    readonly __typename?: "MarathonNode";
    readonly id: string;
    readonly year: string;
  };
  readonly members: ReadonlyArray<{
    readonly __typename?: "MembershipNode";
    readonly position: MembershipPositionType;
    readonly person: {
      readonly __typename?: "PersonNode";
      readonly id: string;
      readonly name?: string | null;
      readonly linkblue?: string | null;
    };
  }>;
} & { " $fragmentName"?: "TeamViewerFragmentFragment" };

export type AssignToTeamMutationVariables = Exact<{
  person: Scalars["GlobalId"]["input"];
  team: Scalars["GlobalId"]["input"];
  position?: InputMaybe<MembershipPositionType>;
}>;

export type AssignToTeamMutation = {
  readonly __typename?: "Mutation";
  readonly addPersonToTeam: {
    readonly __typename?: "MembershipNode";
    readonly id: string;
  };
};

export type RemoveFromTeamMutationVariables = Exact<{
  person: Scalars["GlobalId"]["input"];
  team: Scalars["GlobalId"]["input"];
}>;

export type RemoveFromTeamMutation = {
  readonly __typename?: "Mutation";
  readonly removePersonFromTeam: {
    readonly __typename?: "MembershipNode";
    readonly id: string;
  };
};

export type LoginStateQueryVariables = Exact<{ [key: string]: never }>;

export type LoginStateQuery = {
  readonly __typename?: "Query";
  readonly loginState: {
    readonly __typename?: "LoginState";
    readonly loggedIn: boolean;
    readonly dbRole: DbRole;
    readonly effectiveCommitteeRoles: ReadonlyArray<{
      readonly __typename?: "EffectiveCommitteeRole";
      readonly role: CommitteeRole;
      readonly identifier: CommitteeIdentifier;
    }>;
  };
};

export type LogsPageQueryVariables = Exact<{ [key: string]: never }>;

export type LogsPageQuery = {
  readonly __typename?: "Query";
  readonly auditLog: string;
};

export type DbFundsEntryViewerQueryVariables = Exact<{
  year: Scalars["String"]["input"];
  dbNum: Scalars["Int"]["input"];
}>;

export type DbFundsEntryViewerQuery = {
  readonly __typename?: "Query";
  readonly rawFundraisingEntries: string;
};

export type DbFundsViewerQueryVariables = Exact<{
  year: Scalars["String"]["input"];
}>;

export type DbFundsViewerQuery = {
  readonly __typename?: "Query";
  readonly rawFundraisingTotals: string;
};

export type EditEventPageQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type EditEventPageQuery = {
  readonly __typename?: "Query";
  readonly event: {
    readonly __typename?: "GetEventByUuidResponse";
    readonly data: { readonly __typename?: "EventNode" } & {
      " $fragmentRefs"?: {
        EventEditorFragmentFragment: EventEditorFragmentFragment;
      };
    };
  };
};

export type ViewEventPageQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type ViewEventPageQuery = {
  readonly __typename?: "Query";
  readonly event: {
    readonly __typename?: "GetEventByUuidResponse";
    readonly data: { readonly __typename?: "EventNode" } & {
      " $fragmentRefs"?: {
        EventViewerFragmentFragment: EventViewerFragmentFragment;
      };
    };
  };
};

export type FeedPageQueryVariables = Exact<{ [key: string]: never }>;

export type FeedPageQuery = {
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
    } | null;
  }>;
};

export type CreateFeedItemMutationVariables = Exact<{
  input: CreateFeedInput;
}>;

export type CreateFeedItemMutation = {
  readonly __typename?: "Mutation";
  readonly createFeedItem: {
    readonly __typename?: "FeedNode";
    readonly id: string;
  };
};

export type DeleteFeedItemMutationVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type DeleteFeedItemMutation = {
  readonly __typename?: "Mutation";
  readonly deleteFeedItem: boolean;
};

export type HomePageQueryVariables = Exact<{ [key: string]: never }>;

export type HomePageQuery = {
  readonly __typename?: "Query";
  readonly me?:
    | ({ readonly __typename?: "PersonNode" } & {
        " $fragmentRefs"?: {
          PersonViewerFragmentFragment: PersonViewerFragmentFragment;
        };
      })
    | null;
};

export type EditMarathonHourDataQueryVariables = Exact<{
  marathonHourUuid: Scalars["GlobalId"]["input"];
}>;

export type EditMarathonHourDataQuery = {
  readonly __typename?: "Query";
  readonly marathonHour: {
    readonly __typename?: "MarathonHourNode";
    readonly details?: string | null;
    readonly durationInfo: string;
    readonly shownStartingAt: Date | string;
    readonly title: string;
  };
};

export type EditMarathonHourMutationVariables = Exact<{
  input: SetMarathonHourInput;
  uuid: Scalars["GlobalId"]["input"];
}>;

export type EditMarathonHourMutation = {
  readonly __typename?: "Mutation";
  readonly setMarathonHour: {
    readonly __typename?: "MarathonHourNode";
    readonly id: string;
  };
};

export type AddMarathonHourMutationVariables = Exact<{
  input: CreateMarathonHourInput;
  marathonUuid: Scalars["GlobalId"]["input"];
}>;

export type AddMarathonHourMutation = {
  readonly __typename?: "Mutation";
  readonly createMarathonHour: {
    readonly __typename?: "MarathonHourNode";
    readonly id: string;
  };
};

export type MarathonPageQueryVariables = Exact<{
  marathonUuid: Scalars["GlobalId"]["input"];
}>;

export type MarathonPageQuery = {
  readonly __typename?: "Query";
  readonly marathon: { readonly __typename?: "MarathonNode" } & {
    " $fragmentRefs"?: {
      MarathonViewerFragmentFragment: MarathonViewerFragmentFragment;
    };
  };
};

export type MarathonOverviewPageQueryVariables = Exact<{
  [key: string]: never;
}>;

export type MarathonOverviewPageQuery = {
  readonly __typename?: "Query";
  readonly latestMarathon?:
    | ({ readonly __typename?: "MarathonNode" } & {
        " $fragmentRefs"?: {
          MarathonViewerFragmentFragment: MarathonViewerFragmentFragment;
        };
      })
    | null;
  readonly marathons: {
    readonly __typename?: "ListMarathonsResponse";
    readonly data: ReadonlyArray<
      { readonly __typename?: "MarathonNode" } & {
        " $fragmentRefs"?: {
          MarathonTableFragmentFragment: MarathonTableFragmentFragment;
        };
      }
    >;
  };
};

export type NotificationViewerQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type NotificationViewerQuery = {
  readonly __typename?: "Query";
  readonly notification: {
    readonly __typename?: "GetNotificationByUuidResponse";
    readonly data: { readonly __typename?: "NotificationNode" } & {
      " $fragmentRefs"?: {
        SingleNotificationFragmentFragment: SingleNotificationFragmentFragment;
      };
    };
  };
};

export type NotificationManagerQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type NotificationManagerQuery = {
  readonly __typename?: "Query";
  readonly notification: {
    readonly __typename?: "GetNotificationByUuidResponse";
    readonly data: { readonly __typename?: "NotificationNode" } & {
      " $fragmentRefs"?: {
        SingleNotificationFragmentFragment: SingleNotificationFragmentFragment;
      };
    };
  };
};

export type EditPersonPageQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type EditPersonPageQuery = {
  readonly __typename?: "Query";
  readonly person: { readonly __typename?: "PersonNode" } & {
    " $fragmentRefs"?: {
      PersonEditorFragmentFragment: PersonEditorFragmentFragment;
    };
  };
  readonly teams: {
    readonly __typename?: "ListTeamsResponse";
    readonly data: ReadonlyArray<
      { readonly __typename?: "TeamNode" } & {
        " $fragmentRefs"?: {
          TeamNameFragmentFragment: TeamNameFragmentFragment;
        };
      }
    >;
  };
};

export type ViewPersonPageQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type ViewPersonPageQuery = {
  readonly __typename?: "Query";
  readonly person: { readonly __typename?: "PersonNode" } & {
    " $fragmentRefs"?: {
      PersonViewerFragmentFragment: PersonViewerFragmentFragment;
    };
  };
};

export type ViewTeamFundraisingDocumentQueryVariables = Exact<{
  teamUuid: Scalars["GlobalId"]["input"];
  page?: InputMaybe<Scalars["Int"]["input"]>;
  pageSize?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<
    ReadonlyArray<Scalars["String"]["input"]> | Scalars["String"]["input"]
  >;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<
    | ReadonlyArray<FundraisingEntryResolverKeyedDateFilterItem>
    | FundraisingEntryResolverKeyedDateFilterItem
  >;
  oneOfFilters?: InputMaybe<
    | ReadonlyArray<FundraisingEntryResolverKeyedOneOfFilterItem>
    | FundraisingEntryResolverKeyedOneOfFilterItem
  >;
  stringFilters?: InputMaybe<
    | ReadonlyArray<FundraisingEntryResolverKeyedStringFilterItem>
    | FundraisingEntryResolverKeyedStringFilterItem
  >;
  numericFilters?: InputMaybe<
    | ReadonlyArray<FundraisingEntryResolverKeyedNumericFilterItem>
    | FundraisingEntryResolverKeyedNumericFilterItem
  >;
}>;

export type ViewTeamFundraisingDocumentQuery = {
  readonly __typename?: "Query";
  readonly team: {
    readonly __typename?: "SingleTeamResponse";
    readonly data: {
      readonly __typename?: "TeamNode";
      readonly dbFundsTeam?: {
        readonly __typename?: "DbFundsTeamInfo";
        readonly dbNum: number;
        readonly name: string;
      } | null;
      readonly members: ReadonlyArray<{
        readonly __typename?: "MembershipNode";
        readonly person: {
          readonly __typename?: "PersonNode";
          readonly id: string;
          readonly name?: string | null;
          readonly linkblue?: string | null;
        };
      }>;
      readonly fundraisingEntries: {
        readonly __typename?: "ListFundraisingEntriesResponse";
        readonly page: number;
        readonly pageSize: number;
        readonly total: number;
        readonly data: ReadonlyArray<{
          readonly __typename?: "FundraisingEntryNode";
          readonly id: string;
          readonly amount: number;
          readonly amountUnassigned: number;
          readonly donatedByText?: string | null;
          readonly donatedToText?: string | null;
          readonly donatedOn: Date | string;
          readonly assignments: ReadonlyArray<{
            readonly __typename?: "FundraisingAssignmentNode";
            readonly id: string;
            readonly amount: number;
            readonly person?: {
              readonly __typename?: "PersonNode";
              readonly id: string;
              readonly name?: string | null;
              readonly linkblue?: string | null;
            } | null;
          }>;
        }>;
      };
    };
  };
};

export type SearchFundraisingTeamQueryVariables = Exact<{
  fundraisingTeamSearch: Scalars["String"]["input"];
}>;

export type SearchFundraisingTeamQuery = {
  readonly __typename?: "Query";
  readonly dbFundsTeams: ReadonlyArray<{
    readonly __typename?: "DbFundsTeamInfo";
    readonly dbNum: number;
    readonly name: string;
  }>;
};

export type SetDbFundsTeamMutationVariables = Exact<{
  teamUuid: Scalars["GlobalId"]["input"];
  dbFundsTeamDbNum: Scalars["Int"]["input"];
}>;

export type SetDbFundsTeamMutation = {
  readonly __typename?: "Mutation";
  readonly assignTeamToDbFundsTeam: void;
};

export type AddFundraisingAssignmentMutationVariables = Exact<{
  entryId: Scalars["GlobalId"]["input"];
  personId: Scalars["GlobalId"]["input"];
  amount: Scalars["Float"]["input"];
}>;

export type AddFundraisingAssignmentMutation = {
  readonly __typename?: "Mutation";
  readonly assignEntryToPerson: {
    readonly __typename?: "FundraisingAssignmentNode";
    readonly id: string;
  };
};

export type UpdateFundraisingAssignmentMutationVariables = Exact<{
  id: Scalars["GlobalId"]["input"];
  amount: Scalars["Float"]["input"];
}>;

export type UpdateFundraisingAssignmentMutation = {
  readonly __typename?: "Mutation";
  readonly updateFundraisingAssignment: {
    readonly __typename?: "FundraisingAssignmentNode";
    readonly id: string;
    readonly amount: number;
    readonly person?: {
      readonly __typename?: "PersonNode";
      readonly name?: string | null;
    } | null;
  };
};

export type DeleteFundraisingAssignmentMutationVariables = Exact<{
  id: Scalars["GlobalId"]["input"];
}>;

export type DeleteFundraisingAssignmentMutation = {
  readonly __typename?: "Mutation";
  readonly deleteFundraisingAssignment: {
    readonly __typename?: "FundraisingAssignmentNode";
    readonly id: string;
  };
};

export type EditTeamPageQueryVariables = Exact<{
  uuid: Scalars["GlobalId"]["input"];
}>;

export type EditTeamPageQuery = {
  readonly __typename?: "Query";
  readonly team: {
    readonly __typename?: "SingleTeamResponse";
    readonly data: { readonly __typename?: "TeamNode" } & {
      " $fragmentRefs"?: {
        TeamEditorFragmentFragment: TeamEditorFragmentFragment;
      };
    };
  };
};

export const ConfigFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ConfigFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "validAfter" } },
          { kind: "Field", name: { kind: "Name", value: "validUntil" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConfigFragmentFragment, unknown>;
export const EventEditorFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventEditorFragment" },
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
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventEditorFragmentFragment, unknown>;
export const SingleNotificationFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "SingleNotificationFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "deliveryIssue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueAcknowledgedAt" },
          },
          { kind: "Field", name: { kind: "Name", value: "sendAt" } },
          { kind: "Field", name: { kind: "Name", value: "startedSendingAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "deliveryCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueCount" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "DeviceNotRegistered" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "InvalidCredentials" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageRateExceeded" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageTooBig" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MismatchSenderId" },
                },
                { kind: "Field", name: { kind: "Name", value: "Unknown" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SingleNotificationFragmentFragment, unknown>;
export const TeamNameFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamNameFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "committeeIdentifier" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamNameFragmentFragment, unknown>;
export const PersonEditorFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PersonEditorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "committeeRole" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "team" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "committeeIdentifier" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "marathon" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "year" },
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
  ],
} as unknown as DocumentNode<PersonEditorFragmentFragment, unknown>;
export const PointEntryCreatorFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PointEntryCreatorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
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
      },
    },
  ],
} as unknown as DocumentNode<PointEntryCreatorFragmentFragment, unknown>;
export const TeamEditorFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamEditorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamEditorFragmentFragment, unknown>;
export const EventsTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventsTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EventNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
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
          { kind: "Field", name: { kind: "Name", value: "summary" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventsTableFragmentFragment, unknown>;
export const ImagesTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "ImagesTableFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "width" } },
          { kind: "Field", name: { kind: "Name", value: "alt" } },
          { kind: "Field", name: { kind: "Name", value: "mimeType" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImagesTableFragmentFragment, unknown>;
export const PeopleTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PeopleTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
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
} as unknown as DocumentNode<PeopleTableFragmentFragment, unknown>;
export const TeamsTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamsTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamsTableFragmentFragment, unknown>;
export const MarathonTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MarathonTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "year" } },
          { kind: "Field", name: { kind: "Name", value: "startDate" } },
          { kind: "Field", name: { kind: "Name", value: "endDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarathonTableFragmentFragment, unknown>;
export const NotificationDeliveriesTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationDeliveriesTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationDeliveryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "deliveryError" } },
          { kind: "Field", name: { kind: "Name", value: "receiptCheckedAt" } },
          { kind: "Field", name: { kind: "Name", value: "sentAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  NotificationDeliveriesTableFragmentFragment,
  unknown
>;
export const NotificationsTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "NotificationsTableFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "deliveryIssue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueAcknowledgedAt" },
          },
          { kind: "Field", name: { kind: "Name", value: "sendAt" } },
          { kind: "Field", name: { kind: "Name", value: "startedSendingAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NotificationsTableFragmentFragment, unknown>;
export const PointEntryTableFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PointEntryTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PointEntryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "personFrom" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "points" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pointOpportunity" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "opportunityDate" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "comment" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PointEntryTableFragmentFragment, unknown>;
export const EventViewerFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "EventViewerFragment" },
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
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventViewerFragmentFragment, unknown>;
export const MarathonViewerFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MarathonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "year" } },
          { kind: "Field", name: { kind: "Name", value: "startDate" } },
          { kind: "Field", name: { kind: "Name", value: "endDate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "hours" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "shownStartingAt" },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarathonViewerFragmentFragment, unknown>;
export const PersonViewerFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PersonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
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
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "marathon" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "year" },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "committeeIdentifier" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "committeeRole" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PersonViewerFragmentFragment, unknown>;
export const TeamViewerFragmentFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
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
                { kind: "Field", name: { kind: "Name", value: "position" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamViewerFragmentFragment, unknown>;
export const ActiveMarathonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ActiveMarathon" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "latestMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "endDate" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sendAll" },
                value: { kind: "BooleanValue", value: true },
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
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "year" } },
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
} as unknown as DocumentNode<ActiveMarathonQuery, ActiveMarathonQueryVariables>;
export const SelectedMarathonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SelectedMarathon" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "marathon" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "endDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SelectedMarathonQuery,
  SelectedMarathonQueryVariables
>;
export const ViewTeamPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewTeamPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "teamUuid" },
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
            name: { kind: "Name", value: "team" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "teamUuid" },
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
                        name: {
                          kind: "Name",
                          value: "PointEntryCreatorFragment",
                        },
                      },
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "TeamViewerFragment" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "pointEntries" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: {
                                kind: "Name",
                                value: "PointEntryTableFragment",
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
      name: { kind: "Name", value: "PointEntryCreatorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
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
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "TeamViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "members" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
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
                { kind: "Field", name: { kind: "Name", value: "position" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PointEntryTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PointEntryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "personFrom" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "points" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "pointOpportunity" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "name" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "opportunityDate" },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "comment" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewTeamPageQuery, ViewTeamPageQueryVariables>;
export const DeleteEventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteEvent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "deleteEvent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>;
export const CreateImageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateImage" },
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
              name: { kind: "Name", value: "CreateImageInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createImage" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateImageMutation, CreateImageMutationVariables>;
export const ImagePickerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ImagePicker" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "images" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "pageSize" },
                value: { kind: "IntValue", value: "9" },
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
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "alt" } },
                      { kind: "Field", name: { kind: "Name", value: "url" } },
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
} as unknown as DocumentNode<ImagePickerQuery, ImagePickerQueryVariables>;
export const DeletePersonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeletePerson" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "deletePerson" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
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
  DeletePersonMutation,
  DeletePersonMutationVariables
>;
export const PersonSearchDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PersonSearch" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
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
            name: { kind: "Name", value: "searchPeopleByName" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "personByLinkBlue" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "linkBlueId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PersonSearchQuery, PersonSearchQueryVariables>;
export const DeletePointEntryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeletePointEntry" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "deletePointEntry" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
} as unknown as DocumentNode<
  DeletePointEntryMutation,
  DeletePointEntryMutationVariables
>;
export const DeleteTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "deleteTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const CommitConfigChangesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CommitConfigChanges" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "changes" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "CreateConfigurationInput" },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createConfigurations" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "changes" },
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
} as unknown as DocumentNode<
  CommitConfigChangesMutation,
  CommitConfigChangesMutationVariables
>;
export const ConfigQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ConfigQuery" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "allConfigurations" },
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
                        name: { kind: "Name", value: "ConfigFragment" },
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
      name: { kind: "Name", value: "ConfigFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "validAfter" } },
          { kind: "Field", name: { kind: "Name", value: "validUntil" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ConfigQueryQuery, ConfigQueryQueryVariables>;
export const CreateEventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateEvent" },
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
              name: { kind: "Name", value: "CreateEventInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createEvent" },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
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
      },
    },
  ],
} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const SaveEventDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SaveEvent" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
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
              name: { kind: "Name", value: "SetEventInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "setEvent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "EventEditorFragment" },
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
      name: { kind: "Name", value: "EventEditorFragment" },
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
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SaveEventMutation, SaveEventMutationVariables>;
export const CreateMarathonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateMarathon" },
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
              name: { kind: "Name", value: "CreateMarathonInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createMarathon" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateMarathonMutation,
  CreateMarathonMutationVariables
>;
export const EditMarathonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "EditMarathon" },
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
              name: { kind: "Name", value: "SetMarathonInput" },
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
            name: { kind: "Name", value: "setMarathon" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonId" },
                },
              },
            ],
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
  EditMarathonMutation,
  EditMarathonMutationVariables
>;
export const GetMarathonDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetMarathon" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "marathon" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonId" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "year" } },
                { kind: "Field", name: { kind: "Name", value: "startDate" } },
                { kind: "Field", name: { kind: "Name", value: "endDate" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetMarathonQuery, GetMarathonQueryVariables>;
export const CreateNotificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateNotification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "title" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "body" } },
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
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "audience" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "NotificationAudienceInput" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "url" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "stageNotification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "title" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "title" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "body" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "body" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "audience" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "audience" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "url" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "url" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "uuid" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateNotificationMutation,
  CreateNotificationMutationVariables
>;
export const CancelNotificationScheduleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CancelNotificationSchedule" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "abortScheduledNotification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
} as unknown as DocumentNode<
  CancelNotificationScheduleMutation,
  CancelNotificationScheduleMutationVariables
>;
export const DeleteNotificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteNotification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "force" },
          },
          type: { kind: "NamedType", name: { kind: "Name", value: "Boolean" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteNotification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "force" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "force" },
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
} as unknown as DocumentNode<
  DeleteNotificationMutation,
  DeleteNotificationMutationVariables
>;
export const SendNotificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SendNotification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "sendNotification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
} as unknown as DocumentNode<
  SendNotificationMutation,
  SendNotificationMutationVariables
>;
export const ScheduleNotificationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "ScheduleNotification" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sendAt" },
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
            name: { kind: "Name", value: "scheduleNotification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sendAt" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sendAt" },
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
} as unknown as DocumentNode<
  ScheduleNotificationMutation,
  ScheduleNotificationMutationVariables
>;
export const PersonBulkCreatorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "PersonBulkCreator" },
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
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "BulkPersonInput" },
                },
              },
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
            name: { kind: "Name", value: "bulkLoadPeople" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "people" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonId" },
                },
              },
            ],
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
  PersonBulkCreatorMutation,
  PersonBulkCreatorMutationVariables
>;
export const PersonCreatorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "PersonCreator" },
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
              name: { kind: "Name", value: "CreatePersonInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPerson" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PersonCreatorMutation,
  PersonCreatorMutationVariables
>;
export const PersonEditorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "PersonEditor" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
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
              name: { kind: "Name", value: "SetPersonInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "setPerson" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PersonEditorMutation,
  PersonEditorMutationVariables
>;
export const CreatePointEntryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePointEntry" },
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
              name: { kind: "Name", value: "CreatePointEntryInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPointEntry" },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
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
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePointEntryMutation,
  CreatePointEntryMutationVariables
>;
export const CreatePointEntryAndAssignDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePointEntryAndAssign" },
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
              name: { kind: "Name", value: "CreatePointEntryInput" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "person" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "team" } },
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
            name: { kind: "Name", value: "addPersonToTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "personUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "person" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "teamUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "team" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "createPointEntry" },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
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
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePointEntryAndAssignMutation,
  CreatePointEntryAndAssignMutationVariables
>;
export const GetPersonByUuidDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPersonByUuid" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "person" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "linkblue" } },
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
                              name: { kind: "Name", value: "id" },
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
  ],
} as unknown as DocumentNode<
  GetPersonByUuidQuery,
  GetPersonByUuidQueryVariables
>;
export const GetPersonByLinkBlueDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPersonByLinkBlue" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "linkBlue" },
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
            name: { kind: "Name", value: "personByLinkBlue" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "linkBlueId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "linkBlue" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPersonByLinkBlueQuery,
  GetPersonByLinkBlueQueryVariables
>;
export const SearchPersonByNameDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchPersonByName" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
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
            name: { kind: "Name", value: "searchPeopleByName" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "name" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SearchPersonByNameQuery,
  SearchPersonByNameQueryVariables
>;
export const CreatePersonByLinkBlueDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePersonByLinkBlue" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "linkBlue" },
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
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "email" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "EmailAddress" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPerson" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "email" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "email" },
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "linkblue" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "linkBlue" },
                      },
                    },
                  ],
                },
              },
            ],
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
  CreatePersonByLinkBlueMutation,
  CreatePersonByLinkBlueMutationVariables
>;
export const PointEntryOpportunityLookupDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PointEntryOpportunityLookup" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
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
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonUuid" },
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
            name: { kind: "Name", value: "pointOpportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "field" },
                      value: { kind: "EnumValue", value: "name" },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "comparison" },
                      value: { kind: "EnumValue", value: "SUBSTRING" },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "value" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "name" },
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "field" },
                      value: { kind: "EnumValue", value: "marathonUuid" },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "value" },
                      value: {
                        kind: "ListValue",
                        values: [
                          {
                            kind: "Variable",
                            name: { kind: "Name", value: "marathonUuid" },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sendAll" },
                value: { kind: "BooleanValue", value: true },
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
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
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
} as unknown as DocumentNode<
  PointEntryOpportunityLookupQuery,
  PointEntryOpportunityLookupQueryVariables
>;
export const CreatePointOpportunityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreatePointOpportunity" },
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
              name: { kind: "Name", value: "CreatePointOpportunityInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createPointOpportunity" },
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
                { kind: "Field", name: { kind: "Name", value: "uuid" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePointOpportunityMutation,
  CreatePointOpportunityMutationVariables
>;
export const TeamBulkCreatorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TeamBulkCreator" },
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
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "BulkTeamInput" },
                },
              },
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
            name: { kind: "Name", value: "bulkLoadTeams" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "teams" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonId" },
                },
              },
            ],
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
  TeamBulkCreatorMutation,
  TeamBulkCreatorMutationVariables
>;
export const TeamCreatorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TeamCreator" },
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
              name: { kind: "Name", value: "CreateTeamInput" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonUuid" },
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
            name: { kind: "Name", value: "createTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathon" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonUuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "ok" } },
                { kind: "Field", name: { kind: "Name", value: "uuid" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamCreatorMutation, TeamCreatorMutationVariables>;
export const TeamEditorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "TeamEditor" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
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
              name: { kind: "Name", value: "SetTeamInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "setTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
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
} as unknown as DocumentNode<TeamEditorMutation, TeamEditorMutationVariables>;
export const MasqueradeSelectorDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MasqueradeSelector" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "search" },
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
            name: { kind: "Name", value: "searchPeopleByName" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "name" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "search" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MasqueradeSelectorQuery,
  MasqueradeSelectorQueryVariables
>;
export const EventsTableDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EventsTable" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dateFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "EventResolverKeyedDateFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "EventResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "EventResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "EventResolverKeyedStringFilterItem",
                },
              },
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
                name: { kind: "Name", value: "page" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "page" },
                },
              },
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
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dateFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dateFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "oneOfFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "EventsTableFragment" },
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
      name: { kind: "Name", value: "EventsTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "EventNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
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
          { kind: "Field", name: { kind: "Name", value: "summary" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EventsTableQuery, EventsTableQueryVariables>;
export const ImagesTableDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ImagesTable" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dateFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedDateFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "numericFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "ImageResolverKeyedNumericFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "images" },
            arguments: [
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
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dateFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dateFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "oneOfFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "numericFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "numericFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "ImagesTableFragment" },
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
      name: { kind: "Name", value: "ImagesTableFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "height" } },
          { kind: "Field", name: { kind: "Name", value: "width" } },
          { kind: "Field", name: { kind: "Name", value: "alt" } },
          { kind: "Field", name: { kind: "Name", value: "mimeType" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ImagesTableQuery, ImagesTableQueryVariables>;
export const PeopleTableDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "PeopleTable" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "PersonResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "PersonResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "PersonResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "listPeople" },
            arguments: [
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
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "oneOfFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "PeopleTableFragment" },
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
      name: { kind: "Name", value: "PeopleTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
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
} as unknown as DocumentNode<PeopleTableQuery, PeopleTableQueryVariables>;
export const TeamsTableDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "TeamsTable" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "TeamResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "TeamResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "TeamResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            arguments: [
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
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "oneOfFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: { kind: "Name", value: "TeamsTableFragment" },
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
      name: { kind: "Name", value: "TeamsTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "totalPoints" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TeamsTableQuery, TeamsTableQueryVariables>;
export const NotificationDeliveriesTableQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NotificationDeliveriesTableQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "notificationId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dateFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationDeliveryResolverKeyedDateFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationDeliveryResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "notificationDeliveries" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "notificationUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "notificationId" },
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
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dateFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dateFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "NotificationDeliveriesTableFragment",
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
      name: { kind: "Name", value: "NotificationDeliveriesTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "NotificationDeliveryNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "deliveryError" } },
          { kind: "Field", name: { kind: "Name", value: "receiptCheckedAt" } },
          { kind: "Field", name: { kind: "Name", value: "sentAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  NotificationDeliveriesTableQueryQuery,
  NotificationDeliveriesTableQueryQueryVariables
>;
export const NotificationsTableQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NotificationsTableQuery" },
      variableDefinitions: [
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dateFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationResolverKeyedDateFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "isNullFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationResolverKeyedIsNullFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "NotificationResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "notifications" },
            arguments: [
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
                name: { kind: "Name", value: "pageSize" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "pageSize" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortBy" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortBy" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "sortDirection" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "dateFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dateFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "isNullFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "isNullFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "oneOfFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "oneOfFilters" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "stringFilters" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "stringFilters" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "page" } },
                { kind: "Field", name: { kind: "Name", value: "pageSize" } },
                { kind: "Field", name: { kind: "Name", value: "total" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "FragmentSpread",
                        name: {
                          kind: "Name",
                          value: "NotificationsTableFragment",
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
      name: { kind: "Name", value: "NotificationsTableFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "deliveryIssue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueAcknowledgedAt" },
          },
          { kind: "Field", name: { kind: "Name", value: "sendAt" } },
          { kind: "Field", name: { kind: "Name", value: "startedSendingAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  NotificationsTableQueryQuery,
  NotificationsTableQueryQueryVariables
>;
export const AssignToTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AssignToTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "person" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "team" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "position" },
          },
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "MembershipPositionType" },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "addPersonToTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "personUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "person" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "teamUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "team" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "position" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "position" },
                },
              },
            ],
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
  AssignToTeamMutation,
  AssignToTeamMutationVariables
>;
export const RemoveFromTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "RemoveFromTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "person" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "team" } },
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
            name: { kind: "Name", value: "removePersonFromTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "personUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "person" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "teamUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "team" },
                },
              },
            ],
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
  RemoveFromTeamMutation,
  RemoveFromTeamMutationVariables
>;
export const LoginStateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LoginState" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "loginState" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "loggedIn" } },
                { kind: "Field", name: { kind: "Name", value: "dbRole" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "effectiveCommitteeRoles" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "identifier" },
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
} as unknown as DocumentNode<LoginStateQuery, LoginStateQueryVariables>;
export const LogsPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "LogsPage" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "auditLog" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogsPageQuery, LogsPageQueryVariables>;
export const DbFundsEntryViewerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DbFundsEntryViewer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "year" } },
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
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dbNum" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "rawFundraisingEntries" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonYear" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "year" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "identifier" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dbNum" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DbFundsEntryViewerQuery,
  DbFundsEntryViewerQueryVariables
>;
export const DbFundsViewerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "DbFundsViewer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "year" } },
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
            name: { kind: "Name", value: "rawFundraisingTotals" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonYear" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "year" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DbFundsViewerQuery, DbFundsViewerQueryVariables>;
export const EditEventPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditEventPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "event" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
                        name: { kind: "Name", value: "EventEditorFragment" },
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
      name: { kind: "Name", value: "EventEditorFragment" },
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
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditEventPageQuery, EditEventPageQueryVariables>;
export const ViewEventPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewEventPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "event" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
                        name: { kind: "Name", value: "EventViewerFragment" },
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
      name: { kind: "Name", value: "EventViewerFragment" },
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
                { kind: "Field", name: { kind: "Name", value: "url" } },
                { kind: "Field", name: { kind: "Name", value: "width" } },
                { kind: "Field", name: { kind: "Name", value: "height" } },
                { kind: "Field", name: { kind: "Name", value: "thumbHash" } },
                { kind: "Field", name: { kind: "Name", value: "alt" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewEventPageQuery, ViewEventPageQueryVariables>;
export const FeedPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FeedPage" },
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
                value: { kind: "NullValue" },
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
} as unknown as DocumentNode<FeedPageQuery, FeedPageQueryVariables>;
export const CreateFeedItemDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateFeedItem" },
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
              name: { kind: "Name", value: "CreateFeedInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createFeedItem" },
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
                { kind: "Field", name: { kind: "Name", value: "id" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateFeedItemMutation,
  CreateFeedItemMutationVariables
>;
export const DeleteFeedItemDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteFeedItem" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "deleteFeedItem" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "feedItemUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteFeedItemMutation,
  DeleteFeedItemMutationVariables
>;
export const HomePageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HomePage" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "me" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PersonViewerFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PersonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
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
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "marathon" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "year" },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "committeeIdentifier" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "committeeRole" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HomePageQuery, HomePageQueryVariables>;
export const EditMarathonHourDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditMarathonHourData" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonHourUuid" },
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
            name: { kind: "Name", value: "marathonHour" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonHourUuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "details" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "durationInfo" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "shownStartingAt" },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  EditMarathonHourDataQuery,
  EditMarathonHourDataQueryVariables
>;
export const EditMarathonHourDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "EditMarathonHour" },
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
              name: { kind: "Name", value: "SetMarathonHourInput" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "setMarathonHour" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
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
  EditMarathonHourMutation,
  EditMarathonHourMutationVariables
>;
export const AddMarathonHourDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddMarathonHour" },
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
              name: { kind: "Name", value: "CreateMarathonHourInput" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonUuid" },
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
            name: { kind: "Name", value: "createMarathonHour" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "marathonUuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonUuid" },
                },
              },
            ],
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
  AddMarathonHourMutation,
  AddMarathonHourMutationVariables
>;
export const MarathonPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MarathonPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "marathonUuid" },
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
            name: { kind: "Name", value: "marathon" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "marathonUuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "MarathonViewerFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MarathonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "year" } },
          { kind: "Field", name: { kind: "Name", value: "startDate" } },
          { kind: "Field", name: { kind: "Name", value: "endDate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "hours" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "shownStartingAt" },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MarathonPageQuery, MarathonPageQueryVariables>;
export const MarathonOverviewPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "MarathonOverviewPage" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "latestMarathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "MarathonViewerFragment" },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathons" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "sendAll" },
                value: { kind: "BooleanValue", value: true },
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
                        name: { kind: "Name", value: "MarathonTableFragment" },
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
      name: { kind: "Name", value: "MarathonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "year" } },
          { kind: "Field", name: { kind: "Name", value: "startDate" } },
          { kind: "Field", name: { kind: "Name", value: "endDate" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "hours" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "shownStartingAt" },
                },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "MarathonTableFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "MarathonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "year" } },
          { kind: "Field", name: { kind: "Name", value: "startDate" } },
          { kind: "Field", name: { kind: "Name", value: "endDate" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarathonOverviewPageQuery,
  MarathonOverviewPageQueryVariables
>;
export const NotificationViewerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NotificationViewer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "notification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
                        name: {
                          kind: "Name",
                          value: "SingleNotificationFragment",
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
      name: { kind: "Name", value: "SingleNotificationFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "deliveryIssue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueAcknowledgedAt" },
          },
          { kind: "Field", name: { kind: "Name", value: "sendAt" } },
          { kind: "Field", name: { kind: "Name", value: "startedSendingAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "deliveryCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueCount" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "DeviceNotRegistered" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "InvalidCredentials" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageRateExceeded" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageTooBig" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MismatchSenderId" },
                },
                { kind: "Field", name: { kind: "Name", value: "Unknown" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  NotificationViewerQuery,
  NotificationViewerQueryVariables
>;
export const NotificationManagerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "NotificationManager" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "notification" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
                        name: {
                          kind: "Name",
                          value: "SingleNotificationFragment",
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
      name: { kind: "Name", value: "SingleNotificationFragment" },
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
          { kind: "Field", name: { kind: "Name", value: "deliveryIssue" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueAcknowledgedAt" },
          },
          { kind: "Field", name: { kind: "Name", value: "sendAt" } },
          { kind: "Field", name: { kind: "Name", value: "startedSendingAt" } },
          { kind: "Field", name: { kind: "Name", value: "createdAt" } },
          { kind: "Field", name: { kind: "Name", value: "deliveryCount" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "deliveryIssueCount" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "DeviceNotRegistered" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "InvalidCredentials" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageRateExceeded" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MessageTooBig" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "MismatchSenderId" },
                },
                { kind: "Field", name: { kind: "Name", value: "Unknown" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  NotificationManagerQuery,
  NotificationManagerQueryVariables
>;
export const EditPersonPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditPersonPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "person" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PersonEditorFragment" },
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
                    { kind: "StringValue", value: "name", block: false },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sortDirection" },
                value: {
                  kind: "ListValue",
                  values: [{ kind: "EnumValue", value: "asc" }],
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
                        name: { kind: "Name", value: "TeamNameFragment" },
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
      name: { kind: "Name", value: "PersonEditorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "teams" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "position" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "committeeRole" },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "team" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "committeeIdentifier" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "marathon" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "year" },
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
      name: { kind: "Name", value: "TeamNameFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "committeeIdentifier" },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditPersonPageQuery, EditPersonPageQueryVariables>;
export const ViewPersonPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewPersonPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "person" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "FragmentSpread",
                  name: { kind: "Name", value: "PersonViewerFragment" },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "PersonViewerFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "PersonNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          { kind: "Field", name: { kind: "Name", value: "linkblue" } },
          { kind: "Field", name: { kind: "Name", value: "email" } },
          { kind: "Field", name: { kind: "Name", value: "dbRole" } },
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
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "marathon" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "year" },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "committeeIdentifier" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "committeeRole" },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewPersonPageQuery, ViewPersonPageQueryVariables>;
export const ViewTeamFundraisingDocumentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ViewTeamFundraisingDocument" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "teamUuid" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
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
            name: { kind: "Name", value: "sortBy" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "sortDirection" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "SortDirection" },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dateFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "FundraisingEntryResolverKeyedDateFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "oneOfFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "FundraisingEntryResolverKeyedOneOfFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "stringFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "FundraisingEntryResolverKeyedStringFilterItem",
                },
              },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "numericFilters" },
          },
          type: {
            kind: "ListType",
            type: {
              kind: "NonNullType",
              type: {
                kind: "NamedType",
                name: {
                  kind: "Name",
                  value: "FundraisingEntryResolverKeyedNumericFilterItem",
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "team" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "teamUuid" },
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
                        name: { kind: "Name", value: "dbFundsTeam" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "dbNum" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "members" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "person" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "linkblue" },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "fundraisingEntries" },
                        arguments: [
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
                            name: { kind: "Name", value: "pageSize" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "pageSize" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "sortBy" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "sortBy" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "sortDirection" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "sortDirection" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "dateFilters" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "dateFilters" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "oneOfFilters" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "oneOfFilters" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "stringFilters" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "stringFilters" },
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "numericFilters" },
                            value: {
                              kind: "Variable",
                              name: { kind: "Name", value: "numericFilters" },
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
                                    name: { kind: "Name", value: "id" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "amount" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "amountUnassigned",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "donatedByText",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "donatedToText",
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "donatedOn" },
                                  },
                                  {
                                    kind: "Field",
                                    name: {
                                      kind: "Name",
                                      value: "assignments",
                                    },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "id" },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "amount",
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: {
                                            kind: "Name",
                                            value: "person",
                                          },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "id",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "name",
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: {
                                                  kind: "Name",
                                                  value: "linkblue",
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
                              kind: "Field",
                              name: { kind: "Name", value: "page" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pageSize" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "total" },
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
  ],
} as unknown as DocumentNode<
  ViewTeamFundraisingDocumentQuery,
  ViewTeamFundraisingDocumentQueryVariables
>;
export const SearchFundraisingTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchFundraisingTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "fundraisingTeamSearch" },
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
            name: { kind: "Name", value: "dbFundsTeams" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "search" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "fundraisingTeamSearch" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "dbNum" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SearchFundraisingTeamQuery,
  SearchFundraisingTeamQueryVariables
>;
export const SetDbFundsTeamDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "SetDbFundsTeam" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "teamUuid" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "dbFundsTeamDbNum" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "assignTeamToDbFundsTeam" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "dbFundsTeamDbNum" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "dbFundsTeamDbNum" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "teamId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "teamUuid" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  SetDbFundsTeamMutation,
  SetDbFundsTeamMutationVariables
>;
export const AddFundraisingAssignmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "AddFundraisingAssignment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "entryId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "personId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "amount" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "assignEntryToPerson" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "entryId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "entryId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "personId" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "personId" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "amount" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "amount" },
                      },
                    },
                  ],
                },
              },
            ],
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
  AddFundraisingAssignmentMutation,
  AddFundraisingAssignmentMutationVariables
>;
export const UpdateFundraisingAssignmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateFundraisingAssignment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GlobalId" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "amount" },
          },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Float" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateFundraisingAssignment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "amount" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "amount" },
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "amount" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "person" },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateFundraisingAssignmentMutation,
  UpdateFundraisingAssignmentMutationVariables
>;
export const DeleteFundraisingAssignmentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteFundraisingAssignment" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
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
            name: { kind: "Name", value: "deleteFundraisingAssignment" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "id" },
                },
              },
            ],
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
  DeleteFundraisingAssignmentMutation,
  DeleteFundraisingAssignmentMutationVariables
>;
export const EditTeamPageDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "EditTeamPage" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "uuid" } },
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
            name: { kind: "Name", value: "team" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "uuid" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "uuid" },
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
                        name: { kind: "Name", value: "TeamEditorFragment" },
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
      name: { kind: "Name", value: "TeamEditorFragment" },
      typeCondition: {
        kind: "NamedType",
        name: { kind: "Name", value: "TeamNode" },
      },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "name" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "marathon" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "year" } },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "legacyStatus" } },
          { kind: "Field", name: { kind: "Name", value: "type" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<EditTeamPageQuery, EditTeamPageQueryVariables>;
