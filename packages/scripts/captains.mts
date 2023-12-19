import { readFileSync } from "fs";

/**
 * @type {{teamUuid: string, captainLinkblue: string, captainUuid?: string}[]}
 */
const teamCaptains = JSON.parse(readFileSync("capatinsToAdd.json", "utf8"));

const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3NvdXJjZSI6IlVreUxpbmtibHVlIiwiZGJSb2xlIjoiQ29tbWl0dGVlIiwiYWNjZXNzX2xldmVsIjo0LCJzdWIiOiJjMjIyM2NkZi00YmY3LTQwYzktYTg3Zi03MjVkMTRlMmQ0ZTUiLCJjb21taXR0ZWVfcm9sZSI6IkNvb3JkaW5hdG9yIiwiY29tbWl0dGVlIjoidGVjaENvbW1pdHRlZSIsInRlYW1faWRzIjpbIjlhOWNjZmFmLTIxNGMtNDkxMi1iMTA3LWRkOTA1N2U3NzFhZiJdLCJjYXB0YWluX29mX3RlYW1faWRzIjpbXSwiaWF0IjoxNzAyOTYwMDQwLCJleHAiOjE3MDMwNDY0NDAsImlzcyI6Imh0dHBzOi8vYXBwLmRhbmNlYmx1ZS5vcmcifQ.in9YGZfKdCISWxpOvSf-a97x5xlLbyBWEMHrUtqM3bA";

const headers = {
  "Authorization": `Bearer ${bearerToken}`,
  "Content-Type": "application/json",
};

// Queries
function captainUuidQuery(captainLinkblue: string) {
  return {
    query:
      "query PersonByLinkBlue($linkBlueId: String!) {\n  personByLinkBlue(linkBlueId: $linkBlueId) {\n    data {\n      uuid\n    }\n  }\n}",
    variables: { linkBlueId: captainLinkblue },
    operationName: "PersonByLinkBlue",
  };
}

function createPerson(captainLinkblue: string, teamUuid: string) {
  return {
    query:
      "mutation CreatePerson($input: CreatePersonInput!) {\n  createPerson(input: $input) {\n    ok\n  }\n}",
    variables: {
      input: {
        captainOf: [teamUuid],
        email: `${captainLinkblue}@uky.edu`,
        linkblue: captainLinkblue,
        memberOf: [],
      },
    },
    operationName: "CreatePerson",
  };
}

function makeCaptain(captainUuid: string, teamUuid: string) {
  return {
    query:
      "mutation Mutation($input: SetPersonInput!, $uuid: String!) {\n  setPerson(input: $input, uuid: $uuid) {\n    ok\n  }\n}",
    variables: {
      input: { captainOf: [teamUuid], memberOf: [] },
      uuid: captainUuid,
    },
    operationName: "Mutation",
  };
}

// Load the captainUuids

const promises = [];

for (const teamCaptain of teamCaptains) {
  promises.push(
    fetch("https://app.danceblue.org/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(captainUuidQuery(teamCaptain.captainLinkblue)),
    })
      .then((res) => res.json())
      .then(
        (res: { data: { personByLinkBlue: { data: { uuid: string } } } }) => {
          if (res.data.personByLinkBlue.data) {
            teamCaptain.captainUuid = res.data.personByLinkBlue.data.uuid;
          }
        }
      )
  );
}

await Promise.all(promises);

// Split the captains into two groups, those that need to be created and those that need to be made captains

const captainsToCreate = [];
const captainsToMakeCaptain = [];

for (const teamCaptain of teamCaptains) {
  if (!teamCaptain.captainUuid) {
    captainsToCreate.push(teamCaptain);
  } else {
    captainsToMakeCaptain.push(teamCaptain);
  }
}

// Create the captains

const createPromises = [];

for (const teamCaptain of captainsToCreate) {
  createPromises.push(
    fetch("https://app.danceblue.org/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(
        createPerson(teamCaptain.captainLinkblue, teamCaptain.teamUuid)
      ),
    })
  );
}

await Promise.all(createPromises);

// Make the captains

const makePromises = [];

for (const teamCaptain of captainsToMakeCaptain) {
  makePromises.push(
    fetch("https://app.danceblue.org/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify(
        makeCaptain(teamCaptain.captainUuid, teamCaptain.teamUuid)
      ),
    })
  );
}

await Promise.all(makePromises);
