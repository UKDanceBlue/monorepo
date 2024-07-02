import { Membership, Person, PrismaClient, Team } from "@prisma/client";
import { CommitteeRole, MembershipPositionType } from "@ukdanceblue/common";
import { Err, Ok, Result } from "ts-results-es";
import { Service } from "typedi";

import { NotFoundError } from "../../lib/error/direct.js";
import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import {
  handleRepositoryError,
  type RepositoryError,
  type SimpleUniqueParam,
} from "../shared.js";

const membershipBooleanKeys = [] as const;
type MembershipBooleanKey = (typeof membershipBooleanKeys)[number];

const membershipDateKeys = ["createdAt", "updatedAt"] as const;
type MembershipDateKey = (typeof membershipDateKeys)[number];

const membershipIsNullKeys = [] as const;
type MembershipIsNullKey = (typeof membershipIsNullKeys)[number];

const membershipNumericKeys = [] as const;
type MembershipNumericKey = (typeof membershipNumericKeys)[number];

const membershipOneOfKeys = [] as const;
type MembershipOneOfKey = (typeof membershipOneOfKeys)[number];

const membershipStringKeys = [] as const;
type MembershipStringKey = (typeof membershipStringKeys)[number];

export type MembershipFilters = FilterItems<
  MembershipBooleanKey,
  MembershipDateKey,
  MembershipIsNullKey,
  MembershipNumericKey,
  MembershipOneOfKey,
  MembershipStringKey
>;

type UniqueMembershipParam = { id: number } | { uuid: string };

@Service()
export class MembershipRepository {
  constructor(private prisma: PrismaClient) {}

  async findMembershipByUnique(
    param: UniqueMembershipParam,
    include?: {
      person?: false;
      team?: false;
    }
  ): Promise<Result<Membership, RepositoryError>>;
  async findMembershipByUnique(
    param: UniqueMembershipParam,
    include: {
      person: true;
      team?: false;
    }
  ): Promise<Result<Membership & { person: Person }, RepositoryError>>;
  async findMembershipByUnique(
    param: UniqueMembershipParam,
    include: {
      person?: false;
      team: true;
    }
  ): Promise<Result<Membership & { team: Team }, RepositoryError>>;
  async findMembershipByUnique(
    param: UniqueMembershipParam,
    include: {
      person: true;
      team: true;
    }
  ): Promise<
    Result<Membership & { person: Person; team: Team }, RepositoryError>
  >;
  async findMembershipByUnique(
    param: UniqueMembershipParam,
    include?: {
      person?: boolean;
      team?: boolean;
    }
  ): Promise<
    Result<
      | Membership
      | (Membership & {
          person: Person;
        })
      | (Membership & {
          team: Team;
        })
      | (Membership & {
          person: Person;
          team: Team;
        }),
      RepositoryError
    >
  > {
    try {
      const membership = await this.prisma.membership.findUnique({
        where: param,
        include,
      });
      if (!membership) {
        return Err(new NotFoundError({ what: "Membership" }));
      }
      return Ok(membership);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  private async lookupPersonAndTeamId(
    personParam: SimpleUniqueParam,
    teamParam: SimpleUniqueParam
  ): Promise<Result<{ personId: number; teamId: number }, RepositoryError>> {
    try {
      let personId, teamId;
      if ("id" in personParam) {
        personId = personParam.id;
      } else if ("uuid" in personParam) {
        const found = await this.prisma.person.findUnique({
          where: { uuid: personParam.uuid },
          select: { id: true },
        });
        if (found == null) {
          return Err(new NotFoundError({ what: "Person" }));
        }
        personId = found.id;
      } else {
        throw new Error("Must provide either UUID or ID");
      }
      if ("id" in teamParam) {
        teamId = teamParam.id;
      } else if ("uuid" in teamParam) {
        const found = await this.prisma.team.findUnique({
          where: teamParam,
          select: { id: true },
        });
        if (found == null) {
          return Err(new NotFoundError({ what: "Team" }));
        }
        teamId = found.id;
      } else {
        throw new Error("Must provide either UUID or ID");
      }

      return Ok({ personId, teamId });
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async assignPersonToTeam({
    personParam,
    teamParam,
    ...additionalData
  }: {
    personParam: SimpleUniqueParam;
    teamParam: SimpleUniqueParam;
  } & (
    | {
        position: MembershipPositionType;
      }
    | {
        committeeRole: CommitteeRole;
      }
  )): Promise<Result<Membership, RepositoryError>> {
    try {
      const result = await this.lookupPersonAndTeamId(personParam, teamParam);
      if (result.isErr()) {
        return Err(result.error);
      }
      const { personId, teamId } = result.value;

      let position: MembershipPositionType;
      let committeeRole: CommitteeRole | undefined;
      if ("position" in additionalData) {
        position = additionalData.position;
      } else if ("committeeRole" in additionalData) {
        committeeRole = additionalData.committeeRole;
        position =
          additionalData.committeeRole === CommitteeRole.Chair
            ? MembershipPositionType.Captain
            : MembershipPositionType.Member;
      } else {
        throw new Error("Must provide either position or committeeRole");
      }

      const membership = await this.prisma.membership.upsert({
        where: {
          personId_teamId: {
            personId,
            teamId,
          },
          team: {
            correspondingCommitteeId: null,
          },
        },
        create: {
          person: {
            connect: {
              id: personId,
            },
          },
          team: {
            connect: {
              id: teamId,
            },
          },
          position,
          committeeRole,
        },
        update: {},
      });

      return Ok(membership);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }

  async removePersonFromTeam(
    personParam: SimpleUniqueParam,
    teamParam: SimpleUniqueParam
  ): Promise<Result<Membership, RepositoryError>> {
    try {
      const result = await this.lookupPersonAndTeamId(personParam, teamParam);
      if (result.isErr()) {
        return Err(result.error);
      }
      const { personId, teamId } = result.value;

      const membership = await this.prisma.membership.delete({
        where: {
          personId_teamId: {
            personId,
            teamId,
          },
        },
      });

      return Ok(membership);
    } catch (error) {
      return handleRepositoryError(error);
    }
  }
}
