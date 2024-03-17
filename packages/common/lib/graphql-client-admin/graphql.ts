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

export type GqlAdminAbortScheduledNotificationResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'AbortScheduledNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlAdminAbstractGraphQlArrayOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlAdminAbstractGraphQlCreatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

/** API response */
export type GqlAdminAbstractGraphQlOkResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlAdminAbstractGraphQlPaginatedResponse = {
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminAcknowledgeDeliveryIssueResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'AcknowledgeDeliveryIssueResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminAddEventImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['Int']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['Int']['input'];
};

export type GqlAdminAddEventImageResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'AddEventImageResponse';
  readonly data: GqlAdminImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminAuthIdPairResource = {
  readonly __typename?: 'AuthIdPairResource';
  readonly source: AuthSource;
  readonly value: Scalars['String']['output'];
};

export { AuthSource };

export { CommitteeIdentifier };

export { CommitteeRole };

export type GqlAdminConfigurationResource = {
  readonly __typename?: 'ConfigurationResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly key: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly validAfter?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly validUntil?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly value: Scalars['String']['output'];
};

export type GqlAdminCreateConfigurationInput = {
  readonly key: Scalars['String']['input'];
  readonly validAfter?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly validUntil?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly value: Scalars['String']['input'];
};

export type GqlAdminCreateConfigurationResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreateConfigurationResponse';
  readonly data: GqlAdminConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreateEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<GqlAdminCreateEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type GqlAdminCreateEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
};

export type GqlAdminCreateEventResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreateEventResponse';
  readonly data: GqlAdminEventResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreateImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly height: Scalars['NonNegativeInt']['input'];
  readonly imageData?: InputMaybe<Scalars['String']['input']>;
  readonly mimeType: Scalars['String']['input'];
  readonly thumbHash?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['String']['input']>;
  readonly width: Scalars['NonNegativeInt']['input'];
};

export type GqlAdminCreateImageResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreateImageResponse';
  readonly data: GqlAdminImageResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreatePersonInput = {
  readonly captainOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly email: Scalars['EmailAddress']['input'];
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<GqlAdminRoleResourceInput>;
};

export type GqlAdminCreatePersonResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreatePersonResponse';
  readonly data: GqlAdminPersonResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreatePointEntryInput = {
  readonly comment?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityUuid?: InputMaybe<Scalars['String']['input']>;
  readonly personFromUuid?: InputMaybe<Scalars['String']['input']>;
  readonly points: Scalars['Int']['input'];
  readonly teamUuid: Scalars['String']['input'];
};

export type GqlAdminCreatePointEntryResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreatePointEntryResponse';
  readonly data: GqlAdminPointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreatePointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name: Scalars['String']['input'];
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type: TeamType;
};

export type GqlAdminCreatePointOpportunityResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreatePointOpportunityResponse';
  readonly data: GqlAdminPointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type GqlAdminCreateTeamInput = {
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['input'];
  readonly name: Scalars['String']['input'];
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type: TeamType;
};

export type GqlAdminCreateTeamResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'CreateTeamResponse';
  readonly data: GqlAdminTeamResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { DbRole };

export type GqlAdminDeleteConfigurationResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteConfigurationResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeleteDeviceResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteDeviceResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeleteEventResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteEventResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeleteImageResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteImageResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeleteNotificationResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeletePersonResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeletePersonResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeletePointEntryResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeletePointEntryResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeletePointOpportunityResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeletePointOpportunityResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminDeleteTeamResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'DeleteTeamResponse';
  readonly ok: Scalars['Boolean']['output'];
};

