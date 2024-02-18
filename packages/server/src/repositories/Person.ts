import type { Person, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { AuthSource } from "@ukdanceblue/common";
import {
  AuthIdList,
  PersonResource,
  RoleResource,
  SortDirection,
} from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../lib/auth/findPersonForLogin.js";
import type { FilterItems } from "../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "../lib/prisma-utils/gqlFilterToPrismaFilter.js";

const personStringKeys = ["name", "email", "linkblue"] as const;
type PersonStringKey = (typeof personStringKeys)[number];

const personOneOfKeys = ["dbRole", "committeeRole", "committeeName"] as const;
type PersonOneOfKey = (typeof personOneOfKeys)[number];

const personDateKeys = ["createdAt", "updatedAt"] as const;
type PersonDateKey = (typeof personDateKeys)[number];

type PersonFilters = FilterItems<
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
}

function buildPersonOrder(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
) {
  const orderBy: Prisma.PersonOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "name":
      case "email":
      case "linkblue":
      case "dbRole":
      case "committeeRole":
      case "committeeName":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${key}`);
      }
    }
  }
  return orderBy;
}

function buildPersonWhere(
  filters: readonly PersonFilters[] | null | undefined
) {
  const where: Prisma.PersonWhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "name":
      case "email":
      case "linkblue": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "dbRole": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "committeeRole": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "committeeName": {
        where[filter.field] = oneOfFilterToPrisma(filter);
        break;
      }
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
    }
  }
  return where;
}
