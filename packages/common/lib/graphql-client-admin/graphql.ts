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
  /** Date range custom scalar type (just an ISO 8601 interval) */
  LuxonDateRange: { input: string; output: string; }
  /** Luxon DateTime custom scalar type */
  LuxonDateTime: { input: string; output: string; }
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

export type AddEventImageInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Int']['input'];
  imageData?: InputMaybe<Scalars['String']['input']>;
  mimeType: Scalars['String']['input'];
  thumbHash?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width: Scalars['Int']['input'];
};

export type AddEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'AddEventImageResponse';
  data: ImageResource;
  ok: Scalars['Boolean']['output'];
};

export type AuthIdPairResource = {
  __typename?: 'AuthIdPairResource';
  source: AuthSource;
  value: Scalars['String']['output'];
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
  ProgrammingCommittee = 'programmingCommittee',
  TechCommittee = 'techCommittee',
  ViceCommittee = 'viceCommittee'
}

/** Roles within a committee */
export enum CommitteeRole {
  Chair = 'Chair',
  Coordinator = 'Coordinator',
  Member = 'Member'
}

export type ConfigurationResource = {
  __typename?: 'ConfigurationResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  key: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
  validAfter?: Maybe<Scalars['LuxonDateTime']['output']>;
  validUntil?: Maybe<Scalars['LuxonDateTime']['output']>;
  value: Scalars['String']['output'];
};

export type CreateConfigurationInput = {
  key: Scalars['String']['input'];
  validAfter?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  validUntil?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  value: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateConfigurationResponse';
  data: ConfigurationResource;
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
  interval: Scalars['LuxonDateRange']['input'];
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateEventResponse';
  data: EventResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
};

export type CreateImageInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['NonNegativeInt']['input'];
  imageData?: InputMaybe<Scalars['String']['input']>;
  mimeType: Scalars['String']['input'];
  thumbHash?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width: Scalars['NonNegativeInt']['input'];
};

export type CreateImageResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateImageResponse';
  data: ImageResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
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
  email: Scalars['EmailAddress']['input'];
  linkblue?: InputMaybe<Scalars['String']['input']>;
  memberOf?: Array<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<RoleResourceInput>;
};

export type CreatePersonResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePersonResponse';
  data: PersonResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
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
  data: PointEntryResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
};

export type CreatePointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  type: TeamType;
};

export type CreatePointOpportunityResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePointOpportunityResponse';
  data: PointOpportunityResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
};

export type CreateTeamInput = {
  legacyStatus: TeamLegacyStatus;
  marathonYear: Scalars['String']['input'];
  name: Scalars['String']['input'];
  persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  type: TeamType;
};

export type CreateTeamResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateTeamResponse';
  data: TeamResource;
  ok: Scalars['Boolean']['output'];
  uuid: Scalars['String']['output'];
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

export type DeletePersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeletePersonResponse';
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
  value: Scalars['LuxonDateTime']['input'];
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

export type DeviceResource = {
  __typename?: 'DeviceResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  expoPushToken?: Maybe<Scalars['String']['output']>;
  lastLoggedInUser?: Maybe<PersonResource>;
  lastLogin?: Maybe<Scalars['LuxonDateTime']['output']>;
  notificationDeliveries: Array<NotificationDeliveryResource>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
};


export type DeviceResourceNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export type EventOccurrenceResource = {
  __typename?: 'EventOccurrenceResource';
  fullDay: Scalars['Boolean']['output'];
  interval: Scalars['LuxonDateRange']['output'];
  uuid: Scalars['ID']['output'];
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
  value: Scalars['LuxonDateTime']['input'];
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

export type EventResource = {
  __typename?: 'EventResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  images: Array<ImageResource>;
  location?: Maybe<Scalars['String']['output']>;
  occurrences: Array<EventOccurrenceResource>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
};

export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetAllConfigurationsResponse';
  data: Array<ConfigurationResource>;
  ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetConfigurationByUuidResponse';
  data: ConfigurationResource;
  ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetDeviceByUuidResponse';
  data: DeviceResource;
  ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetEventByUuidResponse';
  data: EventResource;
  ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetImageByUuidResponse';
  data: ImageResource;
  ok: Scalars['Boolean']['output'];
};

export type GetNotificationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetNotificationByUuidResponse';
  data: NotificationResource;
  ok: Scalars['Boolean']['output'];
};

export type GetPeopleResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetPeopleResponse';
  data: Array<PersonResource>;
  ok: Scalars['Boolean']['output'];
};

export type GetPersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetPersonResponse';
  data?: Maybe<PersonResource>;
  ok: Scalars['Boolean']['output'];
};

export type GetPointEntryByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetPointEntryByUuidResponse';
  data: PointEntryResource;
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  ok: Scalars['Boolean']['output'];
};

export type ImageResource = {
  __typename?: 'ImageResource';
  alt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  height: Scalars['Int']['output'];
  imageData?: Maybe<Scalars['String']['output']>;
  mimeType: Scalars['String']['output'];
  thumbHash?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
  uuid: Scalars['ID']['output'];
  width: Scalars['Int']['output'];
};

