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

export type ImageViewFragmentFragment = { __typename?: 'ImageResource', uuid: string, url?: URL | string | null, imageData?: string | null, thumbHash?: string | null, alt?: string | null, width: number, height: number, mimeType: string } & { ' $fragmentName'?: 'ImageViewFragmentFragment' };

export type SimpleConfigFragment = { __typename?: 'ConfigurationResource', uuid: string, key: string, value: string } & { ' $fragmentName'?: 'SimpleConfigFragment' };

export type FullConfigFragment = (
  { __typename?: 'ConfigurationResource', validAfter?: string | null, validUntil?: string | null, createdAt?: Date | string | null }
  & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
) & { ' $fragmentName'?: 'FullConfigFragment' };

export type NotificationFragmentFragment = { __typename?: 'NotificationResource', uuid: string, title: string, body: string, url?: URL | string | null } & { ' $fragmentName'?: 'NotificationFragmentFragment' };

export type NotificationDeliveryFragmentFragment = { __typename?: 'NotificationDeliveryResource', uuid: string, sentAt?: Date | string | null, notification: (
    { __typename?: 'NotificationResource' }
    & { ' $fragmentRefs'?: { 'NotificationFragmentFragment': NotificationFragmentFragment } }
  ) } & { ' $fragmentName'?: 'NotificationDeliveryFragmentFragment' };