export const GqlAdminDeviceResolverAllKeys = {
  CreatedAt: 'createdAt',
  ExpoPushToken: 'expoPushToken',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminDeviceResolverAllKeys = typeof GqlAdminDeviceResolverAllKeys[keyof typeof GqlAdminDeviceResolverAllKeys];
export const GqlAdminDeviceResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  LastSeen: 'lastSeen',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminDeviceResolverDateFilterKeys = typeof GqlAdminDeviceResolverDateFilterKeys[keyof typeof GqlAdminDeviceResolverDateFilterKeys];
export type GqlAdminDeviceResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminDeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminDeviceResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminDeviceResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminDeviceResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminDeviceResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminDeviceResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminDeviceResolverStringFilterKeys = {
  ExpoPushToken: 'expoPushToken'
} as const;

export type GqlAdminDeviceResolverStringFilterKeys = typeof GqlAdminDeviceResolverStringFilterKeys[keyof typeof GqlAdminDeviceResolverStringFilterKeys];
export type GqlAdminDeviceResource = {
  readonly __typename?: 'DeviceResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly expoPushToken?: Maybe<Scalars['String']['output']>;
  readonly lastLoggedInUser?: Maybe<GqlAdminPersonResource>;
  readonly lastLogin?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly notificationDeliveries: ReadonlyArray<GqlAdminNotificationDeliveryResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};


export type GqlAdminDeviceResourceNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export type GqlAdminEventOccurrenceResource = {
  readonly __typename?: 'EventOccurrenceResource';
  readonly fullDay: Scalars['Boolean']['output'];
  readonly interval: Scalars['LuxonDateRange']['output'];
  readonly uuid: Scalars['ID']['output'];
};

export const GqlAdminEventResolverAllKeys = {
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

export type GqlAdminEventResolverAllKeys = typeof GqlAdminEventResolverAllKeys[keyof typeof GqlAdminEventResolverAllKeys];
export const GqlAdminEventResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  Occurrence: 'occurrence',
  OccurrenceEnd: 'occurrenceEnd',
  OccurrenceStart: 'occurrenceStart',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminEventResolverDateFilterKeys = typeof GqlAdminEventResolverDateFilterKeys[keyof typeof GqlAdminEventResolverDateFilterKeys];
export type GqlAdminEventResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminEventResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminEventResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminEventResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminEventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminEventResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminEventResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminEventResolverStringFilterKeys = {
  Description: 'description',
  Location: 'location',
  Summary: 'summary',
  Title: 'title'
} as const;

export type GqlAdminEventResolverStringFilterKeys = typeof GqlAdminEventResolverStringFilterKeys[keyof typeof GqlAdminEventResolverStringFilterKeys];
export type GqlAdminEventResource = {
  readonly __typename?: 'EventResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly images: ReadonlyArray<GqlAdminImageResource>;
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly occurrences: ReadonlyArray<GqlAdminEventOccurrenceResource>;
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlAdminGetAllConfigurationsResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetAllConfigurationsResponse';
  readonly data: ReadonlyArray<GqlAdminConfigurationResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetConfigurationByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetConfigurationByUuidResponse';
  readonly data: GqlAdminConfigurationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetDeviceByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetDeviceByUuidResponse';
  readonly data: GqlAdminDeviceResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetEventByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetEventByUuidResponse';
  readonly data: GqlAdminEventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetImageByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetImageByUuidResponse';
  readonly data: GqlAdminImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetNotificationByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetNotificationByUuidResponse';
  readonly data: GqlAdminNotificationResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetPeopleResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetPeopleResponse';
  readonly data: ReadonlyArray<GqlAdminPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetPersonResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetPersonResponse';
  readonly data?: Maybe<GqlAdminPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminGetPointEntryByUuidResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'GetPointEntryByUuidResponse';
  readonly data: GqlAdminPointEntryResource;
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GqlAdminGraphQlBaseResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminImageResource = {
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

export type GqlAdminListDevicesResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListDevicesResponse';
  readonly data: ReadonlyArray<GqlAdminDeviceResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListEventsResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListEventsResponse';
  readonly data: ReadonlyArray<GqlAdminEventResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListNotificationDeliveriesResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationDeliveriesResponse';
  readonly data: ReadonlyArray<GqlAdminNotificationDeliveryResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListNotificationsResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationsResponse';
  readonly data: ReadonlyArray<GqlAdminNotificationResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListPeopleResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListPeopleResponse';
  readonly data: ReadonlyArray<GqlAdminPersonResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListPointEntriesResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListPointEntriesResponse';
  readonly data: ReadonlyArray<GqlAdminPointEntryResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListPointOpportunitiesResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListPointOpportunitiesResponse';
  readonly data: ReadonlyArray<GqlAdminPointOpportunityResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminListTeamsResponse = GqlAdminAbstractGraphQlArrayOkResponse & GqlAdminAbstractGraphQlPaginatedResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ListTeamsResponse';
  readonly data: ReadonlyArray<GqlAdminTeamResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type GqlAdminLoginState = {
  readonly __typename?: 'LoginState';
  readonly authSource: AuthSource;
  readonly loggedIn: Scalars['Boolean']['output'];
  readonly role: GqlAdminRoleResource;
};

export { MembershipPositionType };

export type GqlAdminMembershipResource = {
  readonly __typename?: 'MembershipResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly person: GqlAdminPersonResource;
  readonly position: MembershipPositionType;
  readonly team: GqlAdminTeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlAdminMutation = {
  readonly __typename?: 'Mutation';
  readonly abortScheduledNotification: GqlAdminAbortScheduledNotificationResponse;
  readonly acknowledgeDeliveryIssue: GqlAdminAcknowledgeDeliveryIssueResponse;
  readonly addExistingImageToEvent: GqlAdminAddEventImageResponse;
  readonly addImageToEvent: GqlAdminAddEventImageResponse;
  readonly createConfiguration: GqlAdminCreateConfigurationResponse;
  readonly createConfigurations: GqlAdminCreateConfigurationResponse;
  readonly createEvent: GqlAdminCreateEventResponse;
  readonly createImage: GqlAdminCreateImageResponse;
  readonly createPerson: GqlAdminCreatePersonResponse;
  readonly createPointEntry: GqlAdminCreatePointEntryResponse;
  readonly createPointOpportunity: GqlAdminCreatePointOpportunityResponse;
  readonly createTeam: GqlAdminCreateTeamResponse;
  readonly deleteConfiguration: GqlAdminDeleteConfigurationResponse;
  readonly deleteDevice: GqlAdminDeleteDeviceResponse;
  readonly deleteEvent: GqlAdminDeleteEventResponse;
  readonly deleteImage: GqlAdminDeleteImageResponse;
  readonly deleteNotification: GqlAdminDeleteNotificationResponse;
  readonly deletePerson: GqlAdminDeletePersonResponse;
  readonly deletePointEntry: GqlAdminDeletePointEntryResponse;
  readonly deletePointOpportunity: GqlAdminDeletePointOpportunityResponse;
  readonly deleteTeam: GqlAdminDeleteTeamResponse;
  readonly registerDevice: GqlAdminRegisterDeviceResponse;
  readonly removeImageFromEvent: GqlAdminRemoveEventImageResponse;
  readonly scheduleNotification: GqlAdminScheduleNotificationResponse;
  /** Send a notification immediately. */
  readonly sendNotification: GqlAdminSendNotificationResponse;
  readonly setEvent: GqlAdminSetEventResponse;
  readonly setPerson: GqlAdminGetPersonResponse;
  readonly setPointOpportunity: GqlAdminSinglePointOpportunityResponse;
  readonly setTeam: GqlAdminSingleTeamResponse;
  readonly stageNotification: GqlAdminStageNotificationResponse;
};


export type GqlAdminMutationAbortScheduledNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationAcknowledgeDeliveryIssueArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationAddExistingImageToEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type GqlAdminMutationAddImageToEventArgs = {
  eventId: Scalars['String']['input'];
  input: GqlAdminAddEventImageInput;
};


export type GqlAdminMutationCreateConfigurationArgs = {
  input: GqlAdminCreateConfigurationInput;
};


export type GqlAdminMutationCreateConfigurationsArgs = {
  input: ReadonlyArray<GqlAdminCreateConfigurationInput>;
};


export type GqlAdminMutationCreateEventArgs = {
  input: GqlAdminCreateEventInput;
};


export type GqlAdminMutationCreateImageArgs = {
  input: GqlAdminCreateImageInput;
};


export type GqlAdminMutationCreatePersonArgs = {
  input: GqlAdminCreatePersonInput;
};


export type GqlAdminMutationCreatePointEntryArgs = {
  input: GqlAdminCreatePointEntryInput;
};


export type GqlAdminMutationCreatePointOpportunityArgs = {
  input: GqlAdminCreatePointOpportunityInput;
};


export type GqlAdminMutationCreateTeamArgs = {
  input: GqlAdminCreateTeamInput;
};


export type GqlAdminMutationDeleteConfigurationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeleteDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeleteEventArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeleteImageArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeleteNotificationArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeletePersonArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeletePointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeletePointOpportunityArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationDeleteTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationRegisterDeviceArgs = {
  input: GqlAdminRegisterDeviceInput;
};


export type GqlAdminMutationRemoveImageFromEventArgs = {
  eventId: Scalars['String']['input'];
  imageId: Scalars['String']['input'];
};


export type GqlAdminMutationScheduleNotificationArgs = {
  sendAt: Scalars['DateTimeISO']['input'];
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationSendNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationSetEventArgs = {
  input: GqlAdminSetEventInput;
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationSetPersonArgs = {
  input: GqlAdminSetPersonInput;
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationSetPointOpportunityArgs = {
  input: GqlAdminSetPointOpportunityInput;
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationSetTeamArgs = {
  input: GqlAdminSetTeamInput;
  uuid: Scalars['String']['input'];
};


export type GqlAdminMutationStageNotificationArgs = {
  audience: GqlAdminNotificationAudienceInput;
  body: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url?: InputMaybe<Scalars['String']['input']>;
};

export type GqlAdminNotificationAudienceInput = {
  readonly all?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The number of delivery issues for a notification, broken down by type. */
export type GqlAdminNotificationDeliveryIssueCount = {
  readonly __typename?: 'NotificationDeliveryIssueCount';
  readonly DeviceNotRegistered: Scalars['Int']['output'];
  readonly InvalidCredentials: Scalars['Int']['output'];
  readonly MessageRateExceeded: Scalars['Int']['output'];
  readonly MessageTooBig: Scalars['Int']['output'];
  readonly MismatchSenderId: Scalars['Int']['output'];
  readonly Unknown: Scalars['Int']['output'];
};

export const GqlAdminNotificationDeliveryResolverAllKeys = {
  CreatedAt: 'createdAt',
  DeliveryError: 'deliveryError',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminNotificationDeliveryResolverAllKeys = typeof GqlAdminNotificationDeliveryResolverAllKeys[keyof typeof GqlAdminNotificationDeliveryResolverAllKeys];
export const GqlAdminNotificationDeliveryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  ReceiptCheckedAt: 'receiptCheckedAt',
  SentAt: 'sentAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminNotificationDeliveryResolverDateFilterKeys = typeof GqlAdminNotificationDeliveryResolverDateFilterKeys[keyof typeof GqlAdminNotificationDeliveryResolverDateFilterKeys];
export type GqlAdminNotificationDeliveryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminNotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminNotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminNotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminNotificationDeliveryResource = {
  readonly __typename?: 'NotificationDeliveryResource';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  readonly chunkUuid?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  readonly deliveryError?: Maybe<Scalars['String']['output']>;
  readonly notification: GqlAdminNotificationResource;
  /** The time the server received a delivery receipt from the user. */
  readonly receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  readonly sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlAdminNotificationResolverAllKeys = {
  Body: 'body',
  CreatedAt: 'createdAt',
  DeliveryIssue: 'deliveryIssue',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  Title: 'title',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminNotificationResolverAllKeys = typeof GqlAdminNotificationResolverAllKeys[keyof typeof GqlAdminNotificationResolverAllKeys];
export const GqlAdminNotificationResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  SendAt: 'sendAt',
  StartedSendingAt: 'startedSendingAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminNotificationResolverDateFilterKeys = typeof GqlAdminNotificationResolverDateFilterKeys[keyof typeof GqlAdminNotificationResolverDateFilterKeys];
export type GqlAdminNotificationResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminNotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminNotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminNotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminNotificationResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminNotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminNotificationResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminNotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminNotificationResolverOneOfFilterKeys = {
  DeliveryIssue: 'deliveryIssue'
} as const;

export type GqlAdminNotificationResolverOneOfFilterKeys = typeof GqlAdminNotificationResolverOneOfFilterKeys[keyof typeof GqlAdminNotificationResolverOneOfFilterKeys];
export const GqlAdminNotificationResolverStringFilterKeys = {
  Body: 'body',
  Title: 'title'
} as const;

export type GqlAdminNotificationResolverStringFilterKeys = typeof GqlAdminNotificationResolverStringFilterKeys[keyof typeof GqlAdminNotificationResolverStringFilterKeys];
export type GqlAdminNotificationResource = {
  readonly __typename?: 'NotificationResource';
  readonly body: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryCount: Scalars['Int']['output'];
  readonly deliveryIssue?: Maybe<Scalars['String']['output']>;
  readonly deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryIssueCount: GqlAdminNotificationDeliveryIssueCount;
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

export const GqlAdminPersonResolverAllKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole',
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type GqlAdminPersonResolverAllKeys = typeof GqlAdminPersonResolverAllKeys[keyof typeof GqlAdminPersonResolverAllKeys];
export type GqlAdminPersonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminPersonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminPersonResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminPersonResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminPersonResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminPersonResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminPersonResolverOneOfFilterKeys = {
  CommitteeName: 'committeeName',
  CommitteeRole: 'committeeRole',
  DbRole: 'dbRole'
} as const;

export type GqlAdminPersonResolverOneOfFilterKeys = typeof GqlAdminPersonResolverOneOfFilterKeys[keyof typeof GqlAdminPersonResolverOneOfFilterKeys];
export const GqlAdminPersonResolverStringFilterKeys = {
  Email: 'email',
  Linkblue: 'linkblue',
  Name: 'name'
} as const;

export type GqlAdminPersonResolverStringFilterKeys = typeof GqlAdminPersonResolverStringFilterKeys[keyof typeof GqlAdminPersonResolverStringFilterKeys];
export type GqlAdminPersonResource = {
  readonly __typename?: 'PersonResource';
  /** @deprecated This is now provided on the AuthIdPair resource. */
  readonly authIds: ReadonlyArray<GqlAdminAuthIdPairResource>;
  /** @deprecated Use teams instead and filter by position */
  readonly captaincies: ReadonlyArray<GqlAdminMembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly email: Scalars['String']['output'];
  readonly linkblue?: Maybe<Scalars['String']['output']>;
  readonly name?: Maybe<Scalars['String']['output']>;
  readonly role: GqlAdminRoleResource;
  readonly teams: ReadonlyArray<GqlAdminMembershipResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlAdminPointEntryResolverAllKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminPointEntryResolverAllKeys = typeof GqlAdminPointEntryResolverAllKeys[keyof typeof GqlAdminPointEntryResolverAllKeys];
export const GqlAdminPointEntryResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminPointEntryResolverDateFilterKeys = typeof GqlAdminPointEntryResolverDateFilterKeys[keyof typeof GqlAdminPointEntryResolverDateFilterKeys];
export type GqlAdminPointEntryResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminPointEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminPointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminPointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminPointEntryResource = {
  readonly __typename?: 'PointEntryResource';
  readonly comment?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly personFrom?: Maybe<GqlAdminPersonResource>;
  readonly pointOpportunity?: Maybe<GqlAdminPointOpportunityResource>;
  readonly points: Scalars['Int']['output'];
  readonly team: GqlAdminTeamResource;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export const GqlAdminPointOpportunityResolverAllKeys = {
  CreatedAt: 'createdAt',
  Name: 'name',
  OpportunityDate: 'opportunityDate',
  Type: 'type',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminPointOpportunityResolverAllKeys = typeof GqlAdminPointOpportunityResolverAllKeys[keyof typeof GqlAdminPointOpportunityResolverAllKeys];
export const GqlAdminPointOpportunityResolverDateFilterKeys = {
  CreatedAt: 'createdAt',
  OpportunityDate: 'opportunityDate',
  UpdatedAt: 'updatedAt'
} as const;

export type GqlAdminPointOpportunityResolverDateFilterKeys = typeof GqlAdminPointOpportunityResolverDateFilterKeys[keyof typeof GqlAdminPointOpportunityResolverDateFilterKeys];
export type GqlAdminPointOpportunityResolverKeyedDateFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: GqlAdminPointOpportunityResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type GqlAdminPointOpportunityResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminPointOpportunityResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminPointOpportunityResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminPointOpportunityResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminPointOpportunityResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminPointOpportunityResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminPointOpportunityResolverOneOfFilterKeys = {
  Type: 'type'
} as const;

export type GqlAdminPointOpportunityResolverOneOfFilterKeys = typeof GqlAdminPointOpportunityResolverOneOfFilterKeys[keyof typeof GqlAdminPointOpportunityResolverOneOfFilterKeys];
export const GqlAdminPointOpportunityResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type GqlAdminPointOpportunityResolverStringFilterKeys = typeof GqlAdminPointOpportunityResolverStringFilterKeys[keyof typeof GqlAdminPointOpportunityResolverStringFilterKeys];
export type GqlAdminPointOpportunityResource = {
  readonly __typename?: 'PointOpportunityResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly event?: Maybe<GqlAdminEventResource>;
  readonly name: Scalars['String']['output'];
  readonly opportunityDate?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GqlAdminQuery = {
  readonly __typename?: 'Query';
  readonly activeConfiguration: GqlAdminGetConfigurationByUuidResponse;
  readonly allConfigurations: GqlAdminGetAllConfigurationsResponse;
  readonly device: GqlAdminGetDeviceByUuidResponse;
  readonly devices: GqlAdminListDevicesResponse;
  readonly event: GqlAdminGetEventByUuidResponse;
  readonly events: GqlAdminListEventsResponse;
  readonly image: GqlAdminGetImageByUuidResponse;
  readonly listPeople: GqlAdminListPeopleResponse;
  readonly loginState: GqlAdminLoginState;
  readonly me: GqlAdminGetPersonResponse;
  readonly notification: GqlAdminGetNotificationByUuidResponse;
  readonly notificationDeliveries: GqlAdminListNotificationDeliveriesResponse;
  readonly notifications: GqlAdminListNotificationsResponse;
  readonly person: GqlAdminGetPersonResponse;
  readonly personByLinkBlue: GqlAdminGetPersonResponse;
  readonly pointEntries: GqlAdminListPointEntriesResponse;
  readonly pointEntry: GqlAdminGetPointEntryByUuidResponse;
  readonly pointOpportunities: GqlAdminListPointOpportunitiesResponse;
  readonly pointOpportunity: GqlAdminSinglePointOpportunityResponse;
  readonly searchPeopleByName: GqlAdminGetPeopleResponse;
  readonly team: GqlAdminSingleTeamResponse;
  readonly teams: GqlAdminListTeamsResponse;
};


export type GqlAdminQueryActiveConfigurationArgs = {
  key: Scalars['String']['input'];
};


export type GqlAdminQueryDeviceArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryDevicesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminDeviceResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminDeviceResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminDeviceResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminDeviceResolverKeyedStringFilterItem>>;
};


export type GqlAdminQueryEventArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryEventsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedStringFilterItem>>;
};


export type GqlAdminQueryImageArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryListPeopleArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedStringFilterItem>>;
};


export type GqlAdminQueryNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryNotificationDeliveriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationDeliveryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationDeliveryResolverKeyedIsNullFilterItem>>;
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


export type GqlAdminQueryNotificationsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedStringFilterItem>>;
};


export type GqlAdminQueryPersonArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryPersonByLinkBlueArgs = {
  linkBlueId: Scalars['String']['input'];
};


export type GqlAdminQueryPointEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminPointEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminPointEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type GqlAdminQueryPointEntryArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryPointOpportunitiesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminPointOpportunityResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminPointOpportunityResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminPointOpportunityResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminPointOpportunityResolverKeyedStringFilterItem>>;
};


export type GqlAdminQueryPointOpportunityArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQuerySearchPeopleByNameArgs = {
  name: Scalars['String']['input'];
};


export type GqlAdminQueryTeamArgs = {
  uuid: Scalars['String']['input'];
};


export type GqlAdminQueryTeamsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<Scalars['Void']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<ReadonlyArray<TeamLegacyStatus>>;
  marathonYear?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedStringFilterItem>>;
  type?: InputMaybe<ReadonlyArray<TeamType>>;
  visibility?: InputMaybe<ReadonlyArray<DbRole>>;
};

export type GqlAdminRegisterDeviceInput = {
  readonly deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars['String']['input']>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  readonly verifier: Scalars['String']['input'];
};

export type GqlAdminRegisterDeviceResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'RegisterDeviceResponse';
  readonly data: GqlAdminDeviceResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminRemoveEventImageResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'RemoveEventImageResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminRoleResource = {
  readonly __typename?: 'RoleResource';
  readonly committeeIdentifier?: Maybe<CommitteeIdentifier>;
  readonly committeeRole?: Maybe<CommitteeRole>;
  readonly dbRole: DbRole;
};

export type GqlAdminRoleResourceInput = {
  readonly committeeIdentifier?: InputMaybe<CommitteeIdentifier>;
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly dbRole?: DbRole;
};

export type GqlAdminScheduleNotificationResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'ScheduleNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminSendNotificationResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'SendNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminSetEventInput = {
  readonly description?: InputMaybe<Scalars['String']['input']>;
  readonly location?: InputMaybe<Scalars['String']['input']>;
  readonly occurrences: ReadonlyArray<GqlAdminSetEventOccurrenceInput>;
  readonly summary?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type GqlAdminSetEventOccurrenceInput = {
  readonly fullDay: Scalars['Boolean']['input'];
  readonly interval: Scalars['LuxonDateRange']['input'];
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars['String']['input']>;
};

export type GqlAdminSetEventResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'SetEventResponse';
  readonly data: GqlAdminEventResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminSetPersonInput = {
  readonly captainOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly email?: InputMaybe<Scalars['EmailAddress']['input']>;
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly role?: InputMaybe<GqlAdminRoleResourceInput>;
};

export type GqlAdminSetPointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityDate?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type GqlAdminSetTeamInput = {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly marathonYear?: InputMaybe<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type GqlAdminSinglePointOpportunityResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'SinglePointOpportunityResponse';
  readonly data: GqlAdminPointOpportunityResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type GqlAdminSingleTeamResponse = GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'SingleTeamResponse';
  readonly data: GqlAdminTeamResource;
  readonly ok: Scalars['Boolean']['output'];
};

export { SortDirection };

export type GqlAdminStageNotificationResponse = GqlAdminAbstractGraphQlCreatedResponse & GqlAdminAbstractGraphQlOkResponse & GqlAdminGraphQlBaseResponse & {
  readonly __typename?: 'StageNotificationResponse';
  readonly data: GqlAdminNotificationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { StringComparator };

export { TeamLegacyStatus };

export const GqlAdminTeamResolverAllKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Name: 'name',
  Type: 'type'
} as const;

export type GqlAdminTeamResolverAllKeys = typeof GqlAdminTeamResolverAllKeys[keyof typeof GqlAdminTeamResolverAllKeys];
export type GqlAdminTeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminTeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GqlAdminTeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: GqlAdminTeamResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type GqlAdminTeamResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: GqlAdminTeamResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const GqlAdminTeamResolverOneOfFilterKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Type: 'type'
} as const;

export type GqlAdminTeamResolverOneOfFilterKeys = typeof GqlAdminTeamResolverOneOfFilterKeys[keyof typeof GqlAdminTeamResolverOneOfFilterKeys];
export const GqlAdminTeamResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type GqlAdminTeamResolverStringFilterKeys = typeof GqlAdminTeamResolverStringFilterKeys[keyof typeof GqlAdminTeamResolverStringFilterKeys];
export type GqlAdminTeamResource = {
  readonly __typename?: 'TeamResource';
  /** @deprecated Just query the members field and filter by role */
  readonly captains: ReadonlyArray<GqlAdminMembershipResource>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathonYear: Scalars['String']['output'];
  readonly members: ReadonlyArray<GqlAdminMembershipResource>;
  readonly name: Scalars['String']['output'];
  readonly persistentIdentifier?: Maybe<Scalars['String']['output']>;
  readonly pointEntries: ReadonlyArray<GqlAdminPointEntryResource>;
  readonly totalPoints: Scalars['Int']['output'];
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export { TeamType };

export type GqlAdminCreateEventMutationVariables = Exact<{
  input: GqlAdminCreateEventInput;
}>;


export type GqlAdminCreateEventMutation = { readonly __typename?: 'Mutation', readonly createEvent: { readonly __typename?: 'CreateEventResponse', readonly data: { readonly __typename?: 'EventResource', readonly uuid: string } } };

export type GqlAdminEventEditorFragmentFragment = { readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceResource', readonly uuid: string, readonly interval: string, readonly fullDay: boolean }>, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly url?: URL | string | null, readonly imageData?: string | null, readonly width: number, readonly height: number, readonly thumbHash?: string | null, readonly alt?: string | null }> } & { ' $fragmentName'?: 'GqlAdminEventEditorFragmentFragment' };

export type GqlAdminSaveEventMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: GqlAdminSetEventInput;
}>;


export type GqlAdminSaveEventMutation = { readonly __typename?: 'Mutation', readonly setEvent: { readonly __typename?: 'SetEventResponse', readonly data: (
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminEventEditorFragmentFragment': GqlAdminEventEditorFragmentFragment } }
    ) } };

export type GqlAdminSingleNotificationFragmentFragment = { readonly __typename?: 'NotificationResource', readonly uuid: string, readonly title: string, readonly body: string, readonly deliveryIssue?: string | null, readonly deliveryIssueAcknowledgedAt?: Date | string | null, readonly sendAt?: Date | string | null, readonly startedSendingAt?: Date | string | null, readonly createdAt?: Date | string | null, readonly deliveryCount: number, readonly deliveryIssueCount: { readonly __typename?: 'NotificationDeliveryIssueCount', readonly DeviceNotRegistered: number, readonly InvalidCredentials: number, readonly MessageRateExceeded: number, readonly MessageTooBig: number, readonly MismatchSenderId: number, readonly Unknown: number } } & { ' $fragmentName'?: 'GqlAdminSingleNotificationFragmentFragment' };

export type GqlAdminCreateNotificationMutationVariables = Exact<{
  title: Scalars['String']['input'];
  body: Scalars['String']['input'];
  audience: GqlAdminNotificationAudienceInput;
  url?: InputMaybe<Scalars['String']['input']>;
}>;


export type GqlAdminCreateNotificationMutation = { readonly __typename?: 'Mutation', readonly stageNotification: { readonly __typename?: 'StageNotificationResponse', readonly uuid: string } };

export type GqlAdminCancelNotificationScheduleMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminCancelNotificationScheduleMutation = { readonly __typename?: 'Mutation', readonly abortScheduledNotification: { readonly __typename?: 'AbortScheduledNotificationResponse', readonly ok: boolean } };

export type GqlAdminDeleteNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GqlAdminDeleteNotificationMutation = { readonly __typename?: 'Mutation', readonly deleteNotification: { readonly __typename?: 'DeleteNotificationResponse', readonly ok: boolean } };

export type GqlAdminSendNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminSendNotificationMutation = { readonly __typename?: 'Mutation', readonly sendNotification: { readonly __typename?: 'SendNotificationResponse', readonly ok: boolean } };

export type GqlAdminScheduleNotificationMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  sendAt: Scalars['DateTimeISO']['input'];
}>;


export type GqlAdminScheduleNotificationMutation = { readonly __typename?: 'Mutation', readonly scheduleNotification: { readonly __typename?: 'ScheduleNotificationResponse', readonly ok: boolean } };

export type GqlAdminTeamNameFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string } & { ' $fragmentName'?: 'GqlAdminTeamNameFragmentFragment' };

export type GqlAdminPersonCreatorMutationVariables = Exact<{
  input: GqlAdminCreatePersonInput;
}>;


export type GqlAdminPersonCreatorMutation = { readonly __typename?: 'Mutation', readonly createPerson: { readonly __typename?: 'CreatePersonResponse', readonly ok: boolean, readonly uuid: string } };

export type GqlAdminPersonEditorFragmentFragment = { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null, readonly email: string, readonly role: { readonly __typename?: 'RoleResource', readonly committeeRole?: GqlAdminCommitteeRole | null, readonly committeeIdentifier?: GqlAdminCommitteeIdentifier | null }, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: GqlAdminMembershipPositionType, readonly team: { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string } }> } & { ' $fragmentName'?: 'GqlAdminPersonEditorFragmentFragment' };

export type GqlAdminPersonEditorMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: GqlAdminSetPersonInput;
}>;


export type GqlAdminPersonEditorMutation = { readonly __typename?: 'Mutation', readonly setPerson: { readonly __typename?: 'GetPersonResponse', readonly ok: boolean } };

export type GqlAdminCreatePointEntryMutationVariables = Exact<{
  input: GqlAdminCreatePointEntryInput;
}>;


export type GqlAdminCreatePointEntryMutation = { readonly __typename?: 'Mutation', readonly createPointEntry: { readonly __typename?: 'CreatePointEntryResponse', readonly data: { readonly __typename?: 'PointEntryResource', readonly uuid: string } } };

export type GqlAdminGetPersonByUuidQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminGetPersonByUuidQuery = { readonly __typename?: 'Query', readonly person: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null } | null } };

export type GqlAdminGetPersonByLinkBlueQueryVariables = Exact<{
  linkBlue: Scalars['String']['input'];
}>;


export type GqlAdminGetPersonByLinkBlueQuery = { readonly __typename?: 'Query', readonly personByLinkBlue: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null } | null } };

export type GqlAdminSearchPersonByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GqlAdminSearchPersonByNameQuery = { readonly __typename?: 'Query', readonly searchPeopleByName: { readonly __typename?: 'GetPeopleResponse', readonly data: ReadonlyArray<{ readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null }> } };

export type GqlAdminCreatePersonByLinkBlueMutationVariables = Exact<{
  linkBlue: Scalars['String']['input'];
  email: Scalars['EmailAddress']['input'];
  teamUuid: Scalars['String']['input'];
}>;


export type GqlAdminCreatePersonByLinkBlueMutation = { readonly __typename?: 'Mutation', readonly createPerson: { readonly __typename?: 'CreatePersonResponse', readonly uuid: string } };

export type GqlAdminPointEntryOpportunityLookupQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type GqlAdminPointEntryOpportunityLookupQuery = { readonly __typename?: 'Query', readonly pointOpportunities: { readonly __typename?: 'ListPointOpportunitiesResponse', readonly data: ReadonlyArray<{ readonly __typename?: 'PointOpportunityResource', readonly name: string, readonly uuid: string }> } };

export type GqlAdminCreatePointOpportunityMutationVariables = Exact<{
  input: GqlAdminCreatePointOpportunityInput;
}>;


export type GqlAdminCreatePointOpportunityMutation = { readonly __typename?: 'Mutation', readonly createPointOpportunity: { readonly __typename?: 'CreatePointOpportunityResponse', readonly uuid: string } };

export type GqlAdminTeamCreatorMutationVariables = Exact<{
  input: GqlAdminCreateTeamInput;
}>;


export type GqlAdminTeamCreatorMutation = { readonly __typename?: 'Mutation', readonly createTeam: { readonly __typename?: 'CreateTeamResponse', readonly ok: boolean, readonly uuid: string } };

export type GqlAdminTeamEditorFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly marathonYear: string, readonly legacyStatus: GqlAdminTeamLegacyStatus, readonly persistentIdentifier?: string | null, readonly type: GqlAdminTeamType } & { ' $fragmentName'?: 'GqlAdminTeamEditorFragmentFragment' };

export type GqlAdminTeamEditorMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
  input: GqlAdminSetTeamInput;
}>;


export type GqlAdminTeamEditorMutation = { readonly __typename?: 'Mutation', readonly setTeam: { readonly __typename?: 'SingleTeamResponse', readonly ok: boolean } };

export type GqlAdminEventsTableFragmentFragment = { readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly description?: string | null, readonly summary?: string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceResource', readonly uuid: string, readonly interval: string, readonly fullDay: boolean }> } & { ' $fragmentName'?: 'GqlAdminEventsTableFragmentFragment' };

export type GqlAdminEventsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<GqlAdminSortDirection> | GqlAdminSortDirection>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedDateFilterItem> | GqlAdminEventResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedIsNullFilterItem> | GqlAdminEventResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedOneOfFilterItem> | GqlAdminEventResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminEventResolverKeyedStringFilterItem> | GqlAdminEventResolverKeyedStringFilterItem>;
}>;


export type GqlAdminEventsTableQuery = { readonly __typename?: 'Query', readonly events: { readonly __typename?: 'ListEventsResponse', readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<(
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminEventsTableFragmentFragment': GqlAdminEventsTableFragmentFragment } }
    )> } };

export type GqlAdminPeopleTableFragmentFragment = { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null, readonly email: string, readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: GqlAdminDbRole, readonly committeeRole?: GqlAdminCommitteeRole | null, readonly committeeIdentifier?: GqlAdminCommitteeIdentifier | null } } & { ' $fragmentName'?: 'GqlAdminPeopleTableFragmentFragment' };

export type GqlAdminPeopleTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<GqlAdminSortDirection> | GqlAdminSortDirection>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedIsNullFilterItem> | GqlAdminPersonResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedOneOfFilterItem> | GqlAdminPersonResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminPersonResolverKeyedStringFilterItem> | GqlAdminPersonResolverKeyedStringFilterItem>;
}>;