export type ListDevicesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListDevicesResponse';
  data: Array<DeviceResource>;
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
  data: Array<EventResource>;
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
  data: Array<MarathonResource>;
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
  data: Array<NotificationDeliveryResource>;
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
  data: Array<NotificationResource>;
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
  data: Array<PersonResource>;
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
  data: Array<PointEntryResource>;
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
  data: Array<PointOpportunityResource>;
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
  data: Array<TeamResource>;
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
  loggedIn: Scalars['Boolean']['output'];
  role: RoleResource;
};

export type MarathonHourResource = {
  __typename?: 'MarathonHourResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  durationInfo: Scalars['String']['output'];
  mapImages: Array<ImageResource>;
  shownStartingAt: Scalars['DateTimeISO']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
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
  value: Scalars['LuxonDateTime']['input'];
};

export type MarathonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MarathonResource = {
  __typename?: 'MarathonResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  endDate: Scalars['DateTimeISO']['output'];
  hours: Array<MarathonHourResource>;
  startDate: Scalars['DateTimeISO']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
  year: Scalars['String']['output'];
};

/** The position of a member on a team */
export enum MembershipPositionType {
  Captain = 'Captain',
  Member = 'Member'
}

export type MembershipResource = {
  __typename?: 'MembershipResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  person: PersonResource;
  position: MembershipPositionType;
  team: TeamResource;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  abortScheduledNotification: AbortScheduledNotificationResponse;
  acknowledgeDeliveryIssue: AcknowledgeDeliveryIssueResponse;
  addExistingImageToEvent: AddEventImageResponse;
  addImageToEvent: AddEventImageResponse;
  addMap: MarathonHourResource;
  createConfiguration: CreateConfigurationResponse;
  createConfigurations: CreateConfigurationResponse;
  createEvent: CreateEventResponse;
  createImage: CreateImageResponse;
  createMarathon: MarathonResource;
  createMarathonHour: MarathonHourResource;
  createPerson: CreatePersonResponse;
  createPointEntry: CreatePointEntryResponse;
  createPointOpportunity: CreatePointOpportunityResponse;
  createTeam: CreateTeamResponse;
  deleteConfiguration: DeleteConfigurationResponse;
  deleteDevice: DeleteDeviceResponse;
  deleteEvent: DeleteEventResponse;
  deleteImage: DeleteImageResponse;
  deleteMarathon: Scalars['Void']['output'];
  deleteMarathonHour: Scalars['Void']['output'];
  deleteNotification: DeleteNotificationResponse;
  deletePerson: DeletePersonResponse;
  deletePointEntry: DeletePointEntryResponse;
  deletePointOpportunity: DeletePointOpportunityResponse;
  deleteTeam: DeleteTeamResponse;
  registerDevice: RegisterDeviceResponse;
  removeImageFromEvent: RemoveEventImageResponse;
  removeMap: Scalars['Void']['output'];
  scheduleNotification: ScheduleNotificationResponse;
  /** Send a notification immediately. */
  sendNotification: SendNotificationResponse;
  setEvent: SetEventResponse;
  setMarathon: MarathonResource;
  setMarathonHour: MarathonHourResource;
  setPerson: GetPersonResponse;
  setPointOpportunity: SinglePointOpportunityResponse;
  setTeam: SingleTeamResponse;
  stageNotification: StageNotificationResponse;
};


export type MutationAbortScheduledNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationAcknowledgeDeliveryIssueArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationAddExistingImageToEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationAddImageToEventArgs = {
  eventId: Scalars['String']['input'];
  input: AddEventImageInput;
};


export type MutationAddMapArgs = {
  imageUuid: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
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
};


export type MutationDeleteConfigurationArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteEventArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteImageArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteMarathonArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteMarathonHourArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteNotificationArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  uuid: Scalars['String']['input'];
};


export type MutationDeletePersonArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeletePointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeletePointOpportunityArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationDeleteTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationRegisterDeviceArgs = {
  input: RegisterDeviceInput;
};


export type MutationRemoveImageFromEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationRemoveMapArgs = {
  imageUuid: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
};


