# ACL Summary
Generated automatically on 1/25/2025. This document lists the required permissions for each GraphQL endpoint in the DanceBlue Server
## NotificationNode
### deliveryIssue
**get** every NotificationNode.deliveryIssue
### deliveryIssueAcknowledgedAt
**get** every NotificationNode.deliveryIssueAcknowledgedAt
## NotificationDeliveryNode
### receiptCheckedAt
**get** every NotificationDeliveryNode.receiptCheckedAt
### chunkUuid
**get** every NotificationDeliveryNode.chunkUuid
### deliveryError
**get** every NotificationDeliveryNode.deliveryError
## ConfigurationResolver
### activeConfiguration
**readActive** every ConfigurationNode.
### configuration
**get** ConfigurationNode. with an id of _args.id_
### allConfigurations
**list** every ConfigurationNode.
### createConfiguration
**create** every ConfigurationNode.
### batchCreate
**create** every ConfigurationNode.
### deleteConfiguration
**delete** every ConfigurationNode.
## DeviceResolver
### devices
**list** every DeviceNode.
### deleteDevice
**delete** DeviceNode. with an id of _args.id_
## EventResolver
### event
**get** EventNode. with an id of _args.id_
### events
**list** every EventNode.
### createEvent
**create** every EventNode.
### deleteEvent
**delete** EventNode. with an id of _args.id_
### setEvent
**update** EventNode. with an id of _args.id_
### removeImage
**update** EventNode. with an id of _args.eventId_
### addExistingImage
**update** EventNode. with an id of _args.eventId_
## FundraisingAssignmentResolver
### fundraisingAssignment
**get** custom function (.fundraisingAssignments):
```js
(_, { entryId }) => {
        if (!isGlobalId(entryId)) {
            return Err(new InvalidArgumentError("Invalid entryId"));
        }
        return new AsyncResult(Container.get(FundraisingEntryRepository).getMembershipForAssignment({
            uuid: entryId.id,
        })).map(({ team: { uuid } }) => ({
            id: uuid,
            kind: "TeamNode",
        }));
    }
```
### assignEntryToPerson
**create** custom function (.fundraisingAssignments):
```js
(_, { entryId }) => {
        if (!isGlobalId(entryId)) {
            return Err(new InvalidArgumentError("Invalid entryId"));
        }
        return new AsyncResult(Container.get(FundraisingEntryRepository).getMembershipForAssignment({
            uuid: entryId.id,
        })).map(({ team: { uuid } }) => ({
            id: uuid,
            kind: "TeamNode",
        }));
    }
```
### updateFundraisingAssignment
**update** custom function (.fundraisingAssignments):
```js
(_, { entryId }) => {
        if (!isGlobalId(entryId)) {
            return Err(new InvalidArgumentError("Invalid entryId"));
        }
        return new AsyncResult(Container.get(FundraisingEntryRepository).getMembershipForAssignment({
            uuid: entryId.id,
        })).map(({ team: { uuid } }) => ({
            id: uuid,
            kind: "TeamNode",
        }));
    }
```
### deleteFundraisingAssignment
**delete** custom function (.fundraisingAssignments):
```js
(_, { entryId }) => {
        if (!isGlobalId(entryId)) {
            return Err(new InvalidArgumentError("Invalid entryId"));
        }
        return new AsyncResult(Container.get(FundraisingEntryRepository).getMembershipForAssignment({
            uuid: entryId.id,
        })).map(({ team: { uuid } }) => ({
            id: uuid,
            kind: "TeamNode",
        }));
    }
```
## FundraisingEntryResolver
### fundraisingEntry
**get** FundraisingEntryNode. with an id of _args.id_
### fundraisingEntries
**list** every FundraisingEntryNode.
### assignments
**list** custom function (.fundraisingAssignments):
```js
(_info, _args, root) => {
        if (!root) {
            return Err(new InvariantError("Root is required"));
        }
        const { id: fundraisingEntryId } = root;
        const solicitationCodeRepository = Container.get(SolicitationCodeRepository);
        const marathonRepository = Container.get(MarathonRepository);
        return assertGlobalId(fundraisingEntryId)
            .toAsyncResult()
            .andThen(({ id }) => new AsyncResult(solicitationCodeRepository.getSolicitationCodeForEntry({
            uuid: id,
        })))
            .andThen((solicitationCode) => {
            return new AsyncResult(marathonRepository.findActiveMarathon())
                .andThen((marathon) => marathon.toResult(new NotFoundError("Active Marathon")))
                .map((marathon) => ({
                marathonId: marathon.id,
                solicitationCodeId: solicitationCode.id,
            }));
        })
            .andThen(({ marathonId, solicitationCodeId }) => new AsyncResult(solicitationCodeRepository.getTeamsForSolitationCode({ id: solicitationCodeId }, {
            marathonParam: { id: marathonId },
        })))
            .map((teams) => ({
            kind: "TeamNode",
            id: teams.map(({ uuid }) => uuid),
        }));
    }
```
### setFundraisingEntry
**update** FundraisingEntryNode. with an id of _args.id_
### rawFundraisingTotals
**list** every FundraisingEntryNode.
### rawFundraisingEntries
**list** every FundraisingEntryNode.
## ImageResolver
### image
**get** ImageNode. with an id of _args.id_
### images
**list** every ImageNode.
### createImage
**create** every ImageNode.
### setImageAltText
**update** ImageNode. with an id of _args.id_
### setImageUrl
**update** ImageNode. with an id of _args.id_
### deleteImage
**delete** ImageNode. with an id of _args.id_
## MarathonHourResolver
### marathonHour
**get** MarathonHourNode. with an id of _args.id_
### currentMarathonHour
**readActive** every MarathonHourNode.
### marathonHours
**list** every MarathonHourNode.
### createMarathonHour
**create** every MarathonHourNode.
### setMarathonHour
**update** MarathonHourNode. with an id of _args.id_
### deleteMarathonHour
**delete** MarathonHourNode. with an id of _args.id_
### addMap
**update** MarathonHourNode. with an id of _args.id_
### removeMap
**update** MarathonHourNode. with an id of _args.id_
## MarathonResolver
### marathon
**get** MarathonNode. with an id of _args.id_
### marathonForYear
**get** every MarathonNode.
### marathons
**list** every MarathonNode.
### currentMarathon
**readActive** every MarathonNode.
### latestMarathon
**readActive** every MarathonNode.
### createMarathon
**create** every MarathonNode.
### setMarathon
**update** MarathonNode. with an id of _args.id_
### deleteMarathon
**delete** MarathonNode. with an id of _args.id_
### hours
**list** MarathonNode. with an id of _root.id_
## NotificationResolver
### notification
**get** NotificationNode. with an id of _args.id_
### notifications
**list** every NotificationNode.
### listDeliveries
**list** every NotificationDeliveryNode.
### stage
**create** every NotificationNode.
### send
**deploy** NotificationNode. with an id of _args.id_
### schedule
**deploy** NotificationNode. with an id of _args.id_
### acknowledgeDeliveryIssue
**deploy** NotificationNode. with an id of _args.id_
### abortScheduled
**deploy** NotificationNode. with an id of _args.id_
### deleteNotification
**delete** NotificationNode. with an id of _args.id_
### deliveryCount
**get** NotificationNode. with an id of _root.id_
### deliveryIssueCount
**get** NotificationNode. with an id of _root.id_
## PersonResolver
### person
**get** PersonNode. with an id of _args.id_
### getByLinkBlueId
**get** custom function (.):
```js
(_info, { linkBlueId }) => {
        const personRepository = Container.get(PersonRepository);
        if (typeof linkBlueId !== "string") {
            return Err(new InvalidArgumentError("linkBlueId must be a string"));
        }
        return new AsyncResult(personRepository.findPersonByUnique({
            linkblue: linkBlueId.toLowerCase(),
        }))
            .andThen((row) => row.toResult(new NotFoundError("Person")))
            .map(({ uuid }) => ({ kind: "PersonNode", id: uuid }));
    }
```
### people
**list** every PersonNode.
### searchByName
**list** every PersonNode.
### createPerson
**create** every PersonNode.
### setPerson
**update** PersonNode. with an id of _args.id_
### bulkLoad
**create** every PersonNode.
### assignPersonToTeam
**update** TeamNode.members with an id of _args.teamUuid_
### unassignPersonFromTeam
**update** TeamNode.members with an id of _args.teamUuid_
### deletePerson
**delete** PersonNode. with an id of _args.id_
### committees
**get** PersonNode.memberships with an id of _root.id_
### teams
**get** PersonNode.memberships with an id of _root.id_
### moraleTeams
**get** PersonNode.memberships with an id of _root.id_
### primaryCommittee
**get** PersonNode.memberships with an id of _root.id_
### primaryTeam
**get** PersonNode.memberships with an id of _root.id_
### fundraisingTotalAmount
**get** PersonNode.fundraisingAssignments with an id of _root.id_
### fundraisingAssignments
**list** PersonNode.fundraisingAssignments with an id of _root.id_
### hasPassword
**get** PersonNode.password with an id of _root.id_
### setPassword
**update** PersonNode.password with an id of _args.id_
## PointEntryResolver
### pointEntry
**get** PointEntryNode. with an id of _args.id_
### pointEntries
**list** every PointEntryNode.
### createPointEntry
**create** every PointEntryNode.
### deletePointEntry
**delete** PointEntryNode. with an id of _args.id_
## PointOpportunityResolver
### pointOpportunity
**get** PointOpportunityNode. with an id of _args.id_
### pointOpportunities
**list** every PointOpportunityNode.
### createPointOpportunity
**create** every PointOpportunityNode.
### setPointOpportunity
**update** PointOpportunityNode. with an id of _args.id_
### deletePointOpportunity
**delete** PointOpportunityNode. with an id of _args.id_
## TeamResolver
### team
**get** TeamNode. with an id of _args.id_
### teams
**list** every TeamNode.
### createTeam
**create** every TeamNode.
### setTeam
**update** TeamNode. with an id of _args.id_
### createTeams
**create** every TeamNode.
### deleteTeam
**delete** TeamNode. with an id of _args.id_
### members
**get** TeamNode. with an id of _root.id_
### pointEntries
**get** every TeamNode.
### fundraisingTotalAmount
**get** TeamNode.fundraisingTotal with an id of _root.id_
### fundraisingEntries
**list** TeamNode.fundraisingEntries with an id of _root.id_
### solicitationCode
**get** TeamNode.solicitationCode with an id of _root.id_
## DailyDepartmentNotificationResolver
### dailyDepartmentNotification
**get** DailyDepartmentNotificationNode. with an id of _args.id_
### dailyDepartmentNotifications
**list** every DailyDepartmentNotificationNode.
### createDailyDepartmentNotification
**create** every DailyDepartmentNotificationNode.
### batchUploadDailyDepartmentNotifications
**create** every DailyDepartmentNotificationNode.
### deleteDailyDepartmentNotification
**delete** DailyDepartmentNotificationNode. with an id of _args.id_
## DailyDepartmentNotificationBatchResolver
### dailyDepartmentNotificationBatch
**get** DailyDepartmentNotificationBatchNode. with an id of _args.id_
### deleteDailyDepartmentNotificationBatch
**list** every DailyDepartmentNotificationBatchNode.
## FeedResolver
### feedItem
**get** FeedNode. with an id of _args.feedItemId_
### feed
**readActive** every FeedNode.
### createFeedItem
**create** every FeedNode.
### attachImageToFeedItem
**update** FeedNode. with an id of _args.feedItemUuid_
### removeImageFromFeedItem
**update** FeedNode. with an id of _args.feedItemUuid_
### setFeedItem
**update** FeedNode. with an id of _args.feedItemUuid_
### deleteFeedItem
**delete** custom function (.):
```js
(_, { feedItemUuid }) => assertGlobalId(feedItemUuid).map(({ id }) => ({ kind: "FeedNode", id }))
```
## SolicitationCodeResolver
### solicitationCode
**get** SolicitationCodeNode. with an id of _args.id_
### solicitationCodes
**list** every SolicitationCodeNode.
### createSolicitationCode
**create** every SolicitationCodeNode.
### setSolicitationCode
**update** SolicitationCodeNode. with an id of _args.id_
### entries
**list** every FundraisingEntryNode.
### teams
**list** every TeamNode.
### assignSolicitationCodeToTeam
**update** SolicitationCodeNode. with an id of _args.id_
### removeSolicitationCodeFromTeam
**update** SolicitationCodeNode. with an id of _args.id_
## NodeResolver
### node
**get** custom function (.):
```js
(_info, { id }) => {
        return assertGlobalId(id).andThen((globalId) => {
            const { id, typename } = globalId;
            if (!isSubjectString(typename)) {
                return Err(new InvalidArgumentError("Could not determine the type of node"));
            }
            if (typename === "all") {
                return Err(new InvalidArgumentError("Unknown typename: all"));
            }
            return Ok({ id, kind: typename });
        });
    }
```
## AuditLogResolver
### auditLogs
**read** every AuditLogNode.
### subject
**read** all
### subjectJson
**read** all
## ReportResolver
### fundraisingReport
**list** every FundraisingEntryNode.