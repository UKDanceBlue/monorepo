/* eslint-disable */
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
  uuid: Scalars['String']['output'];
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

/** The source of authentication */
export enum AuthSource {
  Anonymous = 'Anonymous',
  Demo = 'Demo',
  LinkBlue = 'LinkBlue',
  None = 'None'
}

/** The identifier for a committee */
export enum CommitteeIdentifier {
  CommunityDevelopmentCommittee = 'communityDevelopmentCommittee',
  CorporateCommittee = 'corporateCommittee',
  DancerRelationsCommittee = 'dancerRelationsCommittee',
  FamilyRelationsCommittee = 'familyRelationsCommittee',
  FundraisingCommittee = 'fundraisingCommittee',
  MarketingCommittee = 'marketingCommittee',
  MiniMarathonsCommittee = 'miniMarathonsCommittee',
  OperationsCommittee = 'operationsCommittee',
  OverallCommittee = 'overallCommittee',
  ProgrammingCommittee = 'programmingCommittee',
  TechCommittee = 'techCommittee',
  ViceCommittee = 'viceCommittee'
}

export type CommitteeMembershipNode = Node & {
  __typename?: 'CommitteeMembershipNode';
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

/** Roles within a committee */
export enum CommitteeRole {
  Chair = 'Chair',
  Coordinator = 'Coordinator',
  Member = 'Member'
}

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
  uuid: Scalars['String']['output'];
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
  uuid: Scalars['String']['output'];
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
  endDate: Scalars['DateTimeISO']['input'];
  startDate: Scalars['DateTimeISO']['input'];
  year: Scalars['String']['input'];
};

export type CreatePersonInput = {
  captainOf?: Array<Scalars['String']['input']>;
  dbRole?: InputMaybe<DbRole>;
  email: Scalars['EmailAddress']['input'];
  linkblue?: InputMaybe<Scalars['String']['input']>;
  memberOf?: Array<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePointEntryInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  opportunityUuid?: InputMaybe<Scalars['String']['input']>;
  personFromUuid?: InputMaybe<Scalars['String']['input']>;
  points: Scalars['Int']['input'];
  teamUuid: Scalars['String']['input'];
};

export type CreatePointEntryResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePointEntryResponse';
  data: PointEntryNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
};

export type CreatePointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  opportunityDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  type: TeamType;
};

export type CreatePointOpportunityResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePointOpportunityResponse';
  data: PointOpportunityNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
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
  uuid: Scalars['String']['output'];
};

export type DbFundsTeamInfo = Node & {
  __typename?: 'DbFundsTeamInfo';
  dbNum: Scalars['Int']['output'];
  id: Scalars['GlobalId']['output'];
  name: Scalars['String']['output'];
};

/** DanceBlue roles */
export enum DbRole {
  Committee = 'Committee',
  None = 'None',
  Public = 'Public',
  Uky = 'UKY'
}

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
  notificationDeliveries: Array<NotificationDeliveryNode>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type DeviceNodeNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export enum DeviceResolverAllKeys {
  CreatedAt = 'createdAt',
  ExpoPushToken = 'expoPushToken',
  LastSeen = 'lastSeen',
  UpdatedAt = 'updatedAt'
}

export enum DeviceResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  LastSeen = 'lastSeen',
  UpdatedAt = 'updatedAt'
}

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

export enum DeviceResolverStringFilterKeys {
  ExpoPushToken = 'expoPushToken'
}

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

export enum EventResolverAllKeys {
  CreatedAt = 'createdAt',
  Description = 'description',
  Location = 'location',
  Occurrence = 'occurrence',
  OccurrenceEnd = 'occurrenceEnd',
  OccurrenceStart = 'occurrenceStart',
  Summary = 'summary',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export enum EventResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  Occurrence = 'occurrence',
  OccurrenceEnd = 'occurrenceEnd',
  OccurrenceStart = 'occurrenceStart',
  UpdatedAt = 'updatedAt'
}

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