export type MutationScheduleNotificationArgs = {
  sendAt: Scalars['DateTimeISO']['input'];
  uuid: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationSetEventArgs = {
  input: SetEventInput;
  uuid: Scalars['String']['input'];
};


export type MutationSetMarathonArgs = {
  input: SetMarathonInput;
  uuid: Scalars['String']['input'];
};


export type MutationSetMarathonHourArgs = {
  input: SetMarathonHourInput;
  uuid: Scalars['String']['input'];
};


export type MutationSetPersonArgs = {
  input: SetPersonInput;
  uuid: Scalars['String']['input'];
};


export type MutationSetPointOpportunityArgs = {
  input: SetPointOpportunityInput;
  uuid: Scalars['String']['input'];
};


export type MutationSetTeamArgs = {
  input: SetTeamInput;
  uuid: Scalars['String']['input'];
};


export type MutationStageNotificationArgs = {
  audience: NotificationAudienceInput;
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationAudienceInput = {
  all?: InputMaybe<Scalars['Boolean']['input']>;
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
  value: Scalars['LuxonDateTime']['input'];
};

export type NotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationDeliveryResource = {
  __typename?: 'NotificationDeliveryResource';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  chunkUuid?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  deliveryError?: Maybe<Scalars['String']['output']>;
  notification: NotificationResource;
  /** The time the server received a delivery receipt from the user. */
  receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
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
  value: Scalars['LuxonDateTime']['input'];
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

export type NotificationResource = {
  __typename?: 'NotificationResource';
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deliveryCount: Scalars['Int']['output'];
  deliveryIssue?: Maybe<Scalars['String']['output']>;
  deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deliveryIssueCount: NotificationDeliveryIssueCount;
  /** The time the notification is scheduled to be sent, if null it is either already sent or unscheduled. */
  sendAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server started sending the notification. */
  startedSendingAt?: Maybe<Scalars['DateTimeISO']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
  uuid: Scalars['ID']['output'];
};

export enum NumericComparator {
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqualTo = 'GREATER_THAN_OR_EQUAL_TO',
  Is = 'IS',
  LessThan = 'LESS_THAN',
  LessThanOrEqualTo = 'LESS_THAN_OR_EQUAL_TO'
}

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

export type PersonResource = {
  __typename?: 'PersonResource';
  /** @deprecated This is now provided on the AuthIdPair resource. */
  authIds: Array<AuthIdPairResource>;
  /** @deprecated Use teams instead and filter by position */
  captaincies: Array<MembershipResource>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  linkblue?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role: RoleResource;
  teams: Array<MembershipResource>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
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
  value: Scalars['LuxonDateTime']['input'];
};

export type PointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointEntryResource = {
  __typename?: 'PointEntryResource';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  personFrom?: Maybe<PersonResource>;
  pointOpportunity?: Maybe<PointOpportunityResource>;
  points: Scalars['Int']['output'];
  team: TeamResource;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
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
  value: Scalars['LuxonDateTime']['input'];
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

export type PointOpportunityResource = {
  __typename?: 'PointOpportunityResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  event?: Maybe<EventResource>;
  name: Scalars['String']['output'];
  opportunityDate?: Maybe<Scalars['LuxonDateTime']['output']>;
  type: TeamType;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  activeConfiguration: GetConfigurationByUuidResponse;
  allConfigurations: GetAllConfigurationsResponse;
  currentMarathon?: Maybe<MarathonResource>;
  currentMarathonHour?: Maybe<MarathonHourResource>;
  device: GetDeviceByUuidResponse;
  devices: ListDevicesResponse;
  event: GetEventByUuidResponse;
  events: ListEventsResponse;
  image: GetImageByUuidResponse;
  listPeople: ListPeopleResponse;
  loginState: LoginState;
  marathon: MarathonResource;
  marathonForYear: MarathonResource;
  marathonHour: MarathonHourResource;
  marathons: ListMarathonsResponse;
  me: GetPersonResponse;
  nextMarathon?: Maybe<MarathonResource>;
  notification: GetNotificationByUuidResponse;
  notificationDeliveries: ListNotificationDeliveriesResponse;
  notifications: ListNotificationsResponse;
  person: GetPersonResponse;
  personByLinkBlue: GetPersonResponse;
  pointEntries: ListPointEntriesResponse;
  pointEntry: GetPointEntryByUuidResponse;
  pointOpportunities: ListPointOpportunitiesResponse;
  pointOpportunity: SinglePointOpportunityResponse;
  searchPeopleByName: GetPeopleResponse;
  team: SingleTeamResponse;
  teams: ListTeamsResponse;
};


export type QueryActiveConfigurationArgs = {
  key: Scalars['String']['input'];
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
  uuid: Scalars['String']['input'];
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


export type QueryImageArgs = {
  uuid: Scalars['String']['input'];
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
  uuid: Scalars['String']['input'];
};


export type QueryMarathonForYearArgs = {
  year: Scalars['String']['input'];
};


export type QueryMarathonHourArgs = {
  uuid: Scalars['String']['input'];
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


export type QueryNotificationArgs = {
  uuid: Scalars['String']['input'];
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
  uuid: Scalars['String']['input'];
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
  uuid: Scalars['String']['input'];
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
  uuid: Scalars['String']['input'];
};


export type QuerySearchPeopleByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryTeamsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<Array<TeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<Array<TeamLegacyStatus>>;
  marathonYear?: InputMaybe<Array<Scalars['String']['input']>>;
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
  data: DeviceResource;
  ok: Scalars['Boolean']['output'];
};

export type RemoveEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'RemoveEventImageResponse';
  data: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type RoleResource = {
  __typename?: 'RoleResource';
  committeeIdentifier?: Maybe<CommitteeIdentifier>;
  committeeRole?: Maybe<CommitteeRole>;
  dbRole: DbRole;
};

export type RoleResourceInput = {
  committeeIdentifier?: InputMaybe<CommitteeIdentifier>;
  committeeRole?: InputMaybe<CommitteeRole>;
  dbRole?: DbRole;
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
  interval: Scalars['LuxonDateRange']['input'];
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  uuid?: InputMaybe<Scalars['String']['input']>;
};

export type SetEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SetEventResponse';
  data: EventResource;
  ok: Scalars['Boolean']['output'];
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
  role?: InputMaybe<RoleResourceInput>;
};

export type SetPointOpportunityInput = {
  eventUuid?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  type?: InputMaybe<TeamType>;
};

export type SetTeamInput = {
  legacyStatus?: InputMaybe<TeamLegacyStatus>;
  marathonYear?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TeamType>;
};

export type SinglePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SinglePointOpportunityResponse';
  data: PointOpportunityResource;
  ok: Scalars['Boolean']['output'];
};

export type SingleTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SingleTeamResponse';
  data: TeamResource;
  ok: Scalars['Boolean']['output'];
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type StageNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'StageNotificationResponse';
  data: NotificationResource;
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

export enum TeamResolverAllKeys {
  LegacyStatus = 'legacyStatus',
  MarathonYear = 'marathonYear',
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
  MarathonYear = 'marathonYear',
  Type = 'type'
}

export enum TeamResolverStringFilterKeys {
  Name = 'name'
}

export type TeamResource = {
  __typename?: 'TeamResource';
  /** @deprecated Just query the members field and filter by role */
  captains: Array<MembershipResource>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  legacyStatus: TeamLegacyStatus;
  marathonYear: Scalars['String']['output'];
  members: Array<MembershipResource>;
  name: Scalars['String']['output'];
  persistentIdentifier?: Maybe<Scalars['String']['output']>;
  pointEntries: Array<PointEntryResource>;
  totalPoints: Scalars['Int']['output'];
  type: TeamType;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  uuid: Scalars['ID']['output'];
};

/** Types of teams */
export enum TeamType {
  Committee = 'Committee',
  Morale = 'Morale',
  Spirit = 'Spirit'
}

export type SingleNotificationFragmentFragment = { __typename?: 'NotificationResource', uuid: string, title: string, body: string, deliveryIssue?: string | null, deliveryIssueAcknowledgedAt?: Date | string | null, sendAt?: Date | string | null, startedSendingAt?: Date | string | null, createdAt?: Date | string | null, deliveryCount: number, deliveryIssueCount: { __typename?: 'NotificationDeliveryIssueCount', DeviceNotRegistered: number, InvalidCredentials: number, MessageRateExceeded: number, MessageTooBig: number, MismatchSenderId: number, Unknown: number } } & { ' $fragmentName'?: 'SingleNotificationFragmentFragment' };

export type CreateNotificationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  body: Scalars['String']['input'];
  audience: NotificationAudienceInput;
  url?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateNotificationMutation = { __typename?: 'Mutation', stageNotification: { __typename?: 'StageNotificationResponse', uuid: string } };

export type CancelNotificationScheduleMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type CancelNotificationScheduleMutation = { __typename?: 'Mutation', abortScheduledNotification: { __typename?: 'AbortScheduledNotificationResponse', ok: boolean } };

export type DeleteNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteNotificationMutation = { __typename?: 'Mutation', deleteNotification: { __typename?: 'DeleteNotificationResponse', ok: boolean } };

export type SendNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type SendNotificationMutation = { __typename?: 'Mutation', sendNotification: { __typename?: 'SendNotificationResponse', ok: boolean } };

export type ScheduleNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  sendAt: Scalars['DateTimeISO']['input'];
}>;


export type ScheduleNotificationMutation = { __typename?: 'Mutation', scheduleNotification: { __typename?: 'ScheduleNotificationResponse', ok: boolean } };

export type TeamNameFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string } & { ' $fragmentName'?: 'TeamNameFragmentFragment' };

export type PersonCreatorMutationVariables = Exact<{
  input: CreatePersonInput;
}>;


export type PersonCreatorMutation = { __typename?: 'Mutation', createPerson: { __typename?: 'CreatePersonResponse', ok: boolean, uuid: string } };

export type PersonEditorFragmentFragment = { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null, email: string, role: { __typename?: 'RoleResource', committeeRole?: CommitteeRole | null, committeeIdentifier?: CommitteeIdentifier | null }, teams: Array<{ __typename?: 'MembershipResource', position: MembershipPositionType, team: { __typename?: 'TeamResource', uuid: string, name: string } }> } & { ' $fragmentName'?: 'PersonEditorFragmentFragment' };

export type PersonEditorMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: SetPersonInput;
}>;


