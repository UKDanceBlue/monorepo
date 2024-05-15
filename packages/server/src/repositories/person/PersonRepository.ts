import type { Person } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  AuthSource,
  CommitteeRole,
  DbRole,
  DetailedError,
  ErrorCode,
  MembershipPositionType,
  SortDirection,
  TeamLegacyStatus,
} from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../../lib/auth/findPersonForLogin.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { SimpleUniqueParam } from "../shared.js";

import { buildPersonOrder, buildPersonWhere } from "./personRepositoryUtils.js";

const personStringKeys = ["name", "email", "linkblue"] as const;
type PersonStringKey = (typeof personStringKeys)[number];

const personOneOfKeys = ["committeeRole", "committeeName", "dbRole"] as const;
type PersonOneOfKey = (typeof personOneOfKeys)[number];

const personDateKeys = ["createdAt", "updatedAt"] as const;
type PersonDateKey = (typeof personDateKeys)[number];

export type PersonFilters = FilterItems<
  never,
  PersonDateKey,
  never,
  never,
  PersonOneOfKey,
  PersonStringKey
>;

export type PersonOrderKeys =
  | "name"
  | "email"
  | "linkblue"
  | "committeeRole"
  | "committeeName"
  | "dbRole"
  | "createdAt"
  | "updatedAt";

export type UniquePersonParam =
  | {
      uuid: string;
    }
  | {
      id: number;
    }
  | {
      email: string;
    }
  | {
      linkblue: string;
    };

