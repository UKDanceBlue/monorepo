import type { Person, Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { AuthSource, FilterItem, RoleResource } from "@ukdanceblue/common";
import { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../lib/auth/findPersonForLogin.js";

const personStringKeys = [
  "name",
  "email",
  "linkblue",
  "dbRole",
  "committeeRole",
  "committeeName",
] as const;
type PersonStringKey = (typeof personStringKeys)[number];

const personDateKeys = ["createdAt", "updatedAt"] as const;
type PersonDateKey = (typeof personDateKeys)[number];

type PersonKey = PersonStringKey | PersonDateKey;

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

  listPeople(
    filters: readonly FilterItem<PersonKey, unknown>[],
    order: readonly [key: string, sort: SortDirection][],
    skip: number,
    take: number
  ): Promise<Person[]> {
    const where: Prisma.PersonWhereInput = {};
    const orderBy: Prisma.PersonOrderByWithRelationInput = {};

    for (const filter of filters) {
      switch (filter.field) {
        case "name":
        case "email":
        case "linkblue":
        case "dbRole":
        case "committeeRole":
        case "committeeName": {
          where[filter.field] = {};
          break;
        }
        case "createdAt":
        case "updatedAt": {
          where[filter.field] = filter.value as Date;
          break;
        }
      }
    }

    for (const [key, sort] of order) {
      switch (key) {
        case "name":
        case "email":
        case "linkblue":
        case "dbRole":
        case "committeeRole":
        case "committeeName": {
          orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
          break;
        }
        case "createdAt":
        case "updatedAt": {
          orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
          break;
        }
      }
    }
  }
}