export type PersonEditorMutation = { __typename?: 'Mutation', setPerson: { __typename?: 'GetPersonResponse', ok: boolean } };

export type CreatePointEntryMutationVariables = Exact<{
  input: CreatePointEntryInput;
}>;


export type CreatePointEntryMutation = { __typename?: 'Mutation', createPointEntry: { __typename?: 'CreatePointEntryResponse', data: { __typename?: 'PointEntryResource', uuid: string } } };

export type GetPersonByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GetPersonByUuidQuery = { __typename?: 'Query', person: { __typename?: 'GetPersonResponse', data?: { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null } | null } };

export type GetPersonByLinkBlueQueryVariables = Exact<{
  linkBlue: Scalars['String']['input'];
}>;


export type GetPersonByLinkBlueQuery = { __typename?: 'Query', personByLinkBlue: { __typename?: 'GetPersonResponse', data?: { __typename?: 'PersonResource', uuid: string, name?: string | null } | null } };

export type SearchPersonByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchPersonByNameQuery = { __typename?: 'Query', searchPeopleByName: { __typename?: 'GetPeopleResponse', data: Array<{ __typename?: 'PersonResource', uuid: string, name?: string | null }> } };

export type CreatePersonByLinkBlueMutationVariables = Exact<{
  linkBlue: Scalars['String']['input'];
  email: Scalars['EmailAddress']['input'];
  teamUuid: Scalars['String']['input'];
}>;


export type CreatePersonByLinkBlueMutation = { __typename?: 'Mutation', createPerson: { __typename?: 'CreatePersonResponse', uuid: string } };

export type PointEntryOpportunityLookupQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type PointEntryOpportunityLookupQuery = { __typename?: 'Query', pointOpportunities: { __typename?: 'ListPointOpportunitiesResponse', data: Array<{ __typename?: 'PointOpportunityResource', name: string, uuid: string }> } };

export type CreatePointOpportunityMutationVariables = Exact<{
  input: CreatePointOpportunityInput;
}>;


export type CreatePointOpportunityMutation = { __typename?: 'Mutation', createPointOpportunity: { __typename?: 'CreatePointOpportunityResponse', uuid: string } };

export type TeamCreatorMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type TeamCreatorMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'CreateTeamResponse', ok: boolean, uuid: string } };

export type TeamEditorFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string, marathonYear: string, legacyStatus: TeamLegacyStatus, persistentIdentifier?: string | null, type: TeamType } & { ' $fragmentName'?: 'TeamEditorFragmentFragment' };

export type TeamEditorMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: SetTeamInput;
}>;


export type TeamEditorMutation = { __typename?: 'Mutation', setTeam: { __typename?: 'SingleTeamResponse', ok: boolean } };

export type PeopleTableFragmentFragment = { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null, email: string, role: { __typename?: 'RoleResource', dbRole: DbRole, committeeRole?: CommitteeRole | null, committeeIdentifier?: CommitteeIdentifier | null } } & { ' $fragmentName'?: 'PeopleTableFragmentFragment' };

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
      { __typename?: 'PersonResource' }
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
      { __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'TeamsTableFragmentFragment': TeamsTableFragmentFragment } }
    )> } };

export type TeamsTableFragmentFragment = { __typename?: 'TeamResource', uuid: string, type: TeamType, name: string, legacyStatus: TeamLegacyStatus, marathonYear: string, totalPoints: number } & { ' $fragmentName'?: 'TeamsTableFragmentFragment' };

export type NotificationDeliveriesTableFragmentFragment = { __typename?: 'NotificationDeliveryResource', uuid: string, deliveryError?: string | null, receiptCheckedAt?: Date | string | null, sentAt?: Date | string | null } & { ' $fragmentName'?: 'NotificationDeliveriesTableFragmentFragment' };

export type NotificationDeliveriesTableQueryQueryVariables = Exact<{
  notificationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<Array<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedDateFilterItem> | NotificationDeliveryResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<Array<NotificationDeliveryResolverKeyedIsNullFilterItem> | NotificationDeliveryResolverKeyedIsNullFilterItem>;
}>;


export type NotificationDeliveriesTableQueryQuery = { __typename?: 'Query', notificationDeliveries: { __typename?: 'ListNotificationDeliveriesResponse', page: number, pageSize: number, total: number, data: Array<(
      { __typename?: 'NotificationDeliveryResource' }
      & { ' $fragmentRefs'?: { 'NotificationDeliveriesTableFragmentFragment': NotificationDeliveriesTableFragmentFragment } }
    )> } };

export type NotificationsTableFragmentFragment = { __typename?: 'NotificationResource', uuid: string, title: string, body: string, deliveryIssue?: string | null, deliveryIssueAcknowledgedAt?: Date | string | null, sendAt?: Date | string | null, startedSendingAt?: Date | string | null } & { ' $fragmentName'?: 'NotificationsTableFragmentFragment' };

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
      { __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'NotificationsTableFragmentFragment': NotificationsTableFragmentFragment } }
    )> } };

export type DeletePointEntryMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeletePointEntryMutation = { __typename?: 'Mutation', deletePointEntry: { __typename?: 'DeletePointEntryResponse', ok: boolean } };

export type PointEntryTableFragmentFragment = { __typename?: 'PointEntryResource', uuid: string, points: number, comment?: string | null, personFrom?: { __typename?: 'PersonResource', name?: string | null, linkblue?: string | null } | null, pointOpportunity?: { __typename?: 'PointOpportunityResource', name: string, opportunityDate?: string | null } | null } & { ' $fragmentName'?: 'PointEntryTableFragmentFragment' };

export type DeletePersonMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeletePersonMutation = { __typename?: 'Mutation', deletePerson: { __typename?: 'DeletePersonResponse', ok: boolean } };

export type PersonViewerFragmentFragment = { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null, email: string, role: { __typename?: 'RoleResource', dbRole: DbRole, committeeRole?: CommitteeRole | null, committeeIdentifier?: CommitteeIdentifier | null }, teams: Array<{ __typename?: 'MembershipResource', position: MembershipPositionType, team: { __typename?: 'TeamResource', uuid: string, name: string } }> } & { ' $fragmentName'?: 'PersonViewerFragmentFragment' };

export type DeleteTeamMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteTeamMutation = { __typename?: 'Mutation', deleteTeam: { __typename?: 'DeleteTeamResponse', ok: boolean } };

export type TeamViewerFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string, marathonYear: string, legacyStatus: TeamLegacyStatus, totalPoints: number, type: TeamType, members: Array<{ __typename?: 'MembershipResource', person: { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null } }>, captains: Array<{ __typename?: 'MembershipResource', person: { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null } }> } & { ' $fragmentName'?: 'TeamViewerFragmentFragment' };

export type LoginStateQueryVariables = Exact<{ [key: string]: never; }>;


export type LoginStateQuery = { __typename?: 'Query', loginState: { __typename?: 'LoginState', loggedIn: boolean, role: { __typename?: 'RoleResource', dbRole: DbRole, committeeRole?: CommitteeRole | null, committeeIdentifier?: CommitteeIdentifier | null } } };

