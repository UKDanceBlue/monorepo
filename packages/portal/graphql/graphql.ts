/* eslint-disable */
import type { AuthSource } from '@ukdanceblue/common';
import type { AccessLevel } from '@ukdanceblue/common';
import type { DbRole } from '@ukdanceblue/common';
import type { CommitteeRole } from '@ukdanceblue/common';
import type { CommitteeIdentifier } from '@ukdanceblue/common';
import type { MembershipPositionType } from '@ukdanceblue/common';
import type { TeamLegacyStatus } from '@ukdanceblue/common';
import type { TeamType } from '@ukdanceblue/common';
import type { SortDirection } from '@ukdanceblue/common';
import type { NumericComparator } from '@ukdanceblue/common';
import type { StringComparator } from '@ukdanceblue/common';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: Date | string; output: Date | string; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: string; output: string; }
  /** GlobalId custom scalar type */
  GlobalId: { input: string; output: string; }
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: { input: number; output: number; }
  /** Integers that will have a value greater than 0. */
  PositiveInt: { input: number; output: number; }
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: URL | string; output: URL | string; }
  /** Represents NULL values */
  Void: { input: void; output: void; }
};

export type AbortScheduledNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'AbortScheduledNotificationResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlArrayOkResponse = {
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlCreatedResponse = {
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

/** API response */
export type AbstractGraphQlOkResponse = {
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlPaginatedResponse = {
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export { AccessLevel };

export type AcknowledgeDeliveryIssueResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'AcknowledgeDeliveryIssueResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type AddEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'AddEventImageResponse';
  data: ImageNode;
  ok: Scalars['Boolean']['output'];
};

export type AssignEntryToPersonInput = {
  amount: Scalars['Float']['input'];
};

export { AuthSource };

export type BulkPersonInput = {
  committee?: InputMaybe<CommitteeIdentifier>;
  email: Scalars['EmailAddress']['input'];
  linkblue: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role?: InputMaybe<CommitteeRole>;
};

export type BulkTeamInput = {
  captainLinkblues?: InputMaybe<Array<Scalars['String']['input']>>;
  legacyStatus: TeamLegacyStatus;
  memberLinkblues?: InputMaybe<Array<Scalars['String']['input']>>;
  name: Scalars['String']['input'];
  type: TeamType;
};

export { CommitteeIdentifier };

export type CommitteeMembershipNode = Node & {
  __typename?: 'CommitteeMembershipNode';
  committeeRole?: Maybe<CommitteeRole>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  identifier: CommitteeIdentifier;
  person: PersonNode;
  position: MembershipPositionType;
  role: CommitteeRole;
  team: TeamNode;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type CommitteeNode = Node & {
  __typename?: 'CommitteeNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  identifier: CommitteeIdentifier;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export { CommitteeRole };

export type ConfigurationNode = Node & {
  __typename?: 'ConfigurationNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  key: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  validAfter?: Maybe<Scalars['DateTimeISO']['output']>;
  validUntil?: Maybe<Scalars['DateTimeISO']['output']>;
  value: Scalars['String']['output'];
};

export type CreateConfigurationInput = {
  key: Scalars['String']['input'];
  validAfter?: InputMaybe<Scalars['DateTimeISO']['input']>;
  validUntil?: InputMaybe<Scalars['DateTimeISO']['input']>;
  value: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateConfigurationResponse';
  data: ConfigurationNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export type CreateEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  occurrences: Array<CreateEventOccurrenceInput>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateEventOccurrenceInput = {
  fullDay: Scalars['Boolean']['input'];
  interval: IntervalIsoInput;
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateEventResponse';
  data: EventNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export type CreateFeedInput = {
  imageUuid?: InputMaybe<Scalars['String']['input']>;
  textContent?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateImageInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['URL']['input']>;
};

export type CreateMarathonHourInput = {
  details?: InputMaybe<Scalars['String']['input']>;
  durationInfo: Scalars['String']['input'];
  shownStartingAt: Scalars['DateTimeISO']['input'];
  title: Scalars['String']['input'];
};

export type CreateMarathonInput = {
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  startDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  year: Scalars['String']['input'];
};

export type CreatePersonInput = {
  captainOf?: Array<MemberOf>;
  /** @deprecated DBRole can no longer be set directly */
  dbRole?: InputMaybe<DbRole>;
  email: Scalars['EmailAddress']['input'];
  linkblue?: InputMaybe<Scalars['String']['input']>;
  memberOf?: Array<MemberOf>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePointEntryInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  opportunityUuid?: InputMaybe<Scalars['GlobalId']['input']>;
  personFromUuid?: InputMaybe<Scalars['GlobalId']['input']>;
  points: Scalars['Int']['input'];
  teamUuid: Scalars['GlobalId']['input'];
};

export type CreatePointEntryResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePointEntryResponse';
  data: PointEntryNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export type CreatePointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['GlobalId']['input']>;
  marathonUuid: Scalars['GlobalId']['input'];
  name: Scalars['String']['input'];
  opportunityDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  type: TeamType;
};

export type CreatePointOpportunityResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePointOpportunityResponse';
  data: PointOpportunityNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export type CreateTeamInput = {
  legacyStatus: TeamLegacyStatus;
  name: Scalars['String']['input'];
  type: TeamType;
};

export type CreateTeamResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateTeamResponse';
  data: TeamNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export type DbFundsTeamInfo = {
  __typename?: 'DbFundsTeamInfo';
  dbNum: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export { DbRole };

export type DeleteConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteConfigurationResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeleteDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteDeviceResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeleteEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteEventResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeleteImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteImageResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeleteNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteNotificationResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type DeletePointEntryResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeletePointEntryResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeletePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeletePointOpportunityResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeleteTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteTeamResponse';
  ok: Scalars['Boolean']['output'];
};

export type DeviceNode = Node & {
  __typename?: 'DeviceNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  lastLoggedInUser?: Maybe<PersonNode>;
  lastLogin?: Maybe<Scalars['DateTimeISO']['output']>;
  /** List all notification deliveries for this device */
  notificationDeliveries: Array<NotificationDeliveryNode>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type DeviceNodeNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export const DeviceResolverAllKeys = {
  CreatedAt: 'createdAt',
  ExpoPushToken: 'expoPushToken',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type DeviceResolverAllKeys = typeof DeviceResolverAllKeys[keyof typeof DeviceResolverAllKeys];
export const DeviceResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type DeviceResolverDateFilterKeys = typeof DeviceResolverDateFilterKeys[keyof typeof DeviceResolverDateFilterKeys];
export type DeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type DeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: DeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type DeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const DeviceResolverStringFilterKeys = {
  ExpoPushToken: 'expoPushToken'
} as const;

export type DeviceResolverStringFilterKeys = typeof DeviceResolverStringFilterKeys[keyof typeof DeviceResolverStringFilterKeys];
export type EffectiveCommitteeRole = {
  __typename?: 'EffectiveCommitteeRole';
  identifier: CommitteeIdentifier;
  role: CommitteeRole;
};

export type EventNode = Node & {
  __typename?: 'EventNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['GlobalId']['output'];
  /** List all images for this event */
  images: Array<ImageNode>;
  location?: Maybe<Scalars['String']['output']>;
  occurrences: Array<EventOccurrenceNode>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type EventOccurrenceNode = {
  __typename?: 'EventOccurrenceNode';
  fullDay: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  interval: IntervalIso;
};

export const EventResolverAllKeys = {
  CreatedAt: 'createdAt',
  Description: 'description',
  Location: 'location',
  Occurrence: 'occurrence',
  OccurrenceEnd: 'occurrenceEnd',
  OccurrenceStart: 'occurrenceStart',
  Summary: 'summary',
  Title: 'title',
  UpdatedAt: 'updatedAt'
} as const;

export type EventResolverAllKeys = typeof EventResolverAllKeys[keyof typeof EventResolverAllKeys];
export const EventResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  Occurrence: 'occurrence',
  OccurrenceEnd: 'occurrenceEnd',
  OccurrenceStart: 'occurrenceStart',
  UpdatedAt: 'updatedAt'
} as const;

export type EventResolverDateFilterKeys = typeof EventResolverDateFilterKeys[keyof typeof EventResolverDateFilterKeys];
export type EventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: EventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type EventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: EventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type EventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const EventResolverStringFilterKeys = {
  Description: 'description',
  Location: 'location',
  Summary: 'summary',
  Title: 'title'
} as const;

export type EventResolverStringFilterKeys = typeof EventResolverStringFilterKeys[keyof typeof EventResolverStringFilterKeys];
export type FeedNode = Node & {
  __typename?: 'FeedNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  /** The image associated with this feed item */
  image?: Maybe<ImageNode>;
  textContent?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type FundraisingAssignmentNode = Node & {
  __typename?: 'FundraisingAssignmentNode';
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  entry: FundraisingEntryNode;
  id: Scalars['GlobalId']['output'];
  /** The person assigned to this assignment, only null when access is denied */
  person?: Maybe<PersonNode>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type FundraisingEntryNode = Node & {
  __typename?: 'FundraisingEntryNode';
  amount: Scalars['Float']['output'];
  amountUnassigned: Scalars['Float']['output'];
  assignments: Array<FundraisingAssignmentNode>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  donatedByText?: Maybe<Scalars['String']['output']>;
  donatedOn: Scalars['DateTimeISO']['output'];
  donatedToText?: Maybe<Scalars['String']['output']>;
  id: Scalars['GlobalId']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export const FundraisingEntryResolverAllKeys = {
  Amount: 'amount',
  AmountUnassigned: 'amountUnassigned',
  CreatedAt: 'createdAt',
  DonatedBy: 'donatedBy',
  DonatedOn: 'donatedOn',
  DonatedTo: 'donatedTo',
  UpdatedAt: 'updatedAt'
} as const;

export type FundraisingEntryResolverAllKeys = typeof FundraisingEntryResolverAllKeys[keyof typeof FundraisingEntryResolverAllKeys];
export const FundraisingEntryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  DonatedOn: 'donatedOn',
  UpdatedAt: 'updatedAt'
} as const;

export type FundraisingEntryResolverDateFilterKeys = typeof FundraisingEntryResolverDateFilterKeys[keyof typeof FundraisingEntryResolverDateFilterKeys];
export type FundraisingEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: FundraisingEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type FundraisingEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: FundraisingEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FundraisingEntryResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: FundraisingEntryResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['Float']['input'];
};

export type FundraisingEntryResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: FundraisingEntryResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type FundraisingEntryResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: FundraisingEntryResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const FundraisingEntryResolverNumericFilterKeys = {
  Amount: 'amount',
  AmountUnassigned: 'amountUnassigned'
} as const;

export type FundraisingEntryResolverNumericFilterKeys = typeof FundraisingEntryResolverNumericFilterKeys[keyof typeof FundraisingEntryResolverNumericFilterKeys];
export const FundraisingEntryResolverOneOfFilterKeys = {
  TeamId: 'teamId'
} as const;

export type FundraisingEntryResolverOneOfFilterKeys = typeof FundraisingEntryResolverOneOfFilterKeys[keyof typeof FundraisingEntryResolverOneOfFilterKeys];
export const FundraisingEntryResolverStringFilterKeys = {
  DonatedBy: 'donatedBy',
  DonatedTo: 'donatedTo'
} as const;

export type FundraisingEntryResolverStringFilterKeys = typeof FundraisingEntryResolverStringFilterKeys[keyof typeof FundraisingEntryResolverStringFilterKeys];
export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetAllConfigurationsResponse';
  data: Array<ConfigurationNode>;
  ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetConfigurationByUuidResponse';
  data: ConfigurationNode;
  ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetDeviceByUuidResponse';
  data: DeviceNode;
  ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetEventByUuidResponse';
  data: EventNode;
  ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetImageByUuidResponse';
  data: ImageNode;
  ok: Scalars['Boolean']['output'];
};

export type GetNotificationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetNotificationByUuidResponse';
  data: NotificationNode;
  ok: Scalars['Boolean']['output'];
};

export type GetPointEntryByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetPointEntryByUuidResponse';
  data: PointEntryNode;
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  ok: Scalars['Boolean']['output'];
};

export type ImageNode = Node & {
  __typename?: 'ImageNode';
  alt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['GlobalId']['output'];
  mimeType: Scalars['String']['output'];
  thumbHash?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
  width: Scalars['Int']['output'];
};

export const ImageResolverAllKeys = {
  Alt: 'alt',
  CreatedAt: 'createdAt',
  Height: 'height',
  UpdatedAt: 'updatedAt',
  Width: 'width'
} as const;

export type ImageResolverAllKeys = typeof ImageResolverAllKeys[keyof typeof ImageResolverAllKeys];
export const ImageResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type ImageResolverDateFilterKeys = typeof ImageResolverDateFilterKeys[keyof typeof ImageResolverDateFilterKeys];
export type ImageResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: ImageResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type ImageResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: ImageResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ImageResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: ImageResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['Float']['input'];
};

export type ImageResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type ImageResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: ImageResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const ImageResolverNumericFilterKeys = {
  Height: 'height',
  Width: 'width'
} as const;

export type ImageResolverNumericFilterKeys = typeof ImageResolverNumericFilterKeys[keyof typeof ImageResolverNumericFilterKeys];
export const ImageResolverStringFilterKeys = {
  Alt: 'alt'
} as const;

export type ImageResolverStringFilterKeys = typeof ImageResolverStringFilterKeys[keyof typeof ImageResolverStringFilterKeys];
export type IntervalIso = {
  __typename?: 'IntervalISO';
  end: Scalars['DateTimeISO']['output'];
  start: Scalars['DateTimeISO']['output'];
};

export type IntervalIsoInput = {
  end: Scalars['DateTimeISO']['input'];
  start: Scalars['DateTimeISO']['input'];
};

export type ListDevicesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListDevicesResponse';
  data: Array<DeviceNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListEventsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListEventsResponse';
  data: Array<EventNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListFundraisingEntriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListFundraisingEntriesResponse';
  data: Array<FundraisingEntryNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListImagesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListImagesResponse';
  data: Array<ImageNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListMarathonsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListMarathonsResponse';
  data: Array<MarathonNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListNotificationDeliveriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListNotificationDeliveriesResponse';
  data: Array<NotificationDeliveryNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListNotificationsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListNotificationsResponse';
  data: Array<NotificationNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListPeopleResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListPeopleResponse';
  data: Array<PersonNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListPointEntriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListPointEntriesResponse';
  data: Array<PointEntryNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListPointOpportunitiesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListPointOpportunitiesResponse';
  data: Array<PointOpportunityNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type ListTeamsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListTeamsResponse';
  data: Array<TeamNode>;
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  total: Scalars['NonNegativeInt']['output'];
};

export type LoginState = {
  __typename?: 'LoginState';
  accessLevel: AccessLevel;
  authSource: AuthSource;
  dbRole: DbRole;
  effectiveCommitteeRoles: Array<EffectiveCommitteeRole>;
  loggedIn: Scalars['Boolean']['output'];
};

export type MarathonHourNode = Node & {
  __typename?: 'MarathonHourNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  durationInfo: Scalars['String']['output'];
  id: Scalars['GlobalId']['output'];
  mapImages: Array<ImageNode>;
  shownStartingAt: Scalars['DateTimeISO']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type MarathonNode = Node & {
  __typename?: 'MarathonNode';
  communityDevelopmentCommitteeTeam: TeamNode;
  corporateCommitteeTeam: TeamNode;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  dancerRelationsCommitteeTeam: TeamNode;
  endDate?: Maybe<Scalars['DateTimeISO']['output']>;
  familyRelationsCommitteeTeam: TeamNode;
  fundraisingCommitteeTeam: TeamNode;
  hours: Array<MarathonHourNode>;
  id: Scalars['GlobalId']['output'];
  marketingCommitteeTeam: TeamNode;
  miniMarathonsCommitteeTeam: TeamNode;
  operationsCommitteeTeam: TeamNode;
  overallCommitteeTeam: TeamNode;
  programmingCommitteeTeam: TeamNode;
  startDate?: Maybe<Scalars['DateTimeISO']['output']>;
  techCommitteeTeam: TeamNode;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  viceCommitteeTeam: TeamNode;
  year: Scalars['String']['output'];
};

export const MarathonResolverAllKeys = {
  CreatedAt: 'createdAt',
  EndDate: 'endDate',
  StartDate: 'startDate',
  UpdatedAt: 'updatedAt',
  Year: 'year'
} as const;

export type MarathonResolverAllKeys = typeof MarathonResolverAllKeys[keyof typeof MarathonResolverAllKeys];
export const MarathonResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  EndDate: 'endDate',
  StartDate: 'startDate',
  UpdatedAt: 'updatedAt'
} as const;

export type MarathonResolverDateFilterKeys = typeof MarathonResolverDateFilterKeys[keyof typeof MarathonResolverDateFilterKeys];
export type MarathonResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: MarathonResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type MarathonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MemberOf = {
  committeeRole?: InputMaybe<CommitteeRole>;
  id: Scalars['GlobalId']['input'];
};

export type MembershipNode = Node & {
  __typename?: 'MembershipNode';
  committeeRole?: Maybe<CommitteeRole>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  person: PersonNode;
  position: MembershipPositionType;
  team: TeamNode;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export { MembershipPositionType };

export type Mutation = {
  __typename?: 'Mutation';
  abortScheduledNotification: AbortScheduledNotificationResponse;
  acknowledgeDeliveryIssue: AcknowledgeDeliveryIssueResponse;
  /** Add an existing image to an event */
  addExistingImageToEvent: AddEventImageResponse;
  addMap: MarathonHourNode;
  addPersonToTeam: MembershipNode;
  assignEntryToPerson: FundraisingAssignmentNode;
  assignTeamToDbFundsTeam: Scalars['Void']['output'];
  /** Attach an image to a feed item */
  attachImageToFeedItem: FeedNode;
  bulkLoadPeople: Array<PersonNode>;
  bulkLoadTeams: Array<TeamNode>;
  /** Create a new configuration, superseding existing configurations with the same key (depending on the validAfter and validUntil fields) */
  createConfiguration: CreateConfigurationResponse;
  /** Create multiple configurations, superseding existing configurations with the same key (depending on the validAfter and validUntil fields) */
  createConfigurations: CreateConfigurationResponse;
  /** Create a new event */
  createEvent: CreateEventResponse;
  /** Add a new item to the feed */
  createFeedItem: FeedNode;
  createImage: ImageNode;
  createMarathon: MarathonNode;
  createMarathonHour: MarathonHourNode;
  createPerson: PersonNode;
  createPointEntry: CreatePointEntryResponse;
  createPointOpportunity: CreatePointOpportunityResponse;
  createTeam: CreateTeamResponse;
  /** Delete a configuration by UUID */
  deleteConfiguration: DeleteConfigurationResponse;
  /** Delete a device by it's UUID */
  deleteDevice: DeleteDeviceResponse;
  /** Delete an event by UUID */
  deleteEvent: DeleteEventResponse;
  /** Delete a feed item */
  deleteFeedItem: Scalars['Boolean']['output'];
  deleteFundraisingAssignment: FundraisingAssignmentNode;
  deleteImage: DeleteImageResponse;
  deleteMarathon: MarathonNode;
  deleteMarathonHour: Scalars['Void']['output'];
  deleteNotification: DeleteNotificationResponse;
  deletePerson: PersonNode;
  deletePointEntry: DeletePointEntryResponse;
  deletePointOpportunity: DeletePointOpportunityResponse;
  deleteTeam: DeleteTeamResponse;
  /** Register a new device, or update an existing one */
  registerDevice: RegisterDeviceResponse;
  /** Remove an image from an event */
  removeImageFromEvent: RemoveEventImageResponse;
  /** Remove an image from a feed item */
  removeImageFromFeedItem: FeedNode;
  removeMap: Scalars['Void']['output'];
  removePersonFromTeam: MembershipNode;
  scheduleNotification: ScheduleNotificationResponse;
  /** Send a notification immediately. */
  sendNotification: SendNotificationResponse;
  /** Update an event by UUID */
  setEvent: SetEventResponse;
  /** Set the content of a feed item */
  setFeedItem: FeedNode;
  setImageAltText: ImageNode;
  setImageUrl: ImageNode;
  setMarathon: MarathonNode;
  setMarathonHour: MarathonHourNode;
  setPerson: PersonNode;
  setPointOpportunity: SinglePointOpportunityResponse;
  setTeam: SingleTeamResponse;
  stageNotification: StageNotificationResponse;
  updateFundraisingAssignment: FundraisingAssignmentNode;
};


export type MutationAbortScheduledNotificationArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationAcknowledgeDeliveryIssueArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationAddExistingImageToEventArgs = {
  eventId: Scalars['GlobalId']['input'];
  imageId: Scalars['GlobalId']['input'];
};


export type MutationAddMapArgs = {
  imageUuid: Scalars['GlobalId']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationAddPersonToTeamArgs = {
  personUuid: Scalars['GlobalId']['input'];
  position?: MembershipPositionType;
  teamUuid: Scalars['GlobalId']['input'];
};


export type MutationAssignEntryToPersonArgs = {
  entryId: Scalars['GlobalId']['input'];
  input: AssignEntryToPersonInput;
  personId: Scalars['GlobalId']['input'];
};


export type MutationAssignTeamToDbFundsTeamArgs = {
  dbFundsTeamDbNum: Scalars['Int']['input'];
  teamId: Scalars['GlobalId']['input'];
};


export type MutationAttachImageToFeedItemArgs = {
  feedItemUuid: Scalars['GlobalId']['input'];
  imageUuid: Scalars['GlobalId']['input'];
};


export type MutationBulkLoadPeopleArgs = {
  marathonId: Scalars['GlobalId']['input'];
  people: Array<BulkPersonInput>;
};


export type MutationBulkLoadTeamsArgs = {
  marathonId: Scalars['GlobalId']['input'];
  teams: Array<BulkTeamInput>;
};


export type MutationCreateConfigurationArgs = {
  input: CreateConfigurationInput;
};


export type MutationCreateConfigurationsArgs = {
  input: Array<CreateConfigurationInput>;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateFeedItemArgs = {
  input: CreateFeedInput;
};


export type MutationCreateImageArgs = {
  input: CreateImageInput;
};


export type MutationCreateMarathonArgs = {
  input: CreateMarathonInput;
};


export type MutationCreateMarathonHourArgs = {
  input: CreateMarathonHourInput;
  marathonUuid: Scalars['GlobalId']['input'];
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


export type MutationCreatePointEntryArgs = {
  input: CreatePointEntryInput;
};


export type MutationCreatePointOpportunityArgs = {
  input: CreatePointOpportunityInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
  marathon: Scalars['GlobalId']['input'];
};


export type MutationDeleteConfigurationArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteDeviceArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteEventArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteFeedItemArgs = {
  feedItemUuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteFundraisingAssignmentArgs = {
  id: Scalars['GlobalId']['input'];
};


export type MutationDeleteImageArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteMarathonArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteMarathonHourArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteNotificationArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeletePersonArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeletePointEntryArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeletePointOpportunityArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationDeleteTeamArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};


export type MutationRemoveImageFromEventArgs = {
  eventId: Scalars['GlobalId']['input'];
  imageId: Scalars['GlobalId']['input'];
};


export type MutationRemoveImageFromFeedItemArgs = {
  feedItemUuid: Scalars['GlobalId']['input'];
};


export type MutationRemoveMapArgs = {
  imageUuid: Scalars['GlobalId']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationRemovePersonFromTeamArgs = {
  personUuid: Scalars['GlobalId']['input'];
  teamUuid: Scalars['GlobalId']['input'];
};


export type MutationScheduleNotificationArgs = {
  sendAt: Scalars['DateTimeISO']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSendNotificationArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetEventArgs = {
  input: SetEventInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetFeedItemArgs = {
  feedItemUuid: Scalars['GlobalId']['input'];
  input: SetFeedInput;
};


export type MutationSetImageAltTextArgs = {
  alt: Scalars['String']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetImageUrlArgs = {
  url: Scalars['URL']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetMarathonArgs = {
  input: SetMarathonInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetMarathonHourArgs = {
  input: SetMarathonHourInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetPersonArgs = {
  input: SetPersonInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetPointOpportunityArgs = {
  input: SetPointOpportunityInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetTeamArgs = {
  input: SetTeamInput;
  uuid: Scalars['GlobalId']['input'];
};


export type MutationStageNotificationArgs = {
  audience: NotificationAudienceInput;
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateFundraisingAssignmentArgs = {
  id: Scalars['GlobalId']['input'];
  input: UpdateFundraisingAssignmentInput;
};

export type Node = {
  id: Scalars['GlobalId']['output'];
};

export type NotificationAudienceInput = {
  all?: InputMaybe<Scalars['Boolean']['input']>;
  memberOfTeamType?: InputMaybe<TeamType>;
  memberOfTeams?: InputMaybe<Array<Scalars['GlobalId']['input']>>;
  users?: InputMaybe<Array<Scalars['GlobalId']['input']>>;
};

/** The number of delivery issues for a notification, broken down by type. */
export type NotificationDeliveryIssueCount = {
  __typename?: 'NotificationDeliveryIssueCount';
  DeviceNotRegistered: Scalars['Int']['output'];
  InvalidCredentials: Scalars['Int']['output'];
  MessageRateExceeded: Scalars['Int']['output'];
  MessageTooBig: Scalars['Int']['output'];
  MismatchSenderId: Scalars['Int']['output'];
  Unknown: Scalars['Int']['output'];
};

export type NotificationDeliveryNode = Node & {
  __typename?: 'NotificationDeliveryNode';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  chunkUuid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  deliveryError?: Maybe<Scalars['String']['output']>;
  id: Scalars['GlobalId']['output'];
  notification: NotificationNode;
  /** The time the server received a delivery receipt from the user. */
  receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export const NotificationDeliveryResolverAllKeys = {
  CreatedAt: 'createdAt',
  DeliveryError: 'deliveryError',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type NotificationDeliveryResolverAllKeys = typeof NotificationDeliveryResolverAllKeys[keyof typeof NotificationDeliveryResolverAllKeys];
export const NotificationDeliveryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type NotificationDeliveryResolverDateFilterKeys = typeof NotificationDeliveryResolverDateFilterKeys[keyof typeof NotificationDeliveryResolverDateFilterKeys];
export type NotificationDeliveryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: NotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type NotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationNode = Node & {
  __typename?: 'NotificationNode';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deliveryCount: Scalars['Int']['output'];
  deliveryIssue?: Maybe<Scalars['String']['output']>;
  deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deliveryIssueCount: NotificationDeliveryIssueCount;
  id: Scalars['GlobalId']['output'];
  /** The time the notification is scheduled to be sent, if null it is either already sent or unscheduled. */
  sendAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server started sending the notification. */
  startedSendingAt?: Maybe<Scalars['DateTimeISO']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
};

export const NotificationResolverAllKeys = {
  Body: 'body',
  CreatedAt: 'createdAt',
  DeliveryIssue: 'deliveryIssue',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  Title: 'title',
  UpdatedAt: 'updatedAt'
} as const;

export type NotificationResolverAllKeys = typeof NotificationResolverAllKeys[keyof typeof NotificationResolverAllKeys];
export const NotificationResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  UpdatedAt: 'updatedAt'
} as const;

export type NotificationResolverDateFilterKeys = typeof NotificationResolverDateFilterKeys[keyof typeof NotificationResolverDateFilterKeys];
export type NotificationResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: NotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type NotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: NotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: NotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type NotificationResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: NotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const NotificationResolverOneOfFilterKeys = {
  DeliveryIssue: 'deliveryIssue'
} as const;

export type NotificationResolverOneOfFilterKeys = typeof NotificationResolverOneOfFilterKeys[keyof typeof NotificationResolverOneOfFilterKeys];
export const NotificationResolverStringFilterKeys = {
  Body: 'body',
  Title: 'title'
} as const;

export type NotificationResolverStringFilterKeys = typeof NotificationResolverStringFilterKeys[keyof typeof NotificationResolverStringFilterKeys];
export { NumericComparator };

export type PersonNode = Node & {
  __typename?: 'PersonNode';
  assignedDonationEntries?: Maybe<ListFundraisingEntriesResponse>;
  committees: Array<CommitteeMembershipNode>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  dbRole: DbRole;
  email: Scalars['String']['output'];
  fundraisingAssignments: Array<FundraisingAssignmentNode>;
  fundraisingTotalAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['GlobalId']['output'];
  linkblue?: Maybe<Scalars['String']['output']>;
  moraleTeams: Array<MembershipNode>;
  name?: Maybe<Scalars['String']['output']>;
  primaryCommittee?: Maybe<CommitteeMembershipNode>;
  primaryTeam?: Maybe<MembershipNode>;
  teams: Array<MembershipNode>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type PersonNodeAssignedDonationEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedStringFilterItem>>;
};


export type PersonNodePrimaryTeamArgs = {
  teamType: TeamType;
};

export const PersonResolverAllKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole',
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type PersonResolverAllKeys = typeof PersonResolverAllKeys[keyof typeof PersonResolverAllKeys];
export type PersonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: PersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PersonResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: PersonResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type PersonResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: PersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const PersonResolverOneOfFilterKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole'
} as const;

export type PersonResolverOneOfFilterKeys = typeof PersonResolverOneOfFilterKeys[keyof typeof PersonResolverOneOfFilterKeys];
export const PersonResolverStringFilterKeys = {
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type PersonResolverStringFilterKeys = typeof PersonResolverStringFilterKeys[keyof typeof PersonResolverStringFilterKeys];
export type PointEntryNode = Node & {
  __typename?: 'PointEntryNode';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  personFrom?: Maybe<PersonNode>;
  pointOpportunity?: Maybe<PointOpportunityNode>;
  points: Scalars['Int']['output'];
  team: TeamNode;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export const PointEntryResolverAllKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type PointEntryResolverAllKeys = typeof PointEntryResolverAllKeys[keyof typeof PointEntryResolverAllKeys];
export const PointEntryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type PointEntryResolverDateFilterKeys = typeof PointEntryResolverDateFilterKeys[keyof typeof PointEntryResolverDateFilterKeys];
export type PointEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: PointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type PointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointOpportunityNode = Node & {
  __typename?: 'PointOpportunityNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  event?: Maybe<EventNode>;
  id: Scalars['GlobalId']['output'];
  name: Scalars['String']['output'];
  opportunityDate?: Maybe<Scalars['DateTimeISO']['output']>;
  type: TeamType;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export const PointOpportunityResolverAllKeys = {
  CreatedAt: 'createdAt',
  MarathonUuid: 'marathonUuid',
  Name: 'name',
  OpportunityDate: 'opportunityDate',
  Type: 'type',
  UpdatedAt: 'updatedAt'
} as const;

export type PointOpportunityResolverAllKeys = typeof PointOpportunityResolverAllKeys[keyof typeof PointOpportunityResolverAllKeys];
export const PointOpportunityResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  OpportunityDate: 'opportunityDate',
  UpdatedAt: 'updatedAt'
} as const;

export type PointOpportunityResolverDateFilterKeys = typeof PointOpportunityResolverDateFilterKeys[keyof typeof PointOpportunityResolverDateFilterKeys];
export type PointOpportunityResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: PointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['DateTimeISO']['input'];
};

export type PointOpportunityResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: PointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointOpportunityResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: PointOpportunityResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type PointOpportunityResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: PointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const PointOpportunityResolverOneOfFilterKeys = {
  MarathonUuid: 'marathonUuid',
  Type: 'type'
} as const;

export type PointOpportunityResolverOneOfFilterKeys = typeof PointOpportunityResolverOneOfFilterKeys[keyof typeof PointOpportunityResolverOneOfFilterKeys];
export const PointOpportunityResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type PointOpportunityResolverStringFilterKeys = typeof PointOpportunityResolverStringFilterKeys[keyof typeof PointOpportunityResolverStringFilterKeys];
export type Query = {
  __typename?: 'Query';
  /** Get the active configuration for a given key at the current time */
  activeConfiguration: GetConfigurationByUuidResponse;
  /** Get all configurations, irrespective of time */
  allConfigurations: GetAllConfigurationsResponse;
  /** Get the audit log file from the server */
  auditLog: Scalars['String']['output'];
  /** Get a particular configuration entry by UUID */
  configuration: GetConfigurationByUuidResponse;
  /** The marathon that is currently happening, i.e. the marathon with the latest start date that has not yet ended. */
  currentMarathon?: Maybe<MarathonNode>;
  currentMarathonHour?: Maybe<MarathonHourNode>;
  dbFundsTeams: Array<DbFundsTeamInfo>;
  /** Get a device by it's UUID */
  device: GetDeviceByUuidResponse;
  /** List all devices */
  devices: ListDevicesResponse;
  /** Get an event by UUID */
  event: GetEventByUuidResponse;
  /** List events */
  events: ListEventsResponse;
  /** Get the active feed */
  feed: Array<FeedNode>;
  /** Get a feed item by its UUID */
  feedItem: FeedNode;
  fundraisingAssignment: FundraisingAssignmentNode;
  fundraisingEntries: ListFundraisingEntriesResponse;
  fundraisingEntry: FundraisingEntryNode;
  image: GetImageByUuidResponse;
  images: ListImagesResponse;
  /** The most recent marathon, regardless of whether it is currently happening, i.e. the marathon with the latest year. */
  latestMarathon?: Maybe<MarathonNode>;
  listPeople: ListPeopleResponse;
  loginState: LoginState;
  marathon: MarathonNode;
  marathonForYear: MarathonNode;
  marathonHour: MarathonHourNode;
  marathons: ListMarathonsResponse;
  me?: Maybe<PersonNode>;
  node: Node;
  notification: GetNotificationByUuidResponse;
  notificationDeliveries: ListNotificationDeliveriesResponse;
  notifications: ListNotificationsResponse;
  person: PersonNode;
  personByLinkBlue?: Maybe<PersonNode>;
  pointEntries: ListPointEntriesResponse;
  pointEntry: GetPointEntryByUuidResponse;
  pointOpportunities: ListPointOpportunitiesResponse;
  pointOpportunity: SinglePointOpportunityResponse;
  searchPeopleByName: Array<PersonNode>;
  team: SingleTeamResponse;
  teams: ListTeamsResponse;
};


export type QueryActiveConfigurationArgs = {
  key: Scalars['String']['input'];
};


export type QueryAuditLogArgs = {
  lines?: Scalars['Float']['input'];
  offset?: Scalars['Float']['input'];
};


export type QueryConfigurationArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryDbFundsTeamsArgs = {
  search: Scalars['String']['input'];
};


export type QueryDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<DeviceResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<DeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<DeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<DeviceResolverKeyedStringFilterItem>>;
};


export type QueryEventArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryEventsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<EventResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<EventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<EventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<EventResolverKeyedStringFilterItem>>;
};


export type QueryFeedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFeedItemArgs = {
  feedItemId: Scalars['GlobalId']['input'];
};


export type QueryFundraisingAssignmentArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryFundraisingEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedStringFilterItem>>;
};


export type QueryFundraisingEntryArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryImageArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryImagesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<ImageResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<ImageResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Array<ImageResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<Array<ImageResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<ImageResolverKeyedStringFilterItem>>;
};


export type QueryListPeopleArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<PersonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<PersonResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<PersonResolverKeyedStringFilterItem>>;
};


export type QueryMarathonArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryMarathonForYearArgs = {
  year: Scalars['String']['input'];
};


export type QueryMarathonHourArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryMarathonsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<MarathonResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<MarathonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryNodeArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryNotificationArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryNotificationDeliveriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedIsNullFilterItem>>;
  notificationUuid: Scalars['GlobalId']['input'];
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryNotificationsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<NotificationResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<NotificationResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<NotificationResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<NotificationResolverKeyedStringFilterItem>>;
};


export type QueryPersonArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryPersonByLinkBlueArgs = {
  linkBlueId: Scalars['String']['input'];
};


export type QueryPointEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<PointEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<PointEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryPointEntryArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryPointOpportunitiesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<PointOpportunityResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<PointOpportunityResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<PointOpportunityResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<PointOpportunityResolverKeyedStringFilterItem>>;
};


export type QueryPointOpportunityArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QuerySearchPeopleByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryTeamArgs = {
  uuid: Scalars['GlobalId']['input'];
};


export type QueryTeamsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<TeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<Array<TeamLegacyStatus>>;
  marathonId?: InputMaybe<Array<Scalars['GlobalId']['input']>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<TeamResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<TeamResolverKeyedStringFilterItem>>;
  type?: InputMaybe<Array<TeamType>>;
  visibility?: InputMaybe<Array<DbRole>>;
};

export type RegisterDeviceInput = {
  /** For legacy reasons, this can be a GlobalId or a raw UUID */
  deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  lastUserId?: InputMaybe<Scalars['GlobalId']['input']>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  verifier: Scalars['String']['input'];
};

export type RegisterDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'RegisterDeviceResponse';
  data: DeviceNode;
  ok: Scalars['Boolean']['output'];
};

export type RemoveEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'RemoveEventImageResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type ScheduleNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'ScheduleNotificationResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type SendNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SendNotificationResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type SetEventInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  occurrences: Array<SetEventOccurrenceInput>;
  summary?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SetEventOccurrenceInput = {
  fullDay: Scalars['Boolean']['input'];
  interval: IntervalIsoInput;
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  uuid?: InputMaybe<Scalars['GlobalId']['input']>;
};

export type SetEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SetEventResponse';
  data: EventNode;
  ok: Scalars['Boolean']['output'];
};

export type SetFeedInput = {
  textContent?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type SetMarathonHourInput = {
  details?: InputMaybe<Scalars['String']['input']>;
  durationInfo: Scalars['String']['input'];
  shownStartingAt: Scalars['DateTimeISO']['input'];
  title: Scalars['String']['input'];
};

export type SetMarathonInput = {
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  startDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  year: Scalars['String']['input'];
};

export type SetPersonInput = {
  captainOf?: InputMaybe<Array<MemberOf>>;
  email?: InputMaybe<Scalars['EmailAddress']['input']>;
  linkblue?: InputMaybe<Scalars['String']['input']>;
  memberOf?: InputMaybe<Array<MemberOf>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SetPointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['GlobalId']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  opportunityDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  type?: InputMaybe<TeamType>;
};

export type SetTeamInput = {
  legacyStatus?: InputMaybe<TeamLegacyStatus>;
  name?: InputMaybe<Scalars['String']['input']>;
  persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TeamType>;
};

export type SinglePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SinglePointOpportunityResponse';
  data: PointOpportunityNode;
  ok: Scalars['Boolean']['output'];
};

export type SingleTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SingleTeamResponse';
  data: TeamNode;
  ok: Scalars['Boolean']['output'];
};

export { SortDirection };

export type StageNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'StageNotificationResponse';
  data: NotificationNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['GlobalId']['output'];
};

export { StringComparator };

export { TeamLegacyStatus };

export type TeamNode = Node & {
  __typename?: 'TeamNode';
  /** @deprecated Just query the members field and filter by role */
  captains: Array<MembershipNode>;
  committeeIdentifier?: Maybe<CommitteeIdentifier>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  dbFundsTeam?: Maybe<DbFundsTeamInfo>;
  fundraisingEntries: ListFundraisingEntriesResponse;
  fundraisingTotalAmount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['GlobalId']['output'];
  legacyStatus: TeamLegacyStatus;
  marathon: MarathonNode;
  members: Array<MembershipNode>;
  name: Scalars['String']['output'];
  pointEntries: Array<PointEntryNode>;
  totalPoints: Scalars['Int']['output'];
  type: TeamType;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type TeamNodeFundraisingEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedStringFilterItem>>;
};

export const TeamResolverAllKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonId: 'marathonId',
  Name: 'name',
  Type: 'type'
} as const;

export type TeamResolverAllKeys = typeof TeamResolverAllKeys[keyof typeof TeamResolverAllKeys];
export type TeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: TeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: TeamResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Array<Scalars['String']['input']>;
};

export type TeamResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: TeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  value: Scalars['String']['input'];
};

export const TeamResolverOneOfFilterKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonId: 'marathonId',
  Type: 'type'
} as const;

export type TeamResolverOneOfFilterKeys = typeof TeamResolverOneOfFilterKeys[keyof typeof TeamResolverOneOfFilterKeys];
export const TeamResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type TeamResolverStringFilterKeys = typeof TeamResolverStringFilterKeys[keyof typeof TeamResolverStringFilterKeys];
export { TeamType };

export type UpdateFundraisingAssignmentInput = {
  amount: Scalars['Float']['input'];
};

export type ActiveMarathonQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMarathonQuery = { __typename?: 'Query', latestMarathon?: { __typename?: 'MarathonNode', id: string, year: string, startDate?: Date | string | null, endDate?: Date | string | null } | null, marathons: { __typename?: 'ListMarathonsResponse', data: Array<{ __typename?: 'MarathonNode', id: string, year: string }> } };

export type SelectedMarathonQueryVariables = Exact<{
  marathonId: Scalars['GlobalId']['input'];
}>;


export type SelectedMarathonQuery = { __typename?: 'Query', marathon: { __typename?: 'MarathonNode', id: string, year: string, startDate?: Date | string | null, endDate?: Date | string | null } };

export type ViewTeamPageQueryVariables = Exact<{
  teamUuid: Scalars['GlobalId']['input'];
}>;


export type ViewTeamPageQuery = { __typename?: 'Query', team: { __typename?: 'SingleTeamResponse', data: (
      { __typename?: 'TeamNode', pointEntries: Array<(
        { __typename?: 'PointEntryNode' }
        & { ' $fragmentRefs'?: { 'PointEntryTableFragmentFragment': PointEntryTableFragmentFragment } }
      )> }
      & { ' $fragmentRefs'?: { 'PointEntryCreatorFragmentFragment': PointEntryCreatorFragmentFragment;'TeamViewerFragmentFragment': TeamViewerFragmentFragment } }
    ) } };

export type DeleteEventMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: { __typename?: 'DeleteEventResponse', ok: boolean } };

export type CreateImageMutationVariables = Exact<{
  input: CreateImageInput;
}>;


export type CreateImageMutation = { __typename?: 'Mutation', createImage: { __typename?: 'ImageNode', id: string } };

export type ImagePickerQueryVariables = Exact<{
  stringFilters?: InputMaybe<Array<ImageResolverKeyedStringFilterItem> | ImageResolverKeyedStringFilterItem>;
}>;


export type ImagePickerQuery = { __typename?: 'Query', images: { __typename?: 'ListImagesResponse', data: Array<{ __typename?: 'ImageNode', id: string, alt?: string | null, url?: URL | string | null }> } };

export type DeletePersonMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type DeletePersonMutation = { __typename?: 'Mutation', deletePerson: { __typename?: 'PersonNode', id: string } };

export type PersonSearchQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type PersonSearchQuery = { __typename?: 'Query', searchPeopleByName: Array<{ __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null }>, personByLinkBlue?: { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null } | null };

export type DeletePointEntryMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type DeletePointEntryMutation = { __typename?: 'Mutation', deletePointEntry: { __typename?: 'DeletePointEntryResponse', ok: boolean } };

export type DeleteTeamMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'DeleteTeamResponse', ok: boolean } };

