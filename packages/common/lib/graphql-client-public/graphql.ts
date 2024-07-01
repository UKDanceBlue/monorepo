/* eslint-disable */
import type { AuthSource } from '../index.js';
import type { DbRole } from '../index.js';
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
  readonly data: ImageNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type AssignEntryToPersonInput = {
  readonly amount: Scalars['Float']['input'];
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
  OverallCommittee: 'overallCommittee',
  ProgrammingCommittee: 'programmingCommittee',
  TechCommittee: 'techCommittee',
  ViceCommittee: 'viceCommittee'
} as const;

export type CommitteeIdentifier = typeof CommitteeIdentifier[keyof typeof CommitteeIdentifier];
export type CommitteeMembershipNode = Node & {
  readonly __typename?: 'CommitteeMembershipNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly identifier: CommitteeIdentifier;
  readonly person: PersonNode;
  readonly position: MembershipPositionType;
  readonly role: CommitteeRole;
  readonly team: TeamNode;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type CommitteeNode = Node & {
  readonly __typename?: 'CommitteeNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly identifier: CommitteeIdentifier;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

/** Roles within a committee */
export const CommitteeRole = {
  Chair: 'Chair',
  Coordinator: 'Coordinator',
  Member: 'Member'
} as const;

export type CommitteeRole = typeof CommitteeRole[keyof typeof CommitteeRole];
export type ConfigurationNode = Node & {
  readonly __typename?: 'ConfigurationNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly key: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly validAfter?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly validUntil?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly value: Scalars['String']['output'];
};

export type CreateConfigurationInput = {
  readonly key: Scalars['String']['input'];
  readonly validAfter?: InputMaybe<Scalars['DateTimeISO']['input']>;
  readonly validUntil?: InputMaybe<Scalars['DateTimeISO']['input']>;
  readonly value: Scalars['String']['input'];
};

export type CreateConfigurationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateConfigurationResponse';
  readonly data: ConfigurationNode;
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
  readonly interval: IntervalIsoInput;
};

export type CreateEventResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateEventResponse';
  readonly data: EventNode;
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
  readonly dbRole?: InputMaybe<DbRole>;
  readonly email: Scalars['EmailAddress']['input'];
  readonly linkblue?: InputMaybe<Scalars['String']['input']>;
  readonly memberOf?: ReadonlyArray<Scalars['String']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePersonResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePersonResponse';
  readonly data: PersonNode;
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
  readonly data: PointEntryNode;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreatePointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name: Scalars['String']['input'];
  readonly opportunityDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  readonly type: TeamType;
};

export type CreatePointOpportunityResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreatePointOpportunityResponse';
  readonly data: PointOpportunityNode;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type CreateTeamInput = {
  readonly legacyStatus: TeamLegacyStatus;
  readonly name: Scalars['String']['input'];
  readonly type: TeamType;
};