export type CommitConfigChangesMutationVariables = Exact<{
  changes: Array<CreateConfigurationInput> | CreateConfigurationInput;
}>;


export type CommitConfigChangesMutation = { __typename?: 'Mutation', createConfigurations: { __typename?: 'CreateConfigurationResponse', ok: boolean } };

export type ConfigFragmentFragment = { __typename?: 'ConfigurationResource', uuid: string, key: string, value: string, validAfter?: string | null, validUntil?: string | null, createdAt?: Date | string | null } & { ' $fragmentName'?: 'ConfigFragmentFragment' };

export type ConfigQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQueryQuery = { __typename?: 'Query', allConfigurations: { __typename?: 'GetAllConfigurationsResponse', data: Array<(
      { __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'ConfigFragmentFragment': ConfigFragmentFragment } }
    )> } };

export type CreateEventMutationVariables = Exact<{
  input: CreateEventInput;
}>;


export type CreateEventMutation = { __typename?: 'Mutation', createEvent: { __typename?: 'CreateEventResponse', data: { __typename?: 'EventResource', uuid: string } } };

export type EventsTableFragmentFragment = { __typename?: 'EventResource', uuid: string, title: string, description?: string | null, summary?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceResource', uuid: string, interval: string, fullDay: boolean }> } & { ' $fragmentName'?: 'EventsTableFragmentFragment' };

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
      { __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventsTableFragmentFragment': EventsTableFragmentFragment } }
    )> } };

export type EditEventPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type EditEventPageQuery = { __typename?: 'Query', event: { __typename?: 'GetEventByUuidResponse', data: (
      { __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventEditorFragmentFragment': EventEditorFragmentFragment } }
    ) } };

export type EventEditorFragmentFragment = { __typename?: 'EventResource', uuid: string, title: string, summary?: string | null, description?: string | null, location?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceResource', uuid: string, interval: string, fullDay: boolean }>, images: Array<{ __typename?: 'ImageResource', url?: URL | string | null, imageData?: string | null, width: number, height: number, thumbHash?: string | null, alt?: string | null }> } & { ' $fragmentName'?: 'EventEditorFragmentFragment' };

export type SaveEventMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: SetEventInput;
}>;


export type SaveEventMutation = { __typename?: 'Mutation', setEvent: { __typename?: 'SetEventResponse', data: (
      { __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventEditorFragmentFragment': EventEditorFragmentFragment } }
    ) } };

export type DeleteEventMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type DeleteEventMutation = { __typename?: 'Mutation', deleteEvent: { __typename?: 'DeleteEventResponse', ok: boolean } };

export type EventViewerFragmentFragment = { __typename?: 'EventResource', uuid: string, title: string, summary?: string | null, description?: string | null, location?: string | null, createdAt?: Date | string | null, updatedAt?: Date | string | null, occurrences: Array<{ __typename?: 'EventOccurrenceResource', interval: string, fullDay: boolean }>, images: Array<{ __typename?: 'ImageResource', url?: URL | string | null, imageData?: string | null, width: number, height: number, thumbHash?: string | null, alt?: string | null }> } & { ' $fragmentName'?: 'EventViewerFragmentFragment' };

export type ViewEventPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type ViewEventPageQuery = { __typename?: 'Query', event: { __typename?: 'GetEventByUuidResponse', data: (
      { __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventViewerFragmentFragment': EventViewerFragmentFragment } }
    ) } };

export type CreateMarathonMutationVariables = Exact<{
  input: CreateMarathonInput;
}>;


export type CreateMarathonMutation = { __typename?: 'Mutation', createMarathon: { __typename?: 'MarathonResource', uuid: string } };

export type MarathonOverviewPageQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonOverviewPageQuery = { __typename?: 'Query', nextMarathon?: (
    { __typename?: 'MarathonResource' }
    & { ' $fragmentRefs'?: { 'MarathonViewerFragmentFragment': MarathonViewerFragmentFragment } }
  ) | null, marathons: { __typename?: 'ListMarathonsResponse', data: Array<(
      { __typename?: 'MarathonResource' }
      & { ' $fragmentRefs'?: { 'MarathonTableFragmentFragment': MarathonTableFragmentFragment } }
    )> } };

export type MarathonTableFragmentFragment = { __typename?: 'MarathonResource', uuid: string, year: string, startDate: Date | string, endDate: Date | string } & { ' $fragmentName'?: 'MarathonTableFragmentFragment' };

export type EditMarathonMutationVariables = Exact<{
  input: SetMarathonInput;
  marathonId: Scalars['String']['input'];
}>;


export type EditMarathonMutation = { __typename?: 'Mutation', setMarathon: { __typename?: 'MarathonResource', uuid: string } };

export type GetMarathonQueryVariables = Exact<{
  marathonId: Scalars['String']['input'];
}>;


export type GetMarathonQuery = { __typename?: 'Query', marathon: { __typename?: 'MarathonResource', year: string, startDate: Date | string, endDate: Date | string } };

export type MarathonViewerFragmentFragment = { __typename?: 'MarathonResource', uuid: string, year: string, startDate: Date | string, endDate: Date | string, hours: Array<{ __typename?: 'MarathonHourResource', uuid: string, shownStartingAt: Date | string, title: string }> } & { ' $fragmentName'?: 'MarathonViewerFragmentFragment' };

export type MarathonPageQueryVariables = Exact<{
  marathonUuid: Scalars['String']['input'];
}>;


export type MarathonPageQuery = { __typename?: 'Query', marathon: (
    { __typename?: 'MarathonResource' }
    & { ' $fragmentRefs'?: { 'MarathonViewerFragmentFragment': MarathonViewerFragmentFragment } }
  ) };

export type AddMarathonHourMutationVariables = Exact<{
  input: CreateMarathonHourInput;
  marathonUuid: Scalars['String']['input'];
}>;


export type AddMarathonHourMutation = { __typename?: 'Mutation', createMarathonHour: { __typename?: 'MarathonHourResource', uuid: string } };

export type EditMarathonHourDataQueryVariables = Exact<{
  marathonHourUuid: Scalars['String']['input'];
}>;


export type EditMarathonHourDataQuery = { __typename?: 'Query', marathonHour: { __typename?: 'MarathonHourResource', details?: string | null, durationInfo: string, shownStartingAt: Date | string, title: string } };

export type EditMarathonHourMutationVariables = Exact<{
  input: SetMarathonHourInput;
  uuid: Scalars['String']['input'];
}>;


export type EditMarathonHourMutation = { __typename?: 'Mutation', setMarathonHour: { __typename?: 'MarathonHourResource', uuid: string } };

export type NotificationManagerQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type NotificationManagerQuery = { __typename?: 'Query', notification: { __typename?: 'GetNotificationByUuidResponse', data: (
      { __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'SingleNotificationFragmentFragment': SingleNotificationFragmentFragment } }
    ) } };

export type NotificationViewerQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type NotificationViewerQuery = { __typename?: 'Query', notification: { __typename?: 'GetNotificationByUuidResponse', data: (
      { __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'SingleNotificationFragmentFragment': SingleNotificationFragmentFragment } }
    ) } };

export type CreatePersonPageQueryVariables = Exact<{ [key: string]: never; }>;


export type CreatePersonPageQuery = { __typename?: 'Query', teams: { __typename?: 'ListTeamsResponse', data: Array<(
      { __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'TeamNameFragmentFragment': TeamNameFragmentFragment } }
    )> } };

