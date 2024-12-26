import crypto from "node:crypto";
import { promisify } from "node:util";

import { Service } from "@freshgum/typedi";
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
import { and, eq, getTableColumns, isNotNull, or, sql } from "drizzle-orm";
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
import type { Drizzle } from "#db";
import type { FindManyParams } from "#lib/queryFromArgs.js";
import { drizzleToken } from "#lib/typediTokens.js";
import { CommitteeRepository } from "#repositories/committee/CommitteeRepository.js";
import {
  buildDefaultRepository,
  Transaction,
} from "#repositories/DefaultRepository.js";
import {
  MarathonRepository,
  UniqueMarathonParam,
} from "#repositories/marathon/MarathonRepository.js";
import { MembershipRepository } from "#repositories/membership/MembershipRepository.js";
import {
  handleRepositoryError,
  type RepositoryError,
} from "#repositories/shared.js";
import { membership, person } from "#schema/tables/person.sql.js";
import { committee, team } from "#schema/tables/team.sql.js";

import { PersonModel } from "./PersonModel.js";

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

interface MembershipInput {
  uuid: string;
  committeeRole?: CommitteeRole | null | undefined;
}

@Service([
  drizzleToken,
  MembershipRepository,
  CommitteeRepository,
  MarathonRepository,
])
export class PersonRepository extends buildDefaultRepository(
  person,
  PersonModel,
  {
    name: person.name,
    email: person.email,
    linkblue: person.linkblue,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
    committeeRole: membership.committeeRole,
    committeeName: committee.identifier,
  },
  {} as UniquePersonParam
) {
  constructor(
    protected readonly db: Drizzle,
    private readonly membershipRepository: MembershipRepository,
    private readonly committeeRepository: CommitteeRepository,
    private readonly marathonRepository: MarathonRepository
  ) {
    super(db);
  }

  public uniqueToWhere(by: UniquePersonParam) {
    if ("id" in by) {
      return eq(person.id, by.id);
    } else if ("uuid" in by) {
      return eq(person.uuid, by.uuid);
    } else if ("email" in by) {
      return eq(person.email, by.email);
    } else if ("linkblue" in by) {
      return eq(person.linkblue, by.linkblue);
    } else {
      by satisfies never;
      throw new Error("Invalid unique person param");
    }
  }

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
      const row = await findPersonForLogin(this.db, authIds, userInfo);
      return Ok(row);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  findOne({
    by,
    tx,
  }: {
    by: UniquePersonParam;
    tx?: Transaction;
  }): AsyncResult<PersonModel<true>, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db).query.person.findFirst({
        where: this.uniqueToWhere(by),
        with: {
          memberships: {
            with: {
              team: {
                with: {
                  correspondingCommittee: true,
                },
              },
            },
          },
        },
      }),
      { what: "Person", where: "findOne" }
    ).map((row) => new PersonModel<true>(row));
  }

  findAll({
    tx,
  }: {
    tx?: Transaction;
  }): AsyncResult<PersonModel<true>[], RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db).query.person.findMany({
        with: {
          memberships: {
            with: {
              team: {
                with: {
                  correspondingCommittee: true,
                },
              },
            },
          },
        },
      })
    ).map((rows) => rows.map((row) => new PersonModel<true>(row)));
  }

  findAndCount({
    param,
    tx,
  }: {
    param: FindManyParams<(typeof PersonRepository.fields)[number]>;
    tx?: Transaction;
  }): AsyncResult<
    { total: number; selectedRows: PersonModel<true>[] },
    RepositoryError
  > {
    return this.parseFindManyParams(param)
      .toAsyncResult()
      .andThen((param) => {
        let query = (tx ?? this.db)
          .select()
          .from(person)
          .leftJoin(membership, eq(person.id, membership.personId))
          .leftJoin(team, eq(membership.teamId, team.id))
          .leftJoin(committee, eq(team.correspondingCommitteeId, committee.id))
          .$dynamic();
        const countQuery = (tx ?? this.db).$count(person, param.where);
        if (param.where) {
          query = query.where(param.where);
        }
        if (param.orderBy) {
          query = query.orderBy(...param.orderBy);
        }
        if (param.limit) {
          query = query.limit(param.limit);
        }
        if (param.offset) {
          query = query.offset(param.offset);
        }
        return new AsyncResult(
          Promise.all([
            this.handleQueryError(query, {
              what: "Person",
              where: "findAndCount",
            }).promise,
            this.handleQueryError(countQuery, {
              what: "Person",
              where: "findAndCount",
            }).promise,
          ]).then(([rows, total]) => Result.all([rows, total]))
        );
      })
      .map(
        ([rows, total]): {
          total: number;
          selectedRows: PersonModel<true>[];
        } => {
          const records: ConstructorParameters<typeof PersonModel<true>>[0][] =
            [];
          for (const row of rows) {
            const existing = records.find((r) => r.id === row.Person.id);
            if (existing) {
              const existingMembership = existing.memberships.find(
                (m) => m.team.id === row.Membership?.id
              );
              if (!existingMembership) {
                existing.memberships.push({
                  ...row.Membership!,
                  team: {
                    ...row.Team!,
                    correspondingCommittee: row.Committee,
                  },
                });
              }
            } else {
              records.push({
                ...row.Person,
                memberships: row.Membership
                  ? [
                      {
                        ...row.Membership,
                        team: {
                          ...row.Team!,
                          correspondingCommittee: row.Committee,
                        },
                      },
                    ]
                  : [],
              });
            }
          }
          return {
            total,
            selectedRows: records.map((row) => new PersonModel<true>(row)),
          };
        }
      );
  }

  update({
    by,
    init,
    tx,
  }: {
    by: UniquePersonParam;
    init: Partial<{
      email: string;
      name?: string | null | undefined;
      linkblue?: string | null | undefined;
      memberOf?: MembershipInput[] | undefined | null;
      captainOf?: MembershipInput[] | undefined | null;
      authIds?:
        | { source: Exclude<AuthSource, "None">; value: string }[]
        | undefined
        | null;
    }>;
    tx?: Transaction;
  }): AsyncResult<PersonModel, RepositoryError> {
    // TODO: Implement memberOf, captainOf, and authIds
    return this.handleQueryError(
      (tx ?? this.db)
        .update(person)
        .set(init)
        .where(this.uniqueToWhere(by))
        .returning()
        .then((rows) => rows[0]),
      { what: "Person", where: "update" }
    ).map((row) => new PersonModel(row));
  }

  create({
    init,
    tx,
  }: {
    init: {
      email: string;
      name?: string | null | undefined;
      linkblue?: string | null | undefined;
      memberOf?: MembershipInput[] | undefined | null;
      captainOf?: MembershipInput[] | undefined | null;
    };
    tx?: Transaction;
  }): AsyncResult<PersonModel, RepositoryError> {
    // TODO: Implement memberOf and captainOf
    return this.handleQueryError(
      (tx ?? this.db)
        .insert(person)
        .values(init)
        .returning()
        .then((rows) => rows[0]),
      { what: "Person", where: "create" }
    ).map((row) => new PersonModel(row));
  }

  delete({
    by,
    tx,
  }: {
    by: UniquePersonParam;
    tx?: Transaction;
  }): AsyncResult<PersonModel, RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db)
        .delete(person)
        .where(this.uniqueToWhere(by))
        .returning()
        .then((rows) => rows[0]),
      { what: "Person", where: "delete" }
    ).map((row) => new PersonModel(row));
  }

  createMultiple({
    data,
    tx,
  }: {
    data: {
      init: {
        email: string;
        name?: string | null | undefined;
        linkblue?: string | null | undefined;
        memberOf?: MembershipInput[] | undefined | null;
        captainOf?: MembershipInput[] | undefined | null;
      };
    }[];
    tx?: Transaction;
  }): AsyncResult<PersonModel[], RepositoryError> {
    return this.handleQueryError(
      (tx ?? this.db)
        .insert(person)
        .values(data.map((d) => d.init))
        .returning()
        .then((rows) => rows.map((row) => new PersonModel(row))),
      { what: "Person", where: "createMultiple" }
    );
  }

  private readonly PASSWORD_ITERATIONS = 100_000;
  private readonly PASSWORD_KEYLEN = 256;
  private readonly PASSWORD_DIGEST = "sha512";
  private readonly PASSWORD_SALTLEN = 16;

  passwordLogin(
    email: string,
    password: string
  ): AsyncResult<PersonModel, RepositoryError | UnauthenticatedError> {
    // Things are a little weird here because we want to avoid timing attacks
    // This means that no matter what, the function should take about the same amount of time
    // TODO: Test that behavior

    return this.findOne({ by: { email } }).andThen((person) => {
      const { hashedPassword, salt } = person.row;

      const fallbackSalt = Buffer.alloc(this.PASSWORD_SALTLEN);
      const fallbackHashedPassword = Buffer.alloc(this.PASSWORD_KEYLEN);

      const hashToCompare = crypto.pbkdf2Sync(
        Buffer.from(password, "utf8"),
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        salt ? salt : fallbackSalt,
        this.PASSWORD_ITERATIONS,
        this.PASSWORD_KEYLEN,
        this.PASSWORD_DIGEST
      );

      if (
        !crypto.timingSafeEqual(
          hashToCompare,
          // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
          hashedPassword ? hashedPassword : fallbackHashedPassword
        )
      ) {
        return Err(new UnauthenticatedError());
      }

      return Ok(person);
    });
  }

  setPassword(
    param: UniquePersonParam,
    password: string | null
  ): AsyncResult<PersonModel, RepositoryError> {
    if (password === null) {
      return this.handleQueryError(
        this.db
          .update(person)
          .set({
            salt: null,
            hashedPassword: null,
          })
          .where(this.uniqueToWhere(param))
          .returning()
          .then((rows) => rows[0]),
        { what: "Person", where: "setPassword" }
      ).map((row) => new PersonModel(row));
    }
    const salt = crypto.randomBytes(this.PASSWORD_SALTLEN);
    return this.promiseToAsyncResult(
      promisify(crypto.pbkdf2)(
        Buffer.from(password, "utf8"),
        salt,
        this.PASSWORD_ITERATIONS,
        this.PASSWORD_KEYLEN,
        this.PASSWORD_DIGEST
      )
    ).andThen((hashedPassword) =>
      this.handleQueryError(
        this.db
          .update(person)
          .set({
            salt,
            hashedPassword,
          })
          .where(this.uniqueToWhere(param))
          .returning()
          .then((rows) => rows[0]),
        { what: "Person", where: "setPassword" }
      ).map((row) => new PersonModel(row))
    );
  }

  getEffectiveCommitteeRolesOfPerson(
    param: UniquePersonParam
  ): AsyncResult<EffectiveCommitteeRole[], RepositoryError | InvariantError> {
    return this.marathonRepository
      .findActiveMarathon()
      .andThen((marathon) =>
        this.handleQueryError(
          this.db.query.membership.findMany({
            where: and(
              this.uniqueToWhere(param),
              isNotNull(team.correspondingCommitteeId),
              eq(team.marathonId, marathon.row.id),
              isNotNull(membership.committeeRole)
            ),
            with: {
              team: {
                with: {
                  correspondingCommittee: {
                    columns: { identifier: true },
                    with: {
                      parentCommittee: {
                        columns: { identifier: true },
                        with: {
                          parentCommittee: {
                            columns: { identifier: true },
                          },
                        },
                      },
                      childCommittees: {
                        columns: { identifier: true },
                        with: {
                          childCommittees: {
                            columns: { identifier: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            columns: {
              committeeRole: true,
            },
          })
        )
      )
      .andThen((committees) => {
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
      });
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