export type CommitConfigChangesMutationVariables = Exact<{
  changes: Array<CreateConfigurationInput> | CreateConfigurationInput;
}>;


export type CommitConfigChangesMutation = { __typename?: 'Mutation', createConfigurations: { __typename?: 'CreateConfigurationResponse', ok: boolean } };

export type ConfigFragmentFragment = { __typename?: 'ConfigurationNode', id: string, key: string, value: string, validAfter?: Date | string | null, validUntil?: Date | string | null, createdAt?: Date | string | null } & { ' $fragmentName'?: 'ConfigFragmentFragment' };

export type ConfigQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQueryQuery = { __typename?: 'Query', allConfigurations: { __typename?: 'GetAllConfigurationsResponse', data: Array<(
      { __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'ConfigFragmentFragment': ConfigFragmentFragment } }
    )> } };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventResponse', data: { __typename?: 'EventNode', id: string } } };

export type EventEditorFragmentFragment = { __typename?: 'EventNode', id: string, title: string, summary?: string | null, description?: string | null, location?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceNode', id: string, fullDay: boolean, interval: { __typename?: 'IntervalISO', start: Date | string, end: Date | string } }>, images: Array<{ __typename?: 'ImageNode', url?: URL | string | null, width: number, height: number, thumbHash?: string | null, alt?: string | null }> } & { ' $fragmentName'?: 'EventEditorFragmentFragment' };

export type SaveEventMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
  input: SetEventInput;
}>;


