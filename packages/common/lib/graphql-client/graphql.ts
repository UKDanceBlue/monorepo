/* eslint-disable */
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
  clientActions?: Maybe<Array<ClientAction>>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlCreatedResponse = {
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

/** API response */
export type AbstractGraphQlOkResponse = {
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type AbstractGraphQlPaginatedResponse = {
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['Float']['output'];
  /** The number of items per page */
  pageSize: Scalars['Float']['output'];
  /** The total number of items */
  total: Scalars['Float']['output'];
};

/** The source of authentication */
export enum AuthSource {
  Anonymous = 'Anonymous',
  UkyLinkblue = 'UkyLinkblue'
}

/** Actions that the client MUST take if specified */
export enum ClientAction {
  Logout = 'LOGOUT'
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
};

export type CreateConfigurationInput = {
  key: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateConfigurationResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ConfigurationResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

export type CreateDeviceInput = {
  /** The UUID of the device */
  deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  lastUserId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateDeviceResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateDeviceResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** The payload of the response */
  data: DeviceResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

export type CreateEventInput = {
  description: Scalars['String']['input'];
  duration: Scalars['Duration']['input'];
  location: Scalars['String']['input'];
  name: Scalars['String']['input'];
  start: Scalars['DateTime']['input'];
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateEventResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: EventResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

export type CreateImageInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  imageData?: InputMaybe<Scalars['String']['input']>;
  mimeType: Scalars['String']['input'];
  thumbHash?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width: Scalars['Float']['input'];
};

export type CreateImageResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreateImageResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ImageResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

export type CreatePersonInput = {
  email: Scalars['String']['input'];
};

export type CreatePersonResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'CreatePersonResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: PersonResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The UUID of the created resource */
  uuid: Scalars['String']['output'];
};

/** DanceBlue roles */
export enum DbRole {
  Committee = 'Committee',
  None = 'None',
  Public = 'Public',
  TeamCaptain = 'TeamCaptain',
  TeamMember = 'TeamMember'
}

export type DeleteConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteConfigurationResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type DeleteDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteDeviceResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** The payload of the response */
  data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type DeleteEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteEventResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type DeleteImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeleteImageResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type DeletePersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'DeletePersonResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Scalars['Boolean']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export enum DeviceResolverAllKeys {
  CreatedAt = 'createdAt',
  DeviceId = 'deviceId',
  ExpoPushToken = 'expoPushToken',
  LastLogin = 'lastLogin',
  UpdatedAt = 'updatedAt'
}

export enum DeviceResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  LastLogin = 'lastLogin',
  UpdatedAt = 'updatedAt'
}

export type DeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Scalars['DateTime']['input'];
};

export type DeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: DeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Array<Scalars['String']['input']>;
};

export type DeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: DeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Scalars['String']['input'];
};

export enum DeviceResolverStringFilterKeys {
  DeviceId = 'deviceId',
  ExpoPushToken = 'expoPushToken'
}

export type DeviceResource = {
  __typename?: 'DeviceResource';
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  deviceId: Scalars['ID']['output'];
  expoPushToken?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastUser?: Maybe<PersonResource>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export enum EventResolverAllKeys {
  CreatedAt = 'createdAt',
  Description = 'description',
  Duration = 'duration',
  Location = 'location',
  Occurrence = 'occurrence',
  Summary = 'summary',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export enum EventResolverDateFilterKeys {
  CreatedAt = 'createdAt',
  Occurrence = 'occurrence',
  UpdatedAt = 'updatedAt'
}

export type EventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: EventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Scalars['DateTime']['input'];
};

export type EventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  field: EventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  comparison: NumericComparator;
  /** The field to filter on */
  field: EventResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Scalars['Float']['input'];
};

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Array<Scalars['String']['input']>;
};

export type EventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  comparison: StringComparator;
  /** The field to filter on */
  field: EventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  negate?: InputMaybe<Scalars['Boolean']['input']>;
  /** The value to filter by */
  value: Scalars['String']['input'];
};

