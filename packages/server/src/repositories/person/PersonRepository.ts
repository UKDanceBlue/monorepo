import type { Committee, Membership, Person, Team } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  DetailedError,
  EffectiveCommitteeRole,
  ErrorCode,
  MembershipPositionType,
  SortDirection,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import { Err, Ok, Result } from "ts-results-es";
import { Service } from "typedi";


import { buildPersonOrder, buildPersonWhere } from "./personRepositoryUtils.js";

import { findPersonForLogin } from "#auth/findPersonForLogin.js";
import { ActionDeniedError } from "#error/control.js";
import {
  InvalidArgumentError,
  InvariantError,
  NotFoundError,
} from "#error/direct.js";
import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import {
  handleRepositoryError,
  type RepositoryError,
  type SimpleUniqueParam,
} from "#repositories/shared.js";

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

  async findPersonForLogin(
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
  ): Promise<
    Result<Awaited<ReturnType<typeof findPersonForLogin>>, RepositoryError>
  > {
    try {
      const row = await findPersonForLogin(
        this.prisma,
        authIds,
        userInfo,
        memberOf,
        captainOf
      );
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findPersonByUnique(
    param: UniquePersonParam
  ): Promise<Result<Person, RepositoryError>> {
    try {
      const row = await this.prisma.person.findUnique({ where: param });
      if (!row) {
        return Err(new NotFoundError({ what: "Person" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findPersonAndTeamsByUnique(
    param: UniquePersonParam
  ): Promise<
    Result<
      Person & { memberships: (Membership & { team: Team })[] },
      RepositoryError
    >
  > {
    try {
      const row = await this.prisma.person.findUnique({
        where: param,
        include: {
          memberships: {
            include: {
              team: true,
            },
          },
        },
      });
      if (!row) {
        return Err(new NotFoundError({ what: "Person" }));
      }
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getDbRoleOfPerson(
    param: UniquePersonParam
  ): Promise<Result<DbRole, RepositoryError>> {
    try {
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
        return Ok(DbRole.None);
      }
      if (person.memberships.some((m) => m.committeeRole != null)) {
        return Ok(DbRole.Committee);
      }
      if (person.linkblue) {
        return Ok(DbRole.UKY);
      }
      return Ok(DbRole.Public);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getEffectiveCommitteeRolesOfPerson(
    param: UniquePersonParam
  ): Promise<
    Result<EffectiveCommitteeRole[], RepositoryError | InvariantError>
  > {
    try {
      const effectiveCommitteeRoles: EffectiveCommitteeRole[] = [];

      const committees = await this.prisma.membership.findMany({
        where: {
          person: param,
          team: {
            correspondingCommittee: {
              isNot: null,
            },
          },
          committeeRole: {
            not: null,
          },
        },
        select: {
          team: {
            select: {
              correspondingCommittee: {
                select: {
                  identifier: true,
                  parentCommittee: {
                    select: {
                      identifier: true,
                    },
                  },
                  childCommittees: {
                    select: {
                      identifier: true,
                    },
                  },
                },
              },
            },
          },
          committeeRole: true,
        },
      });

      for (const committee of committees) {
        if (committee.team.correspondingCommittee) {
          if (!committee.committeeRole) {
            return Err(
              new InvariantError("No role found for committee membership")
            );
          }
          const role = EffectiveCommitteeRole.init(
            committee.team.correspondingCommittee.identifier,
            committee.committeeRole
          );
          effectiveCommitteeRoles.push(role);
          if (committee.team.correspondingCommittee.parentCommittee) {
            const parentRole = EffectiveCommitteeRole.init(
              committee.team.correspondingCommittee.parentCommittee.identifier,
              CommitteeRole.Member
            );
            effectiveCommitteeRoles.push(parentRole);
          }
          const childRoles =
            committee.team.correspondingCommittee.childCommittees.map((child) =>
              EffectiveCommitteeRole.init(
                child.identifier,
                committee.committeeRole!
              )
            );
          effectiveCommitteeRoles.push(...childRoles);
        }
      }

      return Ok(effectiveCommitteeRoles);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async listPeople({
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
  }): Promise<Result<Person[], RepositoryError | ActionDeniedError>> {
    try {
      const where: Prisma.PersonWhereInput = buildPersonWhere(filters);
      const orderBy = buildPersonOrder(order);
      if (orderBy.isErr()) {
        return Err(orderBy.error);
      }

      const rows = await this.prisma.person.findMany({
        where,
        orderBy: orderBy.value,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });

      return Ok(rows);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async countPeople({
    filters,
  }: {
    filters?: readonly PersonFilters[] | undefined | null;
  }): Promise<Result<number, RepositoryError>> {
    try {
      const where: Prisma.PersonWhereInput = buildPersonWhere(filters);

      return Ok(await this.prisma.person.count({ where }));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async searchByName(name: string): Promise<Result<Person[], RepositoryError>> {
    try {
      return Ok(
        await this.prisma.person.findMany({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async searchByLinkblue(
    linkblue: string
  ): Promise<Result<Person[], RepositoryError>> {
    try {
      return Ok(
        await this.prisma.person.findMany({
          where: {
            linkblue: {
              contains: linkblue,
              mode: "insensitive",
            },
          },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findCommitteeMembershipsOfPerson(
    param: UniquePersonParam
  ): Promise<
    Result<
      (Membership & { team: { correspondingCommittee: Committee } })[],
      RepositoryError
    >
  > {
    try {
      const rows = await this.prisma.person.findUnique({
        where: param,
        select: {
          memberships: {
            where: {
              team: {
                type: TeamType.Committee,
                correspondingCommittee: {
                  isNot: null,
                },
              },
            },
            include: {
              team: {
                select: {
                  correspondingCommittee: true,
                },
              },
            },
          },
        },
      });

      if (!rows) {
        return Err(new NotFoundError({ what: "Person" }));
      }

      return Ok(
        rows.memberships.filter(
          (
            m
          ): m is typeof m & {
            team: { correspondingCommittee: Committee };
          } => {
            return m.team.correspondingCommittee != null;
          }
        )
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
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
      | Record<string, never> = {},
    types: TeamType[] | undefined = undefined,
    includeTeam: boolean = false
  ): Promise<Result<(Membership & { team: Team })[], RepositoryError>> {
    try {
      const rows = await this.prisma.person
        .findUnique({
          where: param,
        })
        .memberships({
          include: {
            team: includeTeam,
          },
          where: {
            AND: [
              opts,
              types
                ? {
                    team: {
                      type: {
                        in: types,
                      },
                    },
                  }
                : {},
            ],
          },
        });

      if (!rows) {
        return Err(new NotFoundError({ what: "Person" }));
      }

      return Ok(rows);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  // Mutators

  async createPerson({
    name,
    email,
    linkblue,
    authIds,
  }: {
    name?: string | null;
    email: string;
    linkblue?: string | null;
    authIds?: { source: Exclude<AuthSource, "None">; value: string }[] | null;
  }): Promise<Result<Person, RepositoryError>> {
    try {
      return Ok(
        await this.prisma.person.create({
          data: {
            name,
            email,
            linkblue,
            authIdPairs: authIds
              ? {
                  createMany: {
                    data: authIds.map(
                      (authId): Prisma.AuthIdPairCreateInput => {
                        return {
                          source: authId.source,
                          value: authId.value,
                          person: { connect: { email } },
                        };
                      }
                    ),
                  },
                }
              : undefined,
          },
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
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
  ): Promise<Result<Person, RepositoryError | InvalidArgumentError>> {
    try {
      let personId: number;
      if ("id" in param) {
        personId = param.id;
      } else if ("uuid" in param) {
        const found = await this.prisma.person.findUnique({
          where: { uuid: param.uuid },
          select: { id: true },
        });
        if (found == null) {
          return Err(new NotFoundError({ what: "Person" }));
        }
        personId = found.id;
      } else {
        return Err(new InvalidArgumentError("Must provide either UUID or ID"));
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

      return Ok(
        await this.prisma.person.update({
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
              // How many indents is too many? This many. This many is too many
              // TODO: this nesting is nightmarish and should be refactored
              memberOf || captainOf
                ? {
                    connectOrCreate: [
                      ...(memberOfIds
                        ?.filter(
                          (id): id is Exclude<typeof id, undefined> =>
                            id != null
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
                          (id): id is Exclude<typeof id, undefined> =>
                            id != null
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
        })
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Person" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async deletePerson(
    identifier: UniquePersonParam
  ): Promise<Result<Person, RepositoryError>> {
    try {
      return Ok(await this.prisma.person.delete({ where: identifier }));
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return Err(new NotFoundError({ what: "Person" }));
      } else {
        return handleRepositoryError(error);
      }
    }
  }

  async getDemoUser(): Promise<
    Result<
      Person & {
        memberships: (Membership & {
          team: Team;
        })[];
      },
      RepositoryError
    >
  > {
    try {
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
          return Err(new NotFoundError({ what: "Marathon" }));
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

      return Ok(
        await this.prisma.person.upsert({
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
                  connect: {
                    id: demoTeam.id,
                  },
                },
                position: MembershipPositionType.Captain,
              },
            },
            pointEntries: {
              create: {
                team: {
                  connect: {
                    id: demoTeam.id,
                  },
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
        })
      );
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  public async getPrimaryCommitteeOfPerson(
    person: UniquePersonParam,
    marathon?: UniqueMarathonParam
  ): Promise<
    Result<[Membership, Committee], RepositoryError | InvariantError>
  > {
    try {
      const committees = await this.prisma.membership.findMany({
        where: {
          person,
          team: {
            marathon,
            type: TeamType.Committee,
          },
        },
        include: {
          team: {
            include: {
              correspondingCommittee: true,
            },
          },
        },
      });

      if (committees.length === 0) {
        return Err(new NotFoundError({ what: "Primary committee" }));
      }

      let bestCommittee = undefined;
      let fallbackCommittee = undefined;

      for (let i = 1; i <= committees.length; i++) {
        const committee = committees[i];
        if (committee) {
          // We don't want to return the overall committee or vice committee if we have a better option
          if (
            committee.team.correspondingCommittee?.identifier ===
              CommitteeIdentifier.overallCommittee ||
            committee.team.correspondingCommittee?.identifier ===
              CommitteeIdentifier.viceCommittee
          ) {
            fallbackCommittee = committee;
            continue;
          }

          if (bestCommittee) {
            if (
              committee.committeeRole === CommitteeRole.Chair &&
              bestCommittee.committeeRole !== CommitteeRole.Chair
            ) {
              bestCommittee = committee;
              continue;
            } else if (
              committee.committeeRole === CommitteeRole.Coordinator &&
              !(
                bestCommittee.committeeRole === CommitteeRole.Coordinator ||
                bestCommittee.committeeRole === CommitteeRole.Chair
              )
            ) {
              bestCommittee = committee;
              continue;
            }
          } else {
            bestCommittee = committee;
          }
        }
      }

      if (bestCommittee) {
        if (
          !bestCommittee.team.correspondingCommittee ||
          !bestCommittee.committeeRole
        ) {
          return Err(new InvariantError("Invalid committee assignment"));
        }
        return Ok([bestCommittee, bestCommittee.team.correspondingCommittee]);
      } else if (fallbackCommittee) {
        if (
          !fallbackCommittee.team.correspondingCommittee ||
          !fallbackCommittee.committeeRole
        ) {
          throw new DetailedError(
            ErrorCode.InternalFailure,
            "Invalid committee assignment"
          );
        }
        return Ok([
          fallbackCommittee,
          fallbackCommittee.team.correspondingCommittee,
        ]);
      } else {
        return Err(new NotFoundError({ what: "Primary committee" }));
      }
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