export type SaveEventMutation = { __typename?: 'Mutation', setEvent: { __typename?: 'SetEventResponse', data: (
      { __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventEditorFragmentFragment': EventEditorFragmentFragment } }
    ) } };

export type CreateMarathonMutationVariables = Exact<{
  input: CreateMarathonInput;
}>;


export type CreateMarathonMutation = { __typename?: 'Mutation', createMarathon: { __typename?: 'MarathonNode', id: string } };

export type EditMarathonMutationVariables = Exact<{
  input: SetMarathonInput;
  marathonId: Scalars['GlobalId']['input'];
}>;


export type EditMarathonMutation = { __typename?: 'Mutation', setMarathon: { __typename?: 'MarathonNode', id: string } };

export type GetMarathonQueryVariables = Exact<{
  marathonId: Scalars['GlobalId']['input'];
}>;


export type GetMarathonQuery = { __typename?: 'Query', marathon: { __typename?: 'MarathonNode', year: string, startDate?: Date | string | null, endDate?: Date | string | null } };

export type SingleNotificationFragmentFragment = { __typename?: 'NotificationNode', id: string, title: string, body: string, deliveryIssue?: string | null, deliveryIssueAcknowledgedAt?: Date | string | null, sendAt?: Date | string | null, startedSendingAt?: Date | string | null, createdAt?: Date | string | null, deliveryCount: number, deliveryIssueCount: { __typename?: 'NotificationDeliveryIssueCount', DeviceNotRegistered: number, InvalidCredentials: number, MessageRateExceeded: number, MessageTooBig: number, MismatchSenderId: number, Unknown: number } } & { ' $fragmentName'?: 'SingleNotificationFragmentFragment' };

export type CreateNotificationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  body: Scalars['String']['input'];
  audience: NotificationAudienceInput;
  url?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateNotificationMutation = { __typename?: 'Mutation', stageNotification: { __typename?: 'StageNotificationResponse', uuid: string } };

export type CancelNotificationScheduleMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type CancelNotificationScheduleMutation = { __typename?: 'Mutation', abortScheduledNotification: { __typename?: 'AbortScheduledNotificationResponse', ok: boolean } };

export type DeleteNotificationMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotification: { __typename?: 'DeleteNotificationResponse', ok: boolean } };