export type EditPersonPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type EditPersonPageQuery = { __typename?: 'Query', person: { __typename?: 'GetPersonResponse', data?: (
      { __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'PersonEditorFragmentFragment': PersonEditorFragmentFragment } }
    ) | null }, teams: { __typename?: 'ListTeamsResponse', data: Array<(
      { __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'TeamNameFragmentFragment': TeamNameFragmentFragment } }
    )> } };

export type ViewPersonPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type ViewPersonPageQuery = { __typename?: 'Query', person: { __typename?: 'GetPersonResponse', data?: (
      { __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'PersonViewerFragmentFragment': PersonViewerFragmentFragment } }
    ) | null } };

export type EditTeamPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type EditTeamPageQuery = { __typename?: 'Query', team: { __typename?: 'SingleTeamResponse', data: (
      { __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'TeamEditorFragmentFragment': TeamEditorFragmentFragment } }
    ) } };

export type ViewTeamPageQueryVariables = Exact<{
  teamUuid: Scalars['String']['input'];
}>;


export type ViewTeamPageQuery = { __typename?: 'Query', team: { __typename?: 'SingleTeamResponse', data: (
      { __typename?: 'TeamResource', pointEntries: Array<(
        { __typename?: 'PointEntryResource' }
        & { ' $fragmentRefs'?: { 'PointEntryTableFragmentFragment': PointEntryTableFragmentFragment } }
      )> }
      & { ' $fragmentRefs'?: { 'TeamViewerFragmentFragment': TeamViewerFragmentFragment } }
    ) } };

