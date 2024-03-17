/* eslint-disable */
import type { AuthSource } from '../index.js';
import type { DbRole } from '../index.js';
import type { CommitteeRole } from '../index.js';
import type { CommitteeIdentifier } from '../index.js';
import type { MembershipPositionType } from '../index.js';
import type { TeamLegacyStatus } from '../index.js';
import type { TeamType } from '../index.js';
import type { SortDirection } from '../index.js';
import type { NumericComparator } from '../index.js';
import type { StringComparator } from '../index.js';
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

export type GqlPublicAbortScheduledNotificationResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'AbortScheduledNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlPublicAbstractGraphQlArrayOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlPublicAbstractGraphQlCreatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

/** API response */
export type GqlPublicAbstractGraphQlOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlPublicAbstractGraphQlPaginatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicAcknowledgeDeliveryIssueResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'AcknowledgeDeliveryIssueResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicAddEventImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['Int']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['Int']['input'];
};

export type GqlPublicAddEventImageResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'AddEventImageResponse';
  readonly data: GqlPublicImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicAuthIdPairResource = {
  readonly __typename?: 'AuthIdPairResource';
  readonly source: AuthSource;
  readonly value: Scalars['String']['output'];
};

export { AuthSource };

export { CommitteeIdentifier };

export { CommitteeRole };

export type GqlPublicConfigurationResource = {
  readonly __typename?: 'ConfigurationResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly key: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly validAfter?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly validUntil?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly value: Scalars['String']['output'];
};

export type GqlPublicCreateConfigurationInput = {
  readonly key: Scalars['String']['input'];
  readonly validAfter?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly validUntil?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly value: Scalars['String']['input'];
};

export type GqlPublicCreateConfigurationResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreateConfigurationResponse';
  readonly data: GqlPublicConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreateEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<GqlPublicCreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type GqlPublicCreateEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
};

export type GqlPublicCreateEventResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreateEventResponse';
  readonly data: GqlPublicEventResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreateImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['NonNegativeInt']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['NonNegativeInt']['input'];
};

export type GqlPublicCreateImageResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreateImageResponse';
  readonly data: GqlPublicImageResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreatePersonInput = {
  readonly captainOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly email: Scalars['EmailAddress']['input'];
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<GqlPublicRoleResourceInput>;
};

export type GqlPublicCreatePersonResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreatePersonResponse';
  readonly data: GqlPublicPersonResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreatePointEntryInput = {
  readonly comment?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityUuid?: InputMaybe<Scalars['String']['input']>;
  readonly personFromUuid?: InputMaybe<Scalars['String']['input']>;
  readonly points: Scalars['Int']['input'];
  readonly teamUuid: Scalars['String']['input'];
};

export type GqlPublicCreatePointEntryResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreatePointEntryResponse';
  readonly data: GqlPublicPointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreatePointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name: Scalars['String']['input'];
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type: TeamType;
};

export type GqlPublicCreatePointOpportunityResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreatePointOpportunityResponse';
  readonly data: GqlPublicPointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlPublicCreateTeamInput = {
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type: TeamType;
};

export type GqlPublicCreateTeamResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'CreateTeamResponse';
  readonly data: GqlPublicTeamResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { DbRole };

export type GqlPublicDeleteConfigurationResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteConfigurationResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeleteDeviceResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteDeviceResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeleteEventResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteEventResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeleteImageResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteImageResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeleteNotificationResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeletePersonResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeletePersonResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeletePointEntryResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeletePointEntryResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeletePointOpportunityResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeletePointOpportunityResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicDeleteTeamResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'DeleteTeamResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export const GqlPublicDeviceResolverAllKeys = {
  CreatedAt: 'createdAt',
  ExpoPushToken: 'expoPushToken',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicDeviceResolverAllKeys = typeof GqlPublicDeviceResolverAllKeys[keyof typeof GqlPublicDeviceResolverAllKeys];
export const GqlPublicDeviceResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicDeviceResolverDateFilterKeys = typeof GqlPublicDeviceResolverDateFilterKeys[keyof typeof GqlPublicDeviceResolverDateFilterKeys];
export type GqlPublicDeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicDeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicDeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicDeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicDeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicDeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicDeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicDeviceResolverStringFilterKeys = {
  ExpoPushToken: 'expoPushToken'
} as const;

export type GqlPublicDeviceResolverStringFilterKeys = typeof GqlPublicDeviceResolverStringFilterKeys[keyof typeof GqlPublicDeviceResolverStringFilterKeys];
export type GqlPublicDeviceResource = {
  readonly __typename?: 'DeviceResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly expoPushToken?: Maybe<Scalars['String']['output']>;
  readonly lastLoggedInUser?: Maybe<GqlPublicPersonResource>;
  readonly lastLogin?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly notificationDeliveries: ReadonlyArray<GqlPublicNotificationDeliveryResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};


export type GqlPublicDeviceResourceNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPublicEventOccurrenceResource = {
  readonly __typename?: 'EventOccurrenceResource';
  readonly fullDay: Scalars['Boolean']['output'];
  readonly interval: Scalars['LuxonDateRange']['output'];
  readonly uuid: Scalars['ID']['output'];
};

export const GqlPublicEventResolverAllKeys = {
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

export type GqlPublicEventResolverAllKeys = typeof GqlPublicEventResolverAllKeys[keyof typeof GqlPublicEventResolverAllKeys];
export const GqlPublicEventResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  Occurrence: 'occurrence',
  OccurrenceEnd: 'occurrenceEnd',
  OccurrenceStart: 'occurrenceStart',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicEventResolverDateFilterKeys = typeof GqlPublicEventResolverDateFilterKeys[keyof typeof GqlPublicEventResolverDateFilterKeys];
export type GqlPublicEventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicEventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicEventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicEventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicEventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicEventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicEventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicEventResolverStringFilterKeys = {
  Description: 'description',
  Location: 'location',
  Summary: 'summary',
  Title: 'title'
} as const;

export type GqlPublicEventResolverStringFilterKeys = typeof GqlPublicEventResolverStringFilterKeys[keyof typeof GqlPublicEventResolverStringFilterKeys];
export type GqlPublicEventResource = {
  readonly __typename?: 'EventResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly images: ReadonlyArray<GqlPublicImageResource>;
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly occurrences: ReadonlyArray<GqlPublicEventOccurrenceResource>;
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlPublicGetAllConfigurationsResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetAllConfigurationsResponse';
  readonly data: ReadonlyArray<GqlPublicConfigurationResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetConfigurationByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetConfigurationByUuidResponse';
  readonly data: GqlPublicConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetDeviceByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetDeviceByUuidResponse';
  readonly data: GqlPublicDeviceResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetEventByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetEventByUuidResponse';
  readonly data: GqlPublicEventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetImageByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetImageByUuidResponse';
  readonly data: GqlPublicImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetNotificationByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetNotificationByUuidResponse';
  readonly data: GqlPublicNotificationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetPeopleResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetPeopleResponse';
  readonly data: ReadonlyArray<GqlPublicPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetPersonResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetPersonResponse';
  readonly data?: Maybe<GqlPublicPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicGetPointEntryByUuidResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'GetPointEntryByUuidResponse';
  readonly data: GqlPublicPointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlPublicGraphQlBaseResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicImageResource = {
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

export type GqlPublicListDevicesResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListDevicesResponse';
  readonly data: ReadonlyArray<GqlPublicDeviceResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListEventsResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListEventsResponse';
  readonly data: ReadonlyArray<GqlPublicEventResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListNotificationDeliveriesResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationDeliveriesResponse';
  readonly data: ReadonlyArray<GqlPublicNotificationDeliveryResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListNotificationsResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationsResponse';
  readonly data: ReadonlyArray<GqlPublicNotificationResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListPeopleResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListPeopleResponse';
  readonly data: ReadonlyArray<GqlPublicPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListPointEntriesResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListPointEntriesResponse';
  readonly data: ReadonlyArray<GqlPublicPointEntryResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListPointOpportunitiesResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListPointOpportunitiesResponse';
  readonly data: ReadonlyArray<GqlPublicPointOpportunityResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicListTeamsResponse = GqlPublicAbstractGraphQlArrayOkResponse & GqlPublicAbstractGraphQlPaginatedResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ListTeamsResponse';
  readonly data: ReadonlyArray<GqlPublicTeamResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlPublicLoginState = {
  readonly __typename?: 'LoginState';
  readonly authSource: AuthSource;
  readonly loggedIn: Scalars['Boolean']['output'];
  readonly role: GqlPublicRoleResource;
};

export { MembershipPositionType };

export type GqlPublicMembershipResource = {
  readonly __typename?: 'MembershipResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly person: GqlPublicPersonResource;
  readonly position: MembershipPositionType;
  readonly team: GqlPublicTeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlPublicMutation = {
  readonly __typename?: 'Mutation';
  readonly abortScheduledNotification: GqlPublicAbortScheduledNotificationResponse;
  readonly acknowledgeDeliveryIssue: GqlPublicAcknowledgeDeliveryIssueResponse;
  readonly addExistingImageToEvent: GqlPublicAddEventImageResponse;
  readonly addImageToEvent: GqlPublicAddEventImageResponse;
  readonly createConfiguration: GqlPublicCreateConfigurationResponse;
  readonly createConfigurations: GqlPublicCreateConfigurationResponse;
  readonly createEvent: GqlPublicCreateEventResponse;
  readonly createImage: GqlPublicCreateImageResponse;
  readonly createPerson: GqlPublicCreatePersonResponse;
  readonly createPointEntry: GqlPublicCreatePointEntryResponse;
  readonly createPointOpportunity: GqlPublicCreatePointOpportunityResponse;
  readonly createTeam: GqlPublicCreateTeamResponse;
  readonly deleteConfiguration: GqlPublicDeleteConfigurationResponse;
  readonly deleteDevice: GqlPublicDeleteDeviceResponse;
  readonly deleteEvent: GqlPublicDeleteEventResponse;
  readonly deleteImage: GqlPublicDeleteImageResponse;
  readonly deleteNotification: GqlPublicDeleteNotificationResponse;
  readonly deletePerson: GqlPublicDeletePersonResponse;
  readonly deletePointEntry: GqlPublicDeletePointEntryResponse;
  readonly deletePointOpportunity: GqlPublicDeletePointOpportunityResponse;
  readonly deleteTeam: GqlPublicDeleteTeamResponse;
  readonly registerDevice: GqlPublicRegisterDeviceResponse;
  readonly removeImageFromEvent: GqlPublicRemoveEventImageResponse;
  readonly scheduleNotification: GqlPublicScheduleNotificationResponse;
  /** Send a notification immediately. */
  readonly sendNotification: GqlPublicSendNotificationResponse;
  readonly setEvent: GqlPublicSetEventResponse;
  readonly setPerson: GqlPublicGetPersonResponse;
  readonly setPointOpportunity: GqlPublicSinglePointOpportunityResponse;
  readonly setTeam: GqlPublicSingleTeamResponse;
  readonly stageNotification: GqlPublicStageNotificationResponse;
};


export type GqlPublicMutationAbortScheduledNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationAcknowledgeDeliveryIssueArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationAddExistingImageToEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type GqlPublicMutationAddImageToEventArgs = {
  eventId: Scalars['String']['input'];
  input: GqlPublicAddEventImageInput;
};


export type GqlPublicMutationCreateConfigurationArgs = {
  input: GqlPublicCreateConfigurationInput;
};


export type GqlPublicMutationCreateConfigurationsArgs = {
  input: ReadonlyArray<GqlPublicCreateConfigurationInput>;
};


export type GqlPublicMutationCreateEventArgs = {
  input: GqlPublicCreateEventInput;
};


export type GqlPublicMutationCreateImageArgs = {
  input: GqlPublicCreateImageInput;
};


export type GqlPublicMutationCreatePersonArgs = {
  input: GqlPublicCreatePersonInput;
};


export type GqlPublicMutationCreatePointEntryArgs = {
  input: GqlPublicCreatePointEntryInput;
};


export type GqlPublicMutationCreatePointOpportunityArgs = {
  input: GqlPublicCreatePointOpportunityInput;
};


export type GqlPublicMutationCreateTeamArgs = {
  input: GqlPublicCreateTeamInput;
};


export type GqlPublicMutationDeleteConfigurationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeleteDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeleteEventArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeleteImageArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeleteNotificationArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeletePersonArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeletePointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeletePointOpportunityArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationDeleteTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationRegisterDeviceArgs = {
  input: GqlPublicRegisterDeviceInput;
};


export type GqlPublicMutationRemoveImageFromEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type GqlPublicMutationScheduleNotificationArgs = {
  sendAt: Scalars['DateTimeISO']['input'];
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationSendNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationSetEventArgs = {
  input: GqlPublicSetEventInput;
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationSetPersonArgs = {
  input: GqlPublicSetPersonInput;
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationSetPointOpportunityArgs = {
  input: GqlPublicSetPointOpportunityInput;
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationSetTeamArgs = {
  input: GqlPublicSetTeamInput;
  uuid: Scalars['String']['input'];
};


export type GqlPublicMutationStageNotificationArgs = {
  audience: GqlPublicNotificationAudienceInput;
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPublicNotificationAudienceInput = {
  readonly all?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The number of delivery issues for a notification, broken down by type. */
export type GqlPublicNotificationDeliveryIssueCount = {
  readonly __typename?: 'NotificationDeliveryIssueCount';
  readonly DeviceNotRegistered: Scalars['Int']['output'];
  readonly InvalidCredentials: Scalars['Int']['output'];
  readonly MessageRateExceeded: Scalars['Int']['output'];
  readonly MessageTooBig: Scalars['Int']['output'];
  readonly MismatchSenderId: Scalars['Int']['output'];
  readonly Unknown: Scalars['Int']['output'];
};

export const GqlPublicNotificationDeliveryResolverAllKeys = {
  CreatedAt: 'createdAt',
  DeliveryError: 'deliveryError',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicNotificationDeliveryResolverAllKeys = typeof GqlPublicNotificationDeliveryResolverAllKeys[keyof typeof GqlPublicNotificationDeliveryResolverAllKeys];
export const GqlPublicNotificationDeliveryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicNotificationDeliveryResolverDateFilterKeys = typeof GqlPublicNotificationDeliveryResolverDateFilterKeys[keyof typeof GqlPublicNotificationDeliveryResolverDateFilterKeys];
export type GqlPublicNotificationDeliveryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicNotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicNotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicNotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicNotificationDeliveryResource = {
  readonly __typename?: 'NotificationDeliveryResource';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  readonly chunkUuid?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  readonly deliveryError?: Maybe<Scalars['String']['output']>;
  readonly notification: GqlPublicNotificationResource;
  /** The time the server received a delivery receipt from the user. */
  readonly receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  readonly sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlPublicNotificationResolverAllKeys = {
  Body: 'body',
  CreatedAt: 'createdAt',
  DeliveryIssue: 'deliveryIssue',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  Title: 'title',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicNotificationResolverAllKeys = typeof GqlPublicNotificationResolverAllKeys[keyof typeof GqlPublicNotificationResolverAllKeys];
export const GqlPublicNotificationResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicNotificationResolverDateFilterKeys = typeof GqlPublicNotificationResolverDateFilterKeys[keyof typeof GqlPublicNotificationResolverDateFilterKeys];
export type GqlPublicNotificationResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicNotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicNotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicNotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicNotificationResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicNotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicNotificationResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicNotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicNotificationResolverOneOfFilterKeys = {
  DeliveryIssue: 'deliveryIssue'
} as const;

export type GqlPublicNotificationResolverOneOfFilterKeys = typeof GqlPublicNotificationResolverOneOfFilterKeys[keyof typeof GqlPublicNotificationResolverOneOfFilterKeys];
export const GqlPublicNotificationResolverStringFilterKeys = {
  Body: 'body',
  Title: 'title'
} as const;

export type GqlPublicNotificationResolverStringFilterKeys = typeof GqlPublicNotificationResolverStringFilterKeys[keyof typeof GqlPublicNotificationResolverStringFilterKeys];
export type GqlPublicNotificationResource = {
  readonly __typename?: 'NotificationResource';
  readonly body: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryCount: Scalars['Int']['output'];
  readonly deliveryIssue?: Maybe<Scalars['String']['output']>;
  readonly deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryIssueCount: GqlPublicNotificationDeliveryIssueCount;
  /** The time the notification is scheduled to be sent, if null it is either already sent or unscheduled. */
  readonly sendAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server started sending the notification. */
  readonly startedSendingAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly url?: Maybe<Scalars['URL']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export { NumericComparator };

export const GqlPublicPersonResolverAllKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole',
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type GqlPublicPersonResolverAllKeys = typeof GqlPublicPersonResolverAllKeys[keyof typeof GqlPublicPersonResolverAllKeys];
export type GqlPublicPersonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicPersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicPersonResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicPersonResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicPersonResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicPersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicPersonResolverOneOfFilterKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole'
} as const;

export type GqlPublicPersonResolverOneOfFilterKeys = typeof GqlPublicPersonResolverOneOfFilterKeys[keyof typeof GqlPublicPersonResolverOneOfFilterKeys];
export const GqlPublicPersonResolverStringFilterKeys = {
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type GqlPublicPersonResolverStringFilterKeys = typeof GqlPublicPersonResolverStringFilterKeys[keyof typeof GqlPublicPersonResolverStringFilterKeys];
export type GqlPublicPersonResource = {
  readonly __typename?: 'PersonResource';
  /** @deprecated This is now provided on the AuthIdPair resource. */
  readonly authIds: ReadonlyArray<GqlPublicAuthIdPairResource>;
  /** @deprecated Use teams instead and filter by position */
  readonly captaincies: ReadonlyArray<GqlPublicMembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly email: Scalars['String']['output'];
  readonly linkblue?: Maybe<Scalars['String']['output']>;
  readonly name?: Maybe<Scalars['String']['output']>;
  readonly role: GqlPublicRoleResource;
  readonly teams: ReadonlyArray<GqlPublicMembershipResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlPublicPointEntryResolverAllKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicPointEntryResolverAllKeys = typeof GqlPublicPointEntryResolverAllKeys[keyof typeof GqlPublicPointEntryResolverAllKeys];
export const GqlPublicPointEntryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicPointEntryResolverDateFilterKeys = typeof GqlPublicPointEntryResolverDateFilterKeys[keyof typeof GqlPublicPointEntryResolverDateFilterKeys];
export type GqlPublicPointEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicPointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicPointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicPointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicPointEntryResource = {
  readonly __typename?: 'PointEntryResource';
  readonly comment?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly personFrom?: Maybe<GqlPublicPersonResource>;
  readonly pointOpportunity?: Maybe<GqlPublicPointOpportunityResource>;
  readonly points: Scalars['Int']['output'];
  readonly team: GqlPublicTeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlPublicPointOpportunityResolverAllKeys = {
  CreatedAt: 'createdAt',
  Name: 'name',
  OpportunityDate: 'opportunityDate',
  Type: 'type',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicPointOpportunityResolverAllKeys = typeof GqlPublicPointOpportunityResolverAllKeys[keyof typeof GqlPublicPointOpportunityResolverAllKeys];
export const GqlPublicPointOpportunityResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  OpportunityDate: 'opportunityDate',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlPublicPointOpportunityResolverDateFilterKeys = typeof GqlPublicPointOpportunityResolverDateFilterKeys[keyof typeof GqlPublicPointOpportunityResolverDateFilterKeys];
export type GqlPublicPointOpportunityResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlPublicPointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlPublicPointOpportunityResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicPointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicPointOpportunityResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicPointOpportunityResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicPointOpportunityResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicPointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicPointOpportunityResolverOneOfFilterKeys = {
  Type: 'type'
} as const;

export type GqlPublicPointOpportunityResolverOneOfFilterKeys = typeof GqlPublicPointOpportunityResolverOneOfFilterKeys[keyof typeof GqlPublicPointOpportunityResolverOneOfFilterKeys];
export const GqlPublicPointOpportunityResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type GqlPublicPointOpportunityResolverStringFilterKeys = typeof GqlPublicPointOpportunityResolverStringFilterKeys[keyof typeof GqlPublicPointOpportunityResolverStringFilterKeys];
export type GqlPublicPointOpportunityResource = {
  readonly __typename?: 'PointOpportunityResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly event?: Maybe<GqlPublicEventResource>;
  readonly name: Scalars['String']['output'];
  readonly opportunityDate?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlPublicQuery = {
  readonly __typename?: 'Query';
  readonly activeConfiguration: GqlPublicGetConfigurationByUuidResponse;
  readonly allConfigurations: GqlPublicGetAllConfigurationsResponse;
  readonly device: GqlPublicGetDeviceByUuidResponse;
  readonly devices: GqlPublicListDevicesResponse;
  readonly event: GqlPublicGetEventByUuidResponse;
  readonly events: GqlPublicListEventsResponse;
  readonly image: GqlPublicGetImageByUuidResponse;
  readonly listPeople: GqlPublicListPeopleResponse;
  readonly loginState: GqlPublicLoginState;
  readonly me: GqlPublicGetPersonResponse;
  readonly notification: GqlPublicGetNotificationByUuidResponse;
  readonly notificationDeliveries: GqlPublicListNotificationDeliveriesResponse;
  readonly notifications: GqlPublicListNotificationsResponse;
  readonly person: GqlPublicGetPersonResponse;
  readonly personByLinkBlue: GqlPublicGetPersonResponse;
  readonly pointEntries: GqlPublicListPointEntriesResponse;
  readonly pointEntry: GqlPublicGetPointEntryByUuidResponse;
  readonly pointOpportunities: GqlPublicListPointOpportunitiesResponse;
  readonly pointOpportunity: GqlPublicSinglePointOpportunityResponse;
  readonly searchPeopleByName: GqlPublicGetPeopleResponse;
  readonly team: GqlPublicSingleTeamResponse;
  readonly teams: GqlPublicListTeamsResponse;
};


export type GqlPublicQueryActiveConfigurationArgs = {
  key: Scalars['String']['input'];
};


export type GqlPublicQueryDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicDeviceResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicDeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicDeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicDeviceResolverKeyedStringFilterItem>>;
};


export type GqlPublicQueryEventArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryEventsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicEventResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicEventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicEventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicEventResolverKeyedStringFilterItem>>;
};


export type GqlPublicQueryImageArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryListPeopleArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicPersonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicPersonResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicPersonResolverKeyedStringFilterItem>>;
};


export type GqlPublicQueryNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryNotificationDeliveriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationDeliveryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationDeliveryResolverKeyedIsNullFilterItem>>;
  notificationUuid: Scalars['String']['input'];
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type GqlPublicQueryNotificationsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicNotificationResolverKeyedStringFilterItem>>;
};


export type GqlPublicQueryPersonArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryPersonByLinkBlueArgs = {
  linkBlueId: Scalars['String']['input'];
};


export type GqlPublicQueryPointEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicPointEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicPointEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type GqlPublicQueryPointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryPointOpportunitiesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlPublicPointOpportunityResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicPointOpportunityResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicPointOpportunityResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicPointOpportunityResolverKeyedStringFilterItem>>;
};


export type GqlPublicQueryPointOpportunityArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQuerySearchPeopleByNameArgs = {
  name: Scalars['String']['input'];
};


export type GqlPublicQueryTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlPublicQueryTeamsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlPublicTeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<ReadonlyArray<TeamLegacyStatus>>;
  marathonYear?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlPublicTeamResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlPublicTeamResolverKeyedStringFilterItem>>;
  type?: InputMaybe<ReadonlyArray<TeamType>>;
  visibility?: InputMaybe<ReadonlyArray<DbRole>>;
};

export type GqlPublicRegisterDeviceInput = {
  readonly deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars['String']['input']>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  readonly verifier: Scalars['String']['input'];
};

export type GqlPublicRegisterDeviceResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'RegisterDeviceResponse';
  readonly data: GqlPublicDeviceResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicRemoveEventImageResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'RemoveEventImageResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicRoleResource = {
  readonly __typename?: 'RoleResource';
  readonly committeeIdentifier?: Maybe<CommitteeIdentifier>;
  readonly committeeRole?: Maybe<CommitteeRole>;
  readonly dbRole: DbRole;
};

export type GqlPublicRoleResourceInput = {
  readonly committeeIdentifier?: InputMaybe<CommitteeIdentifier>;
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly dbRole?: DbRole;
};

export type GqlPublicScheduleNotificationResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'ScheduleNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicSendNotificationResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'SendNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicSetEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<GqlPublicSetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type GqlPublicSetEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPublicSetEventResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'SetEventResponse';
  readonly data: GqlPublicEventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicSetPersonInput = {
  readonly captainOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly email?: InputMaybe<Scalars['EmailAddress']['input']>;
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<GqlPublicRoleResourceInput>;
};

export type GqlPublicSetPointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type GqlPublicSetTeamInput = {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly marathonYear?: InputMaybe<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type GqlPublicSinglePointOpportunityResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'SinglePointOpportunityResponse';
  readonly data: GqlPublicPointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlPublicSingleTeamResponse = GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'SingleTeamResponse';
  readonly data: GqlPublicTeamResource;
  readonly ok: Scalars['Boolean']['output'];
};

export { SortDirection };

export type GqlPublicStageNotificationResponse = GqlPublicAbstractGraphQlCreatedResponse & GqlPublicAbstractGraphQlOkResponse & GqlPublicGraphQlBaseResponse & {
  readonly __typename?: 'StageNotificationResponse';
  readonly data: GqlPublicNotificationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { StringComparator };

export { TeamLegacyStatus };

export const GqlPublicTeamResolverAllKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Name: 'name',
  Type: 'type'
} as const;

export type GqlPublicTeamResolverAllKeys = typeof GqlPublicTeamResolverAllKeys[keyof typeof GqlPublicTeamResolverAllKeys];
export type GqlPublicTeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicTeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlPublicTeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlPublicTeamResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlPublicTeamResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlPublicTeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlPublicTeamResolverOneOfFilterKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Type: 'type'
} as const;

export type GqlPublicTeamResolverOneOfFilterKeys = typeof GqlPublicTeamResolverOneOfFilterKeys[keyof typeof GqlPublicTeamResolverOneOfFilterKeys];
export const GqlPublicTeamResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type GqlPublicTeamResolverStringFilterKeys = typeof GqlPublicTeamResolverStringFilterKeys[keyof typeof GqlPublicTeamResolverStringFilterKeys];
export type GqlPublicTeamResource = {
  readonly __typename?: 'TeamResource';
  /** @deprecated Just query the members field and filter by role */
  readonly captains: ReadonlyArray<GqlPublicMembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['output'];
  readonly members: ReadonlyArray<GqlPublicMembershipResource>;
  readonly name: Scalars['String']['output'];
  readonly persistentIdentifier?: Maybe<Scalars['String']['output']>;
  readonly pointEntries: ReadonlyArray<GqlPublicPointEntryResource>;
  readonly totalPoints: Scalars['Int']['output'];
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export { TeamType };

export type GqlPublicSimpleConfigFragment = { readonly __typename?: 'ConfigurationResource', readonly uuid: string, readonly key: string, readonly value: string } & { ' $fragmentName'?: 'GqlPublicSimpleConfigFragment' };

export type GqlPublicFullConfigFragment = (
  { readonly __typename?: 'ConfigurationResource', readonly validAfter?: string | null, readonly validUntil?: string | null, readonly createdAt?: Date | string | null }
  & { ' $fragmentRefs'?: { 'GqlPublicSimpleConfigFragment': GqlPublicSimpleConfigFragment } }
) & { ' $fragmentName'?: 'GqlPublicFullConfigFragment' };

export type GqlPublicNotificationFragmentFragment = { readonly __typename?: 'NotificationResource', readonly uuid: string, readonly title: string, readonly body: string, readonly url?: URL | string | null } & { ' $fragmentName'?: 'GqlPublicNotificationFragmentFragment' };

export type GqlPublicNotificationDeliveryFragmentFragment = { readonly __typename?: 'NotificationDeliveryResource', readonly uuid: string, readonly sentAt?: Date | string | null, readonly notification: (
    { readonly __typename?: 'NotificationResource' }
    & { ' $fragmentRefs'?: { 'GqlPublicNotificationFragmentFragment': GqlPublicNotificationFragmentFragment } }
  ) } & { ' $fragmentName'?: 'GqlPublicNotificationDeliveryFragmentFragment' };

export type GqlPublicUseAllowedLoginTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlPublicUseAllowedLoginTypesQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'GqlPublicSimpleConfigFragment': GqlPublicSimpleConfigFragment } }
    ) } };

export type GqlPublicUseTabBarConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlPublicUseTabBarConfigQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'GqlPublicSimpleConfigFragment': GqlPublicSimpleConfigFragment } }
    ) } };

export type GqlPublicAuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlPublicAuthStateQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string } | null }, readonly loginState: { readonly __typename?: 'LoginState', readonly loggedIn: boolean, readonly authSource: GqlPublicAuthSource, readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: GqlPublicDbRole, readonly committeeIdentifier?: GqlPublicCommitteeIdentifier | null, readonly committeeRole?: GqlPublicCommitteeRole | null } } };

