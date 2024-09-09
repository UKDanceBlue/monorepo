import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { FormattedConcreteError } from "@ukdanceblue/common/error";
import { Container } from "@freshgum/typedi";

if (process.env.NODE_ENV !== "development") {
  throw new Error("Seeding is only allowed in development mode");
}

const { prisma } = await import("./prisma.js");

try {
  const personRepository = Container.get(PersonRepository);
  const committeeRepository = Container.get(CommitteeRepository);
  const configurationRepository = Container.get(ConfigurationRepository);
  const marathonRepository = Container.get(MarathonRepository);

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

  const marathon = await marathonRepository.createMarathon({ year: "DB24" });
  if (marathon.isErr()) {
    throw new FormattedConcreteError(marathon);
  }

  const ensureCommitteesResult = await committeeRepository.ensureCommittees([
    marathon.value,
  ]);
  if (ensureCommitteesResult.isErr()) {
    throw new FormattedConcreteError(ensureCommitteesResult);
  }

  const techChair = await personRepository.createPerson({
    email: "jtho264@uky.edu",
    linkblue: "jtho264",
  });
  if (techChair.isErr()) {
    throw new FormattedConcreteError(techChair);
  }

  await committeeRepository.assignPersonToCommittee(
    { id: techChair.value.id },
    CommitteeIdentifier.techCommittee,
    CommitteeRole.Chair,
    { id: marathon.value.id }
  );
} finally {
  await prisma.$disconnect();
}