export type GqlAdminPeopleTableQuery = { readonly __typename?: 'Query', readonly listPeople: { readonly __typename?: 'ListPeopleResponse', readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<(
      { readonly __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminPeopleTableFragmentFragment': GqlAdminPeopleTableFragmentFragment } }
    )> } };

export type GqlAdminTeamsTableQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<GqlAdminSortDirection> | GqlAdminSortDirection>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedIsNullFilterItem> | GqlAdminTeamResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedOneOfFilterItem> | GqlAdminTeamResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminTeamResolverKeyedStringFilterItem> | GqlAdminTeamResolverKeyedStringFilterItem>;
}>;


export type GqlAdminTeamsTableQuery = { readonly __typename?: 'Query', readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminTeamsTableFragmentFragment': GqlAdminTeamsTableFragmentFragment } }
    )> } };

export type GqlAdminTeamsTableFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly type: GqlAdminTeamType, readonly name: string, readonly legacyStatus: GqlAdminTeamLegacyStatus, readonly marathonYear: string, readonly totalPoints: number } & { ' $fragmentName'?: 'GqlAdminTeamsTableFragmentFragment' };

export type GqlAdminNotificationDeliveriesTableFragmentFragment = { readonly __typename?: 'NotificationDeliveryResource', readonly uuid: string, readonly deliveryError?: string | null, readonly receiptCheckedAt?: Date | string | null, readonly sentAt?: Date | string | null } & { ' $fragmentName'?: 'GqlAdminNotificationDeliveriesTableFragmentFragment' };