export type SendNotificationMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: { __typename?: 'SendNotificationResponse', ok: boolean } };

export type ScheduleNotificationMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
  sendAt: Scalars['DateTimeISO']['input'];
}>;


export type ScheduleNotificationMutation = { __typename?: 'Mutation', scheduleNotification: { __typename?: 'ScheduleNotificationResponse', ok: boolean } };

export type TeamNameFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, committeeIdentifier?: CommitteeIdentifier | null, marathon: { __typename?: 'MarathonNode', year: string } } & { ' $fragmentName'?: 'TeamNameFragmentFragment' };

export type PersonBulkCreatorMutationVariables = Exact<{
  input: Array<BulkPersonInput> | BulkPersonInput;
  marathonId: Scalars['GlobalId']['input'];
}>;


export type PersonBulkCreatorMutation = { __typename?: 'Mutation', bulkLoadPeople: Array<{ __typename?: 'PersonNode', id: string }> };

export type PersonCreatorMutationVariables = Exact<{
  input: CreatePersonInput;
}>;


export type PersonCreatorMutation = { __typename?: 'Mutation', createPerson: { __typename?: 'PersonNode', id: string } };

export type PersonEditorFragmentFragment = { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null, email: string, teams: Array<{ __typename?: 'MembershipNode', position: MembershipPositionType, committeeRole?: CommitteeRole | null, team: { __typename?: 'TeamNode', id: string, name: string, committeeIdentifier?: CommitteeIdentifier | null, marathon: { __typename?: 'MarathonNode', year: string } } }> } & { ' $fragmentName'?: 'PersonEditorFragmentFragment' };