export type GqlPublicSetDeviceMutationVariables = Exact<{
  input: GqlPublicRegisterDeviceInput;
}>;


export type GqlPublicSetDeviceMutation = { readonly __typename?: 'Mutation', readonly registerDevice: { readonly __typename?: 'RegisterDeviceResponse', readonly ok: boolean } };

export type GqlPublicEventScreenFragmentFragment = { readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceResource', readonly uuid: string, readonly interval: string, readonly fullDay: boolean }>, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly imageData?: string | null, readonly thumbHash?: string | null, readonly url?: URL | string | null, readonly height: number, readonly width: number, readonly alt?: string | null, readonly mimeType: string }> } & { ' $fragmentName'?: 'GqlPublicEventScreenFragmentFragment' };

export type GqlPublicDeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier: Scalars['String']['input'];
}>;


export type GqlPublicDeviceNotificationsQuery = { readonly __typename?: 'Query', readonly device: { readonly __typename?: 'GetDeviceByUuidResponse', readonly data: { readonly __typename?: 'DeviceResource', readonly notificationDeliveries: ReadonlyArray<(
        { readonly __typename?: 'NotificationDeliveryResource' }
        & { ' $fragmentRefs'?: { 'GqlPublicNotificationDeliveryFragmentFragment': GqlPublicNotificationDeliveryFragmentFragment } }
      )> } } };