export enum EventResolverNumericFilterKeys {
  Duration = 'duration'
}

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
  duration?: Maybe<Scalars['Duration']['output']>;
  eventId: Scalars['ID']['output'];
  images?: Maybe<Array<ImageResource>>;
  location?: Maybe<Scalars['String']['output']>;
  occurrences: Array<Scalars['DateTime']['output']>;
  summary?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetAllConfigurationsResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ConfigurationResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetConfigurationByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ConfigurationResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetDeviceByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** The payload of the response */
  data: DeviceResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetEventByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: EventResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetImageByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ImageResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetPersonByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetPersonByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: PersonResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type GetThumbHashByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'GetThumbHashByUuidResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Scalars['String']['output'];
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export type ImageResource = {
  __typename?: 'ImageResource';
  alt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  height: Scalars['Int']['output'];
  imageData?: Maybe<Scalars['String']['output']>;
  imageId: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  thumbHash?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  url?: Maybe<Scalars['URL']['output']>;
  width: Scalars['Int']['output'];
};

export type ListDevicesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListDevicesResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  /** The payload of the response */
  data: Array<DeviceResource>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['Float']['output'];
  /** The number of items per page */
  pageSize: Scalars['Float']['output'];
  /** The total number of items */
  total: Scalars['Float']['output'];
};

export type ListEventsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  __typename?: 'ListEventsResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: Array<EventResource>;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  page: Scalars['Float']['output'];
  /** The number of items per page */
  pageSize: Scalars['Float']['output'];
  /** The total number of items */
  total: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createConfiguration: CreateConfigurationResponse;
  createDevice: CreateDeviceResponse;
  createEvent: CreateEventResponse;
  createImage: CreateImageResponse;
  createPerson: CreatePersonResponse;
  deleteConfiguration: DeleteConfigurationResponse;
  deleteDevice: DeleteDeviceResponse;
  deleteEvent: DeleteEventResponse;
  deleteImage: DeleteImageResponse;
  deletePerson: DeletePersonResponse;
  setConfiguration: SetConfigurationResponse;
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

export enum NumericComparator {
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqualTo = 'GREATER_THAN_OR_EQUAL_TO',
  Is = 'IS',
  LessThan = 'LESS_THAN',
  LessThanOrEqualTo = 'LESS_THAN_OR_EQUAL_TO'
}

export type PersonResource = {
  __typename?: 'PersonResource';
  authIds: AuthSource;
  captainOf: Array<TeamResource>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  linkblue?: Maybe<Scalars['String']['output']>;
  memberOf: Array<TeamResource>;
  personId: Scalars['ID']['output'];
  role: RoleResource;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getAllConfigurations: GetAllConfigurationsResponse;
  getConfigurationByUuid: GetConfigurationByUuidResponse;
  getDeviceByUuid: GetDeviceByUuidResponse;
  getEventByUuid: GetEventByUuidResponse;
  getImageByUuid: GetImageByUuidResponse;
  getPersonByUuid: GetPersonByUuidResponse;
  getThumbHashByUuid?: Maybe<GetThumbHashByUuidResponse>;
  listDevices: ListDevicesResponse;
  listEvents: ListEventsResponse;
};


export type QueryGetConfigurationByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryGetDeviceByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryGetEventByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryGetImageByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryGetPersonByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryGetThumbHashByUuidArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryListDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<DeviceResolverKeyedDateFilterItem>>;
  isNullFilters?: InputMaybe<Array<DeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Array<DeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<DeviceResolverKeyedStringFilterItem>>;
};


export type QueryListEventsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Array<EventResolverKeyedDateFilterItem>>;
  isNullFilters?: InputMaybe<Array<EventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Array<EventResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<Array<EventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  sortBy?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<Array<SortDirection>>;
  stringFilters?: InputMaybe<Array<EventResolverKeyedStringFilterItem>>;
};

export type RoleResource = {
  __typename?: 'RoleResource';
  committee?: Maybe<Scalars['String']['output']>;
  committeeRole?: Maybe<CommitteeRole>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  dbRole: DbRole;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type SetConfigurationInput = {
  key: Scalars['String']['input'];
};

export type SetConfigurationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  __typename?: 'SetConfigurationResponse';
  /** Client actions to perform */
  clientActions?: Maybe<Array<ClientAction>>;
  data: ConfigurationResource;
  /** Whether the operation was successful */
  ok: Scalars['Boolean']['output'];
};

export enum SortDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export enum StringComparator {
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  Is = 'IS',
  Like = 'LIKE',
  Regex = 'REGEX',
  StartsWith = 'STARTS_WITH',
  Substring = 'SUBSTRING'
}

export type TeamResource = {
  __typename?: 'TeamResource';
  captains: Array<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  members: Array<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pointEntries: Array<Scalars['String']['output']>;
  teamId: Scalars['ID']['output'];
  type: TeamType;
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  visibility: DbRole;
};

/** Types of teams */
export enum TeamType {
  Morale = 'Morale',
  Spirit = 'Spirit'
}
