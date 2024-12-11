import crypto from "node:crypto";

import { Service } from "@freshgum/typedi";
import type {
  Committee,
  Marathon,
  Membership,
  Person,
  Team,
} from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";
import {
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  EffectiveCommitteeRole,
  MembershipPositionType,
  SortDirection,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import {
  ActionDeniedError,
  CompositeError,
  ConcreteResult,
  InvalidArgumentError,
  InvariantError,
  NotFoundError,
  optionOf,
  UnauthenticatedError,
} from "@ukdanceblue/common/error";
import {
  AsyncResult,
  Err,
  None,
  Ok,
  Option,
  Result,
  Some,
} from "ts-results-es";

import { findPersonForLogin } from "#auth/findPersonForLogin.js";
import type { FilterItems } from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";
import {
  MarathonRepository,
  UniqueMarathonParam,
} from "#repositories/marathon/MarathonRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import {
  handleRepositoryError,
  type RepositoryError,
  type SimpleUniqueParam,
  unwrapRepositoryError,
} from "#repositories/shared.js";

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

import { promisify } from "node:util";

import { prismaToken } from "#lib/typediTokens.js";
import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";

@Service([
  prismaToken,
  MembershipRepository,
  CommitteeRepository,
  MarathonRepository,
])
export class PersonRepository {
  constructor(
    private prisma: PrismaClient,
    private membershipRepository: MembershipRepository,
    private committeeRepository: CommitteeRepository,
    private marathonRepository: MarathonRepository
  ) {}

  // Finders