export type GqlPublicProfileScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly authSource: GqlPublicAuthSource, readonly role: { readonly __typename?: 'RoleResource', readonly committeeIdentifier?: GqlPublicCommitteeIdentifier | null, readonly committeeRole?: GqlPublicCommitteeRole | null, readonly dbRole: GqlPublicDbRole } } & { ' $fragmentName'?: 'GqlPublicProfileScreenAuthFragmentFragment' };

export type GqlPublicProfileScreenUserFragmentFragment = { readonly __typename?: 'PersonResource', readonly name?: string | null, readonly linkblue?: string | null, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: GqlPublicMembershipPositionType, readonly team: { readonly __typename?: 'TeamResource', readonly name: string } }> } & { ' $fragmentName'?: 'GqlPublicProfileScreenUserFragmentFragment' };

export type GqlPublicRootScreenDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlPublicRootScreenDocumentQuery = { readonly __typename?: 'Query', readonly loginState: (
    { readonly __typename?: 'LoginState' }
    & { ' $fragmentRefs'?: { 'GqlPublicProfileScreenAuthFragmentFragment': GqlPublicProfileScreenAuthFragmentFragment;'GqlPublicRootScreenAuthFragmentFragment': GqlPublicRootScreenAuthFragmentFragment } }
  ), readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: (
      { readonly __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'GqlPublicProfileScreenUserFragmentFragment': GqlPublicProfileScreenUserFragmentFragment } }
    ) | null } };

