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

export type AbortScheduledNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'AbortScheduledNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
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

export type AcknowledgeDeliveryIssueResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'AcknowledgeDeliveryIssueResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type AddEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'AddEventImageResponse';
  readonly data: ImageResource;
  readonly ok: Scalars['Boolean']['output'];
};

export type AuthIdPairResource = {
  readonly __typename?: 'AuthIdPairResource';
  readonly source: AuthSource;
  readonly value: Scalars['String']['output'];
};

export { AuthSource };

export { CommitteeIdentifier };

export { CommitteeRole };

export type ConfigurationResource = {
  readonly __typename?: 'ConfigurationResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly key: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly validAfter?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly validUntil?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly value: Scalars['String']['output'];
};

export type CreateConfigurationInput = {
  readonly key: Scalars['String']['input'];
  readonly validAfter?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly validUntil?: InputMaybe<Scalars['LuxonDateTime']['input']>;
  readonly value: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateConfigurationResponse';
  readonly data: ConfigurationResource;
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

export type CreateFeedInput = {
  readonly imageUuid?: InputMaybe<Scalars['String']['input']>;
  readonly textContent?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type CreateImageInput = {
  readonly alt?: InputMaybe<Scalars['String']['input']>;
  readonly url?: InputMaybe<Scalars['URL']['input']>;
};

export type CreateMarathonHourInput = {
  readonly details?: InputMaybe<Scalars['String']['input']>;
  readonly durationInfo: Scalars['String']['input'];
  readonly shownStartingAt: Scalars['DateTimeISO']['input'];
  readonly title: Scalars['String']['input'];
};

export type CreateMarathonInput = {
  readonly endDate: Scalars['DateTimeISO']['input'];
  readonly startDate: Scalars['DateTimeISO']['input'];
  readonly year: Scalars['String']['input'];
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
  readonly points: Scalars['Int']['input'];
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
  readonly data: Scalars['Boolean']['output'];
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
  readonly field: Scalars['Void']['input'];
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
  ExpoPushToken: 'expoPushToken'
} as const;

export type DeviceResolverStringFilterKeys = typeof DeviceResolverStringFilterKeys[keyof typeof DeviceResolverStringFilterKeys];
export type DeviceResource = {
  readonly __typename?: 'DeviceResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly expoPushToken?: Maybe<Scalars['String']['output']>;
  readonly lastLoggedInUser?: Maybe<PersonResource>;
  readonly lastLogin?: Maybe<Scalars['LuxonDateTime']['output']>;
  readonly notificationDeliveries: ReadonlyArray<NotificationDeliveryResource>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};


export type DeviceResourceNotificationDeliveriesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier?: InputMaybe<Scalars['String']['input']>;
};

export type EventOccurrenceResource = {
  readonly __typename?: 'EventOccurrenceResource';
  readonly fullDay: Scalars['Boolean']['output'];
  readonly interval: Scalars['LuxonDateRange']['output'];
  readonly uuid: Scalars['ID']['output'];
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

export type EventResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
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

export type FeedResource = {
  readonly __typename?: 'FeedResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly image?: Maybe<ImageResource>;
  readonly textContent?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
};

export type GetAllConfigurationsResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetAllConfigurationsResponse';
  readonly data: ReadonlyArray<ConfigurationResource>;
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

/** API response */
export type GraphQlBaseResponse = {
  readonly ok: Scalars['Boolean']['output'];
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type ImageResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: ImageResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ImageResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: ImageResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['Float']['input'];
};

export type ImageResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: Scalars['Void']['input'];
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type ImageResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: ImageResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
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
export type ImageResource = {
  readonly __typename?: 'ImageResource';
  readonly alt?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly height: Scalars['Int']['output'];
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

export type ListImagesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListImagesResponse';
  readonly data: ReadonlyArray<ImageResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListMarathonsResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListMarathonsResponse';
  readonly data: ReadonlyArray<MarathonResource>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListNotificationDeliveriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListNotificationDeliveriesResponse';
  readonly data: ReadonlyArray<NotificationDeliveryResource>;
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

export type MarathonHourResource = {
  readonly __typename?: 'MarathonHourResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly details?: Maybe<Scalars['String']['output']>;
  readonly durationInfo: Scalars['String']['output'];
  readonly mapImages: ReadonlyArray<ImageResource>;
  readonly shownStartingAt: Scalars['DateTimeISO']['output'];
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: MarathonResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type MarathonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MarathonResource = {
  readonly __typename?: 'MarathonResource';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly endDate: Scalars['DateTimeISO']['output'];
  readonly hours: ReadonlyArray<MarathonHourResource>;
  readonly startDate: Scalars['DateTimeISO']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
  readonly year: Scalars['String']['output'];
};

export { MembershipPositionType };

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
  readonly abortScheduledNotification: AbortScheduledNotificationResponse;
  readonly acknowledgeDeliveryIssue: AcknowledgeDeliveryIssueResponse;
  readonly addExistingImageToEvent: AddEventImageResponse;
  readonly addMap: MarathonHourResource;
  readonly attachImageToFeedItem: FeedResource;
  readonly createConfiguration: CreateConfigurationResponse;
  readonly createConfigurations: CreateConfigurationResponse;
  readonly createEvent: CreateEventResponse;
  readonly createFeedItem: FeedResource;
  readonly createImage: ImageResource;
  readonly createMarathon: MarathonResource;
  readonly createMarathonHour: MarathonHourResource;
  readonly createPerson: CreatePersonResponse;
  readonly createPointEntry: CreatePointEntryResponse;
  readonly createPointOpportunity: CreatePointOpportunityResponse;
  readonly createTeam: CreateTeamResponse;
  readonly deleteConfiguration: DeleteConfigurationResponse;
  readonly deleteDevice: DeleteDeviceResponse;
  readonly deleteEvent: DeleteEventResponse;
  readonly deleteFeedItem: Scalars['Boolean']['output'];
  readonly deleteImage: DeleteImageResponse;
  readonly deleteMarathon: Scalars['Void']['output'];
  readonly deleteMarathonHour: Scalars['Void']['output'];
  readonly deleteNotification: DeleteNotificationResponse;
  readonly deletePerson: DeletePersonResponse;
  readonly deletePointEntry: DeletePointEntryResponse;
  readonly deletePointOpportunity: DeletePointOpportunityResponse;
  readonly deleteTeam: DeleteTeamResponse;
  readonly registerDevice: RegisterDeviceResponse;
  readonly removeImageFromEvent: RemoveEventImageResponse;
  readonly removeImageFromFeedItem: FeedResource;
  readonly removeMap: Scalars['Void']['output'];
  readonly scheduleNotification: ScheduleNotificationResponse;
  /** Send a notification immediately. */
  readonly sendNotification: SendNotificationResponse;
  readonly setEvent: SetEventResponse;
  readonly setFeedItem: FeedResource;
  readonly setImageAltText: ImageResource;
  readonly setImageUrl: ImageResource;
  readonly setMarathon: MarathonResource;
  readonly setMarathonHour: MarathonHourResource;
  readonly setPerson: GetPersonResponse;
  readonly setPointOpportunity: SinglePointOpportunityResponse;
  readonly setTeam: SingleTeamResponse;
  readonly stageNotification: StageNotificationResponse;
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


export type MutationAddMapArgs = {
  imageUuid: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
};


export type MutationAttachImageToFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
  imageUuid: Scalars['String']['input'];
};


export type MutationCreateConfigurationArgs = {
  input: CreateConfigurationInput;
};


export type MutationCreateConfigurationsArgs = {
  input: ReadonlyArray<CreateConfigurationInput>;
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


export type MutationDeleteFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
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


export type MutationRemoveImageFromFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
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


export type MutationSetFeedItemArgs = {
  feedItemUuid: Scalars['String']['input'];
  input: SetFeedInput;
};


export type MutationSetImageAltTextArgs = {
  alt: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
};


export type MutationSetImageUrlArgs = {
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
  readonly all?: InputMaybe<Scalars['Boolean']['input']>;
  readonly memberOfTeamType?: InputMaybe<TeamType>;
  readonly memberOfTeams?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  readonly users?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
};

/** The number of delivery issues for a notification, broken down by type. */
export type NotificationDeliveryIssueCount = {
  readonly __typename?: 'NotificationDeliveryIssueCount';
  readonly DeviceNotRegistered: Scalars['Int']['output'];
  readonly InvalidCredentials: Scalars['Int']['output'];
  readonly MessageRateExceeded: Scalars['Int']['output'];
  readonly MessageTooBig: Scalars['Int']['output'];
  readonly MismatchSenderId: Scalars['Int']['output'];
  readonly Unknown: Scalars['Int']['output'];
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type NotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationDeliveryResource = {
  readonly __typename?: 'NotificationDeliveryResource';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  readonly chunkUuid?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  readonly deliveryError?: Maybe<Scalars['String']['output']>;
  readonly notification: NotificationResource;
  /** The time the server received a delivery receipt from the user. */
  readonly receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  readonly sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly uuid: Scalars['ID']['output'];
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: NotificationResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['LuxonDateTime']['input'];
};

export type NotificationResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: NotificationResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type NotificationResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: NotificationResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
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
export type NotificationResource = {
  readonly __typename?: 'NotificationResource';
  readonly body: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryCount: Scalars['Int']['output'];
  readonly deliveryIssue?: Maybe<Scalars['String']['output']>;
  readonly deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryIssueCount: NotificationDeliveryIssueCount;
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
  readonly field: PersonResolverOneOfFilterKeys;
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
export type PersonResource = {
  readonly __typename?: 'PersonResource';
  /** @deprecated This is now provided on the AuthIdPair resource. */
  readonly authIds: ReadonlyArray<AuthIdPairResource>;
  /** @deprecated Use teams instead and filter by position */
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
  readonly field: PointOpportunityResolverOneOfFilterKeys;
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

export const PointOpportunityResolverOneOfFilterKeys = {
  Type: 'type'
} as const;

export type PointOpportunityResolverOneOfFilterKeys = typeof PointOpportunityResolverOneOfFilterKeys[keyof typeof PointOpportunityResolverOneOfFilterKeys];
export const PointOpportunityResolverStringFilterKeys = {
  Name: 'name'
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
  readonly activeConfiguration: GetConfigurationByUuidResponse;
  readonly allConfigurations: GetAllConfigurationsResponse;
  readonly currentMarathon?: Maybe<MarathonResource>;
  readonly currentMarathonHour?: Maybe<MarathonHourResource>;
  readonly device: GetDeviceByUuidResponse;
  readonly devices: ListDevicesResponse;
  readonly event: GetEventByUuidResponse;
  readonly events: ListEventsResponse;
  readonly feed: ReadonlyArray<FeedResource>;
  readonly image: GetImageByUuidResponse;
  readonly images: ListImagesResponse;
  readonly listPeople: ListPeopleResponse;
  readonly loginState: LoginState;
  readonly marathon: MarathonResource;
  readonly marathonForYear: MarathonResource;
  readonly marathonHour: MarathonHourResource;
  readonly marathons: ListMarathonsResponse;
  readonly me: GetPersonResponse;
  readonly nextMarathon?: Maybe<MarathonResource>;
  readonly notification: GetNotificationByUuidResponse;
  readonly notificationDeliveries: ListNotificationDeliveriesResponse;
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
};


export type QueryActiveConfigurationArgs = {
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
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<EventResolverKeyedStringFilterItem>>;
};


export type QueryFeedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryImageArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryImagesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<ImageResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<ImageResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<ImageResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<ImageResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<ImageResolverKeyedStringFilterItem>>;
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
  dateFilters?: InputMaybe<ReadonlyArray<MarathonResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<MarathonResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<Scalars['Void']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<Scalars['Void']['input']>;
};


export type QueryNotificationArgs = {
  uuid: Scalars['String']['input'];
};


export type QueryNotificationDeliveriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<NotificationDeliveryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<NotificationDeliveryResolverKeyedIsNullFilterItem>>;
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


export type QueryNotificationsArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<NotificationResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<NotificationResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
  oneOfFilters?: InputMaybe<ReadonlyArray<NotificationResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<NotificationResolverKeyedStringFilterItem>>;
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
  numericFilters?: InputMaybe<Scalars['Void']['input']>;
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

export type RegisterDeviceInput = {
  readonly deviceId: Scalars['String']['input'];
  /** The Expo push token of the device */
  readonly expoPushToken?: InputMaybe<Scalars['String']['input']>;
  /** The ID of the last user to log in on this device */
  readonly lastUserId?: InputMaybe<Scalars['String']['input']>;
  /** base64 encoded SHA-256 hash of a secret known to the device */
  readonly verifier: Scalars['String']['input'];
};

export type RegisterDeviceResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'RegisterDeviceResponse';
  readonly data: DeviceResource;
  readonly ok: Scalars['Boolean']['output'];
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
  readonly dbRole: DbRole;
};

export type RoleResourceInput = {
  readonly committeeIdentifier?: InputMaybe<CommitteeIdentifier>;
  readonly committeeRole?: InputMaybe<CommitteeRole>;
  readonly dbRole?: DbRole;
};

export type ScheduleNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ScheduleNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
};

export type SendNotificationResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SendNotificationResponse';
  readonly data: Scalars['Boolean']['output'];
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

export type SetFeedInput = {
  readonly textContent?: InputMaybe<Scalars['String']['input']>;
  readonly title: Scalars['String']['input'];
};

export type SetMarathonHourInput = {
  readonly details?: InputMaybe<Scalars['String']['input']>;
  readonly durationInfo: Scalars['String']['input'];
  readonly shownStartingAt: Scalars['DateTimeISO']['input'];
  readonly title: Scalars['String']['input'];
};

export type SetMarathonInput = {
  readonly endDate: Scalars['DateTimeISO']['input'];
  readonly startDate: Scalars['DateTimeISO']['input'];
  readonly year: Scalars['String']['input'];
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

export type StageNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'StageNotificationResponse';
  readonly data: NotificationResource;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { StringComparator };

export { TeamLegacyStatus };

export const TeamResolverAllKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Name: 'name',
  Type: 'type'
} as const;

export type TeamResolverAllKeys = typeof TeamResolverAllKeys[keyof typeof TeamResolverAllKeys];
export type TeamResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TeamResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: TeamResolverOneOfFilterKeys;
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

export const TeamResolverOneOfFilterKeys = {
  LegacyStatus: 'legacyStatus',
  MarathonYear: 'marathonYear',
  Type: 'type'
} as const;

export type TeamResolverOneOfFilterKeys = typeof TeamResolverOneOfFilterKeys[keyof typeof TeamResolverOneOfFilterKeys];
export const TeamResolverStringFilterKeys = {
  Name: 'name'
} as const;

export type TeamResolverStringFilterKeys = typeof TeamResolverStringFilterKeys[keyof typeof TeamResolverStringFilterKeys];
export type TeamResource = {
  readonly __typename?: 'TeamResource';
  /** @deprecated Just query the members field and filter by role */
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

export type ImageViewFragmentFragment = { readonly __typename?: 'ImageResource', readonly uuid: string, readonly url?: URL | string | null, readonly thumbHash?: string | null, readonly alt?: string | null, readonly width: number, readonly height: number, readonly mimeType: string } & { ' $fragmentName'?: 'ImageViewFragmentFragment' };

export type SimpleConfigFragment = { readonly __typename?: 'ConfigurationResource', readonly uuid: string, readonly key: string, readonly value: string } & { ' $fragmentName'?: 'SimpleConfigFragment' };

export type FullConfigFragment = (
  { readonly __typename?: 'ConfigurationResource', readonly validAfter?: string | null, readonly validUntil?: string | null, readonly createdAt?: Date | string | null }
  & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
) & { ' $fragmentName'?: 'FullConfigFragment' };

export type NotificationFragmentFragment = { readonly __typename?: 'NotificationResource', readonly uuid: string, readonly title: string, readonly body: string, readonly url?: URL | string | null } & { ' $fragmentName'?: 'NotificationFragmentFragment' };

export type NotificationDeliveryFragmentFragment = { readonly __typename?: 'NotificationDeliveryResource', readonly uuid: string, readonly sentAt?: Date | string | null, readonly notification: (
    { readonly __typename?: 'NotificationResource' }
    & { ' $fragmentRefs'?: { 'NotificationFragmentFragment': NotificationFragmentFragment } }
  ) } & { ' $fragmentName'?: 'NotificationDeliveryFragmentFragment' };

export type UseAllowedLoginTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type UseAllowedLoginTypesQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type MarathonTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonTimeQuery = { readonly __typename?: 'Query', readonly nextMarathon?: { readonly __typename?: 'MarathonResource', readonly startDate: Date | string, readonly endDate: Date | string } | null };

export type UseTabBarConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type UseTabBarConfigQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly linkblue?: string | null } | null } };

export type TriviaCrackQueryVariables = Exact<{ [key: string]: never; }>;


export type TriviaCrackQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationResource' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly team: { readonly __typename?: 'TeamResource', readonly type: TeamType, readonly name: string } }> } | null } };

export type AuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthStateQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string } | null }, readonly loginState: { readonly __typename?: 'LoginState', readonly loggedIn: boolean, readonly authSource: AuthSource, readonly role: { readonly __typename?: 'RoleResource', readonly dbRole: DbRole, readonly committeeIdentifier?: CommitteeIdentifier | null, readonly committeeRole?: CommitteeRole | null } } };