export enum EventResolverStringFilterKeys {
  Description = 'description',
  Location = 'location',
  Summary = 'summary',
  Title = 'title'
}

export type FeedNode = Node & {
  __typename?: 'FeedNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
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
  assignments: Array<FundraisingAssignmentNode>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  donatedByText?: Maybe<Scalars['String']['output']>;
  donatedOn: Scalars['DateTimeISO']['output'];
  donatedToText?: Maybe<Scalars['String']['output']>;
  id: Scalars['GlobalId']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export enum FundraisingEntryResolverAllKeys {
  Amount = 'amount',
  CreatedAt = 'createdAt',
  DonatedBy = 'donatedBy',
  DonatedOn = 'donatedOn',
  DonatedTo = 'donatedTo',
  UpdatedAt = 'updatedAt'
}

export enum FundraisingEntryResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  DonatedOn = 'donatedOn',
  UpdatedAt = 'updatedAt'
}

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

export enum FundraisingEntryResolverNumericFilterKeys {
  Amount = 'amount'
}

export enum FundraisingEntryResolverOneOfFilterKeys {
  TeamId = 'teamId'
}

export enum FundraisingEntryResolverStringFilterKeys {
  DonatedBy = 'donatedBy',
  DonatedTo = 'donatedTo'
}

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

export enum ImageResolverAllKeys {
  Alt = 'alt',
  CreatedAt = 'createdAt',
  Height = 'height',
  UpdatedAt = 'updatedAt',
  Width = 'width'
}

export enum ImageResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

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

export enum ImageResolverNumericFilterKeys {
  Height = 'height',
  Width = 'width'
}

export enum ImageResolverStringFilterKeys {
  Alt = 'alt'
}

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

export enum MarathonResolverAllKeys {
  CreatedAt = 'createdAt',
  EndDate = 'endDate',
  StartDate = 'startDate',
  UpdatedAt = 'updatedAt',
  Year = 'year'
}

export enum MarathonResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  EndDate = 'endDate',
  StartDate = 'startDate',
  UpdatedAt = 'updatedAt'
}

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

