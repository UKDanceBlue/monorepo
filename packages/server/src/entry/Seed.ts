/* eslint-disable unicorn/no-await-expression-member */
/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import { Service } from "@freshgum/typedi";
import type {
  Event,
  Image,
  Marathon,
  Person,
  PointEntry,
  PointOpportunity,
  SolicitationCode,
  Team,
} from "@prisma/client";
import {
  BatchType,
  CommitteeIdentifier,
  CommitteeRole,
  type LocalDate,
  MembershipPositionType,
  SolicitationCodeTag,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import { DateTime, Interval } from "luxon";

import { logger } from "#lib/logging/standardLogging.js";
import { PrismaService } from "#lib/prisma.js";
import {
  isDevelopmentToken,
  superAdminLinkbluesToken,
} from "#lib/typediTokens.js";
import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import { ConfigurationRepository } from "#repositories/configuration/ConfigurationRepository.js";
import { DailyDepartmentNotificationRepository } from "#repositories/dailyDepartmentNotification/DDNRepository.js";
import { EventRepository } from "#repositories/event/EventRepository.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { ImageRepository } from "#repositories/image/ImageRepository.js";
import { MarathonRepository } from "#repositories/marathon/MarathonRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { PointEntryRepository } from "#repositories/pointEntry/PointEntryRepository.js";
import { PointOpportunityRepository } from "#repositories/pointOpportunity/PointOpportunityRepository.js";
import { SolicitationCodeRepository } from "#repositories/solicitationCode/SolicitationCodeRepository.js";
import { TeamRepository } from "#repositories/team/TeamRepository.js";

import { EntryPoint } from "./EntryPoint.js";

@Service([
  PersonRepository,
  CommitteeRepository,
  ConfigurationRepository,
  MarathonRepository,
  EventRepository,
  ImageRepository,
  TeamRepository,
  MembershipRepository,
  DailyDepartmentNotificationRepository,
  FundraisingEntryRepository,
  SolicitationCodeRepository,
  PointOpportunityRepository,
  PointEntryRepository,
  superAdminLinkbluesToken,
  PrismaService,
  isDevelopmentToken,
])
export class Seed extends EntryPoint {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly committeeRepository: CommitteeRepository,
    private readonly configurationRepository: ConfigurationRepository,
    private readonly marathonRepository: MarathonRepository,
    private readonly eventRepository: EventRepository,
    private readonly imageRepository: ImageRepository,
    private readonly teamRepository: TeamRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly dailyDepartmentNotificationRepository: DailyDepartmentNotificationRepository,
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly solicitationCodeRepository: SolicitationCodeRepository,
    private readonly pointOpportunityRepository: PointOpportunityRepository,
    private readonly pointEntryRepository: PointEntryRepository,
    private readonly superAdminLinkblues: symbol | string[],
    isDevelopment: boolean
  ) {
    super();
    if (!isDevelopment) {
      throw new Error("Seeding is only allowed in development mode");
    }
  }

  async start(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Seeding is only allowed in development mode");
    }

    logger.info("Seeding database");

    logger.info("Creating configuration entries");
    await this.configurationRepository.createConfiguration({
      key: "TAB_BAR_CONFIG",
      validAfter: null,
      validUntil: null,
      value: JSON.stringify({
        shownTabs: ["Home", "Teams", "Events"],
        fancyTab: "Teams",
      }),
    });
    await this.configurationRepository.createConfiguration({
      key: "ALLOWED_LOGIN_TYPES",
      validAfter: null,
      validUntil: null,
      value: JSON.stringify(["anonymous", "ms-oath-linkblue"]),
    });

    logger.info("Seeding people");
    const peoplePromises: Promise<Person>[] = [];
    for (let i = 0; i < 400; i++) {
      peoplePromises.push(this.seedPerson());
    }
    const people: Person[] = await Promise.all(peoplePromises);

    logger.info("Seeding solicitation codes");
    const solicitationCodes = [];
    for (let i = 0; i < 80; i++) {
      solicitationCodes.push(await this.seedSolicitationCode());
    }

    logger.info("Seeding custom fundraising entries");
    for (let i = 0; i < 40; i++) {
      await this.seedFundraisingEntry(solicitationCodes);
    }

    logger.info("Seeding DDNs");
    // We split it into batches of 250 to avoid overwhelming the database
    const ddnPromises: Promise<void>[] = [];
    for (let i = 0; i < 250; i++) {
      ddnPromises.push(this.seedDDNWithDonorData(solicitationCodes, people));
    }
    await Promise.all(ddnPromises);
    for (let i = 0; i < 250; i++) {
      ddnPromises.push(this.seedDDNWithDonorData(solicitationCodes, people));
    }
    await Promise.all(ddnPromises);
    for (let i = 0; i < 250; i++) {
      ddnPromises.push(this.seedDDNWithDonorData(solicitationCodes, people));
    }
    await Promise.all(ddnPromises);
    for (let i = 0; i < 250; i++) {
      ddnPromises.push(this.seedDDNWithDonorData(solicitationCodes, people));
    }
    await Promise.all(ddnPromises);

    await this.committeeRepository.ensureCommittees();
    const [, , db25] = await Promise.all([
      this.seedMarathon("DB23", people, solicitationCodes),
      this.seedMarathon("DB24", people, solicitationCodes),
      this.seedMarathon("DB25", people, solicitationCodes),
    ]);

    await this.seedSuperAdmin(db25.marathon);
  }

  async seedMarathon(
    year: string,
    people: Person[],
    solicitationCodes: SolicitationCode[]
  ) {
    logger.info(`Seeding marathon ${year}`);

    const marathonYearNumber = 2000 + Number.parseInt(year.slice(2), 10);
    const marathon = (
      await this.marathonRepository.createMarathon({
        year,
      })
    ).unwrap();

    logger.info(`Populating committees for ${year}`);
    const committees = (
      await this.committeeRepository.ensureCommittees([marathon])
    ).unwrap();

    logger.info(`Seeding committee members for ${year}`);
    for (const committee of Object.values(CommitteeIdentifier)) {
      const chair = await this.personRepository
        .createPerson({
          email: `${marathon.year}.${committee}.chair@uky.edu`,
          linkblue: `${marathon.year}.${committee}.chair`,
          name: `${marathon.year} ${committee} Chair`,
        })
        .then((a) => a.unwrap());
      const coordinators = Promise.all(
        Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, i) =>
          this.personRepository
            .createPerson({
              email: `${marathon.year}.${committee}.coordinator.${i}@uky.edu`,
              linkblue: `${marathon.year}.${committee}.coordinator.${i}`,
              name: `${marathon.year} ${committee} Coordinator ${i}`,
            })
            .then((a) => a.unwrap())
        )
      );
      const members = Promise.all(
        Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, (_, i) =>
          this.personRepository
            .createPerson({
              email: `${marathon.year}.${committee}.member.${i}@uky.edu`,
              linkblue: `${marathon.year}.${committee}.member.${i}`,
              name: `${marathon.year} ${committee} Member ${i}`,
            })
            .then((a) => a.unwrap())
        )
      );

      await this.committeeRepository.assignPersonToCommittee(
        { id: chair.id },
        committee,
        CommitteeRole.Chair,
        { id: marathon.id }
      );
      await Promise.all(
        (await coordinators).map((coordinator) =>
          this.committeeRepository.assignPersonToCommittee(
            { id: coordinator.id },
            committee,
            CommitteeRole.Coordinator,
            { id: marathon.id }
          )
        )
      );
      await Promise.all(
        (await members).map((member) =>
          this.committeeRepository.assignPersonToCommittee(
            { id: member.id },
            committee,
            CommitteeRole.Member,
            { id: marathon.id }
          )
        )
      );
    }

    logger.info(`Seeding images for ${year}`);
    const images = [];
    for (let i = 0; i < 20; i++) {
      images.push(await this.seedImage());
    }

    logger.info(`Seeding events for ${year}`);
    const events: Event[] = [];
    for (let i = 0; i < 20; i++) {
      events.push(await this.seedEvent(images, marathonYearNumber));
    }

    logger.info(`Seeding teams for ${year}`);
    const teams: Team[] = [];
    const members = new Map<Team, Person[]>();
    for (let i = 0; i < 45; i++) {
      teams.push(
        await this.seedTeam(marathon, solicitationCodes, members, people)
      );
    }

    logger.info(`Seeding point opportunities for ${year}`);
    const pointOpportunities: PointOpportunity[] = [];
    const unassignedEvents = events.toSorted(() =>
      faker.helpers.arrayElement([-1, 1])
    );
    for (let i = 0; i < 30 && unassignedEvents.length > 0; i++) {
      pointOpportunities.push(
        await this.seedPointOpportunity(marathon, unassignedEvents)
      );
    }

    logger.info(`Seeding point entries for ${year}`);
    const pointEntries = [];
    for (let i = 0; i < 300; i++) {
      const team = faker.helpers.arrayElement(teams);
      pointEntries.push(
        await this.seedPointEntry(team, pointOpportunities, members)
      );
    }

    return {
      marathon,
      committees,
      teams,
      pointOpportunities,
      events,
      pointEntries,
      images,
    };
  }

  private async seedImage(): Promise<Image> {
    const subject = faker.word.noun();
    const aspectRation = faker.helpers.arrayElement([
      16 / 9,
      4 / 3,
      1,
      3 / 2,
      9 / 16,
    ]);
    const width = faker.number.int({ multipleOf: 16, min: 16, max: 1024 });
    const height = Math.round(width / aspectRation);

    return this.imageRepository.createImage({
      height,
      width,
      alt: subject,
      file: {
        create: {
          filename: `${subject}.jpg`,
          locationUrl: faker.image.urlLoremFlickr({
            width,
            height,
          }),
          mimeTypeName: "image",
          mimeSubtypeName: "jpeg",
        },
      },
    });
  }

  private async seedEvent(
    images: Image[],
    marathonYearNumber: number
  ): Promise<Event> {
    const start = DateTime.fromJSDate(
      faker.date.between({
        from: new Date(marathonYearNumber - 1, 8, 1),
        to: new Date(marathonYearNumber, 6, 31),
      })
    );
    return (
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
          eventOccurrences: [
            {
              interval: Interval.fromDateTimes(
                start,
                start.plus({
                  hours: faker.number.int({ min: 1, max: 6 }),
                })
              ),
              fullDay: false,
            },
          ],
          eventImages: {
            connect: faker.helpers
              .arrayElements(images, { min: 0, max: 3 })
              .map(({ id }) => ({ id })),
          },
        },
      }).promise
    ).unwrap();
  }

  private async seedTeam(
    marathon: Marathon,
    solicitationCodes: SolicitationCode[],
    members: Map<Team, Person[]>,
    people: Person[]
  ) {
    const team = await this.teamRepository.createTeam(
      {
        name: `${faker.word.adjective()} ${faker.word.noun()}s`,
        legacyStatus: faker.datatype.boolean()
          ? TeamLegacyStatus.NewTeam
          : TeamLegacyStatus.ReturningTeam,
        type: TeamType.Spirit,
      },
      {
        id: marathon.id,
      }
    );

    if (faker.datatype.boolean({ probability: 0.9 })) {
      await this.solicitationCodeRepository.assignSolitationCodeToTeam(
        {
          id: team.id,
        },
        {
          id: faker.helpers.arrayElement(solicitationCodes).id,
        }
      );
    }

    members.set(team, await this.seedMemberships(people, team));

    return team;
  }

  private async seedMemberships(people: Person[], team: Team) {
    const teamMembers: Person[] = [];
    for (let j = 0; j < faker.number.int({ min: 1, max: 2 }); j++) {
      const person = faker.helpers.arrayElement(
        people.filter((person) => !teamMembers.includes(person))
      );
      await this.membershipRepository.assignPersonToTeam({
        personParam: { id: person.id },
        teamParam: { id: team.id },
        position: MembershipPositionType.Captain,
      });
      teamMembers.push(person);
    }
    for (let j = 0; j < faker.number.int({ min: 1, max: 10 }); j++) {
      const person = faker.helpers.arrayElement(
        people.filter((person) => !teamMembers.includes(person))
      );
      await this.membershipRepository.assignPersonToTeam({
        personParam: { id: person.id },
        teamParam: { id: team.id },
        position: MembershipPositionType.Member,
      });
      teamMembers.push(person);
    }
    return teamMembers;
  }

  private async seedPointOpportunity(
    marathon: Marathon,
    unassignedEvents: Event[]
  ) {
    return this.pointOpportunityRepository.createPointOpportunity({
      marathon: { id: marathon.id },
      name: faker.lorem.words({ min: 2, max: 6 }),
      type: faker.helpers.arrayElement(["Spirit", "Morale"]),
      eventParam: faker.helpers.maybe(
        () => ({ id: unassignedEvents.pop()!.id }),
        {
          probability: 0.8,
        }
      ),
      opportunityDate: faker.helpers.maybe(() => faker.date.recent(), {
        probability: 0.8,
      }),
    });
  }

  private async seedPointEntry(
    team: Team,
    pointOpportunities: PointOpportunity[],
    members: Map<Team, Person[]>
  ): Promise<PointEntry> {
    return this.pointEntryRepository.createPointEntry({
      points: faker.number.int({ min: 1, max: 10 }),
      teamParam: { id: team.id },
      comment: faker.helpers.maybe(() => faker.lorem.sentence(), {
        probability: 0.2,
      }),
      opportunityParam: faker.helpers.maybe(
        () => ({ id: faker.helpers.arrayElement(pointOpportunities).id }),
        {
          probability: 0.8,
        }
      ),
      personParam: faker.helpers.maybe(
        () => ({
          id: faker.helpers.arrayElement(members.get(team)!).id,
        }),
        { probability: 0.9 }
      ),
    });
  }

  private async seedSuperAdmin(marathon: Marathon) {
    for (const superAdminLinkblue of typeof this.superAdminLinkblues ===
    "symbol"
      ? []
      : this.superAdminLinkblues) {
      const superAdmin = (
        await this.personRepository.createPerson({
          email: `${superAdminLinkblue}@uky.edu`,
          linkblue: superAdminLinkblue,
        })
      ).unwrap();
      await this.committeeRepository.assignPersonToCommittee(
        { id: superAdmin.id },
        CommitteeIdentifier.techCommittee,
        CommitteeRole.Chair,
        { id: marathon.id }
      );
    }
  }

  private async seedDDNWithDonorData(
    solicitationCodes: SolicitationCode[],
    people: Person[]
  ) {
    const combinedAmount = faker.number.float({
      min: 0,
      max: 1000,
      fractionDigits: 2,
    });
    const multipleDonors = faker.datatype.boolean();
    const donor1Amount = multipleDonors
      ? faker.number.float({
          min: 0,
          max: combinedAmount,
          fractionDigits: 2,
        })
      : combinedAmount;
    const donor2Amount = multipleDonors
      ? combinedAmount - donor1Amount
      : undefined;
    const donor1 = {
      salutation: faker.person.prefix(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      mInitial: faker.helpers.maybe(() => faker.person.middleName()[0]!, {
        probability: 0.7,
      }),
      get fullName() {
        return `${this.salutation} ${this.firstName} ${this.mInitial ? `${this.mInitial}. ` : ""}${this.lastName}`;
      },
    };
    const donor2 = multipleDonors
      ? {
          salutation: faker.person.prefix(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          mInitial: faker.helpers.maybe(() => faker.person.middleName()[0]!, {
            probability: 0.7,
          }),
          get fullName() {
            return `${this.salutation} ${this.firstName} ${this.mInitial ? `${this.mInitial}. ` : ""}${this.lastName}`;
          },
        }
      : undefined;
    const combinedDonorName = multipleDonors
      ? `${donor1.salutation} and ${donor2!.salutation} ${donor1.firstName} and ${donor1.lastName}`
      : donor1.fullName;
    const combinedDonorSalutation = multipleDonors
      ? `${donor1.salutation} and ${donor2!.salutation} ${donor1.lastName}`
      : `${donor1.salutation} ${donor1.lastName}`;
    const combinedDonorSort = `${donor1.lastName.toUpperCase()}/${donor1.firstName.toUpperCase()}${donor1.mInitial ? ` ${donor1.mInitial.toUpperCase()}` : ""}`;
    await this.seedDDN(
      combinedAmount,
      combinedDonorName,
      combinedDonorSalutation,
      combinedDonorSort,
      solicitationCodes,
      donor1Amount,
      donor1,
      donor2,
      donor2Amount,
      people
    );
  }

  private async seedDDN(
    combinedAmount: number,
    combinedDonorName: string,
    combinedDonorSalutation: string,
    combinedDonorSort: string,
    solicitationCodes: SolicitationCode[],
    donor1Amount: number,
    donor1: {
      salutation: string;
      firstName: string;
      lastName: string;
      mInitial: string | undefined;
      readonly fullName: string;
    },
    donor2:
      | {
          salutation: string;
          firstName: string;
          lastName: string;
          mInitial: string | undefined;
          readonly fullName: string;
        }
      | undefined,
    donor2Amount: number | undefined,
    people: Person[]
  ) {
    (
      await this.dailyDepartmentNotificationRepository.createDDN(
        {
          accountName: faker.finance.accountName(),
          accountNumber: faker.finance.accountNumber(),
          batchId: `SI${faker.string.numeric({ length: 6 })}${faker.string.fromCharacters("CTDANXP")}1`,
          combinedAmount,
          combinedDonorName,
          combinedDonorSalutation,
          combinedDonorSort,
          divFirstGift: faker.datatype.boolean(),
          idSorter: faker.string.numeric({ length: 10 }),
          onlineGift: faker.datatype.boolean(),
          pledgedAmount: combinedAmount,
          processDate: DateTime.fromJSDate(
            faker.date.recent()
          ).toISODate() as LocalDate,
          jvDocDate: faker.helpers.maybe(
            () =>
              DateTime.fromJSDate(faker.date.recent()).toISODate() as LocalDate,
            {
              probability: 0.8,
            }
          ),
          sapDocDate: faker.helpers.maybe(
            () =>
              DateTime.fromJSDate(faker.date.recent()).toISODate() as LocalDate,
            {
              probability: 0.8,
            }
          ),
          pledgedDate: faker.helpers.maybe(
            () =>
              DateTime.fromJSDate(faker.date.recent()).toISODate() as LocalDate,
            {
              probability: 0.8,
            }
          ),
          effectiveDate: faker.helpers.maybe(
            () =>
              DateTime.fromJSDate(faker.date.recent()).toISODate() as LocalDate,
            {
              probability: 0.8,
            }
          ),
          transactionDate: faker.helpers.maybe(
            () =>
              DateTime.fromJSDate(faker.date.recent()).toISODate() as LocalDate,
            {
              probability: 0.8,
            }
          ),
          solicitationCode: faker.helpers.arrayElement(solicitationCodes).text!,
          transactionType: "Gift Transaction",
          ukFirstGift: faker.datatype.boolean(),
          advFeeAmtPhil: faker.helpers.maybe(
            () => faker.number.float({ min: 0, max: 3, fractionDigits: 2 }),
            {
              probability: 0.8,
            }
          ),
          advFeeAmtUnit: faker.helpers.maybe(
            () => faker.number.float({ min: 0, max: 3, fractionDigits: 2 }),
            {
              probability: 0.8,
            }
          ),
          advFeeCcPhil: faker.helpers.maybe(
            () => faker.string.alpha({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          advFeeCcUnit: faker.helpers.maybe(
            () => faker.string.alpha({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          advFeeStatus: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          behalfHonorMemorial: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.1,
            }
          ),
          comment: faker.helpers.maybe(() => faker.person.fullName(), {
            probability: 0.9,
          }),
          department: faker.helpers.maybe(() => faker.lorem.words(), {
            probability: 0.9,
          }),
          division: faker.helpers.maybe(() => faker.lorem.words(), {
            probability: 0.9,
          }),
          donor1Amount,
          donor1Constituency: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          donor1Deceased: faker.datatype.boolean({ probability: 0.05 }),
          donor1Degrees: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          donor1GiftKey: faker.helpers.maybe(
            () => faker.string.numeric({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          donor1Id: faker.helpers.maybe(
            () => faker.string.numeric({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          donor1Name: donor1.fullName,
          donor1Pm: undefined,
          donor1Relation: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          donor1TitleBar: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          ...(donor2 && {
            donor2Amount,
            donor2Constituency: faker.helpers.maybe(
              () => faker.lorem.words({ min: 2, max: 6 }),
              {
                probability: 0.8,
              }
            ),
            donor2Deceased: faker.datatype.boolean({ probability: 0.05 }),
            donor2Degrees: faker.helpers.maybe(
              () => faker.lorem.words({ min: 2, max: 6 }),
              {
                probability: 0.8,
              }
            ),
            donor2GiftKey: faker.helpers.maybe(
              () => faker.string.numeric({ length: 10 }),
              {
                probability: 0.8,
              }
            ),
            donor2Id: faker.helpers.maybe(
              () => faker.string.numeric({ length: 10 }),
              {
                probability: 0.8,
              }
            ),
            donor2Name: donor2.fullName,
            donor2Pm: undefined,
            donor2Relation: faker.helpers.maybe(
              () => faker.lorem.words({ min: 2, max: 6 }),
              {
                probability: 0.8,
              }
            ),
            donor2TitleBar: faker.helpers.maybe(
              () => faker.lorem.words({ min: 2, max: 6 }),
              {
                probability: 0.8,
              }
            ),
          }),
          email: faker.helpers.maybe(() => faker.internet.email(), {
            probability: 0.8,
          }),
          gikDescription: undefined,
          gikType: undefined,
          hcUnit: faker.helpers.maybe(
            () => faker.lorem.words({ min: 1, max: 2 }),
            {
              probability: 0.8,
            }
          ),
          holdingDestination: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          jvDocNum: faker.helpers.maybe(
            () => faker.string.numeric({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          matchingGift: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          sapDocNum: faker.helpers.maybe(
            () => faker.string.numeric({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
          secShares: undefined,
          secType: undefined,
          solicitation: faker.helpers.maybe(
            () => faker.lorem.words({ min: 2, max: 6 }),
            {
              probability: 0.8,
            }
          ),
          transmittalSn: faker.helpers.maybe(
            () => faker.string.numeric({ length: 10 }),
            {
              probability: 0.8,
            }
          ),
        },
        {
          enteredBy:
            faker.helpers.maybe(
              () => ({ id: faker.helpers.arrayElement(people).id }),
              {
                probability: 0.8,
              }
            ) ?? null,
        }
      )
    ).unwrap();
  }

  private async seedFundraisingEntry(solicitationCodes: SolicitationCode[]) {
    await this.fundraisingEntryRepository.create({
      init: {
        amount: faker.number.float({
          min: 0,
          max: 1000,
          fractionDigits: 2,
        }),
        batchType: faker.helpers.objectValue(BatchType),
        solicitationCode: faker.helpers.arrayElement(solicitationCodes),
        donatedTo: faker.helpers.maybe(() => faker.person.fullName()),
        donatedBy: faker.helpers.maybe(() => faker.person.fullName()),
        donatedOn: faker.helpers.maybe(() => faker.date.recent(), {
          probability: 0.8,
        }),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.2,
        }),
      },
    }).promise;
  }

  private async seedSolicitationCode(): Promise<SolicitationCode> {
    return (
      await this.solicitationCodeRepository.createSolicitationCode({
        code: faker.number.int({ min: 1000, max: 9999 }),
        prefix: faker.string.alpha({ length: { min: 2, max: 4 } }),
        name: faker.lorem.words({ min: 2, max: 6 }),
        tags: faker.helpers.arrayElement([
          [SolicitationCodeTag.DancerTeam],
          [SolicitationCodeTag.General],
          [SolicitationCodeTag.MiniMarathon],
          [SolicitationCodeTag.DancerTeam, SolicitationCodeTag.Active],
          [SolicitationCodeTag.General, SolicitationCodeTag.Active],
          [SolicitationCodeTag.MiniMarathon, SolicitationCodeTag.Active],
        ]),
      })
    ).unwrap();
  }

  private async seedPerson() {
    return (
      await this.personRepository.createPerson({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        linkblue: `${faker.string.alpha(4)}${faker.string.numeric(3)}`,
      })
    ).unwrap();
  }
}