export type SetDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;


export type SetDeviceMutation = { readonly __typename?: 'Mutation', readonly registerDevice: { readonly __typename?: 'RegisterDeviceResponse', readonly ok: boolean } };

export type EventScreenFragmentFragment = { readonly __typename?: 'EventResource', readonly uuid: string, readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceResource', readonly uuid: string, readonly interval: string, readonly fullDay: boolean }>, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageResource', readonly thumbHash?: string | null, readonly url?: URL | string | null, readonly height: number, readonly width: number, readonly alt?: string | null, readonly mimeType: string }> } & { ' $fragmentName'?: 'EventScreenFragmentFragment' };

export type DeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier: Scalars['String']['input'];
}>;


export type DeviceNotificationsQuery = { readonly __typename?: 'Query', readonly device: { readonly __typename?: 'GetDeviceByUuidResponse', readonly data: { readonly __typename?: 'DeviceResource', readonly notificationDeliveries: ReadonlyArray<(
        { readonly __typename?: 'NotificationDeliveryResource' }
        & { ' $fragmentRefs'?: { 'NotificationDeliveryFragmentFragment': NotificationDeliveryFragmentFragment } }
      )> } } };

export type ProfileScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly authSource: AuthSource, readonly role: { readonly __typename?: 'RoleResource', readonly committeeIdentifier?: CommitteeIdentifier | null, readonly committeeRole?: CommitteeRole | null, readonly dbRole: DbRole } } & { ' $fragmentName'?: 'ProfileScreenAuthFragmentFragment' };

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

