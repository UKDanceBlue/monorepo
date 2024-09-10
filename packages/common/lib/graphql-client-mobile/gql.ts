/* eslint-disable */
import * as types from './graphql.js';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment ImageViewFragment on ImageNode {\n    id\n    url\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n": types.ImageViewFragmentFragmentDoc,
    "\n  fragment SimpleConfig on ConfigurationNode {\n    id\n    key\n    value\n  }\n": types.SimpleConfigFragmentDoc,
    "\n  fragment FullConfig on ConfigurationNode {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n": types.FullConfigFragmentDoc,
    "\n  fragment NotificationFragment on NotificationNode {\n    id\n    title\n    body\n    url\n  }\n": types.NotificationFragmentFragmentDoc,
    "\n  fragment NotificationDeliveryFragment on NotificationDeliveryNode {\n    id\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n": types.NotificationDeliveryFragmentFragmentDoc,
    "\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n": types.UseAllowedLoginTypesDocument,
    "\n  query MarathonTime {\n    latestMarathon {\n      startDate\n      endDate\n    }\n  }\n": types.MarathonTimeDocument,
    "\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n    me {\n      linkblue\n    }\n  }\n": types.UseTabBarConfigDocument,
    "\n      query TriviaCrack {\n        activeConfiguration(key: \"TRIVIA_CRACK\") {\n          data {\n            ...SimpleConfig\n          }\n        }\n\n        me {\n          teams {\n            team {\n              type\n              name\n            }\n          }\n        }\n      }\n    ": types.TriviaCrackDocument,
    "\n  query AuthState {\n    me {\n      id\n    }\n    loginState {\n      dbRole\n      loggedIn\n      authSource\n    }\n  }\n": types.AuthStateDocument,
    "\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n": types.SetDeviceDocument,
    "\n  fragment EventScreenFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n": types.EventScreenFragmentFragmentDoc,
    "\n  query DeviceNotifications(\n    $deviceUuid: GlobalId!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n": types.DeviceNotificationsDocument,
    "\n  fragment ProfileScreenAuthFragment on LoginState {\n    dbRole\n    authSource\n  }\n": types.ProfileScreenAuthFragmentFragmentDoc,
    "\n  fragment ProfileScreenUserFragment on PersonNode {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n": types.ProfileScreenUserFragmentFragmentDoc,
    "\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      ...ProfileScreenUserFragment\n    }\n  }\n": types.RootScreenDocumentDocument,
    "\n  fragment RootScreenAuthFragment on LoginState {\n    dbRole\n  }\n": types.RootScreenAuthFragmentFragmentDoc,
    "\n      query Events(\n        $earliestTimestamp: DateTimeISO!\n        $lastTimestamp: DateTimeISO!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: asc\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    ": types.EventsDocument,
    "\n  query ServerFeed {\n    feed(limit: 20) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n        width\n        height\n        thumbHash\n      }\n    }\n  }\n": types.ServerFeedDocument,
    "\n  fragment HourScreenFragment on MarathonHourNode {\n    id\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n": types.HourScreenFragmentFragmentDoc,
    "\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    latestMarathon {\n      startDate\n      endDate\n      hours {\n        ...HourScreenFragment\n      }\n    }\n  }\n": types.MarathonScreenDocument,
    "\n  fragment ScoreBoardFragment on TeamNode {\n    id\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n": types.ScoreBoardFragmentFragmentDoc,
    "\n  fragment HighlightedTeamFragment on TeamNode {\n    id\n    name\n    legacyStatus\n    type\n  }\n": types.HighlightedTeamFragmentFragmentDoc,
    "\n  query ScoreBoardDocument($type: [TeamType!], $marathonId: GlobalId!) {\n    me {\n      id\n      teams {\n        team {\n          ...HighlightedTeamFragment\n          ...MyTeamFragment\n        }\n      }\n      ...MyFundraisingFragment\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [desc, asc]\n      type: $type\n      marathonId: [$marathonId]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n": types.ScoreBoardDocumentDocument,
    "\n  query ActiveMarathonDocument {\n    currentMarathon {\n      id\n    }\n    latestMarathon {\n      id\n    }\n  }\n": types.ActiveMarathonDocumentDocument,
    "\n  fragment MyTeamFragment on TeamNode {\n    id\n    name\n    totalPoints\n    fundraisingTotalAmount\n    pointEntries {\n      personFrom {\n        id\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n": types.MyTeamFragmentFragmentDoc,
    "\n  fragment MyFundraisingFragment on PersonNode {\n    fundraisingTotalAmount\n    fundraisingAssignments {\n      amount\n      entry {\n        donatedToText\n        donatedByText\n        donatedOn\n      }\n    }\n  }\n": types.MyFundraisingFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ImageViewFragment on ImageNode {\n    id\n    url\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n"): (typeof documents)["\n  fragment ImageViewFragment on ImageNode {\n    id\n    url\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SimpleConfig on ConfigurationNode {\n    id\n    key\n    value\n  }\n"): (typeof documents)["\n  fragment SimpleConfig on ConfigurationNode {\n    id\n    key\n    value\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullConfig on ConfigurationNode {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n"): (typeof documents)["\n  fragment FullConfig on ConfigurationNode {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationFragment on NotificationNode {\n    id\n    title\n    body\n    url\n  }\n"): (typeof documents)["\n  fragment NotificationFragment on NotificationNode {\n    id\n    title\n    body\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationDeliveryFragment on NotificationDeliveryNode {\n    id\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n"): (typeof documents)["\n  fragment NotificationDeliveryFragment on NotificationDeliveryNode {\n    id\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"): (typeof documents)["\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonTime {\n    latestMarathon {\n      startDate\n      endDate\n    }\n  }\n"): (typeof documents)["\n  query MarathonTime {\n    latestMarathon {\n      startDate\n      endDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n    me {\n      linkblue\n    }\n  }\n"): (typeof documents)["\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n    me {\n      linkblue\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query TriviaCrack {\n        activeConfiguration(key: \"TRIVIA_CRACK\") {\n          data {\n            ...SimpleConfig\n          }\n        }\n\n        me {\n          teams {\n            team {\n              type\n              name\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      query TriviaCrack {\n        activeConfiguration(key: \"TRIVIA_CRACK\") {\n          data {\n            ...SimpleConfig\n          }\n        }\n\n        me {\n          teams {\n            team {\n              type\n              name\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuthState {\n    me {\n      id\n    }\n    loginState {\n      dbRole\n      loggedIn\n      authSource\n    }\n  }\n"): (typeof documents)["\n  query AuthState {\n    me {\n      id\n    }\n    loginState {\n      dbRole\n      loggedIn\n      authSource\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventScreenFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n"): (typeof documents)["\n  fragment EventScreenFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DeviceNotifications(\n    $deviceUuid: GlobalId!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DeviceNotifications(\n    $deviceUuid: GlobalId!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileScreenAuthFragment on LoginState {\n    dbRole\n    authSource\n  }\n"): (typeof documents)["\n  fragment ProfileScreenAuthFragment on LoginState {\n    dbRole\n    authSource\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileScreenUserFragment on PersonNode {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n"): (typeof documents)["\n  fragment ProfileScreenUserFragment on PersonNode {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      ...ProfileScreenUserFragment\n    }\n  }\n"): (typeof documents)["\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      ...ProfileScreenUserFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RootScreenAuthFragment on LoginState {\n    dbRole\n  }\n"): (typeof documents)["\n  fragment RootScreenAuthFragment on LoginState {\n    dbRole\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Events(\n        $earliestTimestamp: DateTimeISO!\n        $lastTimestamp: DateTimeISO!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: asc\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Events(\n        $earliestTimestamp: DateTimeISO!\n        $lastTimestamp: DateTimeISO!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: asc\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServerFeed {\n    feed(limit: 20) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n        width\n        height\n        thumbHash\n      }\n    }\n  }\n"): (typeof documents)["\n  query ServerFeed {\n    feed(limit: 20) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n        width\n        height\n        thumbHash\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HourScreenFragment on MarathonHourNode {\n    id\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n"): (typeof documents)["\n  fragment HourScreenFragment on MarathonHourNode {\n    id\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    latestMarathon {\n      startDate\n      endDate\n      hours {\n        ...HourScreenFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    latestMarathon {\n      startDate\n      endDate\n      hours {\n        ...HourScreenFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ScoreBoardFragment on TeamNode {\n    id\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n"): (typeof documents)["\n  fragment ScoreBoardFragment on TeamNode {\n    id\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HighlightedTeamFragment on TeamNode {\n    id\n    name\n    legacyStatus\n    type\n  }\n"): (typeof documents)["\n  fragment HighlightedTeamFragment on TeamNode {\n    id\n    name\n    legacyStatus\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScoreBoardDocument($type: [TeamType!], $marathonId: GlobalId!) {\n    me {\n      id\n      teams {\n        team {\n          ...HighlightedTeamFragment\n          ...MyTeamFragment\n        }\n      }\n      ...MyFundraisingFragment\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [desc, asc]\n      type: $type\n      marathonId: [$marathonId]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ScoreBoardDocument($type: [TeamType!], $marathonId: GlobalId!) {\n    me {\n      id\n      teams {\n        team {\n          ...HighlightedTeamFragment\n          ...MyTeamFragment\n        }\n      }\n      ...MyFundraisingFragment\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [desc, asc]\n      type: $type\n      marathonId: [$marathonId]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveMarathonDocument {\n    currentMarathon {\n      id\n    }\n    latestMarathon {\n      id\n    }\n  }\n"): (typeof documents)["\n  query ActiveMarathonDocument {\n    currentMarathon {\n      id\n    }\n    latestMarathon {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyTeamFragment on TeamNode {\n    id\n    name\n    totalPoints\n    fundraisingTotalAmount\n    pointEntries {\n      personFrom {\n        id\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MyTeamFragment on TeamNode {\n    id\n    name\n    totalPoints\n    fundraisingTotalAmount\n    pointEntries {\n      personFrom {\n        id\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyFundraisingFragment on PersonNode {\n    fundraisingTotalAmount\n    fundraisingAssignments {\n      amount\n      entry {\n        donatedToText\n        donatedByText\n        donatedOn\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MyFundraisingFragment on PersonNode {\n    fundraisingTotalAmount\n    fundraisingAssignments {\n      amount\n      entry {\n        donatedToText\n        donatedByText\n        donatedOn\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;