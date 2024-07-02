import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { Container } from "typedi";

import { isDevelopment } from "#environment";
import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

if (!isDevelopment) {
  throw new Error("Seeding is only allowed in development mode");
}

const { prisma } = await import("./prisma.js");

try {
  const personRepository = Container.get(PersonRepository);
  const committeeRepository = Container.get(CommitteeRepository);

  const techCommittee: [string, string][] = [
    ["jtho264@uky.edu", "jtho264"],
    ["Camille.Dyer@uky.edu", "chdy223"],
    ["str249@uky.edu", "str249"],
  ];

  const randoms: [string, string, string][] = [
    ["abcd123@uky.edu", "abcd123", "Johnny Appleseed"],
    ["dcba321@uky.edu", "dcba321", "Jane Doe"],
    ["mike@uky.edu", "mike123", "Mike"],
  ];

  const techPeople = await Promise.all(
    techCommittee.map(([email, linkblue]) =>
      personRepository.createPerson({
        email,
        linkblue,
      })
    )
  );

  if (techPeople.some((p) => p.isErr())) {
    throw new Error("Failed to create all tech committee people");
  }

  await Promise.all(
    techPeople.flatMap((person) =>
      committeeRepository.assignPersonToCommittee(
        {
          id: person.unwrap().id,
        },
        CommitteeIdentifier.techCommittee,
        CommitteeRole.Coordinator
      )
    )
  );

  const randomPeople = await Promise.all(
    randoms.map(([email, linkblue, name]) =>
      personRepository.createPerson({
        email,
        linkblue,
        name,
      })
    )
  );

  if (randomPeople.length !== randoms.length) {
    throw new Error("Failed to create all random people");
  }
  if (techPeople.length !== techCommittee.length) {
    throw new Error("Failed to create all tech committee people");
  }

  // const teamRepository = Container.get(TeamRepository);

  // await teamRepository.createTeam({
  //   name: "Tech Committee",
  //   legacyStatus: TeamLegacyStatus.ReturningTeam,
  //   marathonYear: "DB24",
  //   type: TeamType.Committee,
  //   memberships: {
  //     connect: techPeople,
  //   },
  //   persistentIdentifier: CommitteeIdentifier.techCommittee,
  // });

  // await teamRepository.createTeam({
  //   name: "Random People",
  //   legacyStatus: TeamLegacyStatus.NewTeam,
  //   marathonYear: "DB24",
  //   type: TeamType.Spirit,
  //   memberships: {
  //     connect: randomPeople,
  //   },
  // });

  const configurationRepository = Container.get(ConfigurationRepository);

  await configurationRepository.createConfiguration({
    key: "TAB_BAR_CONFIG",
    validAfter: null,
    validUntil: null,
    value: JSON.stringify({
      shownTabs: ["Teams", "Events"],
      fancyTab: "Teams",
    }),
  });
  await configurationRepository.createConfiguration({
    key: "ALLOWED_LOGIN_TYPES",
    validAfter: null,
    validUntil: null,
    value: JSON.stringify(["anonymous", "ms-oath-linkblue"]),
  });
} finally {
  await prisma.$disconnect();
}