export type GqlAdminNotificationDeliveriesTableQueryQueryVariables = Exact<{
  notificationId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<GqlAdminSortDirection> | GqlAdminSortDirection>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationDeliveryResolverKeyedDateFilterItem> | GqlAdminNotificationDeliveryResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationDeliveryResolverKeyedIsNullFilterItem> | GqlAdminNotificationDeliveryResolverKeyedIsNullFilterItem>;
}>;


export type GqlAdminNotificationDeliveriesTableQueryQuery = { readonly __typename?: 'Query', readonly notificationDeliveries: { readonly __typename?: 'ListNotificationDeliveriesResponse', readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<(
      { readonly __typename?: 'NotificationDeliveryResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminNotificationDeliveriesTableFragmentFragment': GqlAdminNotificationDeliveriesTableFragmentFragment } }
    )> } };

export type GqlAdminNotificationsTableFragmentFragment = { readonly __typename?: 'NotificationResource', readonly uuid: string, readonly title: string, readonly body: string, readonly deliveryIssue?: string | null, readonly deliveryIssueAcknowledgedAt?: Date | string | null, readonly sendAt?: Date | string | null, readonly startedSendingAt?: Date | string | null } & { ' $fragmentName'?: 'GqlAdminNotificationsTableFragmentFragment' };

export type GqlAdminNotificationsTableQueryQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<ReadonlyArray<GqlAdminSortDirection> | GqlAdminSortDirection>;
  dateFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedDateFilterItem> | GqlAdminNotificationResolverKeyedDateFilterItem>;
  isNullFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedIsNullFilterItem> | GqlAdminNotificationResolverKeyedIsNullFilterItem>;
  oneOfFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedOneOfFilterItem> | GqlAdminNotificationResolverKeyedOneOfFilterItem>;
  stringFilters?: InputMaybe<ReadonlyArray<GqlAdminNotificationResolverKeyedStringFilterItem> | GqlAdminNotificationResolverKeyedStringFilterItem>;
}>;


export type GqlAdminNotificationsTableQueryQuery = { readonly __typename?: 'Query', readonly notifications: { readonly __typename?: 'ListNotificationsResponse', readonly page: number, readonly pageSize: number, readonly total: number, readonly data: ReadonlyArray<(
      { readonly __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminNotificationsTableFragmentFragment': GqlAdminNotificationsTableFragmentFragment } }
    )> } };

export type GqlAdminDeletePointEntryMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminDeletePointEntryMutation = { readonly __typename?: 'Mutation', readonly deletePointEntry: { readonly __typename?: 'DeletePointEntryResponse', readonly ok: boolean } };

export type GqlAdminPointEntryTableFragmentFragment = { readonly __typename?: 'PointEntryResource', readonly uuid: string, readonly points: number, readonly comment?: string | null, readonly personFrom?: { readonly __typename?: 'PersonResource', readonly name?: string | null, readonly linkblue?: string | null } | null, readonly pointOpportunity?: { readonly __typename?: 'PointOpportunityResource', readonly name: string, readonly opportunityDate?: string | null } | null } & { ' $fragmentName'?: 'GqlAdminPointEntryTableFragmentFragment' };

export type GqlAdminDeleteEventMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminDeleteEventMutation = { readonly __typename?: 'Mutation', readonly deleteEvent: { readonly __typename?: 'DeleteEventResponse', readonly ok: boolean } };

export type GqlAdminEventViewerFragmentFragment = { readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly createdAt?: Date | string | null, readonly updatedAt?: Date | string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceResource', readonly interval: string, readonly fullDay: boolean }>, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly url?: URL | string | null, readonly imageData?: string | null, readonly width: number, readonly height: number, readonly thumbHash?: string | null, readonly alt?: string | null }> } & { ' $fragmentName'?: 'GqlAdminEventViewerFragmentFragment' };

export type GqlAdminDeletePersonMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminDeletePersonMutation = { readonly __typename?: 'Mutation', readonly deletePerson: { readonly __typename?: 'DeletePersonResponse', readonly ok: boolean } };

export type GqlAdminPersonViewerFragmentFragment = { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null, readonly email: string, readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: GqlAdminDbRole, readonly committeeRole?: GqlAdminCommitteeRole | null, readonly committeeIdentifier?: GqlAdminCommitteeIdentifier | null }, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: GqlAdminMembershipPositionType, readonly team: { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string } }> } & { ' $fragmentName'?: 'GqlAdminPersonViewerFragmentFragment' };

export type GqlAdminDeleteTeamMutationVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminDeleteTeamMutation = { readonly __typename?: 'Mutation', readonly deleteTeam: { readonly __typename?: 'DeleteTeamResponse', readonly ok: boolean } };

export type GqlAdminTeamViewerFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly marathonYear: string, readonly legacyStatus: GqlAdminTeamLegacyStatus, readonly totalPoints: number, readonly type: GqlAdminTeamType, readonly members: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly person: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null } }>, readonly captains: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly person: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null } }> } & { ' $fragmentName'?: 'GqlAdminTeamViewerFragmentFragment' };

export type GqlAdminLoginStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlAdminLoginStateQuery = { readonly __typename?: 'Query', readonly loginState: { readonly __typename?: 'LoginState', readonly loggedIn: boolean, readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: GqlAdminDbRole, readonly committeeRole?: GqlAdminCommitteeRole | null, readonly committeeIdentifier?: GqlAdminCommitteeIdentifier | null } } };

export type GqlAdminCommitConfigChangesMutationVariables = Exact<{
  changes: ReadonlyArray<GqlAdminCreateConfigurationInput> | GqlAdminCreateConfigurationInput;
}>;


export type GqlAdminCommitConfigChangesMutation = { readonly __typename?: 'Mutation', readonly createConfigurations: { readonly __typename?: 'CreateConfigurationResponse', readonly ok: boolean } };