export type GqlPublicRootScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: GqlPublicDbRole } } & { ' $fragmentName'?: 'GqlPublicRootScreenAuthFragmentFragment' };

export type GqlPublicEventsQueryVariables = Exact<{
  earliestTimestamp: Scalars['LuxonDateTime']['input'];
  lastTimestamp: Scalars['LuxonDateTime']['input'];
}>;


export type GqlPublicEventsQuery = { readonly __typename?: 'Query', readonly events: { readonly __typename?: 'ListEventsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'GqlPublicEventScreenFragmentFragment': GqlPublicEventScreenFragmentFragment } }
    )> } };

export type GqlPublicScoreBoardFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly totalPoints: number, readonly legacyStatus: GqlPublicTeamLegacyStatus, readonly type: GqlPublicTeamType } & { ' $fragmentName'?: 'GqlPublicScoreBoardFragmentFragment' };

export type GqlPublicHighlightedTeamFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly legacyStatus: GqlPublicTeamLegacyStatus, readonly type: GqlPublicTeamType } & { ' $fragmentName'?: 'GqlPublicHighlightedTeamFragmentFragment' };

export type GqlPublicScoreBoardDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlPublicScoreBoardDocumentQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly team: (
          { readonly __typename?: 'TeamResource' }
          & { ' $fragmentRefs'?: { 'GqlPublicHighlightedTeamFragmentFragment': GqlPublicHighlightedTeamFragmentFragment;'GqlPublicMyTeamFragmentFragment': GqlPublicMyTeamFragmentFragment } }
        ) }> } | null }, readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'GqlPublicScoreBoardFragmentFragment': GqlPublicScoreBoardFragmentFragment } }
    )> } };