export type UseAllowedLoginTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type UseAllowedLoginTypesQuery = { __typename?: 'Query', activeConfiguration: { __typename?: 'GetConfigurationByUuidResponse', data: (
      { __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type UseMarathonStartQueryVariables = Exact<{ [key: string]: never; }>;


export type UseMarathonStartQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type UseMarathonEndQueryVariables = Exact<{ [key: string]: never; }>;


export type UseMarathonEndQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type UseTabBarConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type UseTabBarConfigQuery = { __typename?: 'Query', activeConfiguration: { __typename?: 'GetConfigurationByUuidResponse', data: (
      { __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type AuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthStateQuery = { __typename?: 'Query', me: { __typename?: 'GetPersonResponse', data?: { __typename?: 'PersonResource', uuid: string } | null }, loginState: { __typename?: 'LoginState', loggedIn: boolean, authSource: AuthSource, role: { __typename?: 'RoleResource', dbRole: DbRole, committeeIdentifier?: CommitteeIdentifier | null, committeeRole?: CommitteeRole | null } } };

export type SetDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;


export type SetDeviceMutation = { __typename?: 'Mutation', registerDevice: { __typename?: 'RegisterDeviceResponse', ok: boolean } };

export type EventScreenFragmentFragment = { __typename?: 'EventResource', uuid: string, title: string, summary?: string | null, description?: string | null, location?: string | null, occurrences: Array<{ __typename?: 'EventOccurrenceResource', uuid: string, interval: string, fullDay: boolean }>, images: Array<{ __typename?: 'ImageResource', imageData?: string | null, thumbHash?: string | null, url?: URL | string | null, height: number, width: number, alt?: string | null, mimeType: string }> } & { ' $fragmentName'?: 'EventScreenFragmentFragment' };

export type DeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier: Scalars['String']['input'];
}>;


export type DeviceNotificationsQuery = { __typename?: 'Query', device: { __typename?: 'GetDeviceByUuidResponse', data: { __typename?: 'DeviceResource', notificationDeliveries: Array<(
        { __typename?: 'NotificationDeliveryResource' }
        & { ' $fragmentRefs'?: { 'NotificationDeliveryFragmentFragment': NotificationDeliveryFragmentFragment } }
      )> } } };

export type ProfileScreenAuthFragmentFragment = { __typename?: 'LoginState', authSource: AuthSource, role: { __typename?: 'RoleResource', committeeIdentifier?: CommitteeIdentifier | null, committeeRole?: CommitteeRole | null, dbRole: DbRole } } & { ' $fragmentName'?: 'ProfileScreenAuthFragmentFragment' };

export type ProfileScreenUserFragmentFragment = { __typename?: 'PersonResource', name?: string | null, linkblue?: string | null, teams: Array<{ __typename?: 'MembershipResource', position: MembershipPositionType, team: { __typename?: 'TeamResource', name: string } }> } & { ' $fragmentName'?: 'ProfileScreenUserFragmentFragment' };

export type RootScreenDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type RootScreenDocumentQuery = { __typename?: 'Query', loginState: (
    { __typename?: 'LoginState' }
    & { ' $fragmentRefs'?: { 'ProfileScreenAuthFragmentFragment': ProfileScreenAuthFragmentFragment;'RootScreenAuthFragmentFragment': RootScreenAuthFragmentFragment } }
  ), me: { __typename?: 'GetPersonResponse', data?: (
      { __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'ProfileScreenUserFragmentFragment': ProfileScreenUserFragmentFragment } }
    ) | null } };

export type RootScreenAuthFragmentFragment = { __typename?: 'LoginState', role: { __typename?: 'RoleResource', dbRole: DbRole } } & { ' $fragmentName'?: 'RootScreenAuthFragmentFragment' };

export type EventsQueryVariables = Exact<{
  earliestTimestamp: Scalars['LuxonDateTime']['input'];
  lastTimestamp: Scalars['LuxonDateTime']['input'];
}>;


export type EventsQuery = { __typename?: 'Query', events: { __typename?: 'ListEventsResponse', data: Array<(
      { __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventScreenFragmentFragment': EventScreenFragmentFragment } }
    )> } };

export type HourScreenFragmentFragment = { __typename?: 'MarathonHourResource', uuid: string, title: string, details?: string | null, durationInfo: string, mapImages: Array<(
    { __typename?: 'ImageResource' }
    & { ' $fragmentRefs'?: { 'ImageViewFragmentFragment': ImageViewFragmentFragment } }
  )> } & { ' $fragmentName'?: 'HourScreenFragmentFragment' };

export type MarathonScreenQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonScreenQuery = { __typename?: 'Query', currentMarathonHour?: (
    { __typename?: 'MarathonHourResource' }
    & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
  ) | null, currentMarathon?: { __typename?: 'MarathonResource', year: string } | null, nextMarathon?: { __typename?: 'MarathonResource', year: string, startDate: Date | string, endDate: Date | string } | null };

export type ScoreBoardFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string, totalPoints: number, legacyStatus: TeamLegacyStatus, type: TeamType } & { ' $fragmentName'?: 'ScoreBoardFragmentFragment' };

export type HighlightedTeamFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string, legacyStatus: TeamLegacyStatus, type: TeamType } & { ' $fragmentName'?: 'HighlightedTeamFragmentFragment' };

export type ScoreBoardDocumentQueryVariables = Exact<{
  type?: InputMaybe<Array<TeamType> | TeamType>;
}>;


export type ScoreBoardDocumentQuery = { __typename?: 'Query', me: { __typename?: 'GetPersonResponse', data?: { __typename?: 'PersonResource', uuid: string, teams: Array<{ __typename?: 'MembershipResource', team: (
          { __typename?: 'TeamResource' }
          & { ' $fragmentRefs'?: { 'HighlightedTeamFragmentFragment': HighlightedTeamFragmentFragment;'MyTeamFragmentFragment': MyTeamFragmentFragment } }
        ) }> } | null }, teams: { __typename?: 'ListTeamsResponse', data: Array<(
      { __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'ScoreBoardFragmentFragment': ScoreBoardFragmentFragment } }
    )> } };

export type ActiveMarathonDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMarathonDocumentQuery = { __typename?: 'Query', currentMarathon?: { __typename?: 'MarathonResource', uuid: string } | null };

export type MyTeamFragmentFragment = { __typename?: 'TeamResource', uuid: string, name: string, totalPoints: number, pointEntries: Array<{ __typename?: 'PointEntryResource', points: number, personFrom?: { __typename?: 'PersonResource', uuid: string, name?: string | null, linkblue?: string | null } | null }>, members: Array<{ __typename?: 'MembershipResource', position: MembershipPositionType, person: { __typename?: 'PersonResource', linkblue?: string | null, name?: string | null } }> } & { ' $fragmentName'?: 'MyTeamFragmentFragment' };

export const SimpleConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<SimpleConfigFragment, unknown>;
export const FullConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<FullConfigFragment, unknown>;
export const NotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationFragmentFragment, unknown>;
export const NotificationDeliveryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationDeliveryFragmentFragment, unknown>;
export const EventScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventScreenFragmentFragment, unknown>;
export const ProfileScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]} as unknown as DocumentNode<ProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}}]} as unknown as DocumentNode<RootScreenAuthFragmentFragment, unknown>;
export const ImageViewFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<ImageViewFragmentFragment, unknown>;
export const HourScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<HourScreenFragmentFragment, unknown>;
export const ScoreBoardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardFragmentFragment, unknown>;
export const HighlightedTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<HighlightedTeamFragmentFragment, unknown>;
export const MyTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MyTeamFragmentFragment, unknown>;
export const UseAllowedLoginTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useAllowedLoginTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"ALLOWED_LOGIN_TYPES","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseAllowedLoginTypesQuery, UseAllowedLoginTypesQueryVariables>;
export const UseMarathonStartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useMarathonStart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"MARATHON_START","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseMarathonStartQuery, UseMarathonStartQueryVariables>;
export const UseMarathonEndDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useMarathonEnd"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"MARATHON_END","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseMarathonEndQuery, UseMarathonEndQueryVariables>;
export const UseTabBarConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useTabBarConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TAB_BAR_CONFIG","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseTabBarConfigQuery, UseTabBarConfigQueryVariables>;
export const AuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]}}]} as unknown as DocumentNode<AuthStateQuery, AuthStateQueryVariables>;
export const SetDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SetDeviceMutation, SetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeviceNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveryFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}}]} as unknown as DocumentNode<DeviceNotificationsQuery, DeviceNotificationsQueryVariables>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RootScreenDocumentQuery, RootScreenDocumentQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"GREATER_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"LESS_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"EnumValue","value":"ASCENDING"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"StringValue","value":"occurrence","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const MarathonScreenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonScreen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathonHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}}]} as unknown as DocumentNode<MarathonScreenQuery, MarathonScreenQueryVariables>;
export const ScoreBoardDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScoreBoardDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HighlightedTeamFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyTeamFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"totalPoints","block":false},{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DESCENDING"},{"kind":"EnumValue","value":"ASCENDING"}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScoreBoardFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardDocumentQuery, ScoreBoardDocumentQueryVariables>;
export const ActiveMarathonDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveMarathonDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<ActiveMarathonDocumentQuery, ActiveMarathonDocumentQueryVariables>;