export type GqlAdminConfigFragmentFragment = { readonly __typename?: 'ConfigurationResource', readonly uuid: string, readonly key: string, readonly value: string, readonly validAfter?: string | null, readonly validUntil?: string | null, readonly createdAt?: Date | string | null } & { ' $fragmentName'?: 'GqlAdminConfigFragmentFragment' };

export type GqlAdminConfigQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlAdminConfigQueryQuery = { readonly __typename?: 'Query', readonly allConfigurations: { readonly __typename?: 'GetAllConfigurationsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminConfigFragmentFragment': GqlAdminConfigFragmentFragment } }
    )> } };

export type GqlAdminEditEventPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminEditEventPageQuery = { readonly __typename?: 'Query', readonly event: { readonly __typename?: 'GetEventByUuidResponse', readonly data: (
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminEventEditorFragmentFragment': GqlAdminEventEditorFragmentFragment } }
    ) } };

export type GqlAdminViewEventPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminViewEventPageQuery = { readonly __typename?: 'Query', readonly event: { readonly __typename?: 'GetEventByUuidResponse', readonly data: (
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminEventViewerFragmentFragment': GqlAdminEventViewerFragmentFragment } }
    ) } };

export type GqlAdminNotificationManagerQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminNotificationManagerQuery = { readonly __typename?: 'Query', readonly notification: { readonly __typename?: 'GetNotificationByUuidResponse', readonly data: (
      { readonly __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminSingleNotificationFragmentFragment': GqlAdminSingleNotificationFragmentFragment } }
    ) } };

export type GqlAdminNotificationViewerQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminNotificationViewerQuery = { readonly __typename?: 'Query', readonly notification: { readonly __typename?: 'GetNotificationByUuidResponse', readonly data: (
      { readonly __typename?: 'NotificationResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminSingleNotificationFragmentFragment': GqlAdminSingleNotificationFragmentFragment } }
    ) } };

export type GqlAdminCreatePersonPageQueryVariables = Exact<{ [key: string]: never; }>;


export type GqlAdminCreatePersonPageQuery = { readonly __typename?: 'Query', readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminTeamNameFragmentFragment': GqlAdminTeamNameFragmentFragment } }
    )> } };

export type GqlAdminEditPersonPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminEditPersonPageQuery = { readonly __typename?: 'Query', readonly person: { readonly __typename?: 'GetPersonResponse', readonly data?: (
      { readonly __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminPersonEditorFragmentFragment': GqlAdminPersonEditorFragmentFragment } }
    ) | null }, readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminTeamNameFragmentFragment': GqlAdminTeamNameFragmentFragment } }
    )> } };

export type GqlAdminViewPersonPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminViewPersonPageQuery = { readonly __typename?: 'Query', readonly person: { readonly __typename?: 'GetPersonResponse', readonly data?: (
      { readonly __typename?: 'PersonResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminPersonViewerFragmentFragment': GqlAdminPersonViewerFragmentFragment } }
    ) | null } };

export type GqlAdminEditTeamPageQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
}>;


export type GqlAdminEditTeamPageQuery = { readonly __typename?: 'Query', readonly team: { readonly __typename?: 'SingleTeamResponse', readonly data: (
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'GqlAdminTeamEditorFragmentFragment': GqlAdminTeamEditorFragmentFragment } }
    ) } };

export type GqlAdminViewTeamPageQueryVariables = Exact<{
  teamUuid: Scalars['String']['input'];
}>;


export type GqlAdminViewTeamPageQuery = { readonly __typename?: 'Query', readonly team: { readonly __typename?: 'SingleTeamResponse', readonly data: (
      { readonly __typename?: 'TeamResource', readonly pointEntries: ReadonlyArray<(
        { readonly __typename?: 'PointEntryResource' }
        & { ' $fragmentRefs'?: { 'GqlAdminPointEntryTableFragmentFragment': GqlAdminPointEntryTableFragmentFragment } }
      )> }
      & { ' $fragmentRefs'?: { 'GqlAdminTeamViewerFragmentFragment': GqlAdminTeamViewerFragmentFragment } }
    ) } };

