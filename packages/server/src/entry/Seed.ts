/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import { Service } from "@freshgum/typedi";
import type { PrismaClient } from "@prisma/client";
import {
  CommitteeIdentifier,
  CommitteeRole,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";

import { PrismaService } from "#lib/prisma.js";

import { EntryPoint } from "./EntryPoint.js";

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

@Service([
  PersonRepository,
  CommitteeRepository,
  ConfigurationRepository,
  MarathonRepository,
  EventRepository,
  ImageRepository,
  TeamRepository,
  PrismaService,
])
export class Seed extends EntryPoint {
  constructor(
    private readonly personRepository: InstanceType<typeof PersonRepository>,
    private readonly committeeRepository: InstanceType<
      typeof CommitteeRepository
    >,
    private readonly configurationRepository: InstanceType<
      typeof ConfigurationRepository
    >,
    private readonly marathonRepository: InstanceType<
      typeof MarathonRepository
    >,
    private readonly eventRepository: InstanceType<typeof EventRepository>,
    private readonly imageRepository: InstanceType<typeof ImageRepository>,
    private readonly teamRepository: InstanceType<typeof TeamRepository>,
    private readonly prisma: PrismaClient
  ) {
    super();
  }

  async start(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Seeding is only allowed in development mode");
    }

    try {
      // Base data setup
      await this.configurationRepository.createConfiguration({
        key: "TAB_BAR_CONFIG",
        validAfter: null,
        validUntil: null,
        value: JSON.stringify({
          shownTabs: ["Teams", "Events"],
          fancyTab: "Teams",
        }),
      });
      await this.configurationRepository.createConfiguration({
        key: "ALLOWED_LOGIN_TYPES",
        validAfter: null,
        validUntil: null,
        value: JSON.stringify(["anonymous", "ms-oath-linkblue"]),
      });

      const marathon = await this.marathonRepository.createMarathon({
        year: "DB24",
      });
      if (marathon.isErr()) {
        throw marathon.error;
      }

      const ensureCommitteesResult =
        await this.committeeRepository.ensureCommittees([marathon.value]);
      if (ensureCommitteesResult.isErr()) {
        throw ensureCommitteesResult.error;
      }

      const techChair = await this.personRepository.createPerson({
        email: "jtho264@uky.edu",
        linkblue: "jtho264",
      });
      if (techChair.isErr()) {
        throw techChair.error;
      }

      await this.committeeRepository.assignPersonToCommittee(
        { id: techChair.value.id },
        CommitteeIdentifier.techCommittee,
        CommitteeRole.Chair,
        { id: marathon.value.id }
      );

      // Fake data

      const teams = [];

      for (let i = 0; i < 5; i++) {
        teams.push(
          await this.teamRepository.createTeam(
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
        await this.personRepository.createPerson({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          linkblue: `${faker.string.alpha(4)}${faker.string.numeric(3)}`,
          memberOf: faker.helpers.arrayElements(teams, { min: 0, max: 3 }),
        });
      }

      for (const team of teams) {
        await this.personRepository.createPerson({
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
          await this.imageRepository.createImage({
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
        await this.eventRepository.create({
          init: {
            title: faker.lorem.words({ min: 2, max: 6 }),
            description: faker.datatype.boolean()
              ? faker.lorem.sentences({ min: 1, max: 6 })
              : null,
            location: faker.datatype.boolean()
              ? faker.location.streetAddress()
              : null,
            summary: faker.datatype.boolean()
              ? faker.lorem.sentence({ min: 3, max: 6 })
              : null,
            eventOccurrences: [],
            eventImages: {
              connect: faker.helpers
                .arrayElements(images, { min: 0, max: 3 })
                .map(({ id }) => ({ id })),
            },
          },
        }).promise;
      }
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
