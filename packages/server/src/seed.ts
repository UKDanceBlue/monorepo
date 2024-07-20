import {
  CommitteeIdentifier,
  CommitteeRole,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import { NotFoundError } from "@ukdanceblue/common/error";
import { Ok } from "ts-results-es";
import { Container } from "typedi";

import { CatchableConcreteError } from "#lib/formatError.js";
import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { TeamRepository } from "#repositories/team/TeamRepository.js";

if (process.env.NODE_ENV !== "development") {
  throw new Error("Seeding is only allowed in development mode");
}

const { prisma } = await import("./prisma.js");

try {
  const personRepository = Container.get(PersonRepository);
  const committeeRepository = Container.get(CommitteeRepository);
  const teamRepository = Container.get(TeamRepository);
  const configurationRepository = Container.get(ConfigurationRepository);
  const marathonRepository = Container.get(MarathonRepository);

  const techCommitteeMembers: [string, string][] = [
    ["jtho264@uky.edu", "jtho264"],
    ["Camille.Dyer@uky.edu", "chdy223"],
    ["str249@uky.edu", "str249"],
  ];

  const randoms: [string, string, string][] = [
    ["abcd123@uky.edu", "abcd123", "Johnny Appleseed"],
    ["dcba321@uky.edu", "dcba321", "Jane Doe"],
    ["mike@uky.edu", "mike123", "Mike"],
  ];

  const peopleToCreate: [string, string][] = [];

  for (const person of [...techCommitteeMembers, ...randoms]) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await personRepository.findPersonByUnique({
      linkblue: person[1],
    });
    if (existing.isErr() && existing.error.tag === NotFoundError.Tag) {
      peopleToCreate.push([person[0], person[1]]);
    }
  }

  const allPeople = await Promise.all(
    peopleToCreate.map(([email, linkblue]) =>
      personRepository.createPerson({
        email,
        linkblue,
      })
    )
  );

  if (allPeople.some((p) => p.isErr())) {
    throw new Error(`Failed to create all people ${JSON.stringify(allPeople)}`);
  }

  const techCommitteePeople = await Promise.all(
    techCommitteeMembers.map(([_, linkblue]) =>
      personRepository.findPersonByUnique({ linkblue })
    )
  );

  if (techCommitteePeople.length !== techCommitteeMembers.length) {
    throw new Error("Failed to create all tech committee people");
  }

  let marathon = await marathonRepository.findMarathonByUnique({
    year: "DB24",
  });

  if (marathon.isErr()) {
    marathon = await marathonRepository.createMarathon({
      year: "DB24",
    });
  }
  if (marathon.isErr()) {
    throw new Error("Failed to create marathon");
  }

  const overallCommittee = await committeeRepository.getCommittee(
    CommitteeIdentifier.overallCommittee
  );

  if (overallCommittee.isErr()) {
    throw new CatchableConcreteError(overallCommittee.error);
  }

  const techCommittee = await committeeRepository.getCommittee(
    CommitteeIdentifier.techCommittee
  );

  if (techCommittee.isErr()) {
    throw new CatchableConcreteError(techCommittee.error);
  }

  let techCommitteeTeam = await committeeRepository.getCommitteeTeam(
    CommitteeIdentifier.techCommittee,
    { year: "DB24" }
  );
  if (techCommitteeTeam.isErr()) {
    techCommitteeTeam = Ok(
      await teamRepository.createTeam(
        {
          name: "Tech Committee",
          legacyStatus: TeamLegacyStatus.ReturningTeam,
          type: TeamType.Spirit,
        },
        { id: marathon.value.id }
      )
    );
  }
  if (techCommitteeTeam.isErr()) {
    throw new CatchableConcreteError(techCommitteeTeam.error);
  }

  const [randomPeopleTeam] = await teamRepository.listTeams({
    filters: [{ comparison: "EQUALS", field: "name", value: "Random People" }],
    marathon: [{ year: "DB24" }],
  });
  if (!randomPeopleTeam) {
    await teamRepository.createTeam(
      {
        name: "Random People",
        legacyStatus: TeamLegacyStatus.NewTeam,
        type: TeamType.Spirit,
      },
      { id: marathon.value.id }
    );
  }

  await teamRepository.updateTeam(
    { id: techCommitteeTeam.value.id },
    {
      correspondingCommittee: {
        connect: {
          identifier: CommitteeIdentifier.techCommittee,
        },
      },
    }
  );

  await Promise.all(
    techCommitteePeople.flatMap((person) =>
      committeeRepository.assignPersonToCommittee(
        {
          id: person.unwrap().id,
        },
        CommitteeIdentifier.techCommittee,
        CommitteeRole.Coordinator,
        { id: marathon.value.id }
      )
    )
  );

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
