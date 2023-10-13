/* eslint-disable */
import type { StringComparator } from '../api/request/ListQueryTypes.js';
import type { NumericComparator } from '../api/request/ListQueryTypes.js';
import type { SortDirection } from '../api/request/ListQueryTypes.js';
import type { TeamType } from '../api/graphql/object-types/Team.js';
import type { AuthSource } from '../auth/index.js';
import type { DbRole } from '../auth/index.js';
import type { CommitteeRole } from '../auth/index.js';
import type { ClientAction } from '../api/response/JsonResponse.js';
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
  /** Luxon DateTime custom scalar type */
  DateTime: { input: string; output: string; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: string; output: string; }
  /** Luxon Duration custom scalar type */
  Duration: { input: string; output: string; }
  /** URL custom scalar type */
  URL: { input: string; output: string; }
  /** Void custom scalar type */
  Void: { input: undefined; output: undefined; }
};

/** API response */
export type AbstractGraphQlArrayOkResponse = {
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlCreatedResponse = {
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

/** API response */
export type AbstractGraphQlOkResponse = {
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlPaginatedResponse = {
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['Float']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['Float']['output'];
  /** The total number of items */
  readonly total: Scalars['Float']['output'];
};

export { AuthSource };

export { ClientAction };

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
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ConfigurationResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

export type CreateDeviceInput = {
  /** The UUID of the device */
  readonly deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDeviceResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateDeviceResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** The payload of the response */
  readonly data: DeviceResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

export type CreateEventInput = {
  readonly description: Scalars['String']['input'];
  readonly duration: Scalars['Duration']['input'];
  readonly location: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly start: Scalars['DateTime']['input'];
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateEventResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: EventResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

export type CreateImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['Float']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['Float']['input'];
};

export type CreateImageResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateImageResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ImageResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

export type CreatePersonInput = {
  readonly email: Scalars['String']['input'];
};

export type CreatePersonResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePersonResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: PersonResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  readonly uuid: Scalars['String']['output'];
};

export { DbRole };

export type DeleteConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteConfigurationResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteDeviceResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** The payload of the response */
  readonly data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteEventResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type DeleteImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeleteImageResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type DeletePersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'DeletePersonResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
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
  /** The value to filter by */
  readonly value: Scalars['DateTime']['input'];
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
  /** The value to filter by */
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type DeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
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
  readonly lastLogin?: Maybe<Scalars['DateTime']['output']>;
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
  /** The value to filter by */
  readonly value: Scalars['DateTime']['input'];
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
  /** The value to filter by */
  readonly value: Scalars['Float']['input'];
};

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type EventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
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
  readonly duration?: Maybe<Scalars['Duration']['output']>;
  readonly images: ReadonlyArray<ImageResource>;
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly occurrences: ReadonlyArray<Scalars['DateTime']['output']>;
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetAllConfigurationsResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ConfigurationResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetConfigurationByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ConfigurationResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetDeviceByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** The payload of the response */
  readonly data: DeviceResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetEventByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: EventResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetImageByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ImageResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPersonByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPersonByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: PersonResource;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

export type GetThumbHashByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetThumbHashByUuidResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: Scalars['String']['output'];
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** Whether the operation was successful */
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
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  /** The payload of the response */
  readonly data: ReadonlyArray<DeviceResource>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['Float']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['Float']['output'];
  /** The total number of items */
  readonly total: Scalars['Float']['output'];
};

export type ListEventsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListEventsResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ReadonlyArray<EventResource>;
  /** Whether the operation was successful */
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['Float']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['Float']['output'];
  /** The total number of items */
  readonly total: Scalars['Float']['output'];
};

