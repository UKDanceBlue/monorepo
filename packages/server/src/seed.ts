import {
  CommitteeIdentifier,
  CommitteeRole,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import { Container } from "typedi";

import { isDevelopment } from "./environment.js";
import { ConfigurationRepository } from "./repositories/configuration/ConfigurationRepository.js";
import { PersonRepository } from "./repositories/person/PersonRepository.js";
import { TeamRepository } from "./repositories/team/TeamRepository.js";

if (!isDevelopment) {
  throw new Error("Seeding is only allowed in development mode");
}

await import("./prisma.js");

const personRepository = Container.get(PersonRepository);

const techCommittee: [string, string][] = [
  ["jtho264@uky.edu", "jtho264"],
  ["jp.huse@uky.edu", "jphu235"],
  ["bartholomai@uky.edu", "mdba238"],
  ["Camille.Dyer@uky.edu", "chdy223"],
  ["str249@uky.edu", "str249"],
];

const randos: [string, string, string][] = [
  ["abcd123@uky.edu", "abcd123", "Johnny Appleseed"],
  ["dcba321@uky.edu", "dcba321", "Jane Doe"],
  ["mike@uky.edu", "mike123", "Mike"],
];

const techPeople = await Promise.all(
  techCommittee.map(async ([email, linkblue]) =>
    personRepository.createPerson({
      email,
      linkblue,
      committeeRole: CommitteeRole.Coordinator,
      committeeName: CommitteeIdentifier.techCommittee,
    })
  )
);

const randoPeople = await Promise.all(
  randos.map(async ([email, linkblue, name]) =>
    personRepository.createPerson({
      email,
      linkblue,
      name,
    })
  )
);

const teamRepository = Container.get(TeamRepository);

await teamRepository.createTeam({
  name: "Tech Committee",
  legacyStatus: TeamLegacyStatus.ReturningTeam,
  marathonYear: "DB24",
  type: TeamType.Committee,
  memberships: {
    connect: techPeople,
  },
});

await teamRepository.createTeam({
  name: "Random People",
  legacyStatus: TeamLegacyStatus.NewTeam,
  marathonYear: "DB24",
  type: TeamType.Spirit,
  memberships: {
    connect: randoPeople,
  },
});

const configurationRepository = Container.get(ConfigurationRepository);

await configurationRepository.createConfiguration({
  key: "TAB_BAR_CONFIG",
  validAfter: null,
  validUntil: null,
  value: JSON.stringify({ shownTabs: ["Teams", "Events"], fancyTab: "Teams" }),
});
await configurationRepository.createConfiguration({
  key: "ALLOWED_LOGIN_TYPES",
  validAfter: null,
  validUntil: null,
  value: JSON.stringify(["anonymous", "ms-oath-linkblue"]),
});
