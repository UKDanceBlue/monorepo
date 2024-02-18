import type { Person, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type {
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  SortDirection,
} from "@ukdanceblue/common";
import {
  AuthIdList,
  DbRole,
  PersonResource,
  RoleResource,
} from "@ukdanceblue/common";
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

  static personModelToResource(person: Person): PersonResource {
    return PersonResource.init({
      uuid: person.uuid,
      name: person.name,
      email: person.email,
      linkblue: person.linkblue,
      role: RoleResource.init({
        dbRole: person.dbRole,
        committeeRole: person.committeeRole,
        committeeIdentifier: person.committeeName,
      }),
      authIds: AuthIdList.isAuthIdListArray(person.authIds)
        ? person.authIds
        : [],

      createdAt: person.createdAt,
      updatedAt: person.updatedAt,
    });
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
    authIds?: AuthIdList[] | null;
  }): Promise<Person> {
    return this.prisma.person.create({
      data: {
        name,
        email,
        linkblue,
        dbRole: dbRole ?? DbRole.None,
        committeeRole,
        committeeName,
        authIds:
          authIds?.reduce<Record<string, string>>((acc, cur) => {
            if (AuthIdList.isAuthIdList(cur)) {
              acc[cur.source] = cur.value;
            }
            return acc;
          }, {}) ?? {},
      },
    });
  }

  updatePerson({
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
    name?: string;
    email?: string;
    linkblue?: string;
    dbRole?: DbRole;
    committeeRole?: CommitteeRole;
    committeeName?: CommitteeIdentifier;
    authIds?: AuthIdList;
  } & (
    | {
        uuid: string;
        id?: number;
      }
    | {
        id: number;
        uuid?: string;
      }
  )): Promise<Person> {
    return this.prisma.person.update({
      where: uuid ? { uuid } : { id },
      data: {
        name,
        email,
        linkblue,
        dbRole,
        committeeRole,
        committeeName,
        authIds,
      },
    });
  }

  deletePerson(identifier: { uuid: string } | { id: number }): Promise<Person> {
    return this.prisma.person.delete({ where: identifier });
  }
}
