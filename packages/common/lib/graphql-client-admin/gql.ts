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
    "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n": types.CreateEventDocument,
    "\n  fragment EventEditorFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n": types.EventEditorFragmentFragmentDoc,
    "\n  mutation SaveEvent($uuid: String!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n": types.SaveEventDocument,
    "\n  fragment TeamNameFragment on TeamResource {\n    uuid\n    name\n  }\n": types.TeamNameFragmentFragmentDoc,
    "\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      ok\n      uuid\n    }\n  }\n": types.PersonCreatorDocument,
    "\n  fragment PersonEditorFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n": types.PersonEditorFragmentFragmentDoc,
    "\n  mutation PersonEditor($uuid: String!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n": types.PersonEditorDocument,
    "\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n": types.CreatePointEntryDocument,
    "\n  query GetPersonByUuid($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n": types.GetPersonByUuidDocument,
    "\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n": types.GetPersonByLinkBlueDocument,
    "\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n": types.SearchPersonByNameDocument,
    "\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      uuid\n    }\n  }\n": types.CreatePersonByLinkBlueDocument,
    "\n  mutation TeamCreator($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      ok\n      uuid\n    }\n  }\n": types.TeamCreatorDocument,
    "\n  fragment TeamEditorFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    persistentIdentifier\n    type\n  }\n": types.TeamEditorFragmentFragmentDoc,
    "\n  mutation TeamEditor($uuid: String!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n": types.TeamEditorDocument,
    "\n  fragment EventsTableFragment on EventResource {\n    uuid\n    title\n    description\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    summary\n  }\n": types.EventsTableFragmentFragmentDoc,
    "\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n": types.EventsTableDocument,
    "\n  fragment PeopleTableFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n  }\n": types.PeopleTableFragmentFragmentDoc,
    "\n  query PeopleTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [PersonResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [PersonResolverKeyedOneOfFilterItem!]\n    $stringFilters: [PersonResolverKeyedStringFilterItem!]\n  ) {\n    listPeople(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...PeopleTableFragment\n      }\n    }\n  }\n": types.PeopleTableDocument,
    "\n  query TeamsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]\n    $stringFilters: [TeamResolverKeyedStringFilterItem!]\n  ) {\n    teams(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...TeamsTableFragment\n      }\n    }\n  }\n": types.TeamsTableDocument,
    "\n  fragment TeamsTableFragment on TeamResource {\n    uuid\n    type\n    name\n    legacyStatus\n    marathonYear\n    totalPoints\n  }\n": types.TeamsTableFragmentFragmentDoc,
    "\n  mutation DeletePointEntry($uuid: String!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeletePointEntryDocument,
    "\n  fragment PointEntryTableFragment on PointEntryResource {\n    uuid\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    comment\n  }\n": types.PointEntryTableFragmentFragmentDoc,
    "\n  mutation DeleteEvent($uuid: String!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeleteEventDocument,
    "\n  fragment EventViewerFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n": types.EventViewerFragmentFragmentDoc,
    "\n  mutation DeletePerson($uuid: String!) {\n    deletePerson(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeletePersonDocument,
    "\n  fragment PersonViewerFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n": types.PersonViewerFragmentFragmentDoc,
    "\n  mutation DeleteTeam($uuid: String!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeleteTeamDocument,
    "\n  fragment TeamViewerFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n    captains {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n": types.TeamViewerFragmentFragmentDoc,
    "\n  query LoginState {\n    loginState {\n      loggedIn\n      role {\n        dbRole\n        committeeRole\n        committeeIdentifier\n      }\n    }\n  }\n": types.LoginStateDocument,
    "\n  query EditEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n": types.EditEventPageDocument,
    "\n  query ViewEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n": types.ViewEventPageDocument,
    "\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n": types.CreatePersonPageDocument,
    "\n  query EditPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonEditorFragment\n      }\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n": types.EditPersonPageDocument,
    "\n  query ViewPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonViewerFragment\n      }\n    }\n  }\n": types.ViewPersonPageDocument,
    "\n  query EditTeamPage($uuid: String!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n": types.EditTeamPageDocument,
    "\n  query ViewTeamPage($teamUuid: String!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n": types.ViewTeamPageDocument,
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
export function graphql(source: "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventEditorFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n"): (typeof documents)["\n  fragment EventEditorFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveEvent($uuid: String!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveEvent($uuid: String!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamNameFragment on TeamResource {\n    uuid\n    name\n  }\n"): (typeof documents)["\n  fragment TeamNameFragment on TeamResource {\n    uuid\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      ok\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      ok\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PersonEditorFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PersonEditorFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PersonEditor($uuid: String!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation PersonEditor($uuid: String!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        uuid\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPersonByUuid($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPersonByUuid($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      data {\n        uuid\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TeamCreator($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      ok\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation TeamCreator($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      ok\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamEditorFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    persistentIdentifier\n    type\n  }\n"): (typeof documents)["\n  fragment TeamEditorFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    persistentIdentifier\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TeamEditor($uuid: String!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation TeamEditor($uuid: String!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventsTableFragment on EventResource {\n    uuid\n    title\n    description\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    summary\n  }\n"): (typeof documents)["\n  fragment EventsTableFragment on EventResource {\n    uuid\n    title\n    description\n    occurrences {\n      uuid\n      interval\n      fullDay\n    }\n    summary\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $numericFilters: [EventResolverKeyedNumericFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      numericFilters: $numericFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PeopleTableFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n  }\n"): (typeof documents)["\n  fragment PeopleTableFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PeopleTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [PersonResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [PersonResolverKeyedOneOfFilterItem!]\n    $stringFilters: [PersonResolverKeyedStringFilterItem!]\n  ) {\n    listPeople(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...PeopleTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query PeopleTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [PersonResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [PersonResolverKeyedOneOfFilterItem!]\n    $stringFilters: [PersonResolverKeyedStringFilterItem!]\n  ) {\n    listPeople(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...PeopleTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TeamsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]\n    $stringFilters: [TeamResolverKeyedStringFilterItem!]\n  ) {\n    teams(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...TeamsTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query TeamsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]\n    $stringFilters: [TeamResolverKeyedStringFilterItem!]\n  ) {\n    teams(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...TeamsTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamsTableFragment on TeamResource {\n    uuid\n    type\n    name\n    legacyStatus\n    marathonYear\n    totalPoints\n  }\n"): (typeof documents)["\n  fragment TeamsTableFragment on TeamResource {\n    uuid\n    type\n    name\n    legacyStatus\n    marathonYear\n    totalPoints\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePointEntry($uuid: String!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePointEntry($uuid: String!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PointEntryTableFragment on PointEntryResource {\n    uuid\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    comment\n  }\n"): (typeof documents)["\n  fragment PointEntryTableFragment on PointEntryResource {\n    uuid\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    comment\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEvent($uuid: String!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteEvent($uuid: String!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventViewerFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment EventViewerFragment on EventResource {\n    uuid\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval\n      fullDay\n    }\n    images {\n      url\n      imageData\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePerson($uuid: String!) {\n    deletePerson(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePerson($uuid: String!) {\n    deletePerson(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PersonViewerFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PersonViewerFragment on PersonResource {\n    uuid\n    name\n    linkblue\n    email\n    role {\n      dbRole\n      committeeRole\n      committeeIdentifier\n    }\n    teams {\n      position\n      team {\n        uuid\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTeam($uuid: String!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTeam($uuid: String!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamViewerFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n    captains {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment TeamViewerFragment on TeamResource {\n    uuid\n    name\n    marathonYear\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n    captains {\n      person {\n        uuid\n        name\n        linkblue\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LoginState {\n    loginState {\n      loggedIn\n      role {\n        dbRole\n        committeeRole\n        committeeIdentifier\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoginState {\n    loginState {\n      loggedIn\n      role {\n        dbRole\n        committeeRole\n        committeeIdentifier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewEventPage($uuid: String!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonEditorFragment\n      }\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonEditorFragment\n      }\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [ASCENDING]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonViewerFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewPersonPage($uuid: String!) {\n    person(uuid: $uuid) {\n      data {\n        ...PersonViewerFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditTeamPage($uuid: String!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditTeamPage($uuid: String!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewTeamPage($teamUuid: String!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewTeamPage($teamUuid: String!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;