export type MembershipNode = Node & {
  __typename?: 'MembershipNode';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['GlobalId']['output'];
  person: PersonNode;
  position: MembershipPositionType;
  team: TeamNode;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

/** The position of a member on a team */
export enum MembershipPositionType {
  Captain = 'Captain',
  Member = 'Member'
}

export type Mutation = {
  __typename?: 'Mutation';
  abortScheduledNotification: AbortScheduledNotificationResponse;
  acknowledgeDeliveryIssue: AcknowledgeDeliveryIssueResponse;
  addExistingImageToEvent: AddEventImageResponse;
  addMap: MarathonHourNode;
  addPersonToTeam: MembershipNode;
  assignEntryToPerson: FundraisingAssignmentNode;
  assignTeamToDbFundsTeam: Scalars['Void']['output'];
  attachImageToFeedItem: FeedNode;
  createConfiguration: CreateConfigurationResponse;
  createConfigurations: CreateConfigurationResponse;
  createEvent: CreateEventResponse;
  createFeedItem: FeedNode;
  createImage: ImageNode;
  createMarathon: MarathonNode;
  createMarathonHour: MarathonHourNode;
  createPerson: PersonNode;
  createPointEntry: CreatePointEntryResponse;
  createPointOpportunity: CreatePointOpportunityResponse;
  createTeam: CreateTeamResponse;
  deleteConfiguration: DeleteConfigurationResponse;
  deleteDevice: DeleteDeviceResponse;
  deleteEvent: DeleteEventResponse;
  deleteFeedItem: Scalars['Boolean']['output'];
  deleteFundraisingAssignment: FundraisingAssignmentNode;
  deleteImage: DeleteImageResponse;
  deleteMarathon: Scalars['Void']['output'];
  deleteMarathonHour: Scalars['Void']['output'];
  deleteNotification: DeleteNotificationResponse;
  deletePerson: PersonNode;
  deletePointEntry: DeletePointEntryResponse;
  deletePointOpportunity: DeletePointOpportunityResponse;
  deleteTeam: DeleteTeamResponse;
  registerDevice: RegisterDeviceResponse;
  removeImageFromEvent: RemoveEventImageResponse;
  removeImageFromFeedItem: FeedNode;
  removeMap: Scalars['Void']['output'];
  scheduleNotification: ScheduleNotificationResponse;
  /** Send a notification immediately. */
  sendNotification: SendNotificationResponse;
  setEvent: SetEventResponse;
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
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationAddMapArgs = {
  imageUuid: Scalars['String']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationAddPersonToTeamArgs = {
  personUuid: Scalars['String']['input'];
  teamUuid: Scalars['String']['input'];
};


export type MutationAssignEntryToPersonArgs = {
  entryId: Scalars['String']['input'];
  input: AssignEntryToPersonInput;
  personId: Scalars['String']['input'];
};


export type MutationAssignTeamToDbFundsTeamArgs = {
  dbFundsTeamId: Scalars['Float']['input'];
  teamId: Scalars['String']['input'];
};


export type MutationAttachImageToFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
  imageUuid: Scalars['String']['input'];
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
  marathonUuid: Scalars['String']['input'];
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
  marathon: Scalars['String']['input'];
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
  feedItemUuid: Scalars['String']['input'];
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
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationRemoveImageFromFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
};


export type MutationRemoveMapArgs = {
  imageUuid: Scalars['String']['input'];
  uuid: Scalars['GlobalId']['input'];
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
  feedItemUuid: Scalars['String']['input'];
  input: SetFeedInput;
};


export type MutationSetImageAltTextArgs = {
  alt: Scalars['String']['input'];
  uuid: Scalars['GlobalId']['input'];
};


export type MutationSetImageUrlArgs = {
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
  memberOfTeams?: InputMaybe<Array<Scalars['String']['input']>>;
  users?: InputMaybe<Array<Scalars['String']['input']>>;
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

export enum NotificationDeliveryResolverAllKeys {
  CreatedAt = 'createdAt',
  DeliveryError = 'deliveryError',
  ReceiptCheckedAt = 'receiptCheckedAt',
  SentAt = 'sentAt',
  UpdatedAt = 'updatedAt'
}

export enum NotificationDeliveryResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  ReceiptCheckedAt = 'receiptCheckedAt',
  SentAt = 'sentAt',
  UpdatedAt = 'updatedAt'
}

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

export enum NotificationResolverAllKeys {
  Body = 'body',
  CreatedAt = 'createdAt',
  DeliveryIssue = 'deliveryIssue',
  SendAt = 'sendAt',
  StartedSendingAt = 'startedSendingAt',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export enum NotificationResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  SendAt = 'sendAt',
  StartedSendingAt = 'startedSendingAt',
  UpdatedAt = 'updatedAt'
}

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

export enum NotificationResolverOneOfFilterKeys {
  DeliveryIssue = 'deliveryIssue'
}

export enum NotificationResolverStringFilterKeys {
  Body = 'body',
  Title = 'title'
}

export enum NumericComparator {
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqualTo = 'GREATER_THAN_OR_EQUAL_TO',
  Is = 'IS',
  LessThan = 'LESS_THAN',
  LessThanOrEqualTo = 'LESS_THAN_OR_EQUAL_TO'
}

export type PersonNode = Node & {
  __typename?: 'PersonNode';
  assignedDonationEntries?: Maybe<CommitteeMembershipNode>;
  committees: Array<CommitteeMembershipNode>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  dbRole: DbRole;
  email: Scalars['String']['output'];
  fundraisingAssignments: Array<FundraisingAssignmentNode>;
  id: Scalars['GlobalId']['output'];
  linkblue?: Maybe<Scalars['String']['output']>;
  moraleTeams: Array<MembershipNode>;
  name?: Maybe<Scalars['String']['output']>;
  primaryCommittee?: Maybe<CommitteeMembershipNode>;
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

export enum PersonResolverAllKeys {
  CommitteeName = 'committeeName',
  CommitteeRole = 'committeeRole',
  DbRole = 'dbRole',
  Email = 'email',
  Linkblue = 'linkblue',
  Name = 'name'
}

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

export enum PersonResolverOneOfFilterKeys {
  CommitteeName = 'committeeName',
  CommitteeRole = 'committeeRole',
  DbRole = 'dbRole'
}

export enum PersonResolverStringFilterKeys {
  Email = 'email',
  Linkblue = 'linkblue',
  Name = 'name'
}

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

export enum PointEntryResolverAllKeys {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export enum PointEntryResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

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

export enum PointOpportunityResolverAllKeys {
  CreatedAt = 'createdAt',
  Name = 'name',
  OpportunityDate = 'opportunityDate',
  Type = 'type',
  UpdatedAt = 'updatedAt'
}

export enum PointOpportunityResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  OpportunityDate = 'opportunityDate',
  UpdatedAt = 'updatedAt'
}

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

export enum PointOpportunityResolverOneOfFilterKeys {
  Type = 'type'
}

export enum PointOpportunityResolverStringFilterKeys {
  Name = 'name'
}

export type Query = {
  __typename?: 'Query';
  activeConfiguration: GetConfigurationByUuidResponse;
  allConfigurations: GetAllConfigurationsResponse;
  configuration: GetConfigurationByUuidResponse;
  currentMarathon?: Maybe<MarathonNode>;
  currentMarathonHour?: Maybe<MarathonHourNode>;
  dbFundsTeams: Array<DbFundsTeamInfo>;
  device: GetDeviceByUuidResponse;
  devices: ListDevicesResponse;
  event: GetEventByUuidResponse;
  events: ListEventsResponse;
  feed: Array<FeedNode>;
  fundraisingAssignment: FundraisingAssignmentNode;
  fundraisingEntries: ListFundraisingEntriesResponse;
  fundraisingEntry: FundraisingEntryNode;
  image: GetImageByUuidResponse;
  images: ListImagesResponse;
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
  personByLinkBlue: PersonNode;
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


export type QueryConfigurationArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryDbFundsTeamsArgs = {
  search: Scalars['String']['input'];
};


export type QueryDeviceArgs = {
  uuid: Scalars['GlobalId']['input'];
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
  notificationUuid: Scalars['String']['input'];
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
  marathonId?: InputMaybe<Array<Scalars['String']['input']>>;
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
  deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  lastUserId?: InputMaybe<Scalars['String']['input']>;
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
  uuid?: InputMaybe<Scalars['String']['input']>;
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
  endDate: Scalars['DateTimeISO']['input'];
  startDate: Scalars['DateTimeISO']['input'];
  year: Scalars['String']['input'];
};

export type SetPersonInput = {
  captainOf?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['EmailAddress']['input']>;
  linkblue?: InputMaybe<Scalars['String']['input']>;
  memberOf?: InputMaybe<Array<Scalars['String']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type SetPointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['ID']['input']>;
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

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type StageNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'StageNotificationResponse';
  data: NotificationNode;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
};

export enum StringComparator {
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  Is = 'IS',
  StartsWith = 'STARTS_WITH',
  Substring = 'SUBSTRING'
}

/** New Team vs Returning Team */
export enum TeamLegacyStatus {
  DemoTeam = 'DemoTeam',
  NewTeam = 'NewTeam',
  ReturningTeam = 'ReturningTeam'
}

export type TeamNode = Node & {
  __typename?: 'TeamNode';
  /** @deprecated Just query the members field and filter by role */
  captains: Array<MembershipNode>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  fundraisingEntries: ListFundraisingEntriesResponse;
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

export enum TeamResolverAllKeys {
  LegacyStatus = 'legacyStatus',
  MarathonId = 'marathonId',
  Name = 'name',
  Type = 'type'
}

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

export enum TeamResolverOneOfFilterKeys {
  LegacyStatus = 'legacyStatus',
  MarathonId = 'marathonId',
  Type = 'type'
}

export enum TeamResolverStringFilterKeys {
  Name = 'name'
}

/** Types of teams */
export enum TeamType {
  Morale = 'Morale',
  Spirit = 'Spirit'
}

export type UpdateFundraisingAssignmentInput = {
  amount: Scalars['Float']['input'];
};

export type ImageViewFragmentFragment = { __typename?: 'ImageNode', id: string, url?: URL | string | null, thumbHash?: string | null, alt?: string | null, width: number, height: number, mimeType: string } & { ' $fragmentName'?: 'ImageViewFragmentFragment' };

export type SimpleConfigFragment = { __typename?: 'ConfigurationNode', id: string, key: string, value: string } & { ' $fragmentName'?: 'SimpleConfigFragment' };

export type FullConfigFragment = (
  { __typename?: 'ConfigurationNode', validAfter?: Date | string | null, validUntil?: Date | string | null, createdAt?: Date | string | null }
  & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
) & { ' $fragmentName'?: 'FullConfigFragment' };

export type NotificationFragmentFragment = { __typename?: 'NotificationNode', id: string, title: string, body: string, url?: URL | string | null } & { ' $fragmentName'?: 'NotificationFragmentFragment' };

export type NotificationDeliveryFragmentFragment = { __typename?: 'NotificationDeliveryNode', id: string, sentAt?: Date | string | null, notification: (
    { __typename?: 'NotificationNode' }
    & { ' $fragmentRefs'?: { 'NotificationFragmentFragment': NotificationFragmentFragment } }
  ) } & { ' $fragmentName'?: 'NotificationDeliveryFragmentFragment' };

export type UseAllowedLoginTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type UseAllowedLoginTypesQuery = { __typename?: 'Query', activeConfiguration: { __typename?: 'GetConfigurationByUuidResponse', data: (
      { __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type MarathonTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonTimeQuery = { __typename?: 'Query', latestMarathon?: { __typename?: 'MarathonNode', startDate?: Date | string | null, endDate?: Date | string | null } | null };

export type UseTabBarConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type UseTabBarConfigQuery = { __typename?: 'Query', activeConfiguration: { __typename?: 'GetConfigurationByUuidResponse', data: (
      { __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, me?: { __typename?: 'PersonNode', linkblue?: string | null } | null };

export type TriviaCrackQueryVariables = Exact<{ [key: string]: never; }>;


export type TriviaCrackQuery = { __typename?: 'Query', activeConfiguration: { __typename?: 'GetConfigurationByUuidResponse', data: (
      { __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, me?: { __typename?: 'PersonNode', teams: Array<{ __typename?: 'MembershipNode', team: { __typename?: 'TeamNode', type: TeamType, name: string } }> } | null };

export type AuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthStateQuery = { __typename?: 'Query', me?: { __typename?: 'PersonNode', id: string } | null, loginState: { __typename?: 'LoginState', dbRole: DbRole, loggedIn: boolean, authSource: AuthSource } };

export type SetDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;


export type SetDeviceMutation = { __typename?: 'Mutation', registerDevice: { __typename?: 'RegisterDeviceResponse', ok: boolean } };

export type EventScreenFragmentFragment = { __typename?: 'EventNode', id: string, title: string, summary?: string | null, description?: string | null, location?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceNode', id: string, fullDay: boolean, interval: { __typename?: 'IntervalISO', start: Date | string, end: Date | string } }>, images: Array<{ __typename?: 'ImageNode', thumbHash?: string | null, url?: URL | string | null, height: number, width: number, alt?: string | null, mimeType: string }> } & { ' $fragmentName'?: 'EventScreenFragmentFragment' };

export type DeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars['GlobalId']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier: Scalars['String']['input'];
}>;


export type DeviceNotificationsQuery = { __typename?: 'Query', device: { __typename?: 'GetDeviceByUuidResponse', data: { __typename?: 'DeviceNode', notificationDeliveries: Array<(
        { __typename?: 'NotificationDeliveryNode' }
        & { ' $fragmentRefs'?: { 'NotificationDeliveryFragmentFragment': NotificationDeliveryFragmentFragment } }
      )> } } };

export type ProfileScreenAuthFragmentFragment = { __typename?: 'LoginState', dbRole: DbRole, authSource: AuthSource } & { ' $fragmentName'?: 'ProfileScreenAuthFragmentFragment' };

export type ProfileScreenUserFragmentFragment = { __typename?: 'PersonNode', name?: string | null, linkblue?: string | null, teams: Array<{ __typename?: 'MembershipNode', position: MembershipPositionType, team: { __typename?: 'TeamNode', name: string } }>, primaryCommittee?: { __typename?: 'CommitteeMembershipNode', identifier: CommitteeIdentifier, role: CommitteeRole } | null } & { ' $fragmentName'?: 'ProfileScreenUserFragmentFragment' };

export type RootScreenDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type RootScreenDocumentQuery = { __typename?: 'Query', loginState: (
    { __typename?: 'LoginState' }
    & { ' $fragmentRefs'?: { 'ProfileScreenAuthFragmentFragment': ProfileScreenAuthFragmentFragment;'RootScreenAuthFragmentFragment': RootScreenAuthFragmentFragment } }
  ), me?: (
    { __typename?: 'PersonNode' }
    & { ' $fragmentRefs'?: { 'ProfileScreenUserFragmentFragment': ProfileScreenUserFragmentFragment } }
  ) | null };

export type RootScreenAuthFragmentFragment = { __typename?: 'LoginState', dbRole: DbRole } & { ' $fragmentName'?: 'RootScreenAuthFragmentFragment' };

export type EventsQueryVariables = Exact<{
  earliestTimestamp: Scalars['DateTimeISO']['input'];
  lastTimestamp: Scalars['DateTimeISO']['input'];
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'ListEventsResponse', data: Array<(
      { __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventScreenFragmentFragment': EventScreenFragmentFragment } }
    )> } };

export type ServerFeedQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerFeedQuery = { __typename?: 'Query', feed: Array<{ __typename?: 'FeedNode', id: string, title: string, createdAt?: Date | string | null, textContent?: string | null, image?: { __typename?: 'ImageNode', url?: URL | string | null, alt?: string | null, width: number, height: number, thumbHash?: string | null } | null }> };

export type HourScreenFragmentFragment = { __typename?: 'MarathonHourNode', id: string, title: string, details?: string | null, durationInfo: string, mapImages: Array<(
    { __typename?: 'ImageNode' }
    & { ' $fragmentRefs'?: { 'ImageViewFragmentFragment': ImageViewFragmentFragment } }
  )> } & { ' $fragmentName'?: 'HourScreenFragmentFragment' };

export type MarathonScreenQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonScreenQuery = { __typename?: 'Query', currentMarathonHour?: (
    { __typename?: 'MarathonHourNode' }
    & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
  ) | null, latestMarathon?: { __typename?: 'MarathonNode', startDate?: Date | string | null, endDate?: Date | string | null, hours: Array<(
      { __typename?: 'MarathonHourNode' }
      & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
    )> } | null };

export type ScoreBoardFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, totalPoints: number, legacyStatus: TeamLegacyStatus, type: TeamType } & { ' $fragmentName'?: 'ScoreBoardFragmentFragment' };

export type HighlightedTeamFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, legacyStatus: TeamLegacyStatus, type: TeamType } & { ' $fragmentName'?: 'HighlightedTeamFragmentFragment' };

export type ScoreBoardDocumentQueryVariables = Exact<{
  type?: InputMaybe<Array<TeamType> | TeamType>;
}>;


export type ScoreBoardDocumentQuery = { __typename?: 'Query', me?: { __typename?: 'PersonNode', id: string, teams: Array<{ __typename?: 'MembershipNode', team: (
        { __typename?: 'TeamNode' }
        & { ' $fragmentRefs'?: { 'HighlightedTeamFragmentFragment': HighlightedTeamFragmentFragment;'MyTeamFragmentFragment': MyTeamFragmentFragment } }
      ) }> } | null, teams: { __typename?: 'ListTeamsResponse', data: Array<(
      { __typename?: 'TeamNode' }
      & { ' $fragmentRefs'?: { 'ScoreBoardFragmentFragment': ScoreBoardFragmentFragment } }
    )> } };

export type ActiveMarathonDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMarathonDocumentQuery = { __typename?: 'Query', currentMarathon?: { __typename?: 'MarathonNode', id: string } | null };

export type MyTeamFragmentFragment = { __typename?: 'TeamNode', id: string, name: string, totalPoints: number, pointEntries: Array<{ __typename?: 'PointEntryNode', points: number, personFrom?: { __typename?: 'PersonNode', id: string, name?: string | null, linkblue?: string | null } | null }>, members: Array<{ __typename?: 'MembershipNode', position: MembershipPositionType, person: { __typename?: 'PersonNode', linkblue?: string | null, name?: string | null } }> } & { ' $fragmentName'?: 'MyTeamFragmentFragment' };

export const SimpleConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<SimpleConfigFragment, unknown>;
export const FullConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<FullConfigFragment, unknown>;
export const NotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationFragmentFragment, unknown>;
export const NotificationDeliveryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationDeliveryFragmentFragment, unknown>;
export const EventScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventScreenFragmentFragment, unknown>;
export const ProfileScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]} as unknown as DocumentNode<ProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryCommittee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]} as unknown as DocumentNode<RootScreenAuthFragmentFragment, unknown>;
export const ImageViewFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<ImageViewFragmentFragment, unknown>;
export const HourScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<HourScreenFragmentFragment, unknown>;
export const ScoreBoardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardFragmentFragment, unknown>;
export const HighlightedTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<HighlightedTeamFragmentFragment, unknown>;
export const MyTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MyTeamFragmentFragment, unknown>;
export const UseAllowedLoginTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useAllowedLoginTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"ALLOWED_LOGIN_TYPES","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseAllowedLoginTypesQuery, UseAllowedLoginTypesQueryVariables>;
export const MarathonTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latestMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<MarathonTimeQuery, MarathonTimeQueryVariables>;
export const UseTabBarConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useTabBarConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TAB_BAR_CONFIG","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseTabBarConfigQuery, UseTabBarConfigQueryVariables>;
export const TriviaCrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TriviaCrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TRIVIA_CRACK","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<TriviaCrackQuery, TriviaCrackQueryVariables>;
export const AuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]}}]} as unknown as DocumentNode<AuthStateQuery, AuthStateQueryVariables>;
export const SetDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SetDeviceMutation, SetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeviceNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveryFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}}]} as unknown as DocumentNode<DeviceNotificationsQuery, DeviceNotificationsQueryVariables>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryCommittee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<RootScreenDocumentQuery, RootScreenDocumentQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"GREATER_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"LESS_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"StringValue","value":"occurrence","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const ServerFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerFeed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}}]}}]}}]}}]} as unknown as DocumentNode<ServerFeedQuery, ServerFeedQueryVariables>;
export const MarathonScreenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonScreen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathonHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}}]} as unknown as DocumentNode<MarathonScreenQuery, MarathonScreenQueryVariables>;
export const ScoreBoardDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScoreBoardDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HighlightedTeamFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyTeamFragment"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"totalPoints","block":false},{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"desc"},{"kind":"EnumValue","value":"asc"}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScoreBoardFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardDocumentQuery, ScoreBoardDocumentQueryVariables>;
export const ActiveMarathonDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveMarathonDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ActiveMarathonDocumentQuery, ActiveMarathonDocumentQueryVariables>;