export const SingleNotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<SingleNotificationFragmentFragment, unknown>;
export const TeamNameFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<TeamNameFragmentFragment, unknown>;
export const PersonEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PersonEditorFragmentFragment, unknown>;
export const TeamEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"persistentIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<TeamEditorFragmentFragment, unknown>;
export const PeopleTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]} as unknown as DocumentNode<PeopleTableFragmentFragment, unknown>;
export const TeamsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<TeamsTableFragmentFragment, unknown>;
export const NotificationDeliveriesTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<NotificationDeliveriesTableFragmentFragment, unknown>;
export const NotificationsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<NotificationsTableFragmentFragment, unknown>;
export const PointEntryTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<PointEntryTableFragmentFragment, unknown>;
export const PersonViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PersonViewerFragmentFragment, unknown>;
export const TeamViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"captains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}}]} as unknown as DocumentNode<TeamViewerFragmentFragment, unknown>;
export const ConfigFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfigFragmentFragment, unknown>;
export const EventsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<EventsTableFragmentFragment, unknown>;
export const EventEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<EventEditorFragmentFragment, unknown>;
export const EventViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<EventViewerFragmentFragment, unknown>;
export const MarathonTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<MarathonTableFragmentFragment, unknown>;
export const MarathonViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<MarathonViewerFragmentFragment, unknown>;
export const CreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"audience"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationAudienceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stageNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"audience"},"value":{"kind":"Variable","name":{"kind":"Name","value":"audience"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateNotificationMutation, CreateNotificationMutationVariables>;
export const CancelNotificationScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelNotificationSchedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortScheduledNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CancelNotificationScheduleMutation, CancelNotificationScheduleMutationVariables>;
export const DeleteNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteNotificationMutation, DeleteNotificationMutationVariables>;
export const SendNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SendNotificationMutation, SendNotificationMutationVariables>;
export const ScheduleNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"sendAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<ScheduleNotificationMutation, ScheduleNotificationMutationVariables>;
export const PersonCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<PersonCreatorMutation, PersonCreatorMutationVariables>;
export const PersonEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetPersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<PersonEditorMutation, PersonEditorMutationVariables>;
export const CreatePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePointEntryMutation, CreatePointEntryMutationVariables>;
export const GetPersonByUuidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByUuid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}}]} as unknown as DocumentNode<GetPersonByUuidQuery, GetPersonByUuidQueryVariables>;
export const GetPersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personByLinkBlue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"linkBlueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetPersonByLinkBlueQuery, GetPersonByLinkBlueQueryVariables>;
export const SearchPersonByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPersonByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPeopleByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SearchPersonByNameQuery, SearchPersonByNameQueryVariables>;
export const CreatePersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"linkblue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"memberOf"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreatePersonByLinkBlueMutation, CreatePersonByLinkBlueMutationVariables>;
export const PointEntryOpportunityLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PointEntryOpportunityLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointOpportunities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"SUBSTRING"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<PointEntryOpportunityLookupQuery, PointEntryOpportunityLookupQueryVariables>;
export const CreatePointOpportunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointOpportunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointOpportunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointOpportunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreatePointOpportunityMutation, CreatePointOpportunityMutationVariables>;
export const TeamCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<TeamCreatorMutation, TeamCreatorMutationVariables>;
export const TeamEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<TeamEditorMutation, TeamEditorMutationVariables>;
export const PeopleTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PeopleTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PeopleTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]} as unknown as DocumentNode<PeopleTableQuery, PeopleTableQueryVariables>;
export const TeamsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<TeamsTableQuery, TeamsTableQueryVariables>;
export const NotificationDeliveriesTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationDeliveriesTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedIsNullFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"notificationUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<NotificationDeliveriesTableQueryQuery, NotificationDeliveriesTableQueryQueryVariables>;
export const NotificationsTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<NotificationsTableQueryQuery, NotificationsTableQueryQueryVariables>;
export const DeletePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeletePointEntryMutation, DeletePointEntryMutationVariables>;
export const DeletePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeletePersonMutation, DeletePersonMutationVariables>;
export const DeleteTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteTeamMutation, DeleteTeamMutationVariables>;
export const LoginStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]}}]} as unknown as DocumentNode<LoginStateQuery, LoginStateQueryVariables>;
export const CommitConfigChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitConfigChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateConfigurationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConfigurations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<CommitConfigChangesMutation, CommitConfigChangesMutationVariables>;
export const ConfigQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConfigQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allConfigurations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<ConfigQueryQuery, ConfigQueryQueryVariables>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<CreateEventMutation, CreateEventMutationVariables>;
export const EventsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<EventsTableQuery, EventsTableQueryVariables>;
export const EditEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<EditEventPageQuery, EditEventPageQueryVariables>;
export const SaveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<SaveEventMutation, SaveEventMutationVariables>;
export const DeleteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<DeleteEventMutation, DeleteEventMutationVariables>;
export const ViewEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventViewerFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ViewEventPageQuery, ViewEventPageQueryVariables>;
export const CreateMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarathonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<CreateMarathonMutation, CreateMarathonMutationVariables>;
export const MarathonOverviewPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonOverviewPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonViewerFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marathons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]} as unknown as DocumentNode<MarathonOverviewPageQuery, MarathonOverviewPageQueryVariables>;
export const EditMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetMarathonInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMarathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<EditMarathonMutation, EditMarathonMutationVariables>;
export const GetMarathonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMarathon"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<GetMarathonQuery, GetMarathonQueryVariables>;
export const MarathonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathon"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MarathonViewerFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MarathonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<MarathonPageQuery, MarathonPageQueryVariables>;
export const AddMarathonHourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddMarathonHour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateMarathonHourInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMarathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"marathonUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<AddMarathonHourMutation, AddMarathonHourMutationVariables>;
export const EditMarathonHourDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditMarathonHourData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marathonHourUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marathonHourUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"shownStartingAt"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<EditMarathonHourDataQuery, EditMarathonHourDataQueryVariables>;
export const EditMarathonHourDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditMarathonHour"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetMarathonHourInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setMarathonHour"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}},{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<EditMarathonHourMutation, EditMarathonHourMutationVariables>;
export const NotificationManagerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationManager"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<NotificationManagerQuery, NotificationManagerQueryVariables>;
export const NotificationViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationViewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<NotificationViewerQuery, NotificationViewerQueryVariables>;
export const CreatePersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreatePersonPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ASCENDING"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamNameFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<CreatePersonPageQuery, CreatePersonPageQueryVariables>;
export const EditPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonEditorFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ASCENDING"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamNameFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<EditPersonPageQuery, EditPersonPageQueryVariables>;
export const ViewPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonViewerFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ViewPersonPageQuery, ViewPersonPageQueryVariables>;
export const EditTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"persistentIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<EditTeamPageQuery, EditTeamPageQueryVariables>;
export const ViewTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointEntryTableFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"captains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<ViewTeamPageQuery, ViewTeamPageQueryVariables>;