export type CreateTeamResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'CreateTeamResponse';
  readonly data: TeamNode;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export type DbFundsTeamInfo = Node & {
  readonly __typename?: 'DbFundsTeamInfo';
  readonly dbNum: Scalars['Int']['output'];
  readonly id: Scalars['GlobalId']['output'];
  readonly name: Scalars['String']['output'];
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

export type DeviceNode = Node & {
  readonly __typename?: 'DeviceNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly lastLoggedInUser?: Maybe<PersonNode>;
  readonly lastLogin?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly notificationDeliveries: ReadonlyArray<NotificationDeliveryNode>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: DeviceResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['DateTimeISO']['input'];
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
export type EffectiveCommitteeRole = {
  readonly __typename?: 'EffectiveCommitteeRole';
  readonly identifier: CommitteeIdentifier;
  readonly role: CommitteeRole;
};

export type EventNode = Node & {
  readonly __typename?: 'EventNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly description?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly images: ReadonlyArray<ImageNode>;
  readonly location?: Maybe<Scalars['String']['output']>;
  readonly occurrences: ReadonlyArray<EventOccurrenceNode>;
  readonly summary?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type EventOccurrenceNode = {
  readonly __typename?: 'EventOccurrenceNode';
  readonly fullDay: Scalars['Boolean']['output'];
  readonly id: Scalars['ID']['output'];
  readonly interval: IntervalIso;
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
  readonly value: Scalars['DateTimeISO']['input'];
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
export type FeedNode = Node & {
  readonly __typename?: 'FeedNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly image?: Maybe<ImageNode>;
  readonly textContent?: Maybe<Scalars['String']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type FundraisingAssignmentNode = Node & {
  readonly __typename?: 'FundraisingAssignmentNode';
  readonly amount: Scalars['Float']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly entry: FundraisingEntryNode;
  readonly id: Scalars['GlobalId']['output'];
  /** The person assigned to this assignment, only null when access is denied */
  readonly person?: Maybe<PersonNode>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type FundraisingEntryNode = Node & {
  readonly __typename?: 'FundraisingEntryNode';
  readonly amount: Scalars['Float']['output'];
  readonly assignments: ReadonlyArray<FundraisingAssignmentNode>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly donatedByText?: Maybe<Scalars['String']['output']>;
  readonly donatedOn: Scalars['DateTimeISO']['output'];
  readonly donatedToText?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export const FundraisingEntryResolverAllKeys = {
  Amount: 'amount',
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
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverDateFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['DateTimeISO']['input'];
};

export type FundraisingEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type FundraisingEntryResolverKeyedNumericFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: NumericComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverNumericFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['Float']['input'];
};

export type FundraisingEntryResolverKeyedOneOfFilterItem = {
  /** The field to filter on */
  readonly field: FundraisingEntryResolverOneOfFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: ReadonlyArray<Scalars['String']['input']>;
};

export type FundraisingEntryResolverKeyedStringFilterItem = {
  /** The comparator to use for the filter */
  readonly comparison: StringComparator;
  /** The field to filter on */
  readonly field: FundraisingEntryResolverStringFilterKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
  readonly value: Scalars['String']['input'];
};

export const FundraisingEntryResolverNumericFilterKeys = {
  Amount: 'amount'
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
  readonly __typename?: 'GetAllConfigurationsResponse';
  readonly data: ReadonlyArray<ConfigurationNode>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetConfigurationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetConfigurationByUuidResponse';
  readonly data: ConfigurationNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetDeviceByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetDeviceByUuidResponse';
  readonly data: DeviceNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetEventByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetEventByUuidResponse';
  readonly data: EventNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetImageByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetImageByUuidResponse';
  readonly data: ImageNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetMembershipResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetMembershipResponse';
  readonly data?: Maybe<MembershipNode>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetNotificationByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetNotificationByUuidResponse';
  readonly data: NotificationNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPeopleResponse = AbstractGraphQlArrayOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPeopleResponse';
  readonly data: ReadonlyArray<PersonNode>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPersonResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPersonResponse';
  readonly data?: Maybe<PersonNode>;
  readonly ok: Scalars['Boolean']['output'];
};

export type GetPointEntryByUuidResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'GetPointEntryByUuidResponse';
  readonly data: PointEntryNode;
  readonly ok: Scalars['Boolean']['output'];
};

/** API response */
export type GraphQlBaseResponse = {
  readonly ok: Scalars['Boolean']['output'];
};

export type ImageNode = Node & {
  readonly __typename?: 'ImageNode';
  readonly alt?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly height: Scalars['Int']['output'];
  readonly id: Scalars['GlobalId']['output'];
  readonly mimeType: Scalars['String']['output'];
  readonly thumbHash?: Maybe<Scalars['String']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly url?: Maybe<Scalars['URL']['output']>;
  readonly width: Scalars['Int']['output'];
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
  readonly value: Scalars['DateTimeISO']['input'];
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
export type IntervalIso = {
  readonly __typename?: 'IntervalISO';
  readonly end: Scalars['DateTimeISO']['output'];
  readonly start: Scalars['DateTimeISO']['output'];
};

export type IntervalIsoInput = {
  readonly end: Scalars['DateTimeISO']['input'];
  readonly start: Scalars['DateTimeISO']['input'];
};

export type ListDevicesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListDevicesResponse';
  readonly data: ReadonlyArray<DeviceNode>;
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
  readonly data: ReadonlyArray<EventNode>;
  readonly ok: Scalars['Boolean']['output'];
  /** The current page number (1-indexed) */
  readonly page: Scalars['PositiveInt']['output'];
  /** The number of items per page */
  readonly pageSize: Scalars['NonNegativeInt']['output'];
  /** The total number of items */
  readonly total: Scalars['NonNegativeInt']['output'];
};

export type ListFundraisingEntriesResponse = AbstractGraphQlArrayOkResponse & AbstractGraphQlPaginatedResponse & GraphQlBaseResponse & {
  readonly __typename?: 'ListFundraisingEntriesResponse';
  readonly data: ReadonlyArray<FundraisingEntryNode>;
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
  readonly data: ReadonlyArray<ImageNode>;
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
  readonly data: ReadonlyArray<MarathonNode>;
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
  readonly data: ReadonlyArray<NotificationDeliveryNode>;
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
  readonly data: ReadonlyArray<NotificationNode>;
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
  readonly data: ReadonlyArray<PersonNode>;
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
  readonly data: ReadonlyArray<PointEntryNode>;
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
  readonly data: ReadonlyArray<PointOpportunityNode>;
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
  readonly data: ReadonlyArray<TeamNode>;
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
  readonly dbRole: DbRole;
  readonly effectiveCommitteeRoles: ReadonlyArray<EffectiveCommitteeRole>;
  readonly loggedIn: Scalars['Boolean']['output'];
};

export type MarathonHourNode = Node & {
  readonly __typename?: 'MarathonHourNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly details?: Maybe<Scalars['String']['output']>;
  readonly durationInfo: Scalars['String']['output'];
  readonly id: Scalars['GlobalId']['output'];
  readonly mapImages: ReadonlyArray<ImageNode>;
  readonly shownStartingAt: Scalars['DateTimeISO']['output'];
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type MarathonNode = Node & {
  readonly __typename?: 'MarathonNode';
  readonly communityDevelopmentCommitteeTeam: TeamNode;
  readonly corporateCommitteeTeam: TeamNode;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly dancerRelationsCommitteeTeam: TeamNode;
  readonly endDate?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly familyRelationsCommitteeTeam: TeamNode;
  readonly fundraisingCommitteeTeam: TeamNode;
  readonly hours: ReadonlyArray<MarathonHourNode>;
  readonly id: Scalars['GlobalId']['output'];
  readonly marketingCommitteeTeam: TeamNode;
  readonly miniMarathonsCommitteeTeam: TeamNode;
  readonly operationsCommitteeTeam: TeamNode;
  readonly overallCommitteeTeam: TeamNode;
  readonly programmingCommitteeTeam: TeamNode;
  readonly startDate?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly techCommitteeTeam: TeamNode;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly viceCommitteeTeam: TeamNode;
  readonly year: Scalars['String']['output'];
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
  readonly value: Scalars['DateTimeISO']['input'];
};

export type MarathonResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: MarathonResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MembershipNode = Node & {
  readonly __typename?: 'MembershipNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly person: PersonNode;
  readonly position: MembershipPositionType;
  readonly team: TeamNode;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

export { MembershipPositionType };

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly abortScheduledNotification: AbortScheduledNotificationResponse;
  readonly acknowledgeDeliveryIssue: AcknowledgeDeliveryIssueResponse;
  readonly addExistingImageToEvent: AddEventImageResponse;
  readonly addMap: MarathonHourNode;
  readonly addPersonToTeam: GetMembershipResponse;
  readonly assignEntryToPerson: FundraisingAssignmentNode;
  readonly assignTeamToDbFundsTeam: Scalars['Void']['output'];
  readonly attachImageToFeedItem: FeedNode;
  readonly createConfiguration: CreateConfigurationResponse;
  readonly createConfigurations: CreateConfigurationResponse;
  readonly createEvent: CreateEventResponse;
  readonly createFeedItem: FeedNode;
  readonly createImage: ImageNode;
  readonly createMarathon: MarathonNode;
  readonly createMarathonHour: MarathonHourNode;
  readonly createPerson: CreatePersonResponse;
  readonly createPointEntry: CreatePointEntryResponse;
  readonly createPointOpportunity: CreatePointOpportunityResponse;
  readonly createTeam: CreateTeamResponse;
  readonly deleteConfiguration: DeleteConfigurationResponse;
  readonly deleteDevice: DeleteDeviceResponse;
  readonly deleteEvent: DeleteEventResponse;
  readonly deleteFeedItem: Scalars['Boolean']['output'];
  readonly deleteFundraisingAssignment: FundraisingAssignmentNode;
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
  readonly removeImageFromFeedItem: FeedNode;
  readonly removeMap: Scalars['Void']['output'];
  readonly scheduleNotification: ScheduleNotificationResponse;
  /** Send a notification immediately. */
  readonly sendNotification: SendNotificationResponse;
  readonly setEvent: SetEventResponse;
  readonly setFeedItem: FeedNode;
  readonly setImageAltText: ImageNode;
  readonly setImageUrl: ImageNode;
  readonly setMarathon: MarathonNode;
  readonly setMarathonHour: MarathonHourNode;
  readonly setPerson: GetPersonResponse;
  readonly setPointOpportunity: SinglePointOpportunityResponse;
  readonly setTeam: SingleTeamResponse;
  readonly stageNotification: StageNotificationResponse;
  readonly updateFundraisingAssignment: FundraisingAssignmentNode;
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
  readonly id: Scalars['GlobalId']['output'];
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

export type NotificationDeliveryNode = Node & {
  readonly __typename?: 'NotificationDeliveryNode';
  /** A unique identifier corresponding the group of notifications this was sent to Expo with. */
  readonly chunkUuid?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Any error message returned by Expo when sending the notification. */
  readonly deliveryError?: Maybe<Scalars['String']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly notification: NotificationNode;
  /** The time the server received a delivery receipt from the user. */
  readonly receiptCheckedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server sent the notification to Expo for delivery. */
  readonly sentAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  readonly value: Scalars['DateTimeISO']['input'];
};

export type NotificationDeliveryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: NotificationDeliveryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NotificationNode = Node & {
  readonly __typename?: 'NotificationNode';
  readonly body: Scalars['String']['output'];
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryCount: Scalars['Int']['output'];
  readonly deliveryIssue?: Maybe<Scalars['String']['output']>;
  readonly deliveryIssueAcknowledgedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly deliveryIssueCount: NotificationDeliveryIssueCount;
  readonly id: Scalars['GlobalId']['output'];
  /** The time the notification is scheduled to be sent, if null it is either already sent or unscheduled. */
  readonly sendAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** The time the server started sending the notification. */
  readonly startedSendingAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly title: Scalars['String']['output'];
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly url?: Maybe<Scalars['URL']['output']>;
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
  readonly value: Scalars['DateTimeISO']['input'];
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
export { NumericComparator };

export type PersonNode = Node & {
  readonly __typename?: 'PersonNode';
  readonly assignedDonationEntries?: Maybe<CommitteeMembershipNode>;
  readonly committees: ReadonlyArray<CommitteeMembershipNode>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly dbRole: DbRole;
  readonly email: Scalars['String']['output'];
  readonly fundraisingAssignments: ReadonlyArray<FundraisingAssignmentNode>;
  readonly id: Scalars['GlobalId']['output'];
  readonly linkblue?: Maybe<Scalars['String']['output']>;
  readonly moraleTeams: ReadonlyArray<MembershipNode>;
  readonly name?: Maybe<Scalars['String']['output']>;
  readonly primaryCommittee?: Maybe<CommitteeMembershipNode>;
  readonly teams: ReadonlyArray<MembershipNode>;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type PersonNodeAssignedDonationEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedStringFilterItem>>;
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
export type PointEntryNode = Node & {
  readonly __typename?: 'PointEntryNode';
  readonly comment?: Maybe<Scalars['String']['output']>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly id: Scalars['GlobalId']['output'];
  readonly personFrom?: Maybe<PersonNode>;
  readonly pointOpportunity?: Maybe<PointOpportunityNode>;
  readonly points: Scalars['Int']['output'];
  readonly team: TeamNode;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  readonly value: Scalars['DateTimeISO']['input'];
};

export type PointEntryResolverKeyedIsNullFilterItem = {
  /** The field to filter on */
  readonly field: PointEntryResolverAllKeys;
  /** Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation. */
  readonly negate?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PointOpportunityNode = Node & {
  readonly __typename?: 'PointOpportunityNode';
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly event?: Maybe<EventNode>;
  readonly id: Scalars['GlobalId']['output'];
  readonly name: Scalars['String']['output'];
  readonly opportunityDate?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  readonly value: Scalars['DateTimeISO']['input'];
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
export type Query = {
  readonly __typename?: 'Query';
  readonly activeConfiguration: GetConfigurationByUuidResponse;
  readonly allConfigurations: GetAllConfigurationsResponse;
  readonly configuration: GetConfigurationByUuidResponse;
  readonly currentMarathon?: Maybe<MarathonNode>;
  readonly currentMarathonHour?: Maybe<MarathonHourNode>;
  readonly dbFundsTeams: ReadonlyArray<DbFundsTeamInfo>;
  readonly device: GetDeviceByUuidResponse;
  readonly devices: ListDevicesResponse;
  readonly event: GetEventByUuidResponse;
  readonly events: ListEventsResponse;
  readonly feed: ReadonlyArray<FeedNode>;
  readonly fundraisingAssignment: FundraisingAssignmentNode;
  readonly fundraisingEntries: ListFundraisingEntriesResponse;
  readonly fundraisingEntry: FundraisingEntryNode;
  readonly image: GetImageByUuidResponse;
  readonly images: ListImagesResponse;
  readonly latestMarathon?: Maybe<MarathonNode>;
  readonly listPeople: ListPeopleResponse;
  readonly loginState: LoginState;
  readonly marathon: MarathonNode;
  readonly marathonForYear: MarathonNode;
  readonly marathonHour: MarathonHourNode;
  readonly marathons: ListMarathonsResponse;
  readonly me: GetPersonResponse;
  readonly node: Node;
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
  uuid: Scalars['GlobalId']['input'];
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


export type QueryFundraisingAssignmentArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryFundraisingEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedStringFilterItem>>;
};


export type QueryFundraisingEntryArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryImageArgs = {
  uuid: Scalars['GlobalId']['input'];
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


export type QueryNodeArgs = {
  id: Scalars['GlobalId']['input'];
};


export type QueryNotificationArgs = {
  uuid: Scalars['GlobalId']['input'];
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
  uuid: Scalars['GlobalId']['input'];
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
  uuid: Scalars['GlobalId']['input'];
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
  isNullFilters?: InputMaybe<ReadonlyArray<TeamResolverKeyedIsNullFilterItem>>;
  legacyStatus?: InputMaybe<ReadonlyArray<TeamLegacyStatus>>;
  marathonId?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
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
  readonly data: DeviceNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type RemoveEventImageResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'RemoveEventImageResponse';
  readonly data: Scalars['Boolean']['output'];
  readonly ok: Scalars['Boolean']['output'];
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
  readonly interval: IntervalIsoInput;
  /** If updating an existing occurrence, the UUID of the occurrence to update */
  readonly uuid?: InputMaybe<Scalars['String']['input']>;
};

export type SetEventResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SetEventResponse';
  readonly data: EventNode;
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
};

export type SetPointOpportunityInput = {
  readonly eventUuid?: InputMaybe<Scalars['ID']['input']>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly opportunityDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type SetTeamInput = {
  readonly legacyStatus?: InputMaybe<TeamLegacyStatus>;
  readonly name?: InputMaybe<Scalars['String']['input']>;
  readonly persistentIdentifier?: InputMaybe<Scalars['String']['input']>;
  readonly type?: InputMaybe<TeamType>;
};

export type SinglePointOpportunityResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SinglePointOpportunityResponse';
  readonly data: PointOpportunityNode;
  readonly ok: Scalars['Boolean']['output'];
};

export type SingleTeamResponse = AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'SingleTeamResponse';
  readonly data: TeamNode;
  readonly ok: Scalars['Boolean']['output'];
};

export { SortDirection };

export type StageNotificationResponse = AbstractGraphQlCreatedResponse & AbstractGraphQlOkResponse & GraphQlBaseResponse & {
  readonly __typename?: 'StageNotificationResponse';
  readonly data: NotificationNode;
  readonly ok: Scalars['Boolean']['output'];
  readonly uuid: Scalars['String']['output'];
};

export { StringComparator };

export { TeamLegacyStatus };

export type TeamNode = Node & {
  readonly __typename?: 'TeamNode';
  /** @deprecated Just query the members field and filter by role */
  readonly captains: ReadonlyArray<MembershipNode>;
  readonly createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  readonly fundraisingEntries: ListFundraisingEntriesResponse;
  readonly id: Scalars['GlobalId']['output'];
  readonly legacyStatus: TeamLegacyStatus;
  readonly marathon: MarathonNode;
  readonly members: ReadonlyArray<MembershipNode>;
  readonly name: Scalars['String']['output'];
  readonly pointEntries: ReadonlyArray<PointEntryNode>;
  readonly totalPoints: Scalars['Int']['output'];
  readonly type: TeamType;
  readonly updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};


export type TeamNodeFundraisingEntriesArgs = {
  booleanFilters?: InputMaybe<Scalars['Void']['input']>;
  dateFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedDateFilterItem>>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  isNullFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedIsNullFilterItem>>;
  numericFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedNumericFilterItem>>;
  oneOfFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedOneOfFilterItem>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  sendAll?: InputMaybe<Scalars['Boolean']['input']>;
  sortBy?: InputMaybe<ReadonlyArray<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<ReadonlyArray<SortDirection>>;
  stringFilters?: InputMaybe<ReadonlyArray<FundraisingEntryResolverKeyedStringFilterItem>>;
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
  readonly amount: Scalars['Float']['input'];
};

export type ImageViewFragmentFragment = { readonly __typename?: 'ImageNode', readonly id: string, readonly url?: URL | string | null, readonly thumbHash?: string | null, readonly alt?: string | null, readonly width: number, readonly height: number, readonly mimeType: string } & { ' $fragmentName'?: 'ImageViewFragmentFragment' };

export type SimpleConfigFragment = { readonly __typename?: 'ConfigurationNode', readonly id: string, readonly key: string, readonly value: string } & { ' $fragmentName'?: 'SimpleConfigFragment' };

export type FullConfigFragment = (
  { readonly __typename?: 'ConfigurationNode', readonly validAfter?: Date | string | null, readonly validUntil?: Date | string | null, readonly createdAt?: Date | string | null }
  & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
) & { ' $fragmentName'?: 'FullConfigFragment' };

export type NotificationFragmentFragment = { readonly __typename?: 'NotificationNode', readonly id: string, readonly title: string, readonly body: string, readonly url?: URL | string | null } & { ' $fragmentName'?: 'NotificationFragmentFragment' };

export type NotificationDeliveryFragmentFragment = { readonly __typename?: 'NotificationDeliveryNode', readonly id: string, readonly sentAt?: Date | string | null, readonly notification: (
    { readonly __typename?: 'NotificationNode' }
    & { ' $fragmentRefs'?: { 'NotificationFragmentFragment': NotificationFragmentFragment } }
  ) } & { ' $fragmentName'?: 'NotificationDeliveryFragmentFragment' };

export type UseAllowedLoginTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type UseAllowedLoginTypesQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) } };

export type MarathonTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonTimeQuery = { readonly __typename?: 'Query', readonly latestMarathon?: { readonly __typename?: 'MarathonNode', readonly startDate?: Date | string | null, readonly endDate?: Date | string | null } | null };

export type UseTabBarConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type UseTabBarConfigQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonNode', readonly linkblue?: string | null } | null } };

export type TriviaCrackQueryVariables = Exact<{ [key: string]: never; }>;


export type TriviaCrackQuery = { readonly __typename?: 'Query', readonly activeConfiguration: { readonly __typename?: 'GetConfigurationByUuidResponse', readonly data: (
      { readonly __typename?: 'ConfigurationNode' }
      & { ' $fragmentRefs'?: { 'SimpleConfigFragment': SimpleConfigFragment } }
    ) }, readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonNode', readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipNode', readonly team: { readonly __typename?: 'TeamNode', readonly type: TeamType, readonly name: string } }> } | null } };

export type AuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthStateQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonNode', readonly id: string } | null }, readonly loginState: { readonly __typename?: 'LoginState', readonly dbRole: DbRole, readonly loggedIn: boolean, readonly authSource: AuthSource } };

export type SetDeviceMutationVariables = Exact<{
  input: RegisterDeviceInput;
}>;


export type SetDeviceMutation = { readonly __typename?: 'Mutation', readonly registerDevice: { readonly __typename?: 'RegisterDeviceResponse', readonly ok: boolean } };

export type EventScreenFragmentFragment = { readonly __typename?: 'EventNode', readonly id: string, readonly title: string, readonly summary?: string | null, readonly description?: string | null, readonly location?: string | null, readonly occurrences: ReadonlyArray<{ readonly __typename?: 'EventOccurrenceNode', readonly id: string, readonly fullDay: boolean, readonly interval: { readonly __typename?: 'IntervalISO', readonly start: Date | string, readonly end: Date | string } }>, readonly images: ReadonlyArray<{ readonly __typename?: 'ImageNode', readonly thumbHash?: string | null, readonly url?: URL | string | null, readonly height: number, readonly width: number, readonly alt?: string | null, readonly mimeType: string }> } & { ' $fragmentName'?: 'EventScreenFragmentFragment' };

export type DeviceNotificationsQueryVariables = Exact<{
  deviceUuid: Scalars['GlobalId']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  verifier: Scalars['String']['input'];
}>;


export type DeviceNotificationsQuery = { readonly __typename?: 'Query', readonly device: { readonly __typename?: 'GetDeviceByUuidResponse', readonly data: { readonly __typename?: 'DeviceNode', readonly notificationDeliveries: ReadonlyArray<(
        { readonly __typename?: 'NotificationDeliveryNode' }
        & { ' $fragmentRefs'?: { 'NotificationDeliveryFragmentFragment': NotificationDeliveryFragmentFragment } }
      )> } } };

export type ProfileScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly dbRole: DbRole, readonly authSource: AuthSource } & { ' $fragmentName'?: 'ProfileScreenAuthFragmentFragment' };

export type ProfileScreenUserFragmentFragment = { readonly __typename?: 'PersonNode', readonly name?: string | null, readonly linkblue?: string | null, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipNode', readonly position: MembershipPositionType, readonly team: { readonly __typename?: 'TeamNode', readonly name: string } }>, readonly primaryCommittee?: { readonly __typename?: 'CommitteeMembershipNode', readonly identifier: CommitteeIdentifier, readonly role: CommitteeRole } | null } & { ' $fragmentName'?: 'ProfileScreenUserFragmentFragment' };

export type RootScreenDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type RootScreenDocumentQuery = { readonly __typename?: 'Query', readonly loginState: (
    { readonly __typename?: 'LoginState' }
    & { ' $fragmentRefs'?: { 'ProfileScreenAuthFragmentFragment': ProfileScreenAuthFragmentFragment;'RootScreenAuthFragmentFragment': RootScreenAuthFragmentFragment } }
  ), readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: (
      { readonly __typename?: 'PersonNode' }
      & { ' $fragmentRefs'?: { 'ProfileScreenUserFragmentFragment': ProfileScreenUserFragmentFragment } }
    ) | null } };

export type RootScreenAuthFragmentFragment = { readonly __typename?: 'LoginState', readonly dbRole: DbRole } & { ' $fragmentName'?: 'RootScreenAuthFragmentFragment' };

export type EventsQueryVariables = Exact<{
  earliestTimestamp: Scalars['DateTimeISO']['input'];
  lastTimestamp: Scalars['DateTimeISO']['input'];
}>;


export type EventsQuery = { readonly __typename?: 'Query', readonly events: { readonly __typename?: 'ListEventsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'EventNode' }
      & { ' $fragmentRefs'?: { 'EventScreenFragmentFragment': EventScreenFragmentFragment } }
    )> } };

export type ServerFeedQueryVariables = Exact<{ [key: string]: never; }>;


export type ServerFeedQuery = { readonly __typename?: 'Query', readonly feed: ReadonlyArray<{ readonly __typename?: 'FeedNode', readonly id: string, readonly title: string, readonly createdAt?: Date | string | null, readonly textContent?: string | null, readonly image?: { readonly __typename?: 'ImageNode', readonly url?: URL | string | null, readonly alt?: string | null, readonly width: number, readonly height: number, readonly thumbHash?: string | null } | null }> };

export type HourScreenFragmentFragment = { readonly __typename?: 'MarathonHourNode', readonly id: string, readonly title: string, readonly details?: string | null, readonly durationInfo: string, readonly mapImages: ReadonlyArray<(
    { readonly __typename?: 'ImageNode' }
    & { ' $fragmentRefs'?: { 'ImageViewFragmentFragment': ImageViewFragmentFragment } }
  )> } & { ' $fragmentName'?: 'HourScreenFragmentFragment' };

export type MarathonScreenQueryVariables = Exact<{ [key: string]: never; }>;


export type MarathonScreenQuery = { readonly __typename?: 'Query', readonly currentMarathonHour?: (
    { readonly __typename?: 'MarathonHourNode' }
    & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
  ) | null, readonly latestMarathon?: { readonly __typename?: 'MarathonNode', readonly startDate?: Date | string | null, readonly endDate?: Date | string | null, readonly hours: ReadonlyArray<(
      { readonly __typename?: 'MarathonHourNode' }
      & { ' $fragmentRefs'?: { 'HourScreenFragmentFragment': HourScreenFragmentFragment } }
    )> } | null };

export type ScoreBoardFragmentFragment = { readonly __typename?: 'TeamNode', readonly id: string, readonly name: string, readonly totalPoints: number, readonly legacyStatus: TeamLegacyStatus, readonly type: TeamType } & { ' $fragmentName'?: 'ScoreBoardFragmentFragment' };

export type HighlightedTeamFragmentFragment = { readonly __typename?: 'TeamNode', readonly id: string, readonly name: string, readonly legacyStatus: TeamLegacyStatus, readonly type: TeamType } & { ' $fragmentName'?: 'HighlightedTeamFragmentFragment' };

export type ScoreBoardDocumentQueryVariables = Exact<{
  type?: InputMaybe<ReadonlyArray<TeamType> | TeamType>;
}>;


export type ScoreBoardDocumentQuery = { readonly __typename?: 'Query', readonly me: { readonly __typename?: 'GetPersonResponse', readonly data?: { readonly __typename?: 'PersonNode', readonly id: string, readonly teams: ReadonlyArray<{ readonly __typename?: 'MembershipNode', readonly team: (
          { readonly __typename?: 'TeamNode' }
          & { ' $fragmentRefs'?: { 'HighlightedTeamFragmentFragment': HighlightedTeamFragmentFragment;'MyTeamFragmentFragment': MyTeamFragmentFragment } }
        ) }> } | null }, readonly teams: { readonly __typename?: 'ListTeamsResponse', readonly data: ReadonlyArray<(
      { readonly __typename?: 'TeamNode' }
      & { ' $fragmentRefs'?: { 'ScoreBoardFragmentFragment': ScoreBoardFragmentFragment } }
    )> } };

export type ActiveMarathonDocumentQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveMarathonDocumentQuery = { readonly __typename?: 'Query', readonly currentMarathon?: { readonly __typename?: 'MarathonNode', readonly id: string } | null };

export type MyTeamFragmentFragment = { readonly __typename?: 'TeamNode', readonly id: string, readonly name: string, readonly totalPoints: number, readonly pointEntries: ReadonlyArray<{ readonly __typename?: 'PointEntryNode', readonly points: number, readonly personFrom?: { readonly __typename?: 'PersonNode', readonly id: string, readonly name?: string | null, readonly linkblue?: string | null } | null }>, readonly members: ReadonlyArray<{ readonly __typename?: 'MembershipNode', readonly position: MembershipPositionType, readonly person: { readonly __typename?: 'PersonNode', readonly linkblue?: string | null, readonly name?: string | null } }> } & { ' $fragmentName'?: 'MyTeamFragmentFragment' };

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
export const UseTabBarConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"useTabBarConfig"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TAB_BAR_CONFIG","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<UseTabBarConfigQuery, UseTabBarConfigQueryVariables>;
export const TriviaCrackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TriviaCrack"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activeConfiguration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"StringValue","value":"TRIVIA_CRACK","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SimpleConfig"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SimpleConfig"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ConfigurationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<TriviaCrackQuery, TriviaCrackQueryVariables>;
export const AuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"loggedIn"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}}]}}]} as unknown as DocumentNode<AuthStateQuery, AuthStateQueryVariables>;
export const SetDeviceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDevice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterDeviceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerDevice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]} as unknown as DocumentNode<SetDeviceMutation, SetDeviceMutationVariables>;
export const DeviceNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeviceNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GlobalId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"device"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deviceUuid"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationDeliveries"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pageSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"verifier"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verifier"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationDeliveryFragment"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NotificationDeliveryFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"NotificationDeliveryNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sentAt"}},{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"NotificationFragment"}}]}}]}}]} as unknown as DocumentNode<DeviceNotificationsQuery, DeviceNotificationsQueryVariables>;
export const RootScreenDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RootScreenDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenAuthFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RootScreenAuthFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProfileScreenUserFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}},{"kind":"Field","name":{"kind":"Name","value":"authSource"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RootScreenAuthFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginState"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dbRole"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProfileScreenUserFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PersonNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"primaryCommittee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<RootScreenDocumentQuery, RootScreenDocumentQueryVariables>;
export const EventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Events"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTimeISO"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"dateFilters"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"GREATER_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"earliestTimestamp"}}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"comparison"},"value":{"kind":"EnumValue","value":"LESS_THAN_OR_EQUAL_TO"}},{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"occurrenceStart"}},{"kind":"ObjectField","name":{"kind":"Name","value":"value"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastTimestamp"}}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"EnumValue","value":"asc"}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"StringValue","value":"occurrence","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"EventScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"EventScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EventNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"occurrences"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullDay"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}}]}}]} as unknown as DocumentNode<EventsQuery, EventsQueryVariables>;
export const ServerFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ServerFeed"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"20"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}}]}}]}}]}}]} as unknown as DocumentNode<ServerFeedQuery, ServerFeedQueryVariables>;
export const MarathonScreenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MarathonScreen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathonHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}},{"kind":"Field","name":{"kind":"Name","value":"latestMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"hours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HourScreenFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ImageViewFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ImageNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"thumbHash"}},{"kind":"Field","name":{"kind":"Name","value":"alt"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HourScreenFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MarathonHourNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"durationInfo"}},{"kind":"Field","name":{"kind":"Name","value":"mapImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ImageViewFragment"}}]}}]}}]} as unknown as DocumentNode<MarathonScreenQuery, MarathonScreenQueryVariables>;
export const ScoreBoardDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScoreBoardDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamType"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"HighlightedTeamFragment"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyTeamFragment"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sendAll"},"value":{"kind":"BooleanValue","value":true}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"totalPoints","block":false},{"kind":"StringValue","value":"name","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"sortDirection"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"desc"},{"kind":"EnumValue","value":"asc"}]}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ScoreBoardFragment"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"HighlightedTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyTeamFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"pointEntries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"linkblue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkblue"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ScoreBoardFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TeamNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"totalPoints"}},{"kind":"Field","name":{"kind":"Name","value":"legacyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ScoreBoardDocumentQuery, ScoreBoardDocumentQueryVariables>;
export const ActiveMarathonDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActiveMarathonDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentMarathon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ActiveMarathonDocumentQuery, ActiveMarathonDocumentQueryVariables>;