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
    "\n  fragment FullEventOccurrence on EventOccurrenceResource {\n    uuid\n    occurrence\n    fullDay\n  }\n": types.FullEventOccurrenceFragmentDoc,
    "\n  fragment FullEvent on EventResource {\n    title\n    summary\n    location\n    occurrences {\n      ...FullEventOccurrence\n    }\n    description\n  }\n": types.FullEventFragmentDoc,
    "\n  fragment EventImages on EventResource {\n    images {\n      ...FullImage\n    }\n  }\n": types.EventImagesFragmentDoc,
    "\n  fragment FullEventWithImages on EventResource {\n    ...FullEvent\n    ...EventImages\n  }\n": types.FullEventWithImagesFragmentDoc,
    "\n  fragment FullImage on ImageResource {\n    url\n    imageData\n    height\n    width\n    thumbHash\n    alt\n  }\n": types.FullImageFragmentDoc,
    "\n  fragment ImageMetadata on ImageResource {\n    height\n    width\n    mimeType\n    alt\n  }\n": types.ImageMetadataFragmentDoc,
    "\n  fragment ImageThumbHash on ImageResource {\n    thumbHash\n    height\n    width\n    alt\n  }\n": types.ImageThumbHashFragmentDoc,
    "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      ok\n      clientActions\n      data {\n        uuid\n      }\n    }\n  }\n": types.CreateEventDocument,
    "\n  query GetEvent($uuid: String!) {\n    event(uuid: $uuid) {\n      ok\n      clientActions\n      data {\n        uuid\n        ...FullEventWithImages\n      }\n    }\n  }\n": types.GetEventDocument,
    "\n  query ListEvents(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      ok\n      data {\n        uuid\n        ...FullEvent\n        images {\n          uuid\n          ...ImageMetadata\n        }\n      }\n      page\n      pageSize\n      total\n    }\n  }\n": types.ListEventsDocument,
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
export function graphql(source: "\n  fragment FullEventOccurrence on EventOccurrenceResource {\n    uuid\n    occurrence\n    fullDay\n  }\n"): (typeof documents)["\n  fragment FullEventOccurrence on EventOccurrenceResource {\n    uuid\n    occurrence\n    fullDay\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullEvent on EventResource {\n    title\n    summary\n    location\n    occurrences {\n      ...FullEventOccurrence\n    }\n    description\n  }\n"): (typeof documents)["\n  fragment FullEvent on EventResource {\n    title\n    summary\n    location\n    occurrences {\n      ...FullEventOccurrence\n    }\n    description\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventImages on EventResource {\n    images {\n      ...FullImage\n    }\n  }\n"): (typeof documents)["\n  fragment EventImages on EventResource {\n    images {\n      ...FullImage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullEventWithImages on EventResource {\n    ...FullEvent\n    ...EventImages\n  }\n"): (typeof documents)["\n  fragment FullEventWithImages on EventResource {\n    ...FullEvent\n    ...EventImages\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment FullImage on ImageResource {\n    url\n    imageData\n    height\n    width\n    thumbHash\n    alt\n  }\n"): (typeof documents)["\n  fragment FullImage on ImageResource {\n    url\n    imageData\n    height\n    width\n    thumbHash\n    alt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ImageMetadata on ImageResource {\n    height\n    width\n    mimeType\n    alt\n  }\n"): (typeof documents)["\n  fragment ImageMetadata on ImageResource {\n    height\n    width\n    mimeType\n    alt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ImageThumbHash on ImageResource {\n    thumbHash\n    height\n    width\n    alt\n  }\n"): (typeof documents)["\n  fragment ImageThumbHash on ImageResource {\n    thumbHash\n    height\n    width\n    alt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      ok\n      clientActions\n      data {\n        uuid\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      ok\n      clientActions\n      data {\n        uuid\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetEvent($uuid: String!) {\n    event(uuid: $uuid) {\n      ok\n      clientActions\n      data {\n        uuid\n        ...FullEventWithImages\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetEvent($uuid: String!) {\n    event(uuid: $uuid) {\n      ok\n      clientActions\n      data {\n        uuid\n        ...FullEventWithImages\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ListEvents(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      ok\n      data {\n        uuid\n        ...FullEvent\n        images {\n          uuid\n          ...ImageMetadata\n        }\n      }\n      page\n      pageSize\n      total\n    }\n  }\n"): (typeof documents)["\n  query ListEvents(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      ok\n      data {\n        uuid\n        ...FullEvent\n        images {\n          uuid\n          ...ImageMetadata\n        }\n      }\n      page\n      pageSize\n      total\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;