export type EventsQueryVariables = Exact<{
  earliestTimestamp: Scalars['LuxonDateTime']['input'];
  lastTimestamp: Scalars['LuxonDateTime']['input'];
}>;


export type EventsQuery = { readonly __typename?: 'Query', readonly events: { readonly __typename?: 'ListEventsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'EventResource' }
      & { ' $fragmentRefs'?: { 'EventScreenFragmentFragment': EventScreenFragmentFragment } }
    )> } };

export type ServerFeedQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerFeedQuery = { readonly __typename?: 'Query', readonly feed: ReadonlyArray<{ readonly __typename?: 'FeedResource', readonly uuid: string, readonly title: string, readonly createdAt?: Date | string | null, readonly textContent?: string | null, readonly image?: { readonly __typename?: 'ImageResource', readonly url?: URL | string | null, readonly alt?: string | null, readonly width: number, readonly height: number, readonly thumbHash?: string | null } | null }> };

export type HourScreenFragmentFragment = { readonly __typename?: 'MarathonHourResource', readonly uuid: string, readonly title: string, readonly details?: string | null, readonly durationInfo: string, readonly mapImages: ReadonlyArray<(
    { readonly __typename?: 'ImageResource' }
    & { ' $fragmentRefs'?: { 'ImageViewFragmentFragment': ImageViewFragmentFragment } }
  )> } & { ' $fragmentName'?: 'HourScreenFragmentFragment' };