@Service()
export class PersonRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findPersonForLogin(
    authIds: [Exclude<AuthSource, "None">, string][],
    userInfo: {
      uuid?: string | null;
      email?: string | null;
      linkblue?: string | null;
      name?: string | null;
      dbRole?: DbRole | null;
    },
    memberOf?: (string | number)[],
    captainOf?: (string | number)[]
  ) {
    return findPersonForLogin(
      this.prisma,
      authIds,
      userInfo,
      memberOf,
      captainOf
    );
  }

  /** @deprecated Use findPersonByUnique directly */
  findPersonByUuid(uuid: string): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { uuid } });
  }

  /** @deprecated Use findPersonByUnique directly */
  findPersonById(id: number): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { id } });
  }

  /** @deprecated Use findPersonByUnique directly */
  findPersonByLinkblue(linkblue: string): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { linkblue } });
  }

  async findPersonByUnique(param: UniquePersonParam) {
    return this.prisma.person.findUnique({ where: param });
  }

  async findPersonAndTeamsByUnique(param: UniquePersonParam) {
    return this.prisma.person.findUnique({
      where: param,
      include: {
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });
  }

  async getDbRoleOfPerson(param: UniquePersonParam) {
    const person = await this.prisma.person.findUnique({
      where: param,
      select: {
        linkblue: true,
        memberships: {
          select: {
            committeeRole: true,
          },
        },
      },
    });

    if (!person) {
      return null;
    }
    if (person.memberships.some((m) => m.committeeRole != null)) {
      return DbRole.Committee;
    }
    if (person.linkblue) {
      return DbRole.UKY;
    }
    return DbRole.Public;
  }

  listPeople({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly PersonFilters[] | undefined | null;
    order?:
      | readonly [key: PersonOrderKeys, sort: SortDirection][]
      | undefined
      | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }): Promise<Person[]> {
    const where: Prisma.PersonWhereInput = buildPersonWhere(filters);
    const orderBy: Prisma.PersonOrderByWithRelationInput =
      buildPersonOrder(order);

    return this.prisma.person.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countPeople({
    filters,
  }: {
    filters?: readonly PersonFilters[] | undefined | null;
  }): Promise<number> {
    const where: Prisma.PersonWhereInput = buildPersonWhere(filters);

    return this.prisma.person.count({ where });
  }

  searchByName(name: string): Promise<Person[]> {
    return this.prisma.person.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }

  searchByLinkblue(linkblue: string): Promise<Person[]> {
    return this.prisma.person.findMany({
      where: {
        linkblue: {
          contains: linkblue,
          mode: "insensitive",
        },
      },
    });
  }

  async findMembershipsOfPerson(
    param: UniquePersonParam,
    opts:
      | {
          position: MembershipPositionType;
        }
      | {
          committeeRole: CommitteeRole;
        }
      | Record<string, never> = {}
  ) {
    const rows = await this.prisma.person.findUnique({
      where: param,
      select: {
        memberships: {
          where: opts,
        },
      },
    });

    return rows?.memberships ?? null;
  }

  // Mutators

  createPerson({
    name,
    email,
    linkblue,
    authIds,
  }: {
    name?: string | null;
    email: string;
    linkblue?: string | null;
    authIds?: { source: Exclude<AuthSource, "None">; value: string }[] | null;
  }): Promise<Person> {
    return this.prisma.person.create({
      data: {
        name,
        email,
        linkblue,
        authIdPairs: authIds
          ? {
              createMany: {
                data: authIds.map((authId): Prisma.AuthIdPairCreateInput => {
                  return {
                    source: authId.source,
                    value: authId.value,
                    person: { connect: { email } },
                  };
                }),
              },
            }
          : undefined,
      },
    });
  }

  async updatePerson(
    param: UniquePersonParam,
    {
      name,
      email,
      linkblue,
      authIds,
      memberOf,
      captainOf,
    }: {
      name?: string | undefined | null;
      email?: string | undefined;
      linkblue?: string | undefined | null;
      authIds?:
        | { source: Exclude<AuthSource, "None">; value: string }[]
        | undefined
        | null;
      memberOf?: SimpleUniqueParam[] | undefined | null;
      captainOf?: SimpleUniqueParam[] | undefined | null;
    }
  ) {
    let personId: number;
    if ("id" in param) {
      personId = param.id;
    } else if ("uuid" in param) {
      const found = await this.prisma.person.findUnique({
        where: { uuid: param.uuid },
        select: { id: true },
      });
      if (found == null) {
        return null;
      }
      personId = found.id;
    } else {
      throw new Error("Must provide either UUID or ID");
    }

    const [memberOfIds, captainOfIds] = await Promise.all([
      memberOf
        ? Promise.all(
            memberOf.map((team) =>
              this.prisma.team
                .findUnique({
                  where: team,
                  select: { id: true },
                })
                .then((team) => team?.id)
            )
          )
        : Promise.resolve(null),
      captainOf
        ? Promise.all(
            captainOf.map((team) =>
              this.prisma.team
                .findUnique({
                  where: team,
                  select: { id: true },
                })
                .then((team) => team?.id)
            )
          )
        : Promise.resolve(null),
    ]);

    try {
      return await this.prisma.person.update({
        where: param,
        data: {
          name,
          email,
          linkblue,
          authIdPairs: authIds
            ? {
                upsert: authIds.map((authId) => {
                  return {
                    create: {
                      source: authId.source,
                      value: authId.value,
                    },
                    update: {
                      value: authId.value,
                    },
                    where: {
                      personId_source: {
                        personId,
                        source: authId.source,
                      },
                    },
                  };
                }),
              }
            : undefined,
          memberships:
            // TODO: this nesting is nightmarish and should be refactored
            memberOf || captainOf
              ? {
                  connectOrCreate: [
                    ...(memberOfIds
                      ?.filter(
                        (id): id is Exclude<typeof id, undefined> => id != null
                      )
                      .map(
                        (
                          teamId
                        ): Prisma.MembershipCreateOrConnectWithoutPersonInput => {
                          return {
                            where: { personId_teamId: { personId, teamId } },
                            create: {
                              position: MembershipPositionType.Member,
                              team: {
                                connect: {
                                  id: teamId,
                                },
                              },
                            },
                          };
                        }
                      ) ?? []),
                    ...(captainOfIds
                      ?.filter(
                        (id): id is Exclude<typeof id, undefined> => id != null
                      )
                      .map(
                        (
                          teamId
                        ): Prisma.MembershipCreateOrConnectWithoutPersonInput => {
                          return {
                            where: { personId_teamId: { personId, teamId } },
                            create: {
                              position: MembershipPositionType.Captain,
                              team: {
                                connect: {
                                  id: teamId,
                                },
                              },
                            },
                          };
                        }
                      ) ?? []),
                  ],
                }
              : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  async deletePerson(identifier: UniquePersonParam): Promise<Person | null> {
    try {
      return await this.prisma.person.delete({ where: identifier });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  async getDemoUser() {
    let demoTeam = await this.prisma.team.findFirst({
      where: {
        legacyStatus: TeamLegacyStatus.DemoTeam,
      },
    });

    if (!demoTeam) {
      const someMarathon = await this.prisma.marathon.findFirst({
        orderBy: {
          year: "asc",
        },
      });

      if (!someMarathon) {
        throw new DetailedError(
          ErrorCode.NotFound,
          "No marathons found for demo user"
        );
      }

      demoTeam = await this.prisma.team.create({
        data: {
          name: "Demo Team",
          type: "Spirit",
          marathon: {
            connect: someMarathon,
          },
          legacyStatus: TeamLegacyStatus.DemoTeam,
          persistentIdentifier: "demo-team",
        },
      });
    }

    return this.prisma.person.upsert({
      where: {
        authIdPairs: {
          some: {
            source: AuthSource.Demo,
            value: "demo-user",
          },
        },
        email: "demo-user@dancblue.org",
      },
      create: {
        email: "demo-user@dancblue.org",
        name: "Demo User",
        linkblue: "demo-user",
        memberships: {
          create: {
            team: {
              connect: demoTeam,
            },
            position: MembershipPositionType.Captain,
          },
        },
        pointEntries: {
          create: {
            team: {
              connect: demoTeam,
            },
            points: 1,
            comment: "Demo point",
          },
        },
      },
      update: {
        email: "demo-user@dancblue.org",
        name: "Demo User",
        linkblue: "demo-user",
      },
      include: {
        memberships: {
          include: {
            team: true,
          },
        },
      },
    });
  }
}
