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
    "\n  query ActiveMarathon {\n    latestMarathon {\n      id\n      year\n      startDate\n      endDate\n    }\n    marathons(sendAll: true) {\n      data {\n        id\n        year\n      }\n    }\n  }\n": types.ActiveMarathonDocument,
    "\n  query SelectedMarathon($marathonId: GlobalId!) {\n    marathon(uuid: $marathonId) {\n      id\n      year\n      startDate\n      endDate\n    }\n  }\n": types.SelectedMarathonDocument,
    "\n  query ImagePicker($stringFilters: [ImageResolverKeyedStringFilterItem!]) {\n    images(stringFilters: $stringFilters, pageSize: 9) {\n      data {\n        id\n        alt\n        url\n      }\n    }\n  }\n": types.ImagePickerDocument,
    "\n  query PersonSearch($search: String!) {\n    searchPeopleByName(name: $search) {\n      id\n      name\n      linkblue\n    }\n    personByLinkBlue(linkBlueId: $search) {\n      id\n      name\n      linkblue\n    }\n  }\n": types.PersonSearchDocument,
    "\n  fragment SingleNotificationFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n    createdAt\n    deliveryCount\n    deliveryIssueCount {\n      DeviceNotRegistered\n      InvalidCredentials\n      MessageRateExceeded\n      MessageTooBig\n      MismatchSenderId\n      Unknown\n    }\n  }\n": types.SingleNotificationFragmentFragmentDoc,
    "\n  mutation CreateNotification(\n    $title: String!\n    $body: String!\n    $audience: NotificationAudienceInput!\n    $url: String\n  ) {\n    stageNotification(\n      title: $title\n      body: $body\n      audience: $audience\n      url: $url\n    ) {\n      uuid\n    }\n  }\n": types.CreateNotificationDocument,
    "\n  mutation CancelNotificationSchedule($uuid: GlobalId!) {\n    abortScheduledNotification(uuid: $uuid) {\n      ok\n    }\n  }\n": types.CancelNotificationScheduleDocument,
    "\n  mutation DeleteNotification($uuid: GlobalId!, $force: Boolean) {\n    deleteNotification(uuid: $uuid, force: $force) {\n      ok\n    }\n  }\n": types.DeleteNotificationDocument,
    "\n  mutation SendNotification($uuid: GlobalId!) {\n    sendNotification(uuid: $uuid) {\n      ok\n    }\n  }\n": types.SendNotificationDocument,
    "\n  mutation ScheduleNotification($uuid: GlobalId!, $sendAt: DateTimeISO!) {\n    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {\n      ok\n    }\n  }\n": types.ScheduleNotificationDocument,
    "\n  fragment TeamNameFragment on TeamNode {\n    id\n    name\n  }\n": types.TeamNameFragmentFragmentDoc,
    "\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      id\n    }\n  }\n": types.PersonCreatorDocument,
    "\n  fragment PersonEditorFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n  }\n": types.PersonEditorFragmentFragmentDoc,
    "\n  mutation PersonEditor($uuid: GlobalId!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      id\n    }\n  }\n": types.PersonEditorDocument,
    "\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n": types.CreatePointEntryDocument,
    "\n  query GetPersonByUuid($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      id\n      name\n      linkblue\n    }\n  }\n": types.GetPersonByUuidDocument,
    "\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      id\n      name\n    }\n  }\n": types.GetPersonByLinkBlueDocument,
    "\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      id\n      name\n    }\n  }\n": types.SearchPersonByNameDocument,
    "\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      id\n    }\n  }\n": types.CreatePersonByLinkBlueDocument,
    "\n  query PointEntryOpportunityLookup($name: String!) {\n    pointOpportunities(\n      stringFilters: { field: name, comparison: SUBSTRING, value: $name }\n      sendAll: true\n    ) {\n      data {\n        name\n        id\n      }\n    }\n  }\n": types.PointEntryOpportunityLookupDocument,
    "\n  mutation CreatePointOpportunity($input: CreatePointOpportunityInput!) {\n    createPointOpportunity(input: $input) {\n      uuid\n    }\n  }\n": types.CreatePointOpportunityDocument,
    "\n  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: String!) {\n    createTeam(input: $input, marathon: $marathonUuid) {\n      ok\n      uuid\n    }\n  }\n": types.TeamCreatorDocument,
    "\n  fragment TeamEditorFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    type\n  }\n": types.TeamEditorFragmentFragmentDoc,
    "\n  mutation TeamEditor($uuid: GlobalId!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n": types.TeamEditorDocument,
    "\n  fragment PeopleTableFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n": types.PeopleTableFragmentFragmentDoc,
    "\n  query PeopleTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [PersonResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [PersonResolverKeyedOneOfFilterItem!]\n    $stringFilters: [PersonResolverKeyedStringFilterItem!]\n  ) {\n    listPeople(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...PeopleTableFragment\n      }\n    }\n  }\n": types.PeopleTableDocument,
    "\n  query TeamsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $isNullFilters: [TeamResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [TeamResolverKeyedOneOfFilterItem!]\n    $stringFilters: [TeamResolverKeyedStringFilterItem!]\n  ) {\n    teams(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...TeamsTableFragment\n      }\n    }\n  }\n": types.TeamsTableDocument,
    "\n  fragment TeamsTableFragment on TeamNode {\n    id\n    type\n    name\n    legacyStatus\n    totalPoints\n  }\n": types.TeamsTableFragmentFragmentDoc,
    "\n  fragment NotificationDeliveriesTableFragment on NotificationDeliveryNode {\n    id\n    deliveryError\n    receiptCheckedAt\n    sentAt\n  }\n": types.NotificationDeliveriesTableFragmentFragmentDoc,
    "\n  query NotificationDeliveriesTableQuery(\n    $notificationId: String!\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationDeliveryResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationDeliveryResolverKeyedIsNullFilterItem!]\n  ) {\n    notificationDeliveries(\n      notificationUuid: $notificationId\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationDeliveriesTableFragment\n      }\n    }\n  }\n": types.NotificationDeliveriesTableQueryDocument,
    "\n  fragment NotificationsTableFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n  }\n": types.NotificationsTableFragmentFragmentDoc,
    "\n  query NotificationsTableQuery(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [NotificationResolverKeyedOneOfFilterItem!]\n    $stringFilters: [NotificationResolverKeyedStringFilterItem!]\n  ) {\n    notifications(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationsTableFragment\n      }\n    }\n  }\n": types.NotificationsTableQueryDocument,
    "\n  mutation DeletePointEntry($uuid: GlobalId!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeletePointEntryDocument,
    "\n  fragment PointEntryTableFragment on PointEntryNode {\n    id\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    pointOpportunity {\n      name\n      opportunityDate\n    }\n    comment\n  }\n": types.PointEntryTableFragmentFragmentDoc,
    "\n  mutation DeletePerson($uuid: GlobalId!) {\n    deletePerson(uuid: $uuid) {\n      id\n    }\n  }\n": types.DeletePersonDocument,
    "\n  fragment PersonViewerFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n    committees {\n      identifier\n      role\n    }\n  }\n": types.PersonViewerFragmentFragmentDoc,
    "\n  mutation DeleteTeam($uuid: GlobalId!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeleteTeamDocument,
    "\n  fragment TeamViewerFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        id\n        name\n        linkblue\n      }\n      position\n    }\n  }\n": types.TeamViewerFragmentFragmentDoc,
    "\n  query LoginState {\n    loginState {\n      loggedIn\n      dbRole\n      effectiveCommitteeRoles {\n        role\n        identifier\n      }\n    }\n  }\n": types.LoginStateDocument,
    "\n  mutation CommitConfigChanges($changes: [CreateConfigurationInput!]!) {\n    createConfigurations(input: $changes) {\n      ok\n    }\n  }\n": types.CommitConfigChangesDocument,
    "\n  fragment ConfigFragment on ConfigurationNode {\n    id\n    key\n    value\n    validAfter\n    validUntil\n    createdAt\n  }\n": types.ConfigFragmentFragmentDoc,
    "\n      query ConfigQuery {\n        allConfigurations {\n          data {\n            ...ConfigFragment\n          }\n        }\n      }\n    ": types.ConfigQueryDocument,
    "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n": types.CreateEventDocument,
    "\n  fragment EventsTableFragment on EventNode {\n    id\n    title\n    description\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    summary\n  }\n": types.EventsTableFragmentFragmentDoc,
    "\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n": types.EventsTableDocument,
    "\n  query EditEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n": types.EditEventPageDocument,
    "\n  fragment EventEditorFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n": types.EventEditorFragmentFragmentDoc,
    "\n  mutation SaveEvent($uuid: GlobalId!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n": types.SaveEventDocument,
    "\n  mutation DeleteEvent($uuid: GlobalId!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n": types.DeleteEventDocument,
    "\n  fragment EventViewerFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n": types.EventViewerFragmentFragmentDoc,
    "\n  query ViewEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n": types.ViewEventPageDocument,
    "\n  query FeedPage {\n    feed(limit: null) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n      }\n    }\n  }\n": types.FeedPageDocument,
    "\n  mutation CreateFeedItem($input: CreateFeedInput!) {\n    createFeedItem(input: $input) {\n      id\n    }\n  }\n": types.CreateFeedItemDocument,
    "\n  mutation DeleteFeedItem($uuid: String!) {\n    deleteFeedItem(feedItemUuid: $uuid)\n  }\n": types.DeleteFeedItemDocument,
    "\n  mutation CreateImage($input: CreateImageInput!) {\n    createImage(input: $input) {\n      id\n    }\n  }\n": types.CreateImageDocument,
    "\n  fragment ImagesTableFragment on ImageNode {\n    id\n    url\n    thumbHash\n    height\n    width\n    alt\n    mimeType\n    createdAt\n  }\n": types.ImagesTableFragmentFragmentDoc,
    "\n  query ImagesTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [ImageResolverKeyedDateFilterItem!]\n    $isNullFilters: [ImageResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [ImageResolverKeyedOneOfFilterItem!]\n    $stringFilters: [ImageResolverKeyedStringFilterItem!]\n    $numericFilters: [ImageResolverKeyedNumericFilterItem!]\n  ) {\n    images(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n      numericFilters: $numericFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...ImagesTableFragment\n      }\n    }\n  }\n": types.ImagesTableDocument,
    "\n      mutation CreateMarathon($input: CreateMarathonInput!) {\n        createMarathon(input: $input) {\n          id\n        }\n      }\n    ": types.CreateMarathonDocument,
    "\n  query MarathonOverviewPage {\n    latestMarathon {\n      ...MarathonViewerFragment\n    }\n    marathons(sendAll: true) {\n      data {\n        ...MarathonTableFragment\n      }\n    }\n  }\n": types.MarathonOverviewPageDocument,
    "\n  fragment MarathonTableFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n  }\n": types.MarathonTableFragmentFragmentDoc,
    "\n        mutation EditMarathon(\n          $input: SetMarathonInput!\n          $marathonId: GlobalId!\n        ) {\n          setMarathon(input: $input, uuid: $marathonId) {\n            id\n          }\n        }\n      ": types.EditMarathonDocument,
    "\n      query GetMarathon($marathonId: GlobalId!) {\n        marathon(uuid: $marathonId) {\n          year\n          startDate\n          endDate\n        }\n      }\n    ": types.GetMarathonDocument,
    "\n  fragment MarathonViewerFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n    hours {\n      id\n      shownStartingAt\n      title\n    }\n  }\n": types.MarathonViewerFragmentFragmentDoc,
    "\n  query MarathonPage($marathonUuid: GlobalId!) {\n    marathon(uuid: $marathonUuid) {\n      ...MarathonViewerFragment\n    }\n  }\n": types.MarathonPageDocument,
    "\n      mutation AddMarathonHour(\n        $input: CreateMarathonHourInput!\n        $marathonUuid: String!\n      ) {\n        createMarathonHour(input: $input, marathonUuid: $marathonUuid) {\n          id\n        }\n      }\n    ": types.AddMarathonHourDocument,
    "\n  query EditMarathonHourData($marathonHourUuid: GlobalId!) {\n    marathonHour(uuid: $marathonHourUuid) {\n      details\n      durationInfo\n      shownStartingAt\n      title\n    }\n  }\n": types.EditMarathonHourDataDocument,
    "\n  mutation EditMarathonHour($input: SetMarathonHourInput!, $uuid: GlobalId!) {\n    setMarathonHour(input: $input, uuid: $uuid) {\n      id\n    }\n  }\n": types.EditMarathonHourDocument,
    "\n  query NotificationManager($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n": types.NotificationManagerDocument,
    "\n  query NotificationViewer($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n": types.NotificationViewerDocument,
    "\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n": types.CreatePersonPageDocument,
    "\n  query EditPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonEditorFragment\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n": types.EditPersonPageDocument,
    "\n  query ViewPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonViewerFragment\n    }\n  }\n": types.ViewPersonPageDocument,
    "\n  query EditTeamPage($uuid: GlobalId!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n": types.EditTeamPageDocument,
    "\n  query ViewTeamFundraisingDocument($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        # TODO: Add filtering and pagination\n        fundraisingEntries(sendAll: true) {\n          data {\n            id\n            amount\n            donatedByText\n            donatedToText\n            donatedOn\n            assignments {\n              id\n              amount\n              person {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ViewTeamFundraisingDocumentDocument,
    "\n  query ViewTeamPage($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n": types.ViewTeamPageDocument,
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
export function graphql(source: "\n  query ActiveMarathon {\n    latestMarathon {\n      id\n      year\n      startDate\n      endDate\n    }\n    marathons(sendAll: true) {\n      data {\n        id\n        year\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveMarathon {\n    latestMarathon {\n      id\n      year\n      startDate\n      endDate\n    }\n    marathons(sendAll: true) {\n      data {\n        id\n        year\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SelectedMarathon($marathonId: GlobalId!) {\n    marathon(uuid: $marathonId) {\n      id\n      year\n      startDate\n      endDate\n    }\n  }\n"): (typeof documents)["\n  query SelectedMarathon($marathonId: GlobalId!) {\n    marathon(uuid: $marathonId) {\n      id\n      year\n      startDate\n      endDate\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImagePicker($stringFilters: [ImageResolverKeyedStringFilterItem!]) {\n    images(stringFilters: $stringFilters, pageSize: 9) {\n      data {\n        id\n        alt\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImagePicker($stringFilters: [ImageResolverKeyedStringFilterItem!]) {\n    images(stringFilters: $stringFilters, pageSize: 9) {\n      data {\n        id\n        alt\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PersonSearch($search: String!) {\n    searchPeopleByName(name: $search) {\n      id\n      name\n      linkblue\n    }\n    personByLinkBlue(linkBlueId: $search) {\n      id\n      name\n      linkblue\n    }\n  }\n"): (typeof documents)["\n  query PersonSearch($search: String!) {\n    searchPeopleByName(name: $search) {\n      id\n      name\n      linkblue\n    }\n    personByLinkBlue(linkBlueId: $search) {\n      id\n      name\n      linkblue\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SingleNotificationFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n    createdAt\n    deliveryCount\n    deliveryIssueCount {\n      DeviceNotRegistered\n      InvalidCredentials\n      MessageRateExceeded\n      MessageTooBig\n      MismatchSenderId\n      Unknown\n    }\n  }\n"): (typeof documents)["\n  fragment SingleNotificationFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n    createdAt\n    deliveryCount\n    deliveryIssueCount {\n      DeviceNotRegistered\n      InvalidCredentials\n      MessageRateExceeded\n      MessageTooBig\n      MismatchSenderId\n      Unknown\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateNotification(\n    $title: String!\n    $body: String!\n    $audience: NotificationAudienceInput!\n    $url: String\n  ) {\n    stageNotification(\n      title: $title\n      body: $body\n      audience: $audience\n      url: $url\n    ) {\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation CreateNotification(\n    $title: String!\n    $body: String!\n    $audience: NotificationAudienceInput!\n    $url: String\n  ) {\n    stageNotification(\n      title: $title\n      body: $body\n      audience: $audience\n      url: $url\n    ) {\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CancelNotificationSchedule($uuid: GlobalId!) {\n    abortScheduledNotification(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation CancelNotificationSchedule($uuid: GlobalId!) {\n    abortScheduledNotification(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteNotification($uuid: GlobalId!, $force: Boolean) {\n    deleteNotification(uuid: $uuid, force: $force) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteNotification($uuid: GlobalId!, $force: Boolean) {\n    deleteNotification(uuid: $uuid, force: $force) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendNotification($uuid: GlobalId!) {\n    sendNotification(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation SendNotification($uuid: GlobalId!) {\n    sendNotification(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ScheduleNotification($uuid: GlobalId!, $sendAt: DateTimeISO!) {\n    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation ScheduleNotification($uuid: GlobalId!, $sendAt: DateTimeISO!) {\n    scheduleNotification(uuid: $uuid, sendAt: $sendAt) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamNameFragment on TeamNode {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment TeamNameFragment on TeamNode {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation PersonCreator($input: CreatePersonInput!) {\n    createPerson(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PersonEditorFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment PersonEditorFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation PersonEditor($uuid: GlobalId!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation PersonEditor($uuid: GlobalId!, $input: SetPersonInput!) {\n    setPerson(uuid: $uuid, input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePointEntry($input: CreatePointEntryInput!) {\n    createPointEntry(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPersonByUuid($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      id\n      name\n      linkblue\n    }\n  }\n"): (typeof documents)["\n  query GetPersonByUuid($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      id\n      name\n      linkblue\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query GetPersonByLinkBlue($linkBlue: String!) {\n    personByLinkBlue(linkBlueId: $linkBlue) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query SearchPersonByName($name: String!) {\n    searchPeopleByName(name: $name) {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePersonByLinkBlue(\n    $linkBlue: String!\n    $email: EmailAddress!\n    $teamUuid: String!\n  ) {\n    createPerson(\n      input: { email: $email, linkblue: $linkBlue, memberOf: [$teamUuid] }\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PointEntryOpportunityLookup($name: String!) {\n    pointOpportunities(\n      stringFilters: { field: name, comparison: SUBSTRING, value: $name }\n      sendAll: true\n    ) {\n      data {\n        name\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  query PointEntryOpportunityLookup($name: String!) {\n    pointOpportunities(\n      stringFilters: { field: name, comparison: SUBSTRING, value: $name }\n      sendAll: true\n    ) {\n      data {\n        name\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePointOpportunity($input: CreatePointOpportunityInput!) {\n    createPointOpportunity(input: $input) {\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePointOpportunity($input: CreatePointOpportunityInput!) {\n    createPointOpportunity(input: $input) {\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: String!) {\n    createTeam(input: $input, marathon: $marathonUuid) {\n      ok\n      uuid\n    }\n  }\n"): (typeof documents)["\n  mutation TeamCreator($input: CreateTeamInput!, $marathonUuid: String!) {\n    createTeam(input: $input, marathon: $marathonUuid) {\n      ok\n      uuid\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamEditorFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    type\n  }\n"): (typeof documents)["\n  fragment TeamEditorFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    type\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation TeamEditor($uuid: GlobalId!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation TeamEditor($uuid: GlobalId!, $input: SetTeamInput!) {\n    setTeam(uuid: $uuid, input: $input) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PeopleTableFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n"): (typeof documents)["\n  fragment PeopleTableFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    primaryCommittee {\n      identifier\n      role\n    }\n  }\n"];
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
export function graphql(source: "\n  fragment TeamsTableFragment on TeamNode {\n    id\n    type\n    name\n    legacyStatus\n    totalPoints\n  }\n"): (typeof documents)["\n  fragment TeamsTableFragment on TeamNode {\n    id\n    type\n    name\n    legacyStatus\n    totalPoints\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationDeliveriesTableFragment on NotificationDeliveryNode {\n    id\n    deliveryError\n    receiptCheckedAt\n    sentAt\n  }\n"): (typeof documents)["\n  fragment NotificationDeliveriesTableFragment on NotificationDeliveryNode {\n    id\n    deliveryError\n    receiptCheckedAt\n    sentAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationDeliveriesTableQuery(\n    $notificationId: String!\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationDeliveryResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationDeliveryResolverKeyedIsNullFilterItem!]\n  ) {\n    notificationDeliveries(\n      notificationUuid: $notificationId\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationDeliveriesTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query NotificationDeliveriesTableQuery(\n    $notificationId: String!\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationDeliveryResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationDeliveryResolverKeyedIsNullFilterItem!]\n  ) {\n    notificationDeliveries(\n      notificationUuid: $notificationId\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationDeliveriesTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NotificationsTableFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n  }\n"): (typeof documents)["\n  fragment NotificationsTableFragment on NotificationNode {\n    id\n    title\n    body\n    deliveryIssue\n    deliveryIssueAcknowledgedAt\n    sendAt\n    startedSendingAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationsTableQuery(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [NotificationResolverKeyedOneOfFilterItem!]\n    $stringFilters: [NotificationResolverKeyedStringFilterItem!]\n  ) {\n    notifications(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationsTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query NotificationsTableQuery(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [NotificationResolverKeyedDateFilterItem!]\n    $isNullFilters: [NotificationResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [NotificationResolverKeyedOneOfFilterItem!]\n    $stringFilters: [NotificationResolverKeyedStringFilterItem!]\n  ) {\n    notifications(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...NotificationsTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePointEntry($uuid: GlobalId!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePointEntry($uuid: GlobalId!) {\n    deletePointEntry(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PointEntryTableFragment on PointEntryNode {\n    id\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    pointOpportunity {\n      name\n      opportunityDate\n    }\n    comment\n  }\n"): (typeof documents)["\n  fragment PointEntryTableFragment on PointEntryNode {\n    id\n    personFrom {\n      name\n      linkblue\n    }\n    points\n    pointOpportunity {\n      name\n      opportunityDate\n    }\n    comment\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePerson($uuid: GlobalId!) {\n    deletePerson(uuid: $uuid) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePerson($uuid: GlobalId!) {\n    deletePerson(uuid: $uuid) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PersonViewerFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n    committees {\n      identifier\n      role\n    }\n  }\n"): (typeof documents)["\n  fragment PersonViewerFragment on PersonNode {\n    id\n    name\n    linkblue\n    email\n    dbRole\n    teams {\n      position\n      team {\n        id\n        name\n      }\n    }\n    committees {\n      identifier\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTeam($uuid: GlobalId!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTeam($uuid: GlobalId!) {\n    deleteTeam(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TeamViewerFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        id\n        name\n        linkblue\n      }\n      position\n    }\n  }\n"): (typeof documents)["\n  fragment TeamViewerFragment on TeamNode {\n    id\n    name\n    marathon {\n      id\n      year\n    }\n    legacyStatus\n    totalPoints\n    type\n    members {\n      person {\n        id\n        name\n        linkblue\n      }\n      position\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query LoginState {\n    loginState {\n      loggedIn\n      dbRole\n      effectiveCommitteeRoles {\n        role\n        identifier\n      }\n    }\n  }\n"): (typeof documents)["\n  query LoginState {\n    loginState {\n      loggedIn\n      dbRole\n      effectiveCommitteeRoles {\n        role\n        identifier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CommitConfigChanges($changes: [CreateConfigurationInput!]!) {\n    createConfigurations(input: $changes) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation CommitConfigChanges($changes: [CreateConfigurationInput!]!) {\n    createConfigurations(input: $changes) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ConfigFragment on ConfigurationNode {\n    id\n    key\n    value\n    validAfter\n    validUntil\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ConfigFragment on ConfigurationNode {\n    id\n    key\n    value\n    validAfter\n    validUntil\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query ConfigQuery {\n        allConfigurations {\n          data {\n            ...ConfigFragment\n          }\n        }\n      }\n    "): (typeof documents)["\n      query ConfigQuery {\n        allConfigurations {\n          data {\n            ...ConfigFragment\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateEvent($input: CreateEventInput!) {\n    createEvent(input: $input) {\n      data {\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventsTableFragment on EventNode {\n    id\n    title\n    description\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    summary\n  }\n"): (typeof documents)["\n  fragment EventsTableFragment on EventNode {\n    id\n    title\n    description\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    summary\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EventsTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [EventResolverKeyedDateFilterItem!]\n    $isNullFilters: [EventResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]\n    $stringFilters: [EventResolverKeyedStringFilterItem!]\n  ) {\n    events(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...EventsTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventEditorFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n"): (typeof documents)["\n  fragment EventEditorFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      id\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SaveEvent($uuid: GlobalId!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SaveEvent($uuid: GlobalId!, $input: SetEventInput!) {\n    setEvent(uuid: $uuid, input: $input) {\n      data {\n        ...EventEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteEvent($uuid: GlobalId!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteEvent($uuid: GlobalId!) {\n    deleteEvent(uuid: $uuid) {\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EventViewerFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n"): (typeof documents)["\n  fragment EventViewerFragment on EventNode {\n    id\n    title\n    summary\n    description\n    location\n    occurrences {\n      interval {\n        start\n        end\n      }\n      fullDay\n    }\n    images {\n      url\n      width\n      height\n      thumbHash\n      alt\n    }\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewEventPage($uuid: GlobalId!) {\n    event(uuid: $uuid) {\n      data {\n        ...EventViewerFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FeedPage {\n    feed(limit: null) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n      }\n    }\n  }\n"): (typeof documents)["\n  query FeedPage {\n    feed(limit: null) {\n      id\n      title\n      createdAt\n      textContent\n      image {\n        url\n        alt\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFeedItem($input: CreateFeedInput!) {\n    createFeedItem(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFeedItem($input: CreateFeedInput!) {\n    createFeedItem(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteFeedItem($uuid: String!) {\n    deleteFeedItem(feedItemUuid: $uuid)\n  }\n"): (typeof documents)["\n  mutation DeleteFeedItem($uuid: String!) {\n    deleteFeedItem(feedItemUuid: $uuid)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateImage($input: CreateImageInput!) {\n    createImage(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateImage($input: CreateImageInput!) {\n    createImage(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ImagesTableFragment on ImageNode {\n    id\n    url\n    thumbHash\n    height\n    width\n    alt\n    mimeType\n    createdAt\n  }\n"): (typeof documents)["\n  fragment ImagesTableFragment on ImageNode {\n    id\n    url\n    thumbHash\n    height\n    width\n    alt\n    mimeType\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImagesTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [ImageResolverKeyedDateFilterItem!]\n    $isNullFilters: [ImageResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [ImageResolverKeyedOneOfFilterItem!]\n    $stringFilters: [ImageResolverKeyedStringFilterItem!]\n    $numericFilters: [ImageResolverKeyedNumericFilterItem!]\n  ) {\n    images(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n      numericFilters: $numericFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...ImagesTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImagesTable(\n    $page: Int\n    $pageSize: Int\n    $sortBy: [String!]\n    $sortDirection: [SortDirection!]\n    $dateFilters: [ImageResolverKeyedDateFilterItem!]\n    $isNullFilters: [ImageResolverKeyedIsNullFilterItem!]\n    $oneOfFilters: [ImageResolverKeyedOneOfFilterItem!]\n    $stringFilters: [ImageResolverKeyedStringFilterItem!]\n    $numericFilters: [ImageResolverKeyedNumericFilterItem!]\n  ) {\n    images(\n      page: $page\n      pageSize: $pageSize\n      sortBy: $sortBy\n      sortDirection: $sortDirection\n      dateFilters: $dateFilters\n      isNullFilters: $isNullFilters\n      oneOfFilters: $oneOfFilters\n      stringFilters: $stringFilters\n      numericFilters: $numericFilters\n    ) {\n      page\n      pageSize\n      total\n      data {\n        ...ImagesTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateMarathon($input: CreateMarathonInput!) {\n        createMarathon(input: $input) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateMarathon($input: CreateMarathonInput!) {\n        createMarathon(input: $input) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonOverviewPage {\n    latestMarathon {\n      ...MarathonViewerFragment\n    }\n    marathons(sendAll: true) {\n      data {\n        ...MarathonTableFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query MarathonOverviewPage {\n    latestMarathon {\n      ...MarathonViewerFragment\n    }\n    marathons(sendAll: true) {\n      data {\n        ...MarathonTableFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MarathonTableFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n  }\n"): (typeof documents)["\n  fragment MarathonTableFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n        mutation EditMarathon(\n          $input: SetMarathonInput!\n          $marathonId: GlobalId!\n        ) {\n          setMarathon(input: $input, uuid: $marathonId) {\n            id\n          }\n        }\n      "): (typeof documents)["\n        mutation EditMarathon(\n          $input: SetMarathonInput!\n          $marathonId: GlobalId!\n        ) {\n          setMarathon(input: $input, uuid: $marathonId) {\n            id\n          }\n        }\n      "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query GetMarathon($marathonId: GlobalId!) {\n        marathon(uuid: $marathonId) {\n          year\n          startDate\n          endDate\n        }\n      }\n    "): (typeof documents)["\n      query GetMarathon($marathonId: GlobalId!) {\n        marathon(uuid: $marathonId) {\n          year\n          startDate\n          endDate\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MarathonViewerFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n    hours {\n      id\n      shownStartingAt\n      title\n    }\n  }\n"): (typeof documents)["\n  fragment MarathonViewerFragment on MarathonNode {\n    id\n    year\n    startDate\n    endDate\n    hours {\n      id\n      shownStartingAt\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MarathonPage($marathonUuid: GlobalId!) {\n    marathon(uuid: $marathonUuid) {\n      ...MarathonViewerFragment\n    }\n  }\n"): (typeof documents)["\n  query MarathonPage($marathonUuid: GlobalId!) {\n    marathon(uuid: $marathonUuid) {\n      ...MarathonViewerFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation AddMarathonHour(\n        $input: CreateMarathonHourInput!\n        $marathonUuid: String!\n      ) {\n        createMarathonHour(input: $input, marathonUuid: $marathonUuid) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation AddMarathonHour(\n        $input: CreateMarathonHourInput!\n        $marathonUuid: String!\n      ) {\n        createMarathonHour(input: $input, marathonUuid: $marathonUuid) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditMarathonHourData($marathonHourUuid: GlobalId!) {\n    marathonHour(uuid: $marathonHourUuid) {\n      details\n      durationInfo\n      shownStartingAt\n      title\n    }\n  }\n"): (typeof documents)["\n  query EditMarathonHourData($marathonHourUuid: GlobalId!) {\n    marathonHour(uuid: $marathonHourUuid) {\n      details\n      durationInfo\n      shownStartingAt\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditMarathonHour($input: SetMarathonHourInput!, $uuid: GlobalId!) {\n    setMarathonHour(input: $input, uuid: $uuid) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation EditMarathonHour($input: SetMarathonHourInput!, $uuid: GlobalId!) {\n    setMarathonHour(input: $input, uuid: $uuid) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationManager($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query NotificationManager($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query NotificationViewer($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query NotificationViewer($uuid: GlobalId!) {\n    notification(uuid: $uuid) {\n      data {\n        ...SingleNotificationFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query CreatePersonPage {\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonEditorFragment\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonEditorFragment\n    }\n    teams(sendAll: true, sortBy: [\"name\"], sortDirection: [asc]) {\n      data {\n        ...TeamNameFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonViewerFragment\n    }\n  }\n"): (typeof documents)["\n  query ViewPersonPage($uuid: GlobalId!) {\n    person(uuid: $uuid) {\n      ...PersonViewerFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditTeamPage($uuid: GlobalId!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditTeamPage($uuid: GlobalId!) {\n    team(uuid: $uuid) {\n      data {\n        ...TeamEditorFragment\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewTeamFundraisingDocument($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        # TODO: Add filtering and pagination\n        fundraisingEntries(sendAll: true) {\n          data {\n            id\n            amount\n            donatedByText\n            donatedToText\n            donatedOn\n            assignments {\n              id\n              amount\n              person {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewTeamFundraisingDocument($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        # TODO: Add filtering and pagination\n        fundraisingEntries(sendAll: true) {\n          data {\n            id\n            amount\n            donatedByText\n            donatedToText\n            donatedOn\n            assignments {\n              id\n              amount\n              person {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ViewTeamPage($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ViewTeamPage($teamUuid: GlobalId!) {\n    team(uuid: $teamUuid) {\n      data {\n        ...TeamViewerFragment\n        pointEntries {\n          ...PointEntryTableFragment\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;