export type MarathonScreenQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonScreenQuery = { readonly __typename?: 'Query', readonly currentMarathonHour?: (
    { readonly __typename?: 'MarathonHourResource' }
    & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
  ) | null, readonly nextMarathon?: { readonly __typename?: 'MarathonResource', readonly startDate: Date | string, readonly endDate: Date | string, readonly hours: ReadonlyArray<(
      { readonly __typename?: 'MarathonHourResource' }
      & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
    )> } | null };

export type ScoreBoardFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly totalPoints: number, readonly legacyStatus: TeamLegacyStatus, readonly type: TeamType } & { ' $fragmentName'?: 'ScoreBoardFragmentFragment' };

export type HighlightedTeamFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly legacyStatus: TeamLegacyStatus, readonly type: TeamType } & { ' $fragmentName'?: 'HighlightedTeamFragmentFragment' };

export type ScoreBoardDocumentQueryVariables = Exact<{
  type?: InputMaybe<ReadonlyArray<TeamType> | TeamType>;
}>;


export type ScoreBoardDocumentQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly team: (
          { readonly __typename?: 'TeamResource' }
          & { ' $fragmentRefs'?: { 'HighlightedTeamFragmentFragment': HighlightedTeamFragmentFragment;'MyTeamFragmentFragment': MyTeamFragmentFragment } }
        ) }> } | null }, readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamResource' }
      & { ' $fragmentRefs'?: { 'ScoreBoardFragmentFragment': ScoreBoardFragmentFragment } }
    )> } };