export type GqlPublicMyTeamFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly totalPoints: number, readonly pointEntries: ReadonlyArray<{ readonly __typename?: 'PointEntryResource', readonly points: number, readonly personFrom?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null } | null }>, readonly members: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: GqlPublicMembershipPositionType, readonly person: { readonly __typename?: 'PersonResource', readonly linkblue?: string | null, readonly name?: string | null } }> } & { ' $fragmentName'?: 'GqlPublicMyTeamFragmentFragment' };

export const SimpleConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<GqlPublicSimpleConfigFragment, unknown>;
export const FullConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<GqlPublicFullConfigFragment, unknown>;
export const NotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<GqlPublicNotificationFragmentFragment, unknown>;
export const NotificationDeliveryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<GqlPublicNotificationDeliveryFragmentFragment, unknown>;
export const EventScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<GqlPublicEventScreenFragmentFragment, unknown>;
export const ProfileScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]} as unknown as DocumentNode<GqlPublicProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlPublicProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}}]} as unknown as DocumentNode<GqlPublicRootScreenAuthFragmentFragment, unknown>;
export const ScoreBoardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GqlPublicScoreBoardFragmentFragment, unknown>;
export const HighlightedTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GqlPublicHighlightedTeamFragmentFragment, unknown>;
export const MyTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlPublicMyTeamFragmentFragment, unknown>;
export const UseAllowedLoginTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useAllowedLoginTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"ALLOWED_LOGIN_TYPES","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<GqlPublicUseAllowedLoginTypesQuery, GqlPublicUseAllowedLoginTypesQueryVariables>;
export const UseTabBarConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useTabBarConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TAB_BAR_CONFIG","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<GqlPublicUseTabBarConfigQuery, GqlPublicUseTabBarConfigQueryVariables>;
export const AuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]}}]} as unknown as DocumentNode<GqlPublicAuthStateQuery, GqlPublicAuthStateQueryVariables>;
export const SetDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlPublicSetDeviceMutation, GqlPublicSetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeviceNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveryFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}}]} as unknown as DocumentNode<GqlPublicDeviceNotificationsQuery, GqlPublicDeviceNotificationsQueryVariables>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlPublicRootScreenDocumentQuery, GqlPublicRootScreenDocumentQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"GREATER_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"LESS_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"EnumValue","value":"ASCENDING"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"StringValue","value":"occurrence","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<GqlPublicEventsQuery, GqlPublicEventsQueryVariables>;
export const ScoreBoardDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScoreBoardDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HighlightedTeamFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyTeamFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"totalPoints","block":false},{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DESCENDING"},{"kind":"EnumValue","value":"ASCENDING"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScoreBoardFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GqlPublicScoreBoardDocumentQuery, GqlPublicScoreBoardDocumentQueryVariables>;