export type PersonEditorMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
  input: SetPersonInput;
}>;


export type PersonEditorMutation = { __typename?: 'Mutation', setPerson: { __typename?: 'PersonNode', id: string } };

export type PointEntryCreatorFragmentFragment = { __typename?: 'TeamNode', id: string, members: Array<{ __typename?: 'MembershipNode', person: { __typename?: 'PersonNode', id: string } }> } & { ' $fragmentName'?: 'PointEntryCreatorFragmentFragment' };

export type CreatePointEntryMutationVariables = Exact<{
  input: CreatePointEntryInput;
}>;


export type CreatePointEntryMutation = { __typename?: 'Mutation', createPointEntry: { __typename?: 'CreatePointEntryResponse', data: { __typename?: 'PointEntryNode', id: string } } };

export type CreatePointEntryAndAssignMutationVariables = Exact<{
  input: CreatePointEntryInput;
  person: Scalars['GlobalId']['input'];
  team: Scalars['GlobalId']['input'];
}>;


export type CreatePointEntryAndAssignMutation = { __typename?: 'Mutation', addPersonToTeam: { __typename?: 'MembershipNode', id: string }, createPointEntry: { __typename?: 'CreatePointEntryResponse', data: { __typename?: 'PointEntryNode', id: string } } };

export type GetPersonByUuidQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type GetPersonByUuidQuery = { __typename?: 'Query', person: { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null, teams: Array<{ __typename?: 'MembershipNode', team: { __typename?: 'TeamNode', id: string } }> } };

export type GetPersonByLinkBlueQueryVariables = Exact<{
  linkBlue: Scalars['String']['input'];
}>;


export type GetPersonByLinkBlueQuery = { __typename?: 'Query', personByLinkBlue?: { __typename?: 'PersonNode', id: string, name?: string | null } | null };

export type SearchPersonByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchPersonByNameQuery = { __typename?: 'Query', searchPeopleByName: Array<{ __typename?: 'PersonNode', id: string, name?: string | null }> };