export type ActiveMarathonDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMarathonDocumentQuery = { readonly __typename?: 'Query', readonly currentMarathon?: { readonly __typename?: 'MarathonResource', readonly uuid: string } | null };

export type MyTeamFragmentFragment = { readonly __typename?: 'TeamResource', readonly uuid: string, readonly name: string, readonly totalPoints: number, readonly pointEntries: ReadonlyArray<{ readonly __typename?: 'PointEntryResource', readonly points: number, readonly personFrom?: { readonly __typename?: 'PersonResource', readonly uuid: string, readonly name?: string | null, readonly linkblue?: string | null } | null }>, readonly members: ReadonlyArray<{ readonly __typename?: 'MembershipResource', readonly position: MembershipPositionType, readonly person: { readonly __typename?: 'PersonResource', readonly linkblue?: string | null, readonly name?: string | null } }> } & { ' $fragmentName'?: 'MyTeamFragmentFragment' };

export const SimpleConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<SimpleConfigFragment, unknown>;
export const FullConfigFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FullConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}},{"kind":"Field","name":{"kind":"Name","value":"validAfter"}},{"kind":"Field","name":{"kind":"Name","value":"validUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<FullConfigFragment, unknown>;
export const NotificationFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationFragmentFragment, unknown>;
export const NotificationDeliveryFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]} as unknown as DocumentNode<NotificationDeliveryFragmentFragment, unknown>;
export const EventScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventScreenFragmentFragment, unknown>;
export const ProfileScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]} as unknown as DocumentNode<ProfileScreenAuthFragmentFragment, unknown>;
export const ProfileScreenUserFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ProfileScreenUserFragmentFragment, unknown>;
export const RootScreenAuthFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}}]} as unknown as DocumentNode<RootScreenAuthFragmentFragment, unknown>;
export const ImageViewFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<ImageViewFragmentFragment, unknown>;
export const HourScreenFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]} as unknown as DocumentNode<HourScreenFragmentFragment, unknown>;
export const ScoreBoardFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardFragmentFragment, unknown>;
export const HighlightedTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<HighlightedTeamFragmentFragment, unknown>;
export const MyTeamFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<MyTeamFragmentFragment, unknown>;
export const UseAllowedLoginTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useAllowedLoginTypes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"ALLOWED_LOGIN_TYPES","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseAllowedLoginTypesQuery, UseAllowedLoginTypesQueryVariables>;
export const MarathonTimeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonTime"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]} as unknown as DocumentNode<MarathonTimeQuery, MarathonTimeQueryVariables>;
export const UseTabBarConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useTabBarConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TAB_BAR_CONFIG","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseTabBarConfigQuery, UseTabBarConfigQueryVariables>;
export const TriviaCrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TriviaCrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TRIVIA_CRACK","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<TriviaCrackQuery, TriviaCrackQueryVariables>;
export const AuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]}}]} as unknown as DocumentNode<AuthStateQuery, AuthStateQueryVariables>;
export const SetDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SetDeviceMutation, SetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeviceNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveryFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}}]} as unknown as DocumentNode<DeviceNotificationsQuery, DeviceNotificationsQueryVariables>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"committeeIdentifier"}},{"kind":"Field","name":{"kind":"Name","value":"committeeRole"}},{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RootScreenDocumentQuery, RootScreenDocumentQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LuxonDateTime"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"GREATER_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"LESS_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"EnumValue","value":"ASCENDING"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"StringValue","value":"occurrence","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const ServerFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerFeed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}}]}}]}}]}}]} as unknown as DocumentNode<ServerFeedQuery, ServerFeedQueryVariables>;
export const MarathonScreenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonScreen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathonHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}}]} as unknown as DocumentNode<MarathonScreenQuery, MarathonScreenQueryVariables>;
export const ScoreBoardDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScoreBoardDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HighlightedTeamFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyTeamFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"totalPoints","block":false},{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"DESCENDING"},{"kind":"EnumValue","value":"ASCENDING"}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScoreBoardFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamResource"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardDocumentQuery, ScoreBoardDocumentQueryVariables>;
export const ActiveMarathonDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveMarathonDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]}}]} as unknown as DocumentNode<ActiveMarathonDocumentQuery, ActiveMarathonDocumentQueryVariables>;