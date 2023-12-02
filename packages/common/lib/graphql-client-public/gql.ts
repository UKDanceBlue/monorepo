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
    "\n  fragment ProfileScreenAuthFragment on LoginState {\n    role {\n      committeeIdentifier\n      committeeRole\n      dbRole\n    }\n    authSource\n  }\n": types.ProfileScreenAuthFragmentFragmentDoc,
    "\n  fragment ProfileScreenUserFragment on PersonResource {\n    name\n    linkblue\n    teams {\n      position\n      team {\n        name\n      }\n    }\n  }\n": types.ProfileScreenUserFragmentFragmentDoc,
    "\n  query RootScreenDocument {\n    loginState {\n      ...ProfileScreenAuthFragment\n      ...RootScreenAuthFragment\n    }\n    me {\n      data {\n        ...ProfileScreenUserFragment\n      }\n    }\n  }\n": types.RootScreenDocumentDocument,
    "\n  fragment RootScreenAuthFragment on LoginState {\n    role {\n      dbRole\n    }\n  }\n": types.RootScreenAuthFragmentFragmentDoc,
    "\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n  }\n": types.ScoreBoardFragmentFragmentDoc,
    "\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n  }\n": types.HighlightedTeamFragmentFragmentDoc,
    "\n  query ScoreBoardDocument {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n": types.ScoreBoardDocumentDocument,
    "\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n": types.MyTeamFragmentFragmentDoc,
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
export function graphql(source: "\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n  }\n"): (typeof documents)["\n  fragment ScoreBoardFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n  }\n"): (typeof documents)["\n  fragment HighlightedTeamFragment on TeamResource {\n    uuid\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ScoreBoardDocument {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ScoreBoardDocument {\n    me {\n      data {\n        uuid\n        teams {\n          team {\n            ...HighlightedTeamFragment\n            ...MyTeamFragment\n          }\n        }\n      }\n    }\n    teams(\n      sendAll: true\n      sortBy: [\"totalPoints\", \"name\"]\n      sortDirection: [DESCENDING, ASCENDING]\n    ) {\n      data {\n        ...ScoreBoardFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MyTeamFragment on TeamResource {\n    uuid\n    name\n    totalPoints\n    pointEntries {\n      personFrom {\n        uuid\n        name\n        linkblue\n      }\n      points\n    }\n    members {\n      person {\n        linkblue\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;