  async findPersonForLogin(
    authIds: [Exclude<AuthSource, "None">, string][],
    userInfo: {
      uuid?: string | undefined | null;
      email?: string | undefined | null;
      linkblue?: string | undefined | null;
      name?: string | undefined | null;
      dbRole?: DbRole | undefined | null;
    }
  ): Promise<
    Result<Awaited<ReturnType<typeof findPersonForLogin>>, RepositoryError>
  > {
    try {
      const row = await findPersonForLogin(this.prisma, authIds, userInfo);
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async findPersonByUnique(
    param: UniquePersonParam
  ): Promise<Result<Option<Person>, RepositoryError>> {
    try {
      const row = await this.prisma.person.findUnique({ where: param });
      return Ok(optionOf(row));
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

  private readonly PASSWORD_ITERATIONS = 100_000;
  private readonly PASSWORD_KEYLEN = 256;
  private readonly PASSWORD_DIGEST = "sha512";
  private readonly PASSWORD_SALTLEN = 16;

  async passwordLogin(
    email: string,
    password: string
  ): Promise<Result<Person, RepositoryError | UnauthenticatedError>> {
    try {
      const person = await this.findPersonByUnique({ email });
      if (person.isErr()) {
        return person;
      }
      if (
        person.value.isNone() ||
        !person.value.value.hashedPassword ||
        !person.value.value.salt
      ) {
        return Err(new NotFoundError({ what: "Person" }));
      }

      const { hashedPassword, salt } = person.value.value;

      const hashToCompare = await promisify(crypto.pbkdf2)(
        Buffer.from(password, "utf8"),
        salt,
        this.PASSWORD_ITERATIONS,
        this.PASSWORD_KEYLEN,
        this.PASSWORD_DIGEST
      );

      return crypto.timingSafeEqual(hashToCompare, hashedPassword)
        ? Ok(person.value.value)
        : Err(new UnauthenticatedError());
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async setPassword(
    param: UniquePersonParam,
    password: string | null
  ): Promise<Result<Person, RepositoryError | NotFoundError>> {
    try {
      if (password === null) {
        const person = await this.prisma.person.update({
          where: param,
          data: {
            salt: null,
            hashedPassword: null,
          },
        });

        return Ok(person);
      }
      const salt = crypto.randomBytes(this.PASSWORD_SALTLEN);
      const hashedPassword = await promisify(crypto.pbkdf2)(
        Buffer.from(password, "utf8"),
        salt,
        this.PASSWORD_ITERATIONS,
        this.PASSWORD_KEYLEN,
        this.PASSWORD_DIGEST
      );

      const person = await this.prisma.person.update({
        where: param,
        data: {
          salt,
          hashedPassword,
        },
      });

      return Ok(person);
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
      const marathon = await new AsyncResult(
        this.marathonRepository.findActiveMarathon()
      ).andThen((option) =>
        option.toResult(new NotFoundError({ what: "active marathon" }))
      ).promise;
      if (marathon.isErr()) {
        return Err(marathon.error);
      }

      const committees = await this.prisma.membership.findMany({
        where: {
          person: param,
          team: {
            correspondingCommittee: {
              isNot: null,
            },
            marathonId: marathon.value.id,
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
                      parentCommittee: {
                        select: {
                          identifier: true,
                        },
                      },
                    },
                  },
                  childCommittees: {
                    select: {
                      identifier: true,
                      childCommittees: {
                        select: {
                          identifier: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          committeeRole: true,
        },
      });

      const effectiveCommitteeRoles: Partial<
        Record<CommitteeIdentifier, EffectiveCommitteeRole>
      > = {};
      function addRole(identifier: CommitteeIdentifier, role: CommitteeRole) {
        const existing = effectiveCommitteeRoles[identifier];
        if (existing) {
          if (role > existing.role) {
            existing.role = role;
          }
        } else {
          effectiveCommitteeRoles[identifier] = EffectiveCommitteeRole.init(
            identifier,
            role
          );
        }
      }
      for (const { team, committeeRole } of committees) {
        if (team.correspondingCommittee) {
          addRole(
            team.correspondingCommittee.identifier,
            committeeRole ?? CommitteeRole.Member
          );
          if (team.correspondingCommittee.parentCommittee) {
            switch (team.correspondingCommittee.parentCommittee.identifier) {
              case CommitteeIdentifier.viceCommittee: {
                addRole(
                  CommitteeIdentifier.viceCommittee,
                  committeeRole ?? CommitteeRole.Member
                );
                // fallthrough
              }
              case CommitteeIdentifier.overallCommittee: {
                addRole(
                  CommitteeIdentifier.overallCommittee,
                  CommitteeRole.Member
                );
                break;
              }
              default: {
                return Err(
                  new InvariantError(
                    `Unexpected parent committee ${team.correspondingCommittee.parentCommittee.identifier}`
                  )
                );
              }
            }
          }

          if (
            (committeeRole === CommitteeRole.Chair ||
              committeeRole === CommitteeRole.Coordinator) &&
            (team.correspondingCommittee.identifier ===
              CommitteeIdentifier.overallCommittee ||
              team.correspondingCommittee.identifier ===
                CommitteeIdentifier.viceCommittee)
          ) {
            for (const child of team.correspondingCommittee.childCommittees) {
              addRole(child.identifier, committeeRole);
              for (const grandchild of child.childCommittees) {
                addRole(grandchild.identifier, committeeRole);
              }
            }
          }
        }
      }

      return Ok(Object.values(effectiveCommitteeRoles));
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
              contains: linkblue.toLowerCase(),
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
    includeTeam = false
  ): Promise<Result<(Membership & { team: Team })[], RepositoryError>> {
    if (types?.includes(TeamType.Spirit)) {
      // @ts-expect-error Before committees were split out, they had a special type. It is now equivalent to Spirit
      types.push("Committee");
    }
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
    memberOf,
    captainOf,
  }: {
    name?: string | undefined | null;
    email: string;
    linkblue?: string | undefined | null;
    authIds?:
      | { source: Exclude<AuthSource, "None">; value: string }[]
      | undefined
      | null;
    memberOf?: SimpleUniqueParam[] | undefined | null;
    captainOf?: SimpleUniqueParam[] | undefined | null;
  }): Promise<
    Result<Person, RepositoryError | CompositeError<RepositoryError>>
  > {
    try {
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

      const person = await this.prisma.person.create({
        data: {
          name,
          email,
          linkblue: linkblue?.toLowerCase(),
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

      if (memberOfIds) {
        const result = await Promise.allSettled(
          memberOfIds.map(async (teamId) => {
            if (teamId) {
              await this.membershipRepository.assignPersonToTeam({
                personParam: {
                  id: person.id,
                },
                teamParam: {
                  id: teamId,
                },
                position: MembershipPositionType.Member,
              });
            }
          })
        );
        const errors = result.filter((r) => r.status === "rejected");
        if (errors.length > 0) {
          return Err(
            new CompositeError(
              errors.map((e) => unwrapRepositoryError(e.reason))
            )
          );
        }
      }
      if (captainOfIds) {
        const result = await Promise.allSettled(
          captainOfIds.map(async (teamId) => {
            if (teamId) {
              await this.membershipRepository.assignPersonToTeam({
                personParam: {
                  id: person.id,
                },
                teamParam: {
                  id: teamId,
                },
                position: MembershipPositionType.Captain,
              });
            }
          })
        );
        const errors = result.filter((r) => r.status === "rejected");
        if (errors.length > 0) {
          return Err(
            new CompositeError(
              errors.map((e) => unwrapRepositoryError(e.reason))
            )
          );
        }
      }

      return Ok(person);
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
      memberOf?:
        | {
            id: string | number;
            committeeRole?: CommitteeRole | undefined | null;
          }[]
        | undefined
        | null;
      captainOf?:
        | {
            id: string | number;
            committeeRole?: CommitteeRole | undefined | null;
          }[]
        | undefined
        | null;
    }
  ): Promise<
    Result<
      Person,
      | RepositoryError
      | InvalidArgumentError
      | CompositeError<NotFoundError | ActionDeniedError>
    >
  > {
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
              memberOf.map(({ id, committeeRole }) =>
                this.prisma.team
                  .findUnique({
                    where: typeof id === "number" ? { id } : { uuid: id },
                    select: { id: true, correspondingCommitteeId: true },
                  })
                  .then((team) => {
                    if (!team) {
                      return Err(new NotFoundError({ what: "Team" }));
                    } else if (
                      !team.correspondingCommitteeId &&
                      committeeRole
                    ) {
                      return Err(
                        new ActionDeniedError(
                          "Cannot assign a committee role to a non-committee team"
                        )
                      );
                    } else {
                      return Ok({
                        id: team.id,
                        committeeRole: committeeRole ?? undefined,
                      });
                    }
                  })
              )
            )
          : Promise.resolve([]),
        captainOf
          ? Promise.all(
              captainOf.map(({ id, committeeRole }) =>
                this.prisma.team
                  .findUnique({
                    where: typeof id === "number" ? { id } : { uuid: id },
                    select: { id: true, correspondingCommitteeId: true },
                  })
                  .then((team) => {
                    if (!team) {
                      return Err(new NotFoundError({ what: "Team" }));
                    } else if (
                      !team.correspondingCommitteeId &&
                      committeeRole
                    ) {
                      return Err(
                        new ActionDeniedError(
                          "Cannot assign a committee role to a non-committee team"
                        )
                      );
                    } else {
                      return Ok({
                        id: team.id,
                        committeeRole: committeeRole ?? undefined,
                      });
                    }
                  })
              )
            )
          : Promise.resolve([]),
      ]);

      const memberOfErrors: (ActionDeniedError | NotFoundError)[] = [];
      const okMemberOfIds: { id: number; committeeRole?: CommitteeRole }[] = [];
      const okCaptainOfIds: { id: number; committeeRole?: CommitteeRole }[] =
        [];
      for (const result of memberOfIds) {
        if (result.isErr()) {
          memberOfErrors.push(result.error);
        } else {
          okMemberOfIds.push(result.value);
        }
      }
      for (const result of captainOfIds) {
        if (result.isErr()) {
          memberOfErrors.push(result.error);
        } else {
          okCaptainOfIds.push(result.value);
        }
      }
      if (memberOfErrors.length > 0) {
        return Err(new CompositeError(memberOfErrors));
      }

      return Ok(
        await this.prisma.person.update({
          where: param,
          data: {
            name,
            email,
            linkblue: linkblue?.toLowerCase(),
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
                    deleteMany: {
                      teamId: {
                        notIn: [
                          ...okMemberOfIds.map(({ id }) => id),
                          ...okCaptainOfIds.map(({ id }) => id),
                        ],
                      },
                      personId,
                    },
                    upsert: [
                      ...okMemberOfIds.map(
                        ({
                          id: teamId,
                          committeeRole,
                        }): Prisma.MembershipUpsertWithWhereUniqueWithoutPersonInput => {
                          return {
                            where: { personId_teamId: { personId, teamId } },
                            create: {
                              position: MembershipPositionType.Member,
                              committeeRole,
                              team: {
                                connect: {
                                  id: teamId,
                                  correspondingCommitteeId: committeeRole
                                    ? {
                                        not: null,
                                      }
                                    : undefined,
                                },
                              },
                            },
                            update: {
                              position: MembershipPositionType.Member,
                              committeeRole,
                            },
                          };
                        }
                      ),
                      ...okCaptainOfIds.map(
                        ({
                          id: teamId,
                          committeeRole,
                        }): Prisma.MembershipUpsertWithWhereUniqueWithoutPersonInput => {
                          return {
                            where: { personId_teamId: { personId, teamId } },
                            create: {
                              position: MembershipPositionType.Captain,
                              committeeRole,
                              team: {
                                connect: {
                                  id: teamId,
                                  correspondingCommitteeId: committeeRole
                                    ? {
                                        not: null,
                                      }
                                    : undefined,
                                },
                              },
                            },
                            update: {
                              position: MembershipPositionType.Captain,
                              committeeRole,
                            },
                          };
                        }
                      ),
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

  async bulkLoadPeople(
    people: {
      name: string;
      email: string;
      linkblue: string;
      committee: CommitteeIdentifier | null | undefined;
      role: CommitteeRole | null | undefined;
    }[],
    marathon: UniqueMarathonParam
  ): Promise<
    Result<Person[], RepositoryError | CompositeError<RepositoryError>>
  > {
    try {
      await this.committeeRepository.ensureCommittees([marathon]);
      let marathonId: number;
      if ("id" in marathon) {
        marathonId = marathon.id;
      } else {
        const found = await this.prisma.marathon.findUnique({
          where: marathon,
          select: { id: true },
        });
        if (found == null) {
          return Err(new NotFoundError({ what: "Marathon" }));
        }
        marathonId = found.id;
      }

      const committeeIds: Record<CommitteeIdentifier, number> = {} as Record<
        CommitteeIdentifier,
        number
      >;
      const committees = await this.prisma.committee.findMany({
        where: {
          correspondingTeams: {
            some: {
              marathonId,
            },
          },
        },
        select: {
          identifier: true,
          id: true,
        },
      });
      for (const committee of committees) {
        committeeIds[committee.identifier] = committee.id;
      }

      const addToVice: {
        name: string;
        email: string;
        linkblue: string;
        committee: CommitteeIdentifier | null | undefined;
        role: CommitteeRole | null | undefined;
      }[] = [];

      const result = await this.prisma.$transaction(
        people.map((person) => {
          if (
            person.committee === CommitteeIdentifier.overallCommittee ||
            person.committee === CommitteeIdentifier.fundraisingCommittee ||
            person.committee === CommitteeIdentifier.dancerRelationsCommittee
          ) {
            addToVice.push(person);
          }

          return this.prisma.person.upsert({
            where: {
              linkblue: person.linkblue.toLowerCase(),
            },
            create: {
              name: person.name,
              email: person.email,
              linkblue: person.linkblue.toLowerCase(),
              memberships:
                person.committee && person.role
                  ? {
                      create: {
                        team: {
                          connect: {
                            marathonId_correspondingCommitteeId: {
                              marathonId,
                              correspondingCommitteeId:
                                committeeIds[person.committee],
                            },
                          },
                        },
                        position:
                          person.role === CommitteeRole.Chair
                            ? MembershipPositionType.Captain
                            : MembershipPositionType.Member,
                        committeeRole: person.role,
                      },
                    }
                  : undefined,
            },
            update: {
              name: person.name,
              email: person.email,
              linkblue: person.linkblue.toLowerCase(),
              memberships:
                person.committee && person.role
                  ? {
                      create: {
                        team: {
                          connect: {
                            marathonId_correspondingCommitteeId: {
                              marathonId,
                              correspondingCommitteeId:
                                committeeIds[person.committee],
                            },
                          },
                        },
                        position:
                          person.role === CommitteeRole.Chair
                            ? MembershipPositionType.Captain
                            : MembershipPositionType.Member,
                        committeeRole: person.role,
                      },
                    }
                  : undefined,
            },
          });
        })
      );

      for (const person of addToVice) {
        // eslint-disable-next-line no-await-in-loop
        await this.prisma.membership.upsert({
          create: {
            person: {
              connect: {
                email: person.email,
              },
            },
            team: {
              connect: {
                marathonId_correspondingCommitteeId: {
                  marathonId,
                  correspondingCommitteeId: committeeIds.viceCommittee,
                },
              },
            },
            position:
              person.role === CommitteeRole.Chair
                ? MembershipPositionType.Captain
                : MembershipPositionType.Member,
            committeeRole: person.role,
          },
          update: {
            position:
              person.role === CommitteeRole.Chair
                ? MembershipPositionType.Captain
                : MembershipPositionType.Member,
            committeeRole: person.role,
          },
          where: {
            personId_teamId: {
              personId: result.find((r) => r.email === person.email)!.id,
              teamId: marathonId,
            },
          },
        });
      }

      return Ok(result);
    } catch (error) {
      return handleRepositoryError(error);
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
    ConcreteResult<[Membership, Committee], RepositoryError | InvariantError>
  > {
    try {
      const committees = await this.prisma.membership.findMany({
        where: {
          person,
          team: {
            marathon,
            correspondingCommittee: {
              isNot: null,
            },
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

      for (let i = 0; i <= committees.length; i++) {
        const committee = committees[i];
        if (committee) {
          // We don't want to return the overall committee or vice committee if we have a better option
          if (
            !fallbackCommittee ||
            committee.team.correspondingCommittee?.identifier ===
              CommitteeIdentifier.overallCommittee
          ) {
            fallbackCommittee = committee;
            continue;
          }
          if (
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
        if (!bestCommittee.team.correspondingCommittee) {
          return Err(new InvariantError("Invalid committee assignment"));
        }
        return Ok([bestCommittee, bestCommittee.team.correspondingCommittee]);
      } else if (fallbackCommittee) {
        if (!fallbackCommittee.team.correspondingCommittee) {
          return Err(new InvariantError("Invalid committee assignment"));
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

  private scoreTeamForPrimary(
    membership: Membership & {
      team: Team & {
        _count: {
          pointEntries: number;
        };
        marathon: Marathon;
      };
    }
  ): number {
    let score = 0;
    const distanceFromCurrentYear = Math.abs(
      Number.parseInt(membership.team.marathon.year.substring(2), 10) +
        2000 -
        (new Date().getFullYear() + 1)
    );
    score += 500 - distanceFromCurrentYear * 100;
    score += membership.team._count.pointEntries;
    score += membership.committeeRole ? 100 : 0;
    return score;
  }

  async getPrimaryTeamOfPerson(
    personParam: UniquePersonParam,
    teamType: TeamType
  ): Promise<Result<Option<Membership & { team: Team }>, RepositoryError>> {
    try {
      // First we get the teams for this marathon
      const teams = await this.prisma.membership.findMany({
        where: {
          team: {
            type: teamType,
          },
          person: personParam,
        },
        include: {
          team: {
            include: {
              marathon: true,
              _count: {
                select: {
                  pointEntries: {
                    where: {
                      person: personParam,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const best = teams
        .map(
          (membership) =>
            [membership, this.scoreTeamForPrimary(membership)] as const
        )
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      return Ok(optionOf(best));
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async getTotalFundraisingAmount(
    param: UniquePersonParam
  ): Promise<ConcreteResult<Option<number>, RepositoryError>> {
    try {
      const {
        _sum: { amount },
      } = await this.prisma.fundraisingAssignment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          person: param,
        },
      });
      return Ok(
        amount !== null ? Some(amount.toDecimalPlaces(2).toNumber()) : None
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }
}
