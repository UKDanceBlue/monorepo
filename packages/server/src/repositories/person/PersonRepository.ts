import type { Person } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import type {
  AuthIdPairResource,
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  MembershipPositionType,
  RoleResource,
  SortDirection,
} from "@ukdanceblue/common";
import { DbRole } from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../../lib/auth/findPersonForLogin.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildPersonOrder, buildPersonWhere } from "./personRepositoryUtils.js";

const personStringKeys = ["name", "email", "linkblue"] as const;
type PersonStringKey = (typeof personStringKeys)[number];

const personOneOfKeys = ["dbRole", "committeeRole", "committeeName"] as const;
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

@Service()
export class PersonRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findPersonForLogin(
    authIds: Partial<Record<AuthSource, string>>,
    userData: {
      uuid?: string | null;
      email?: string | null;
      linkblue?: string | null;
      name?: string | null;
      role?: RoleResource | null;
    },
    memberOf?: (string | number)[],
    captainOf?: (string | number)[]
  ): Promise<[Person, boolean]> {
    return findPersonForLogin(
      this.prisma,
      authIds,
      userData,
      memberOf,
      captainOf
    );
  }

  findPersonByUuid(uuid: string): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { uuid } });
  }

  findPersonById(id: number): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { id } });
  }

  findPersonByLinkblue(linkblue: string): Promise<Person | null> {
    return this.prisma.person.findUnique({ where: { linkblue } });
  }

  listPeople({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly PersonFilters[] | undefined | null;
    order?: readonly [key: string, sort: SortDirection][] | undefined | null;
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
    dbRole,
    committeeRole,
    committeeName,
    authIds,
  }: {
    name?: string | null;
    email: string;
    linkblue?: string | null;
    dbRole?: DbRole | null;
    committeeRole?: CommitteeRole | null;
    committeeName?: CommitteeIdentifier | null;
    authIds?: AuthIdPairResource<Exclude<AuthSource, "None">>[] | null;
  }): Promise<Person> {
    return this.prisma.person.create({
      data: {
        name,
        email,
        linkblue,
        dbRole: dbRole ?? DbRole.None,
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

  async updatePerson({
    uuid,
    id,
    name,
    email,
    linkblue,
    dbRole,
    committeeRole,
    committeeName,
    authIds,
  }: {
    name?: string | null;
    email?: string;
    linkblue?: string | null;
    dbRole?: DbRole;
    committeeRole?: CommitteeRole | null;
    committeeName?: CommitteeIdentifier | null;
    authIds?: AuthIdPairResource<Exclude<AuthSource, "None">>[];
  } & (
    | {
        uuid: string;
        id?: number;
      }
    | {
        id: number;
        uuid?: string;
      }
  )): Promise<Person | null> {
    let personId: number;
    if (id != null && uuid == null) {
      personId = id;
    } else if (uuid != null && id == null) {
      const found = await this.prisma.person.findUnique({
        where: { uuid },
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
        where: { id: personId },
        data: {
          name,
          email,
          linkblue,
          dbRole,
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
}
