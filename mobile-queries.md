# List of GQL API Queries used by the Mobile App

## Summary:

```js
activeConfiguration(key: "TRIVIA_CRACK").data
```

```js
me.teams.team
```

```js
me.primaryCommittee
```

```js
me.primaryTeam(teamType: TeamType).team.pointEntries.personFrom
```

```js
me.primaryTeam(teamType: TeamType).team.members.person
```

```js
me.fundraisingAssignments.entry
```

```js
loginState.loggedIn
```

```js
device(uuid: String).data.notificationDeliveries.notification
```

```js
events(dateFilters: [{comparison: GREATER_THAN_OR_EQUAL_TO, field: occurrenceStart, value: DateTimeISO }, { comparison: LESS_THAN_OR_EQUAL_TO, field: occurrenceStart, value: DateTimeISO }], sortDirection: asc, sortBy: "occurrence").data.occurrences.interval
```

```js
events(dateFilters: [{comparison: GREATER_THAN_OR_EQUAL_TO, field: occurrenceStart, value: DateTimeISO }, { comparison: LESS_THAN_OR_EQUAL_TO, field: occurrenceStart, value: DateTimeISO }], sortDirection: asc, sortBy: "occurrence").data.images
```

```js
feed(limit: 20).image
```

```js
currentMarathon.mapImages
```

```js
latestMarathon.hours.mapImages
```

```js
teams(sortBy: ["totalPoints", "name"], sortDirection: [desc, asc], type: TeamType, marathonId: GlobalId, sendAll: true).data
```

```js
currentMarathon.id
```

```js
registerDevice(input: RegisterDeviceInput)
```

## Queries:

```graphql
query MobileQuery(
  $type: TeamType!
  $deviceUuid: String!
  $pageSize: Int
  $page: Int
  $verifier: String
  $earliestTimestamp: DateTimeISO!
  $lastTimestamp: DateTimeISO!
  $marathonId: GlobalId!
) {
  activeConfiguration(key: "TRIVIA_CRACK") {
    data {
      id
    }
  }

  me {
    teams {
      team {
        id
      }
    }
    primaryCommittee {
      id
    }
    primaryTeam(teamType: $type) {
      team {
        pointEntries {
          personFrom {
            id
          }
        }
        members {
          person {
            id
          }
        }
      }
    }
    fundraisingAssignments {
      entry {
        id
      }
    }
  }

  loginState {
    loggedIn
  }

  device(uuid: $deviceUuid) {
    data {
      notificationDeliveries(
        pageSize: $pageSize
        page: $page
        verifier: $verifier
      ) {
        notification {
          id
        }
      }
    }
  }

  events(
    dateFilters: [
      {
        comparison: GREATER_THAN_OR_EQUAL_TO
        field: occurrenceStart
        value: $earliestTimestamp
      }
      {
        comparison: LESS_THAN_OR_EQUAL_TO
        field: occurrenceStart
        value: $lastTimestamp
      }
    ]
    sortDirection: asc
    sortBy: "occurrence"
  ) {
    data {
      occurrences {
        interval {
          start
          end
        }
      }
      images {
        id
      }
    }
  }

  feed(limit: 20) {
    image {
      id
    }
  }

  currentMarathonHour {
    mapImages {
      id
    }
  }

  latestMarathon {
    hours {
      mapImages {
        id
      }
    }
  }

  teams(
    sendAll: true
    sortBy: ["totalPoints", "name"]
    sortDirection: [desc, asc]
    type: [$type]
    marathonId: [$marathonId]
  ) {
    data {
      id
    }
  }

  currentMarathon {
    id
  }
}

mutation RegisterDevice($input: RegisterDeviceInput!) {
  registerDevice(input: $input) {
    ok
  }
}
``
```
