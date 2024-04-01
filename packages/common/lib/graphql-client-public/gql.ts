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
    "\n  fragment ImageViewFragment on ImageResource {\n    uuid\n    url\n    imageData\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n": types.ImageViewFragmentFragmentDoc,
    "\n  fragment SimpleConfig on ConfigurationResource {\n    uuid\n    key\n    value\n  }\n": types.SimpleConfigFragmentDoc,
    "\n  fragment FullConfig on ConfigurationResource {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n": types.FullConfigFragmentDoc,
    "\n  fragment NotificationFragment on NotificationResource {\n    uuid\n    title\n    body\n    url\n  }\n": types.NotificationFragmentFragmentDoc,
    "\n  fragment NotificationDeliveryFragment on NotificationDeliveryResource {\n    uuid\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n": types.NotificationDeliveryFragmentFragmentDoc,
    "\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n": types.UseAllowedLoginTypesDocument,
    "\n  query MarathonTime {\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n": types.MarathonTimeDocument,
    "\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n": types.UseTabBarConfigDocument,
    "\n  query AuthState {\n    me {\n      data {\n        uuid\n      }\n    }\n    loginState {\n      role {\n        dbRole\n        committeeIdentifier\n        committeeRole\n      }\n      loggedIn\n      authSource\n    }\n  }\n": types.AuthStateDocument,
    "\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n": types.SetDeviceDocument,
    "\n  fragment EventScreenFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      imageData\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n": types.EventScreenFragmentFragmentDoc,
    "\n  query DeviceNotifications(\n    $deviceUuid: String!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n": types.DeviceNotificationsDocument,
    "\n  fragment ProfileScreenAuthFragment on LoginState {\n    role {\n      committeeIdentifier\n      committeeRole\n      dbRole\n    }\n    authSource\n  }\n": types.ProfileScreenAuthFragmentFragmentDoc,
    "\n  fragment ProfileScreenUserFragment on PersonResource {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n  }\n": types.ProfileScreenUserFragmentFragmentDoc,
    "\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      data {\n        ...ProfileScreenUserFragment\n      }\n    }\n  }\n": types.RootScreenDocumentDocument,
    "\n  fragment RootScreenAuthFragment on LoginState {\n    role {\n      dbRole\n    }\n  }\n": types.RootScreenAuthFragmentFragmentDoc,
    "\n      query Events(\n        $earliestTimestamp: LuxonDateTime!\n        $lastTimestamp: LuxonDateTime!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: ASCENDING\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    ": types.EventsDocument,
    "\n  fragment HourScreenFragment on MarathonHourResource {\n    uuid\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n": types.HourScreenFragmentFragmentDoc,
    "\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n": types.MarathonScreenDocument,
    "\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n": types.ScoreBoardFragmentFragmentDoc,
    "\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n    legacyStatus\n    type\n  }\n": types.HighlightedTeamFragmentFragmentDoc,
    "\n  query ScoreBoardDocument($type: [TeamType!]) {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n      type: $type\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n": types.ScoreBoardDocumentDocument,
    "\n  query ActiveMarathonDocument {\n    currentMarathon {\n      uuid\n    }\n  }\n": types.ActiveMarathonDocumentDocument,
    "\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n": types.MyTeamFragmentFragmentDoc,
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
export function graphql(source: "\n  fragment ImageViewFragment on ImageResource {\n    uuid\n    url\n    imageData\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n"): (typeof documents)["\n  fragment ImageViewFragment on ImageResource {\n    uuid\n    url\n    imageData\n    thumbHash\n    alt\n    width\n    height\n    mimeType\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SimpleConfig on ConfigurationResource {\n    uuid\n    key\n    value\n  }\n"): (typeof documents)["\n  fragment SimpleConfig on ConfigurationResource {\n    uuid\n    key\n    value\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullConfig on ConfigurationResource {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n"): (typeof documents)["\n  fragment FullConfig on ConfigurationResource {\n    ...SimpleConfig\n    validAfter\n    validUntil\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationFragment on NotificationResource {\n    uuid\n    title\n    body\n    url\n  }\n"): (typeof documents)["\n  fragment NotificationFragment on NotificationResource {\n    uuid\n    title\n    body\n    url\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationDeliveryFragment on NotificationDeliveryResource {\n    uuid\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n"): (typeof documents)["\n  fragment NotificationDeliveryFragment on NotificationDeliveryResource {\n    uuid\n    sentAt\n    notification {\n      ...NotificationFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"): (typeof documents)["\n  query useAllowedLoginTypes {\n    activeConfiguration(key: \"ALLOWED_LOGIN_TYPES\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonTime {\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n"): (typeof documents)["\n  query MarathonTime {\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"): (typeof documents)["\n  query useTabBarConfig {\n    activeConfiguration(key: \"TAB_BAR_CONFIG\") {\n      data {\n        ...SimpleConfig\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuthState {\n    me {\n      data {\n        uuid\n      }\n    }\n    loginState {\n      role {\n        dbRole\n        committeeIdentifier\n        committeeRole\n      }\n      loggedIn\n      authSource\n    }\n  }\n"): (typeof documents)["\n  query AuthState {\n    me {\n      data {\n        uuid\n      }\n    }\n    loginState {\n      role {\n        dbRole\n        committeeIdentifier\n        committeeRole\n      }\n      loggedIn\n      authSource\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation SetDevice($input: RegisterDeviceInput!) {\n    registerDevice(input: $input) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventScreenFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      imageData\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n"): (typeof documents)["\n  fragment EventScreenFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      imageData\n      thumbHash\n      url\n      height\n      width\n      alt\n      mimeType\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query DeviceNotifications(\n    $deviceUuid: String!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query DeviceNotifications(\n    $deviceUuid: String!\n    $page: Int\n    $pageSize: Int\n    $verifier: String!\n  ) {\n    device(uuid: $deviceUuid) {\n      data {\n        notificationDeliveries(\n          pageSize: $pageSize\n          page: $page\n          verifier: $verifier\n        ) {\n          ...NotificationDeliveryFragment\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileScreenAuthFragment on LoginState {\n    role {\n      committeeIdentifier\n      committeeRole\n      dbRole\n    }\n    authSource\n  }\n"): (typeof documents)["\n  fragment ProfileScreenAuthFragment on LoginState {\n    role {\n      committeeIdentifier\n      committeeRole\n      dbRole\n    }\n    authSource\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProfileScreenUserFragment on PersonResource {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ProfileScreenUserFragment on PersonResource {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      data {\n        ...ProfileScreenUserFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      data {\n        ...ProfileScreenUserFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RootScreenAuthFragment on LoginState {\n    role {\n      dbRole\n    }\n  }\n"): (typeof documents)["\n  fragment RootScreenAuthFragment on LoginState {\n    role {\n      dbRole\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Events(\n        $earliestTimestamp: LuxonDateTime!\n        $lastTimestamp: LuxonDateTime!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: ASCENDING\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Events(\n        $earliestTimestamp: LuxonDateTime!\n        $lastTimestamp: LuxonDateTime!\n      ) {\n        events(\n          dateFilters: [\n            {\n              comparison: GREATER_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $earliestTimestamp\n            }\n            {\n              comparison: LESS_THAN_OR_EQUAL_TO\n              field: occurrenceStart\n              value: $lastTimestamp\n            }\n          ]\n          sortDirection: ASCENDING\n          sortBy: \"occurrence\"\n        ) {\n          data {\n            ...EventScreenFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HourScreenFragment on MarathonHourResource {\n    uuid\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n"): (typeof documents)["\n  fragment HourScreenFragment on MarathonHourResource {\n    uuid\n    title\n    details\n    durationInfo\n    mapImages {\n      ...ImageViewFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n"): (typeof documents)["\n  query MarathonScreen {\n    currentMarathonHour {\n      ...HourScreenFragment\n    }\n    nextMarathon {\n      startDate\n      endDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n"): (typeof documents)["\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    legacyStatus\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n    legacyStatus\n    type\n  }\n"): (typeof documents)["\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n    legacyStatus\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScoreBoardDocument($type: [TeamType!]) {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n      type: $type\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ScoreBoardDocument($type: [TeamType!]) {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n      type: $type\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveMarathonDocument {\n    currentMarathon {\n      uuid\n    }\n  }\n"): (typeof documents)["\n  query ActiveMarathonDocument {\n    currentMarathon {\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      position\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;