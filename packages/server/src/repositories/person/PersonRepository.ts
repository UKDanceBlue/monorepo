import type { Person } from "@prisma/client";
import { AuthSource, Prisma, PrismaClient } from "@prisma/client";
import type {
  AuthIdPairResource,
  CommitteeIdentifier,
  CommitteeRole,
  RoleResource,
  SortDirection,
} from "@ukdanceblue/common";
import { MembershipPositionType, TeamLegacyStatus } from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../../lib/auth/findPersonForLogin.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

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

@Service()
export class PersonRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findPersonForLogin(
    authIds: [AuthSource, string][],
    userData: {
      uuid?: string | null;
      email?: string | null;
      linkblue?: string | null;
      name?: string | null;
      role?: RoleResource | null;
    },
    memberOf?: (string | number)[],
    captainOf?: (string | number)[]
  ) {
    return findPersonForLogin(
      this.prisma,
      authIds,
      userData,
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

  async findPersonByUnique(
    param:
      | { uuid: string }
      | { id: number }
      | { email: string }
      | { linkblue: string }
  ) {
    return this.prisma.person.findUnique({ where: param });
  }

  async findPersonAndTeamsByUnique(
    param:
      | { uuid: string }
      | { id: number }
      | { email: string }
      | { linkblue: string }
  ) {
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
    param: { uuid: string } | { id: number },
    opts: {
      position?: MembershipPositionType;
    } = {}
  ) {
    const rows = await this.prisma.person.findUnique({
      where: param,
      select: {
        memberships: {
          where: {
            position: opts.position,
          },
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
    committeeRole,
    committeeName,
    authIds,
  }: {
    name?: string | null;
    email: string;
    linkblue?: string | null;
    committeeRole?: CommitteeRole | null;
    committeeName?: CommitteeIdentifier | null;
    authIds?: AuthIdPairResource<Exclude<AuthSource, "None">>[] | null;
  }): Promise<Person> {
    return this.prisma.person.create({
      data: {
        name,
        email,
        linkblue,
        committeeRole,
        committeeName,
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
    param: { uuid: string } | { id: number },
    {
      name,
      email,
      linkblue,
      committeeRole,
      committeeName,
      authIds,
    }: {
      name?: string | null;
      email?: string;
      linkblue?: string | null;
      committeeRole?: CommitteeRole | null;
      committeeName?: CommitteeIdentifier | null;
      authIds?: { source: Exclude<AuthSource, "None">; value: string }[];
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

    try {
      return await this.prisma.person.update({
        where: param,
        data: {
          name,
          email,
          linkblue,
          committeeRole,
          committeeName,
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

  async deletePerson(
    identifier: { uuid: string } | { id: number }
  ): Promise<Person | null> {
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
    return this.prisma.person.upsert({
      where: {
        authIdPairs: {
          some: {
            source: AuthSource.Demo,
            value: "demo-user",
          },
        },
        email: "demo--user@dancblue.org",
      },
      create: {
        email: "demo--user@dancblue.org",
        name: "Demo User",
        linkblue: "demo-user",
        memberships: {
          create: {
            team: {
              connectOrCreate: {
                where: {
                  persistentIdentifier: "demo-team",
                  legacyStatus: TeamLegacyStatus.DemoTeam,
                },
                create: {
                  name: "Demo Team",
                  type: "Spirit",
                  marathonYear: "DB24",
                  legacyStatus: TeamLegacyStatus.DemoTeam,
                  persistentIdentifier: "demo-team",
                },
              },
            },
            position: MembershipPositionType.Captain,
          },
        },
        pointEntries: {
          create: {
            team: {
              connect: {
                persistentIdentifier: "demo-team",
              },
            },
            points: 1,
            comment: "Demo point",
          },
        },
      },
      update: {
        email: "demo--user@dancblue.org",
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
