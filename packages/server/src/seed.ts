/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import { Container } from "@freshgum/typedi";
import {
  CommitteeIdentifier,
  CommitteeRole,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import { FormattedConcreteError } from "@ukdanceblue/common/error";

if (process.env.NODE_ENV !== "development") {
  throw new Error("Seeding is only allowed in development mode");
}

await import("#environment");

const { CommitteeRepository } = await import(
  "#repositories/committee/CommitteeRepository.js"
);
const { ConfigurationRepository } = await import(
  "#repositories/configuration/ConfigurationRepository.js"
);
const { EventRepository } = await import(
  "#repositories/event/EventRepository.js"
);
const { ImageRepository } = await import(
  "#repositories/image/ImageRepository.js"
);
const { MarathonRepository } = await import(
  "#repositories/marathon/MarathonRepository.js"
);
const { PersonRepository } = await import(
  "#repositories/person/PersonRepository.js"
);
const { TeamRepository } = await import("#repositories/team/TeamRepository.js");

const { prisma } = await import("./prisma.js");

try {
  // Base data setup

  const personRepository = Container.get(PersonRepository);
  const committeeRepository = Container.get(CommitteeRepository);
  const configurationRepository = Container.get(ConfigurationRepository);
  const marathonRepository = Container.get(MarathonRepository);
  const eventRepository = Container.get(EventRepository);
  const imageRepository = Container.get(ImageRepository);
  const teamRepository = Container.get(TeamRepository);

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
    { identifier: CommitteeIdentifier.techCommittee },
    CommitteeRole.Chair,
    { id: marathon.value.id }
  );

  // Fake data

  const teams = [];

  for (let i = 0; i < 5; i++) {
    teams.push(
      await teamRepository.createTeam(
        {
          name: `${faker.word.adjective()} ${faker.word.noun()}s`,
          legacyStatus: faker.datatype.boolean()
            ? TeamLegacyStatus.NewTeam
            : TeamLegacyStatus.ReturningTeam,
          type: TeamType.Spirit,
        },
        {
          id: marathon.value.id,
        }
      )
    );
  }

  for (let i = 0; i < 20; i++) {
    await personRepository.createPerson({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      linkblue: `${faker.string.alpha(4)}${faker.string.numeric(3)}`,
      memberOf: faker.helpers.arrayElements(teams, { min: 0, max: 3 }),
    });
  }

  for (const team of teams) {
    await personRepository.createPerson({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      linkblue: `${faker.string.alpha(4)}${faker.string.numeric(3)}`,
      captainOf: [{ id: team.id }],
    });
  }

  const images = [];

  for (let i = 0; i < 20; i++) {
    const subject = faker.word.noun();
    const width = faker.number.int({ multipleOf: 16, min: 16, max: 1024 });
    const height = faker.number.int({ multipleOf: 16, min: 16, max: 1024 });
    images.push(
      await imageRepository.createImage({
        height,
        width,
        alt: subject,
        file: {
          create: {
            filename: `${subject}.jpg`,
            locationUrl: faker.image.urlLoremFlickr({
              width,
              height,
              category: subject,
            }),
            mimeTypeName: "image",
            mimeSubtypeName: "jpeg",
          },
        },
      })
    );
  }

  for (let i = 0; i < 20; i++) {
    await eventRepository.createEvent({
      title: faker.lorem.words({ min: 2, max: 6 }),
      description: faker.datatype.boolean()
        ? faker.lorem.sentences({ min: 1, max: 6 })
        : undefined,
      location: faker.datatype.boolean()
        ? faker.location.streetAddress()
        : undefined,
      summary: faker.datatype.boolean()
        ? faker.lorem.sentence({ min: 3, max: 6 })
        : undefined,
      eventImages: {
        create: faker.helpers.arrayElements(images, { min: 0, max: 3 }).map(
          ({ id }): Prisma.EventImageCreateWithoutEventInput => ({
            image: { connect: { id } },
          })
        ),
      },
    });
  }
} finally {
  await prisma.$disconnect();
}
