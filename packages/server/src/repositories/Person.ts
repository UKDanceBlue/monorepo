import type { Person } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { AuthSource, RoleResource } from "@ukdanceblue/common";
import { Service } from "typedi";

import { findPersonForLogin } from "../lib/auth/findPersonForLogin.js";

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
}