export type CreatePersonByLinkBlueMutationVariables = Exact<{
  linkBlue: Scalars['String']['input'];
  email: Scalars['EmailAddress']['input'];
}>;


export type CreatePersonByLinkBlueMutation = { __typename?: 'Mutation', createPerson: { __typename?: 'PersonNode', id: string } };

export type PointEntryOpportunityLookupQueryVariables = Exact<{
  name: Scalars['String']['input'];
  marathonUuid: Scalars['String']['input'];
}>;


export type PointEntryOpportunityLookupQuery = { __typename?: 'Query', pointOpportunities: { __typename?: 'ListPointOpportunitiesResponse', data: Array<{ __typename?: 'PointOpportunityNode', name: string, id: string }> } };

export type CreatePointOpportunityMutationVariables = Exact<{
  input: CreatePointOpportunityInput;
}>;


export type CreatePointOpportunityMutation = { __typename?: 'Mutation', createPointOpportunity: { __typename?: 'CreatePointOpportunityResponse', uuid: string } };

export type TeamBulkCreatorMutationVariables = Exact<{
  input: Array<BulkTeamInput> | BulkTeamInput;
  marathonId: Scalars['GlobalId']['input'];
}>;


export type TeamBulkCreatorMutation = { __typename?: 'Mutation', bulkLoadTeams: Array<{ __typename?: 'TeamNode', id: string }> };

export type TeamCreatorMutationVariables = Exact<{
  input: CreateTeamInput;
  marathonUuid: Scalars['GlobalId']['input'];
}>;


export type TeamCreatorMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'CreateTeamResponse', ok: boolean, uuid: string } };

export type TeamEditorFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, legacyStatus: TeamLegacyStatus, type: TeamType, marathon: { __typename?: 'MarathonNode', id: string, year: string } } & { ' $fragmentName'?: 'TeamEditorFragmentFragment' };

export type TeamEditorMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
  input: SetTeamInput;
}>;


export type TeamEditorMutation = { __typename?: 'Mutation', setTeam: { __typename?: 'SingleTeamResponse', ok: boolean } };

export type MasqueradeSelectorQueryVariables = Exact<{
  search: Scalars['String']['input'];
}>;


export type MasqueradeSelectorQuery = { __typename?: 'Query', searchPeopleByName: Array<{ __typename?: 'PersonNode', id: string, name?: string | null }> };

export type EventsTableFragmentFragment = { __typename?: 'EventNode', id: string, title: string, description?: string | null, summary?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceNode', id: string, fullDay: boolean, interval: { __typename?: 'IntervalISO', start: Date | string, end: Date | string } }> } & { ' $fragmentName'?: 'EventsTableFragmentFragment' };

export type EventsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<EventResolverKeyedDateFilterItem> | EventResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<Array<EventResolverKeyedIsNullFilterItem> | EventResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<Array<EventResolverKeyedOneOfFilterItem> | EventResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<EventResolverKeyedStringFilterItem> | EventResolverKeyedStringFilterItem>;
}>;


export type EventsTableQuery = { __typename?: 'Query', events: { __typename?: 'ListEventsResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventsTableFragmentFragment': EventsTableFragmentFragment } }
    )> } };

export type ImagesTableFragmentFragment = { __typename?: 'ImageNode', id: string, url?: URL | string | null, thumbHash?: string | null, height: number, width: number, alt?: string | null, mimeType: string, createdAt?: Date | string | null } & { ' $fragmentName'?: 'ImagesTableFragmentFragment' };

export type ImagesTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<ImageResolverKeyedDateFilterItem> | ImageResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<Array<ImageResolverKeyedIsNullFilterItem> | ImageResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<Array<ImageResolverKeyedOneOfFilterItem> | ImageResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<ImageResolverKeyedStringFilterItem> | ImageResolverKeyedStringFilterItem>;
  numericFilters?: InputMaybe<Array<ImageResolverKeyedNumericFilterItem> | ImageResolverKeyedNumericFilterItem>;
}>;


export type ImagesTableQuery = { __typename?: 'Query', images: { __typename?: 'ListImagesResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'ImageNode' }
      & { ' $fragmentRefs'?: { 'ImagesTableFragmentFragment': ImagesTableFragmentFragment } }
    )> } };

export type PeopleTableFragmentFragment = { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null, email: string, dbRole: DbRole, primaryCommittee?: { __typename?: 'CommitteeMembershipNode', identifier: CommitteeIdentifier, role: CommitteeRole } | null } & { ' $fragmentName'?: 'PeopleTableFragmentFragment' };

export type PeopleTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  isNullFilters?: InputMaybe<Array<PersonResolverKeyedIsNullFilterItem> | PersonResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<Array<PersonResolverKeyedOneOfFilterItem> | PersonResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<PersonResolverKeyedStringFilterItem> | PersonResolverKeyedStringFilterItem>;
}>;


export type PeopleTableQuery = { __typename?: 'Query', listPeople: { __typename?: 'ListPeopleResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'PersonNode' }
      & { ' $fragmentRefs'?: { 'PeopleTableFragmentFragment': PeopleTableFragmentFragment } }
    )> } };

export type TeamsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  isNullFilters?: InputMaybe<Array<TeamResolverKeyedIsNullFilterItem> | TeamResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<Array<TeamResolverKeyedOneOfFilterItem> | TeamResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<TeamResolverKeyedStringFilterItem> | TeamResolverKeyedStringFilterItem>;
}>;


export type TeamsTableQuery = { __typename?: 'Query', teams: { __typename?: 'ListTeamsResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'TeamNode' }
      & { ' $fragmentRefs'?: { 'TeamsTableFragmentFragment': TeamsTableFragmentFragment } }
    )> } };

export type TeamsTableFragmentFragment = { __typename?: 'TeamNode', id: string, type: TeamType, name: string, legacyStatus: TeamLegacyStatus, totalPoints: number } & { ' $fragmentName'?: 'TeamsTableFragmentFragment' };

export type MarathonTableFragmentFragment = { __typename?: 'MarathonNode', id: string, year: string, startDate?: Date | string | null, endDate?: Date | string | null } & { ' $fragmentName'?: 'MarathonTableFragmentFragment' };

export type NotificationDeliveriesTableFragmentFragment = { __typename?: 'NotificationDeliveryNode', id: string, deliveryError?: string | null, receiptCheckedAt?: Date | string | null, sentAt?: Date | string | null } & { ' $fragmentName'?: 'NotificationDeliveriesTableFragmentFragment' };

export type NotificationDeliveriesTableQueryQueryVariables = Exact<{
  notificationId: Scalars['GlobalId']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedDateFilterItem> | NotificationDeliveryResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedIsNullFilterItem> | NotificationDeliveryResolverKeyedIsNullFilterItem>;
}>;


export type NotificationDeliveriesTableQueryQuery = { __typename?: 'Query', notificationDeliveries: { __typename?: 'ListNotificationDeliveriesResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'NotificationDeliveryNode' }
      & { ' $fragmentRefs'?: { 'NotificationDeliveriesTableFragmentFragment': NotificationDeliveriesTableFragmentFragment } }
    )> } };

export type NotificationsTableFragmentFragment = { __typename?: 'NotificationNode', id: string, title: string, body: string, deliveryIssue?: string | null, deliveryIssueAcknowledgedAt?: Date | string | null, sendAt?: Date | string | null, startedSendingAt?: Date | string | null } & { ' $fragmentName'?: 'NotificationsTableFragmentFragment' };

export type NotificationsTableQueryQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<NotificationResolverKeyedDateFilterItem> | NotificationResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<Array<NotificationResolverKeyedIsNullFilterItem> | NotificationResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<Array<NotificationResolverKeyedOneOfFilterItem> | NotificationResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<NotificationResolverKeyedStringFilterItem> | NotificationResolverKeyedStringFilterItem>;
}>;


export type NotificationsTableQueryQuery = { __typename?: 'Query', notifications: { __typename?: 'ListNotificationsResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'NotificationNode' }
      & { ' $fragmentRefs'?: { 'NotificationsTableFragmentFragment': NotificationsTableFragmentFragment } }
    )> } };

export type PointEntryTableFragmentFragment = { __typename?: 'PointEntryNode', id: string, points: number, comment?: string | null, personFrom?: { __typename?: 'PersonNode', name?: string | null, linkblue?: string | null } | null, pointOpportunity?: { __typename?: 'PointOpportunityNode', name: string, opportunityDate?: Date | string | null } | null } & { ' $fragmentName'?: 'PointEntryTableFragmentFragment' };

export type EventViewerFragmentFragment = { __typename?: 'EventNode', id: string, title: string, summary?: string | null, description?: string | null, location?: string | null, createdAt?: Date | string | null, updatedAt?: Date | string | null, occurrences: Array<{ __typename?: 'EventOccurrenceNode', fullDay: boolean, interval: { __typename?: 'IntervalISO', start: Date | string, end: Date | string } }>, images: Array<{ __typename?: 'ImageNode', url?: URL | string | null, width: number, height: number, thumbHash?: string | null, alt?: string | null }> } & { ' $fragmentName'?: 'EventViewerFragmentFragment' };

export type MarathonViewerFragmentFragment = { __typename?: 'MarathonNode', id: string, year: string, startDate?: Date | string | null, endDate?: Date | string | null, hours: Array<{ __typename?: 'MarathonHourNode', id: string, shownStartingAt: Date | string, title: string }> } & { ' $fragmentName'?: 'MarathonViewerFragmentFragment' };

export type PersonViewerFragmentFragment = { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null, email: string, dbRole: DbRole, teams: Array<{ __typename?: 'MembershipNode', position: MembershipPositionType, committeeRole?: CommitteeRole | null, team: { __typename?: 'TeamNode', id: string, name: string, committeeIdentifier?: CommitteeIdentifier | null, marathon: { __typename?: 'MarathonNode', year: string } } }> } & { ' $fragmentName'?: 'PersonViewerFragmentFragment' };

export type TeamViewerFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, legacyStatus: TeamLegacyStatus, totalPoints: number, type: TeamType, marathon: { __typename?: 'MarathonNode', id: string, year: string }, members: Array<{ __typename?: 'MembershipNode', position: MembershipPositionType, person: { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null } }> } & { ' $fragmentName'?: 'TeamViewerFragmentFragment' };