export type MembershipResource = {
  readonly __typename?: 'MembershipResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly marathonYear: Scalars['String']['output'];
  readonly person: PersonResource;
  readonly team: TeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly createConfiguration: CreateConfigurationResponse;
  readonly createDevice: CreateDeviceResponse;
  readonly createEvent: CreateEventResponse;
  readonly createImage: CreateImageResponse;
  readonly createPerson: CreatePersonResponse;
  readonly deleteConfiguration: DeleteConfigurationResponse;
  readonly deleteDevice: DeleteDeviceResponse;
  readonly deleteEvent: DeleteEventResponse;
  readonly deleteImage: DeleteImageResponse;
  readonly deletePerson: DeletePersonResponse;
  readonly setConfiguration: SetConfigurationResponse;
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


export type MutationDeleteConfigurationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDeviceArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteEventArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeletePersonArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetConfigurationArgs = {
  id: Scalars['String']['input'];
  input: SetConfigurationInput;
};

export { NumericComparator };

export type PersonResource = {
  readonly __typename?: 'PersonResource';
  readonly authIds: AuthSource;
  readonly captaincies: ReadonlyArray<MembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly email: Scalars['String']['output'];
  readonly firstName?: Maybe<Scalars['String']['output']>;
  readonly lastName?: Maybe<Scalars['String']['output']>;
  readonly linkblue?: Maybe<Scalars['String']['output']>;
  readonly role: RoleResource;
  readonly teams: ReadonlyArray<MembershipResource>;
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
  readonly person: GetPersonByUuidResponse;
  readonly thumbhash?: Maybe<GetThumbHashByUuidResponse>;
};


export type QueryConfigurationArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedDateFilterItem>>;
  isNullFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<DeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
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
  isNullFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedStringFilterItem>>;
};


export type QueryImageArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryPersonArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryThumbhashArgs = {
  uuid: Scalars['String']['input'];
};

export type RoleResource = {
  readonly __typename?: 'RoleResource';
  readonly committeeIdentifier?: Maybe<Scalars['String']['output']>;
  readonly committeeRole?: Maybe<CommitteeRole>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly dbRole: DbRole;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type SetConfigurationInput = {
  readonly key: Scalars['String']['input'];
};

export type SetConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SetConfigurationResponse';
  /** Client actions to perform */
  readonly clientActions?: Maybe<ReadonlyArray<ClientAction>>;
  readonly data: ConfigurationResource;
  /** Whether the operation was successful */
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
export type TeamResource = {
  readonly __typename?: 'TeamResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear?: Maybe<Scalars['String']['output']>;
  readonly name: Scalars['String']['output'];
  readonly persistentIdentifier?: Maybe<Scalars['String']['output']>;
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly visibility: DbRole;
};

export { TeamType };

export type ListEventsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection> | SortDirection>;
  dateFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedDateFilterItem> | EventResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedIsNullFilterItem> | EventResolverKeyedIsNullFilterItem>;
  numericFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedNumericFilterItem> | EventResolverKeyedNumericFilterItem>;
  oneOfFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedOneOfFilterItem> | EventResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedStringFilterItem> | EventResolverKeyedStringFilterItem>;
}>;


export type ListEventsQuery = { readonly __typename?: 'Query', readonly events: { readonly __typename?: 'ListEventsResponse', readonly ok: boolean, readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<{ readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly description?: string | null, readonly duration?: string | null, readonly occurrences: ReadonlyArray<string>, readonly summary?: string | null, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly url?: string | null, readonly width: number, readonly height: number, readonly uuid: string }> }> } };

export type GetEventQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GetEventQuery = { readonly __typename?: 'Query', readonly event: { readonly __typename?: 'GetEventByUuidResponse', readonly ok: boolean, readonly clientActions?: ReadonlyArray<ClientAction> | null, readonly data: { readonly __typename?: 'EventResource', readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly occurrences: ReadonlyArray<string>, readonly duration?: string | null, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly uuid: string, readonly url?: string | null, readonly imageData?: string | null, readonly height: number, readonly width: number, readonly thumbHash?: string | null, readonly alt?: string | null }> } } };


export const ListEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListEvents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedNumericFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"numericFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numericFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<ListEventsQuery, ListEventsQueryVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"clientActions"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;