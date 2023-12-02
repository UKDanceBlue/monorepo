/* eslint-disable */
import type { StringComparator } from '../api/request/ListQueryTypes.js';
import type { NumericComparator } from '../api/request/ListQueryTypes.js';
import type { SortDirection } from '../api/request/ListQueryTypes.js';
import type { TeamType } from '../api/graphql/object-types/Team.js';
import type { AuthSource } from '../auth/index.js';
import type { DbRole } from '../auth/index.js';
import type { CommitteeRole } from '../auth/index.js';
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

/** API response */
export type AbstractGraphQlArrayOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlCreatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

/** API response */
export type AbstractGraphQlOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlPaginatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type AddEventImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['Int']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['Int']['input'];
};

export type AddEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'AddEventImageResponse';
  readonly data: ImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type AuthIdList = {
  readonly __typename?: 'AuthIdList';
  readonly source: AuthSource;
  readonly value: Scalars['String']['output'];
};

export { AuthSource };

/** The identifier for a committee */
export const CommitteeIdentifier = {
  CommunityDevelopmentCommittee: 'communityDevelopmentCommittee',
  CorporateCommittee: 'corporateCommittee',
  DancerRelationsCommittee: 'dancerRelationsCommittee',
  FamilyRelationsCommittee: 'familyRelationsCommittee',
  FundraisingCommittee: 'fundraisingCommittee',
  MarketingCommittee: 'marketingCommittee',
  MiniMarathonsCommittee: 'miniMarathonsCommittee',
  OperationsCommittee: 'operationsCommittee',
  ProgrammingCommittee: 'programmingCommittee',
  TechCommittee: 'techCommittee'
} as const;

export type CommitteeIdentifier = typeof CommitteeIdentifier[keyof typeof CommitteeIdentifier];
export { CommitteeRole };

export type ConfigurationResource = {
  readonly __typename?: 'ConfigurationResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly key: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type CreateConfigurationInput = {
  readonly key: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateConfigurationResponse';
  readonly data: ConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreateDeviceInput = {
  readonly deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDeviceResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateDeviceResponse';
  readonly data: DeviceResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreateEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<CreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type CreateEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateEventResponse';
  readonly data: EventResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreateImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['NonNegativeInt']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['NonNegativeInt']['input'];
};

export type CreateImageResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateImageResponse';
  readonly data: ImageResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreatePersonInput = {
  readonly captainOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly email: Scalars['EmailAddress']['input'];
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<RoleResourceInput>;
};

export type CreatePersonResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePersonResponse';
  readonly data: PersonResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreatePointEntryInput = {
  readonly comment?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityUuid?: InputMaybe<Scalars['String']['input']>;
  readonly personFromUuid?: InputMaybe<Scalars['String']['input']>;
  readonly points: Scalars['Float']['input'];
  readonly teamUuid: Scalars['String']['input'];
};

export type CreatePointEntryResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePointEntryResponse';
  readonly data: PointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreatePointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name: Scalars['String']['input'];
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type: TeamType;
};

export type CreatePointOpportunityResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePointOpportunityResponse';
  readonly data: PointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreateTeamInput = {
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type: TeamType;
};

export type CreateTeamResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateTeamResponse';
  readonly data: TeamResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { DbRole };

export type DeleteConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteConfigurationResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteDeviceResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteEventResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteImageResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteNotificationResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeletePersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeletePersonResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeletePointEntryResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeletePointEntryResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeletePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeletePointOpportunityResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteTeamResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export const DeviceResolverAllKeys = {
  CreatedAt: 'createdAt',
  DeviceId: 'deviceId',
  ExpoPushToken: 'expoPushToken',
  LastLogin: 'lastLogin',
  UpdatedAt: 'updatedAt'
} as const;

export type DeviceResolverAllKeys = typeof DeviceResolverAllKeys[keyof typeof DeviceResolverAllKeys];
export const DeviceResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  LastLogin: 'lastLogin',
  UpdatedAt: 'updatedAt'
} as const;

export type DeviceResolverDateFilterKeys = typeof DeviceResolverDateFilterKeys[keyof typeof DeviceResolverDateFilterKeys];
export type DeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type DeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: DeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type DeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const DeviceResolverStringFilterKeys = {
  DeviceId: 'deviceId',
  ExpoPushToken: 'expoPushToken'
} as const;