export const EventEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<GqlAdminEventEditorFragmentFragment, unknown>;
export const SingleNotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<GqlAdminSingleNotificationFragmentFragment, unknown>;
export const TeamNameFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GqlAdminTeamNameFragmentFragment, unknown>;
export const PersonEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminPersonEditorFragmentFragment, unknown>;
export const TeamEditorFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"persistentIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GqlAdminTeamEditorFragmentFragment, unknown>;
export const EventsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<GqlAdminEventsTableFragmentFragment, unknown>;
export const PeopleTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]} as unknown as DocumentNode<GqlAdminPeopleTableFragmentFragment, unknown>;
export const TeamsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<GqlAdminTeamsTableFragmentFragment, unknown>;
export const NotificationDeliveriesTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<GqlAdminNotificationDeliveriesTableFragmentFragment, unknown>;
export const NotificationsTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<GqlAdminNotificationsTableFragmentFragment, unknown>;
export const PointEntryTableFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<GqlAdminPointEntryTableFragmentFragment, unknown>;
export const EventViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GqlAdminEventViewerFragmentFragment, unknown>;
export const PersonViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminPersonViewerFragmentFragment, unknown>;
export const TeamViewerFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"captains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminTeamViewerFragmentFragment, unknown>;
export const ConfigFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GqlAdminConfigFragmentFragment, unknown>;
export const CreateEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminCreateEventMutation, GqlAdminCreateEventMutationVariables>;
export const SaveEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<GqlAdminSaveEventMutation, GqlAdminSaveEventMutationVariables>;
export const CreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"body"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"audience"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationAudienceInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stageNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"body"},"value":{"kind":"Variable","name":{"kind":"Name","value":"body"}}},{"kind":"Argument","name":{"kind":"Name","value":"audience"},"value":{"kind":"Variable","name":{"kind":"Name","value":"audience"}}},{"kind":"Argument","name":{"kind":"Name","value":"url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<GqlAdminCreateNotificationMutation, GqlAdminCreateNotificationMutationVariables>;
export const CancelNotificationScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelNotificationSchedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abortScheduledNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminCancelNotificationScheduleMutation, GqlAdminCancelNotificationScheduleMutationVariables>;
export const DeleteNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"force"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"force"},"value":{"kind":"Variable","name":{"kind":"Name","value":"force"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminDeleteNotificationMutation, GqlAdminDeleteNotificationMutationVariables>;
export const SendNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminSendNotificationMutation, GqlAdminSendNotificationMutationVariables>;
export const ScheduleNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"sendAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sendAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminScheduleNotificationMutation, GqlAdminScheduleNotificationMutationVariables>;
export const PersonCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<GqlAdminPersonCreatorMutation, GqlAdminPersonCreatorMutationVariables>;
export const PersonEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetPersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminPersonEditorMutation, GqlAdminPersonEditorMutationVariables>;
export const CreatePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointEntryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminCreatePointEntryMutation, GqlAdminCreatePointEntryMutationVariables>;
export const GetPersonByUuidDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByUuid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminGetPersonByUuidQuery, GqlAdminGetPersonByUuidQueryVariables>;
export const GetPersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personByLinkBlue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"linkBlueId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminGetPersonByLinkBlueQuery, GqlAdminGetPersonByLinkBlueQueryVariables>;
export const SearchPersonByNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPersonByName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchPeopleByName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminSearchPersonByNameQuery, GqlAdminSearchPersonByNameQueryVariables>;
export const CreatePersonByLinkBlueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePersonByLinkBlue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailAddress"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"linkblue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"linkBlue"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"memberOf"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<GqlAdminCreatePersonByLinkBlueMutation, GqlAdminCreatePersonByLinkBlueMutationVariables>;
export const PointEntryOpportunityLookupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PointEntryOpportunityLookup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pointOpportunities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"SUBSTRING"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminPointEntryOpportunityLookupQuery, GqlAdminPointEntryOpportunityLookupQueryVariables>;
export const CreatePointOpportunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePointOpportunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePointOpportunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPointOpportunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<GqlAdminCreatePointOpportunityMutation, GqlAdminCreatePointOpportunityMutationVariables>;
export const TeamCreatorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamCreator"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<GqlAdminTeamCreatorMutation, GqlAdminTeamCreatorMutationVariables>;
export const TeamEditorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TeamEditor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminTeamEditorMutation, GqlAdminTeamEditorMutationVariables>;
export const EventsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EventsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EventResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"summary"}}]}}]} as unknown as DocumentNode<GqlAdminEventsTableQuery, GqlAdminEventsTableQueryVariables>;
export const PeopleTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PeopleTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listPeople"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PeopleTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PeopleTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]} as unknown as DocumentNode<GqlAdminPeopleTableQuery, GqlAdminPeopleTableQueryVariables>;
export const TeamsTableDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamsTable"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}}]}}]} as unknown as DocumentNode<GqlAdminTeamsTableQuery, GqlAdminTeamsTableQueryVariables>;
export const NotificationDeliveriesTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationDeliveriesTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResolverKeyedIsNullFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"notificationUuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveriesTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryError"}},{"kind":"Field","name":{"kind":"Name","value":"receiptCheckedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}}]}}]} as unknown as DocumentNode<GqlAdminNotificationDeliveriesTableQueryQuery, GqlAdminNotificationDeliveriesTableQueryQueryVariables>;
export const NotificationsTableQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationsTableQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SortDirection"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedDateFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedIsNullFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedOneOfFilterItem"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResolverKeyedStringFilterItem"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortDirection"}}},{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dateFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"isNullFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isNullFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"oneOfFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oneOfFilters"}}},{"kind":"Argument","name":{"kind":"Name","value":"stringFilters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stringFilters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationsTableFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationsTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}}]}}]} as unknown as DocumentNode<GqlAdminNotificationsTableQueryQuery, GqlAdminNotificationsTableQueryQueryVariables>;
export const DeletePointEntryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePointEntry"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePointEntry"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminDeletePointEntryMutation, GqlAdminDeletePointEntryMutationVariables>;
export const DeleteEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEvent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminDeleteEventMutation, GqlAdminDeleteEventMutationVariables>;
export const DeletePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminDeletePersonMutation, GqlAdminDeletePersonMutationVariables>;
export const DeleteTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminDeleteTeamMutation, GqlAdminDeleteTeamMutationVariables>;
export const LoginStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LoginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminLoginStateQuery, GqlAdminLoginStateQueryVariables>;
export const CommitConfigChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CommitConfigChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateConfigurationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createConfigurations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<GqlAdminCommitConfigChangesMutation, GqlAdminCommitConfigChangesMutationVariables>;
export const ConfigQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConfigQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allConfigurations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ConfigFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ConfigFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<GqlAdminConfigQueryQuery, GqlAdminConfigQueryQueryVariables>;
export const EditEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}}]}}]} as unknown as DocumentNode<GqlAdminEditEventPageQuery, GqlAdminEditEventPageQueryVariables>;
export const ViewEventPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewEventPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventViewerFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"imageData"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<GqlAdminViewEventPageQuery, GqlAdminViewEventPageQueryVariables>;
export const NotificationManagerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationManager"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<GqlAdminNotificationManagerQuery, GqlAdminNotificationManagerQueryVariables>;
export const NotificationViewerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"NotificationViewer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SingleNotificationFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SingleNotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssue"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueAcknowledgedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sendAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedSendingAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryCount"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryIssueCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DeviceNotRegistered"}},{"kind":"Field","name":{"kind":"Name","value":"InvalidCredentials"}},{"kind":"Field","name":{"kind":"Name","value":"MessageRateExceeded"}},{"kind":"Field","name":{"kind":"Name","value":"MessageTooBig"}},{"kind":"Field","name":{"kind":"Name","value":"MismatchSenderId"}},{"kind":"Field","name":{"kind":"Name","value":"Unknown"}}]}}]}}]} as unknown as DocumentNode<GqlAdminNotificationViewerQuery, GqlAdminNotificationViewerQueryVariables>;
export const CreatePersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CreatePersonPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ASCENDING"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamNameFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GqlAdminCreatePersonPageQuery, GqlAdminCreatePersonPageQueryVariables>;
export const EditPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonEditorFragment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"ASCENDING"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamNameFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamNameFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<GqlAdminEditPersonPageQuery, GqlAdminEditPersonPageQueryVariables>;
export const ViewPersonPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewPersonPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonViewerFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GqlAdminViewPersonPageQuery, GqlAdminViewPersonPageQueryVariables>;
export const EditTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EditTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamEditorFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamEditorFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"persistentIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<GqlAdminEditTeamPageQuery, GqlAdminEditTeamPageQueryVariables>;
export const ViewTeamPageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ViewTeamPage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TeamViewerFragment"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PointEntryTableFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TeamViewerFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"marathonYear"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"captains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PointEntryTableFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PointEntryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"pointOpportunity"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"opportunityDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]} as unknown as DocumentNode<GqlAdminViewTeamPageQuery, GqlAdminViewTeamPageQueryVariables>;