export type AssignToTeamMutationVariables = Exact<{
  person: Scalars['GlobalId']['input'];
  team: Scalars['GlobalId']['input'];
  position?: InputMaybe<MembershipPositionType>;
}>;


export type AssignToTeamMutation = { __typename?: 'Mutation', addPersonToTeam: { __typename?: 'MembershipNode', id: string } };

export type RemoveFromTeamMutationVariables = Exact<{
  person: Scalars['GlobalId']['input'];
  team: Scalars['GlobalId']['input'];
}>;


export type RemoveFromTeamMutation = { __typename?: 'Mutation', removePersonFromTeam: { __typename?: 'MembershipNode', id: string } };

export type LoginStateQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginStateQuery = { __typename?: 'Query', loginState: { __typename?: 'LoginState', loggedIn: boolean, dbRole: DbRole, effectiveCommitteeRoles: Array<{ __typename?: 'EffectiveCommitteeRole', role: CommitteeRole, identifier: CommitteeIdentifier }> } };

export type LogsPageQueryVariables = Exact<{ [key: string]: never; }>;


export type LogsPageQuery = { __typename?: 'Query', auditLog: string };

export type EditEventPageQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type EditEventPageQuery = { __typename?: 'Query', event: { __typename?: 'GetEventByUuidResponse', data: (
      { __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventEditorFragmentFragment': EventEditorFragmentFragment } }
    ) } };

export type ViewEventPageQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type ViewEventPageQuery = { __typename?: 'Query', event: { __typename?: 'GetEventByUuidResponse', data: (
      { __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventViewerFragmentFragment': EventViewerFragmentFragment } }
    ) } };

export type FeedPageQueryVariables = Exact<{ [key: string]: never; }>;


export type FeedPageQuery = { __typename?: 'Query', feed: Array<{ __typename?: 'FeedNode', id: string, title: string, createdAt?: Date | string | null, textContent?: string | null, image?: { __typename?: 'ImageNode', url?: URL | string | null, alt?: string | null } | null }> };

export type CreateFeedItemMutationVariables = Exact<{
  input: CreateFeedInput;
}>;


export type CreateFeedItemMutation = { __typename?: 'Mutation', createFeedItem: { __typename?: 'FeedNode', id: string } };

export type DeleteFeedItemMutationVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type DeleteFeedItemMutation = { __typename?: 'Mutation', deleteFeedItem: boolean };

export type HomePageQueryVariables = Exact<{ [key: string]: never; }>;


export type HomePageQuery = { __typename?: 'Query', me?: (
    { __typename?: 'PersonNode' }
    & { ' $fragmentRefs'?: { 'PersonViewerFragmentFragment': PersonViewerFragmentFragment } }
  ) | null };

export type EditMarathonHourDataQueryVariables = Exact<{
  marathonHourUuid: Scalars['GlobalId']['input'];
}>;


export type EditMarathonHourDataQuery = { __typename?: 'Query', marathonHour: { __typename?: 'MarathonHourNode', details?: string | null, durationInfo: string, shownStartingAt: Date | string, title: string } };

export type EditMarathonHourMutationVariables = Exact<{
  input: SetMarathonHourInput;
  uuid: Scalars['GlobalId']['input'];
}>;


export type EditMarathonHourMutation = { __typename?: 'Mutation', setMarathonHour: { __typename?: 'MarathonHourNode', id: string } };

export type AddMarathonHourMutationVariables = Exact<{
  input: CreateMarathonHourInput;
  marathonUuid: Scalars['GlobalId']['input'];
}>;


export type AddMarathonHourMutation = { __typename?: 'Mutation', createMarathonHour: { __typename?: 'MarathonHourNode', id: string } };

export type MarathonPageQueryVariables = Exact<{
  marathonUuid: Scalars['GlobalId']['input'];
}>;


export type MarathonPageQuery = { __typename?: 'Query', marathon: (
    { __typename?: 'MarathonNode' }
    & { ' $fragmentRefs'?: { 'MarathonViewerFragmentFragment': MarathonViewerFragmentFragment } }
  ) };

export type MarathonOverviewPageQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonOverviewPageQuery = { __typename?: 'Query', latestMarathon?: (
    { __typename?: 'MarathonNode' }
    & { ' $fragmentRefs'?: { 'MarathonViewerFragmentFragment': MarathonViewerFragmentFragment } }
  ) | null, marathons: { __typename?: 'ListMarathonsResponse', data: Array<(
      { __typename?: 'MarathonNode' }
      & { ' $fragmentRefs'?: { 'MarathonTableFragmentFragment': MarathonTableFragmentFragment } }
    )> } };

export type NotificationViewerQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type NotificationViewerQuery = { __typename?: 'Query', notification: { __typename?: 'GetNotificationByUuidResponse', data: (
      { __typename?: 'NotificationNode' }
      & { ' $fragmentRefs'?: { 'SingleNotificationFragmentFragment': SingleNotificationFragmentFragment } }
    ) } };

export type NotificationManagerQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type NotificationManagerQuery = { __typename?: 'Query', notification: { __typename?: 'GetNotificationByUuidResponse', data: (
      { __typename?: 'NotificationNode' }
      & { ' $fragmentRefs'?: { 'SingleNotificationFragmentFragment': SingleNotificationFragmentFragment } }
    ) } };

export type EditPersonPageQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type EditPersonPageQuery = { __typename?: 'Query', person: (
    { __typename?: 'PersonNode' }
    & { ' $fragmentRefs'?: { 'PersonEditorFragmentFragment': PersonEditorFragmentFragment } }
  ), teams: { __typename?: 'ListTeamsResponse', data: Array<(
      { __typename?: 'TeamNode' }
      & { ' $fragmentRefs'?: { 'TeamNameFragmentFragment': TeamNameFragmentFragment } }
    )> } };

export type ViewPersonPageQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type ViewPersonPageQuery = { __typename?: 'Query', person: (
    { __typename?: 'PersonNode' }
    & { ' $fragmentRefs'?: { 'PersonViewerFragmentFragment': PersonViewerFragmentFragment } }
  ) };

export type ViewTeamFundraisingDocumentQueryVariables = Exact<{
  teamUuid: Scalars['GlobalId']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedDateFilterItem> | FundraisingEntryResolverKeyedDateFilterItem>;
  oneOfFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedOneOfFilterItem> | FundraisingEntryResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedStringFilterItem> | FundraisingEntryResolverKeyedStringFilterItem>;
  numericFilters?: InputMaybe<Array<FundraisingEntryResolverKeyedNumericFilterItem> | FundraisingEntryResolverKeyedNumericFilterItem>;
}>;


export type ViewTeamFundraisingDocumentQuery = { __typename?: 'Query', team: { __typename?: 'SingleTeamResponse', data: { __typename?: 'TeamNode', dbFundsTeam?: { __typename?: 'DbFundsTeamInfo', dbNum: number, name: string } | null, members: Array<{ __typename?: 'MembershipNode', person: { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null } }>, fundraisingEntries: { __typename?: 'ListFundraisingEntriesResponse', page: number, pageSize: number, total: number, data: Array<{ __typename?: 'FundraisingEntryNode', id: string, amount: number, amountUnassigned: number, donatedByText?: string | null, donatedToText?: string | null, donatedOn: Date | string, assignments: Array<{ __typename?: 'FundraisingAssignmentNode', id: string, amount: number, person?: { __typename?: 'PersonNode', name?: string | null } | null }> }> } } } };

export type SearchFundraisingTeamQueryVariables = Exact<{
  fundraisingTeamSearch: Scalars['String']['input'];
}>;


export type SearchFundraisingTeamQuery = { __typename?: 'Query', dbFundsTeams: Array<{ __typename?: 'DbFundsTeamInfo', dbNum: number, name: string }> };

export type SetDbFundsTeamMutationVariables = Exact<{
  teamUuid: Scalars['GlobalId']['input'];
  dbFundsTeamDbNum: Scalars['Int']['input'];
}>;


export type SetDbFundsTeamMutation = { __typename?: 'Mutation', assignTeamToDbFundsTeam: void };

export type AddFundraisingAssignmentMutationVariables = Exact<{
  entryId: Scalars['GlobalId']['input'];
  personId: Scalars['GlobalId']['input'];
  amount: Scalars['Float']['input'];
}>;


export type AddFundraisingAssignmentMutation = { __typename?: 'Mutation', assignEntryToPerson: { __typename?: 'FundraisingAssignmentNode', id: string } };

export type UpdateFundraisingAssignmentMutationVariables = Exact<{
  id: Scalars['GlobalId']['input'];
  amount: Scalars['Float']['input'];
}>;


export type UpdateFundraisingAssignmentMutation = { __typename?: 'Mutation', updateFundraisingAssignment: { __typename?: 'FundraisingAssignmentNode', id: string, amount: number, person?: { __typename?: 'PersonNode', name?: string | null } | null } };

export type DeleteFundraisingAssignmentMutationVariables = Exact<{
  id: Scalars['GlobalId']['input'];
}>;


export type DeleteFundraisingAssignmentMutation = { __typename?: 'Mutation', deleteFundraisingAssignment: { __typename?: 'FundraisingAssignmentNode', id: string } };

export type EditTeamPageQueryVariables = Exact<{
  uuid: Scalars['GlobalId']['input'];
}>;


export type EditTeamPageQuery = { __typename?: 'Query', team: { __typename?: 'SingleTeamResponse', data: (
      { __typename?: 'TeamNode' }
      & { ' $fragmentRefs'?: { 'TeamEditorFragmentFragment': TeamEditorFragmentFragment } }
    ) } };

export const ConfigFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfigFragmentFragment, unknown>;
export const EventEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<EventEditorFragmentFragment, unknown>;
export const SingleNotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<SingleNotificationFragmentFragment, unknown>;
export const TeamNameFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<TeamNameFragmentFragment, unknown>;
export const PersonEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PersonEditorFragmentFragment, unknown>;
export const PointEntryCreatorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryCreatorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PointEntryCreatorFragmentFragment, unknown>;
export const TeamEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<TeamEditorFragmentFragment, unknown>;
export const EventsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<EventsTableFragmentFragment, unknown>;
export const ImagesTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImagesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ImagesTableFragmentFragment, unknown>;
export const PeopleTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"primaryCommittee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<PeopleTableFragmentFragment, unknown>;
export const TeamsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<TeamsTableFragmentFragment, unknown>;
export const MarathonTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<MarathonTableFragmentFragment, unknown>;
export const NotificationDeliveriesTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<NotificationDeliveriesTableFragmentFragment, unknown>;
export const NotificationsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<NotificationsTableFragmentFragment, unknown>;
export const PointEntryTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<PointEntryTableFragmentFragment, unknown>;
export const EventViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<EventViewerFragmentFragment, unknown>;
export const MarathonViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<MarathonViewerFragmentFragment, unknown>;
export const PersonViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}}]}}]} as unknown as DocumentNode<PersonViewerFragmentFragment, unknown>;
export const TeamViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}}]} as unknown as DocumentNode<TeamViewerFragmentFragment, unknown>;
export const ActiveMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marathons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]}}]} as unknown as DocumentNode<ActiveMarathonQuery, ActiveMarathonQueryVariables>;
export const SelectedMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SelectedMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<SelectedMarathonQuery, SelectedMarathonQueryVariables>;
export const ViewTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointEntryCreatorFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointEntryTableFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryCreatorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"position"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<ViewTeamPageQuery, ViewTeamPageQueryVariables>;
export const DeleteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>;
export const CreateImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateImageMutation, CreateImageMutationVariables>;
export const ImagePickerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImagePicker"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"IntValue","value":"9"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ImagePickerQuery, ImagePickerQueryVariables>;
export const DeletePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePersonMutation, DeletePersonMutationVariables>;
export const PersonSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPeopleByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"personByLinkBlue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"linkBlueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]} as unknown as DocumentNode<PersonSearchQuery, PersonSearchQueryVariables>;
export const DeletePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeletePointEntryMutation, DeletePointEntryMutationVariables>;
export const DeleteTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const CommitConfigChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitConfigChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateConfigurationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConfigurations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CommitConfigChangesMutation, CommitConfigChangesMutationVariables>;
export const ConfigQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConfigQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allConfigurations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfigQueryQuery, ConfigQueryQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const SaveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<SaveEventMutation, SaveEventMutationVariables>;
export const CreateMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarathonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMarathonMutation, CreateMarathonMutationVariables>;
export const EditMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetMarathonInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMarathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditMarathonMutation, EditMarathonMutationVariables>;
export const GetMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<GetMarathonQuery, GetMarathonQueryVariables>;
export const CreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"audience"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationAudienceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stageNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"audience"},"value":{"kind":"Variable","name":{"kind":"Name","value":"audience"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateNotificationMutation, CreateNotificationMutationVariables>;
export const CancelNotificationScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelNotificationSchedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortScheduledNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CancelNotificationScheduleMutation, CancelNotificationScheduleMutationVariables>;
export const DeleteNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const SendNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendNotificationMutation, SendNotificationMutationVariables>;
export const ScheduleNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"sendAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<ScheduleNotificationMutation, ScheduleNotificationMutationVariables>;
export const PersonBulkCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonBulkCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkPersonInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkLoadPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"people"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"marathonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PersonBulkCreatorMutation, PersonBulkCreatorMutationVariables>;
export const PersonCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PersonCreatorMutation, PersonCreatorMutationVariables>;
export const PersonEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetPersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<PersonEditorMutation, PersonEditorMutationVariables>;
export const CreatePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePointEntryMutation, CreatePointEntryMutationVariables>;
export const CreatePointEntryAndAssignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointEntryAndAssign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointEntryInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"person"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"team"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPersonToTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"person"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"team"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createPointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePointEntryAndAssignMutation, CreatePointEntryAndAssignMutationVariables>;
export const GetPersonByUuidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByUuid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPersonByUuidQuery, GetPersonByUuidQueryVariables>;
export const GetPersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personByLinkBlue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"linkBlueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetPersonByLinkBlueQuery, GetPersonByLinkBlueQueryVariables>;
export const SearchPersonByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPersonByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPeopleByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchPersonByNameQuery, SearchPersonByNameQueryVariables>;
export const CreatePersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"linkblue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePersonByLinkBlueMutation, CreatePersonByLinkBlueMutationVariables>;
export const PointEntryOpportunityLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PointEntryOpportunityLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointOpportunities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"SUBSTRING"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"marathonUuid"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PointEntryOpportunityLookupQuery, PointEntryOpportunityLookupQueryVariables>;
export const CreatePointOpportunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointOpportunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointOpportunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointOpportunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreatePointOpportunityMutation, CreatePointOpportunityMutationVariables>;
export const TeamBulkCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamBulkCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BulkTeamInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bulkLoadTeams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teams"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"marathonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<TeamBulkCreatorMutation, TeamBulkCreatorMutationVariables>;
export const TeamCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"marathon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<TeamCreatorMutation, TeamCreatorMutationVariables>;
export const TeamEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<TeamEditorMutation, TeamEditorMutationVariables>;
export const MasqueradeSelectorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MasqueradeSelector"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPeopleByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MasqueradeSelectorQuery, MasqueradeSelectorQueryVariables>;
export const EventsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<EventsTableQuery, EventsTableQueryVariables>;
export const ImagesTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImagesTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedStringFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResolverKeyedNumericFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"numericFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImagesTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImagesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ImagesTableQuery, ImagesTableQueryVariables>;
export const PeopleTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PeopleTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PeopleTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"primaryCommittee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<PeopleTableQuery, PeopleTableQueryVariables>;
export const TeamsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<TeamsTableQuery, TeamsTableQueryVariables>;
export const NotificationDeliveriesTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationDeliveriesTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedIsNullFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"notificationUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<NotificationDeliveriesTableQueryQuery, NotificationDeliveriesTableQueryQueryVariables>;
export const NotificationsTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<NotificationsTableQueryQuery, NotificationsTableQueryQueryVariables>;
export const AssignToTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignToTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"person"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"team"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MembershipPositionType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addPersonToTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"person"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"team"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AssignToTeamMutation, AssignToTeamMutationVariables>;
export const RemoveFromTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"person"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"team"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removePersonFromTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"personUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"person"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"team"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<RemoveFromTeamMutation, RemoveFromTeamMutationVariables>;
export const LoginStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveCommitteeRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}}]}}]}}]} as unknown as DocumentNode<LoginStateQuery, LoginStateQueryVariables>;
export const LogsPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LogsPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLog"}}]}}]} as unknown as DocumentNode<LogsPageQuery, LogsPageQueryVariables>;
export const EditEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<EditEventPageQuery, EditEventPageQueryVariables>;
export const ViewEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventViewerFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ViewEventPageQuery, ViewEventPageQueryVariables>;
export const FeedPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FeedPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"NullValue"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]}}]} as unknown as DocumentNode<FeedPageQuery, FeedPageQueryVariables>;
export const CreateFeedItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFeedItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFeedInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFeedItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateFeedItemMutation, CreateFeedItemMutationVariables>;
export const DeleteFeedItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFeedItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFeedItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"feedItemUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}]}]}}]} as unknown as DocumentNode<DeleteFeedItemMutation, DeleteFeedItemMutationVariables>;
export const HomePageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HomePage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonViewerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}}]}}]} as unknown as DocumentNode<HomePageQuery, HomePageQueryVariables>;
export const EditMarathonHourDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditMarathonHourData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonHourUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonHourUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<EditMarathonHourDataQuery, EditMarathonHourDataQueryVariables>;
export const EditMarathonHourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditMarathonHour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetMarathonHourInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMarathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditMarathonHourMutation, EditMarathonHourMutationVariables>;
export const AddMarathonHourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMarathonHour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarathonHourInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"marathonUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddMarathonHourMutation, AddMarathonHourMutationVariables>;
export const MarathonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonViewerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<MarathonPageQuery, MarathonPageQueryVariables>;
export const MarathonOverviewPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonOverviewPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonViewerFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marathons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<MarathonOverviewPageQuery, MarathonOverviewPageQueryVariables>;
export const NotificationViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationViewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<NotificationViewerQuery, NotificationViewerQueryVariables>;
export const NotificationManagerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationManager"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<NotificationManagerQuery, NotificationManagerQueryVariables>;
export const EditPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonEditorFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"asc"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamNameFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<EditPersonPageQuery, EditPersonPageQueryVariables>;
export const ViewPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonViewerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}}]}}]} as unknown as DocumentNode<ViewPersonPageQuery, ViewPersonPageQueryVariables>;
export const ViewTeamFundraisingDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewTeamFundraisingDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FundraisingEntryResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FundraisingEntryResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FundraisingEntryResolverKeyedStringFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FundraisingEntryResolverKeyedNumericFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbFundsTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbNum"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"fundraisingEntries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"numericFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"amountUnassigned"}},{"kind":"Field","name":{"kind":"Name","value":"donatedByText"}},{"kind":"Field","name":{"kind":"Name","value":"donatedToText"}},{"kind":"Field","name":{"kind":"Name","value":"donatedOn"}},{"kind":"Field","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ViewTeamFundraisingDocumentQuery, ViewTeamFundraisingDocumentQueryVariables>;
export const SearchFundraisingTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchFundraisingTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fundraisingTeamSearch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbFundsTeams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fundraisingTeamSearch"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbNum"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchFundraisingTeamQuery, SearchFundraisingTeamQueryVariables>;
export const SetDbFundsTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDbFundsTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dbFundsTeamDbNum"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignTeamToDbFundsTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dbFundsTeamDbNum"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dbFundsTeamDbNum"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}}]}]}}]} as unknown as DocumentNode<SetDbFundsTeamMutation, SetDbFundsTeamMutationVariables>;
export const AddFundraisingAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFundraisingAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignEntryToPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"personId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddFundraisingAssignmentMutation, AddFundraisingAssignmentMutationVariables>;
export const UpdateFundraisingAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateFundraisingAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateFundraisingAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateFundraisingAssignmentMutation, UpdateFundraisingAssignmentMutationVariables>;
export const DeleteFundraisingAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFundraisingAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFundraisingAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteFundraisingAssignmentMutation, DeleteFundraisingAssignmentMutationVariables>;
export const EditTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<EditTeamPageQuery, EditTeamPageQueryVariables>;