export type DeviceResolverStringFilterKeys = typeof DeviceResolverStringFilterKeys[keyof typeof DeviceResolverStringFilterKeys];
export type DeviceResource = {
  readonly __typename?: 'DeviceResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly expoPushToken?: Maybe<Scalars['String']['output']>;
  readonly lastLoggedInUser?: Maybe<PersonResource>;
  readonly lastLogin?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type EventOccurrenceResource = {
  readonly __typename?: 'EventOccurrenceResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly fullDay: Scalars['Boolean']['output'];
  readonly interval: Scalars['LuxonDateRange']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const EventResolverAllKeys = {
  CreatedAt: 'createdAt',
  Description: 'description',
  Duration: 'duration',
  Location: 'location',
  Occurrence: 'occurrence',
  Summary: 'summary',
  Title: 'title',
  UpdatedAt: 'updatedAt'
} as const;

export type EventResolverAllKeys = typeof EventResolverAllKeys[keyof typeof EventResolverAllKeys];
export const EventResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  Occurrence: 'occurrence',
  UpdatedAt: 'updatedAt'
} as const;

export type EventResolverDateFilterKeys = typeof EventResolverDateFilterKeys[keyof typeof EventResolverDateFilterKeys];
export type EventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: EventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type EventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: EventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: EventResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['Float']['input'];
};

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type EventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const EventResolverNumericFilterKeys = {
  Duration: 'duration'
} as const;

export type EventResolverNumericFilterKeys = typeof EventResolverNumericFilterKeys[keyof typeof EventResolverNumericFilterKeys];
export const EventResolverStringFilterKeys = {
  Description: 'description',
  Location: 'location',
  Summary: 'summary',
  Title: 'title'
} as const;

export type EventResolverStringFilterKeys = typeof EventResolverStringFilterKeys[keyof typeof EventResolverStringFilterKeys];
export type EventResource = {
  readonly __typename?: 'EventResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly images: ReadonlyArray<ImageResource>;
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly occurrences: ReadonlyArray<EventOccurrenceResource>;
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetAllConfigurationsResponse';
  readonly data: ConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetConfigurationByUuidResponse';
  readonly data: ConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetDeviceByUuidResponse';
  readonly data: DeviceResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetEventByUuidResponse';
  readonly data: EventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetImageByUuidResponse';
  readonly data: ImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetNotificationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetNotificationByUuidResponse';
  readonly data: NotificationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPeopleResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPeopleResponse';
  readonly data: ReadonlyArray<PersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPersonResponse';
  readonly data?: Maybe<PersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPointEntryByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPointEntryByUuidResponse';
  readonly data: PointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetThumbHashByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetThumbHashByUuidResponse';
  readonly data: Scalars['String']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

export type ImageResource = {
  readonly __typename?: 'ImageResource';
  readonly alt?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly height: Scalars['Int']['output'];
  readonly imageData?: Maybe<Scalars['String']['output']>;
  readonly mimeType: Scalars['String']['output'];
  readonly thumbHash?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly url?: Maybe<Scalars['URL']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly width: Scalars['Int']['output'];
};

export type ListDevicesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListDevicesResponse';
  readonly data: ReadonlyArray<DeviceResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListEventsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListEventsResponse';
  readonly data: ReadonlyArray<EventResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListNotificationsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationsResponse';
  readonly data: ReadonlyArray<NotificationResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListPeopleResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListPeopleResponse';
  readonly data: ReadonlyArray<PersonResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListPointEntriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListPointEntriesResponse';
  readonly data: ReadonlyArray<PointEntryResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListPointOpportunitiesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListPointOpportunitiesResponse';
  readonly data: ReadonlyArray<PointOpportunityResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListTeamsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListTeamsResponse';
  readonly data: ReadonlyArray<TeamResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type LoginState = {
  readonly __typename?: 'LoginState';
  readonly authSource: AuthSource;
  readonly loggedIn: Scalars['Boolean']['output'];
  readonly role: RoleResource;
};

/** The position of a member on a team */
export const MembershipPositionType = {
  Captain: 'Captain',
  Member: 'Member'
} as const;

export type MembershipPositionType = typeof MembershipPositionType[keyof typeof MembershipPositionType];
export type MembershipResource = {
  readonly __typename?: 'MembershipResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly person: PersonResource;
  readonly position: MembershipPositionType;
  readonly team: TeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addExistingImageToEvent: AddEventImageResponse;
  readonly addImageToEvent: AddEventImageResponse;
  readonly createConfiguration: CreateConfigurationResponse;
  readonly createDevice: CreateDeviceResponse;
  readonly createEvent: CreateEventResponse;
  readonly createImage: CreateImageResponse;
  readonly createPerson: CreatePersonResponse;
  readonly createPointEntry: CreatePointEntryResponse;
  readonly createPointOpportunity: CreatePointOpportunityResponse;
  readonly createTeam: CreateTeamResponse;
  readonly deleteConfiguration: DeleteConfigurationResponse;
  readonly deleteDevice: DeleteDeviceResponse;
  readonly deleteEvent: DeleteEventResponse;
  readonly deleteImage: DeleteImageResponse;
  readonly deleteNotification: DeleteNotificationResponse;
  readonly deletePerson: DeletePersonResponse;
  readonly deletePointEntry: DeletePointEntryResponse;
  readonly deletePointOpportunity: DeletePointOpportunityResponse;
  readonly deleteTeam: DeleteTeamResponse;
  readonly removeImageFromEvent: RemoveEventImageResponse;
  readonly sendNotification: SendNotificationResponse;
  readonly setConfiguration: SetConfigurationResponse;
  readonly setEvent: SetEventResponse;
  readonly setPerson: GetPersonResponse;
  readonly setPointOpportunity: SinglePointOpportunityResponse;
  readonly setTeam: SingleTeamResponse;
};


export type MutationAddExistingImageToEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationAddImageToEventArgs = {
  eventId: Scalars['String']['input'];
  input: AddEventImageInput;
};


export type MutationCreateConfigurationArgs = {
  input: CreateConfigurationInput;
};


export type MutationCreateDeviceArgs = {
  input: CreateDeviceInput;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateImageArgs = {
  input: CreateImageInput;
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


export type MutationDeleteNotificationArgs = {
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


export type MutationRemoveImageFromEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type MutationSendNotificationArgs = {
  input: SendNotificationInput;
};


export type MutationSetConfigurationArgs = {
  input: SetConfigurationInput;
  key: Scalars['String']['input'];
};


export type MutationSetEventArgs = {
  input: SetEventInput;
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

export type NotificationPayload = {
  readonly __typename?: 'NotificationPayload';
  /** Only shown for presentation type INFO_POPUP, shown at the bottom of the popup */
  readonly message?: Maybe<Scalars['String']['output']>;
  readonly presentation: NotificationPayloadPresentationType;
  /** A title for the notification, ignored for presentation type URL, shown with the webview for presentation type IN_APP_VIEW, and shown at the top of the popup for presentation type INFO_POPUP */
  readonly title?: Maybe<Scalars['String']['output']>;
  /** A URL related to the notification, opened immediately for presentation type URL, opened in a webview for presentation type IN_APP_VIEW, and shown as a button for presentation type INFO_POPUP */
  readonly url?: Maybe<Scalars['String']['output']>;
};

/** The type of presentation for the notification, URL skips the app and opens a URL directly, IN_APP_VIEW opens a webview, and INFO_POPUP shows a popup */
export const NotificationPayloadPresentationType = {
  InfoPopup: 'INFO_POPUP',
  InAppView: 'IN_APP_VIEW',
  OpenUrl: 'OPEN_URL'
} as const;

export type NotificationPayloadPresentationType = typeof NotificationPayloadPresentationType[keyof typeof NotificationPayloadPresentationType];
export const NotificationResolverAllKeys = {
  Uuid: 'uuid'
} as const;

export type NotificationResolverAllKeys = typeof NotificationResolverAllKeys[keyof typeof NotificationResolverAllKeys];
export type NotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationResource = {
  readonly __typename?: 'NotificationResource';
  readonly body: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly payload?: Maybe<NotificationPayload>;
  readonly sendTime: Scalars['DateTimeISO']['output'];
  readonly sound?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export { NumericComparator };

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
  readonly field: PersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PersonResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: PersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type PersonResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const PersonResolverStringFilterKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole',
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type PersonResolverStringFilterKeys = typeof PersonResolverStringFilterKeys[keyof typeof PersonResolverStringFilterKeys];
export type PersonResource = {
  readonly __typename?: 'PersonResource';
  readonly authIds: ReadonlyArray<AuthIdList>;
  readonly captaincies: ReadonlyArray<MembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly email: Scalars['String']['output'];
  readonly linkblue?: Maybe<Scalars['String']['output']>;
  readonly name?: Maybe<Scalars['String']['output']>;
  readonly role: RoleResource;
  readonly teams: ReadonlyArray<MembershipResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type PointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointEntryResource = {
  readonly __typename?: 'PointEntryResource';
  readonly comment?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly personFrom?: Maybe<PersonResource>;
  readonly pointOpportunity?: Maybe<PointOpportunityResource>;
  readonly points: Scalars['Int']['output'];
  readonly team: TeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const PointOpportunityResolverAllKeys = {
  CreatedAt: 'createdAt',
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type PointOpportunityResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointOpportunityResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: PointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type PointOpportunityResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: PointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const PointOpportunityResolverStringFilterKeys = {
  Name: 'name',
  Type: 'type'
} as const;

export type PointOpportunityResolverStringFilterKeys = typeof PointOpportunityResolverStringFilterKeys[keyof typeof PointOpportunityResolverStringFilterKeys];
export type PointOpportunityResource = {
  readonly __typename?: 'PointOpportunityResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly event?: Maybe<EventResource>;
  readonly name: Scalars['String']['output'];
  readonly opportunityDate?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly allConfigurations: GetAllConfigurationsResponse;
  readonly configuration: GetConfigurationByUuidResponse;
  readonly device: GetDeviceByUuidResponse;
  readonly devices: ListDevicesResponse;
  readonly event: GetEventByUuidResponse;
  readonly events: ListEventsResponse;
  readonly image: GetImageByUuidResponse;
  readonly listPeople: ListPeopleResponse;
  readonly loginState: LoginState;
  readonly me: GetPersonResponse;
  readonly notification: GetNotificationByUuidResponse;
  readonly notifications: ListNotificationsResponse;
  readonly person: GetPersonResponse;
  readonly personByLinkBlue: GetPersonResponse;
  readonly pointEntries: ListPointEntriesResponse;
  readonly pointEntry: GetPointEntryByUuidResponse;
  readonly pointOpportunities: ListPointOpportunitiesResponse;
  readonly pointOpportunity: SinglePointOpportunityResponse;
  readonly searchPeopleByName: GetPeopleResponse;
  readonly team: SingleTeamResponse;
  readonly teams: ListTeamsResponse;
  readonly thumbhash?: Maybe<GetThumbHashByUuidResponse>;
};


export type QueryConfigurationArgs = {
  key: Scalars['String']['input'];
};


export type QueryDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedStringFilterItem>>;
};


export type QueryEventArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryEventsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedStringFilterItem>>;
};


export type QueryImageArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryListPeopleArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<PersonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<PersonResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<PersonResolverKeyedStringFilterItem>>;
};


export type QueryNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryNotificationsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<NotificationResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryPersonArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryPersonByLinkBlueArgs = {
  linkBlueId: Scalars['String']['input'];
};


export type QueryPointEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<PointEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<PointEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryPointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryPointOpportunitiesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<PointOpportunityResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<PointOpportunityResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<PointOpportunityResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<PointOpportunityResolverKeyedStringFilterItem>>;
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
  isNullFilters?: InputMaybe<ReadonlyArray<TeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<ReadonlyArray<TeamLegacyStatus>>;
  marathonYear?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  numericFilters?: InputMaybe<ReadonlyArray<TeamResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<TeamResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<TeamResolverKeyedStringFilterItem>>;
  type?: InputMaybe<ReadonlyArray<TeamType>>;
  visibility?: InputMaybe<ReadonlyArray<DbRole>>;
};


export type QueryThumbhashArgs = {
  uuid: Scalars['String']['input'];
};

export type RemoveEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'RemoveEventImageResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type RoleResource = {
  readonly __typename?: 'RoleResource';
  readonly committeeIdentifier?: Maybe<CommitteeIdentifier>;
  readonly committeeRole?: Maybe<CommitteeRole>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly dbRole: DbRole;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type RoleResourceInput = {
  readonly committeeIdentifier?: InputMaybe<CommitteeIdentifier>;
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly dbRole?: DbRole;
};

export type SendNotificationInput = {
  readonly body: Scalars['String']['input'];
  readonly title: Scalars['String']['input'];
};

export type SendNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SendNotificationResponse';
  readonly data: NotificationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type SetConfigurationInput = {
  readonly key: Scalars['String']['input'];
};

export type SetConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SetConfigurationResponse';
  readonly data: ConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type SetEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<SetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type SetEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars['String']['input']>;
};

export type SetEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SetEventResponse';
  readonly data: EventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type SetPersonInput = {
  readonly captainOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly email?: InputMaybe<Scalars['EmailAddress']['input']>;
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<RoleResourceInput>;
};

export type SetPointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type SetTeamInput = {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly marathonYear?: InputMaybe<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type SinglePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SinglePointOpportunityResponse';
  readonly data: PointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type SingleTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SingleTeamResponse';
  readonly data: TeamResource;
  readonly ok: Scalars['Boolean']['output'];
};

export { SortDirection };

export { StringComparator };

/** New Team vs Returning Team */
export const TeamLegacyStatus = {
  NewTeam: 'NewTeam',
  ReturningTeam: 'ReturningTeam'
} as const;

export type TeamLegacyStatus = typeof TeamLegacyStatus[keyof typeof TeamLegacyStatus];
export const TeamResolverAllKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Name: 'name',
  TotalPoints: 'totalPoints',
  Type: 'type'
} as const;

export type TeamResolverAllKeys = typeof TeamResolverAllKeys[keyof typeof TeamResolverAllKeys];
export type TeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TeamResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: TeamResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['Float']['input'];
};

export type TeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type TeamResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: TeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const TeamResolverNumericFilterKeys = {
  TotalPoints: 'totalPoints'
} as const;

export type TeamResolverNumericFilterKeys = typeof TeamResolverNumericFilterKeys[keyof typeof TeamResolverNumericFilterKeys];
export const TeamResolverStringFilterKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Name: 'name',
  Type: 'type'
} as const;

export type TeamResolverStringFilterKeys = typeof TeamResolverStringFilterKeys[keyof typeof TeamResolverStringFilterKeys];
export type TeamResource = {
  readonly __typename?: 'TeamResource';
  readonly captains: ReadonlyArray<MembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['output'];
  readonly members: ReadonlyArray<MembershipResource>;
  readonly name: Scalars['String']['output'];
  readonly persistentIdentifier?: Maybe<Scalars['String']['output']>;
  readonly pointEntries: ReadonlyArray<PointEntryResource>;
  readonly totalPoints: Scalars['Int']['output'];
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export { TeamType };

export type ProfileScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly role: { readonly __typename?: 'RoleResource', readonly committeeIdentifier?: CommitteeIdentifier | null, readonly committeeRole?: CommitteeRole | null, readonly dbRole: DbRole } } & { ' $fragmentName'?: 'ProfileScreenAuthFragmentFragment' };

export type ProfileScreenUserFragmentFragment = { readonly __typename?: 'PersonResource', readonly name?: string | null, readonly linkblue?: string | null, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: MembershipPositionType, readonly team: { readonly __typename?: 'TeamResource', readonly name: string } }> } & { ' $fragmentName'?: 'ProfileScreenUserFragmentFragment' };

export type RootScreenDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type RootScreenDocumentQuery = { readonly __typename?: 'Query', readonly loginState: (
    { readonly __typename?: 'LoginState' }
    & { ' $fragmentRefs'?: { 'ProfileScreenAuthFragmentFragment': ProfileScreenAuthFragmentFragment;'RootScreenAuthFragmentFragment': RootScreenAuthFragmentFragment } }
  ), readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: (
      { readonly __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'ProfileScreenUserFragmentFragment': ProfileScreenUserFragmentFragment } }
    ) | null } };

export type RootScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: DbRole } } & { ' $fragmentName'?: 'RootScreenAuthFragmentFragment' };

export const ProfileScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}}]} as unknown as DocumentNode<ProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}}]} as unknown as DocumentNode<RootScreenAuthFragmentFragment, unknown>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RootScreenDocumentQuery, RootScreenDocumentQueryVariables>;