import { Service } from "@freshgum/typedi";
import type {
  FundraisingEntry,
  PrismaClient,
  SolicitationCode,
  Team,
} from "@prisma/client";
import type { InvariantError } from "@ukdanceblue/common/error";
import { ActionDeniedError, NotFoundError } from "@ukdanceblue/common/error";
import type { Result } from "ts-results-es";
import { Err, None, Ok } from "ts-results-es";

import { prismaToken } from "#lib/typediTokens.js";
import type {
  FundraisingEntryUniqueParam,
  WideFundraisingEntryWithMeta,
} from "#repositories/fundraising/FundraisingRepository.js";
import { wideFundraisingEntryInclude } from "#repositories/fundraising/FundraisingRepository.js";
import type { UniqueMarathonParam } from "#repositories/marathon/MarathonRepository.js";
import type {
  RepositoryError,
  SimpleUniqueParam,
} from "#repositories/shared.js";
import { handleRepositoryError } from "#repositories/shared.js";

export type SolicitationCodeUniqueParam =
  | SimpleUniqueParam
  | {
      code: number;
      prefix: string;
    };

@Service([prismaToken])
export class SolicitationCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createSolicitationCode({
    prefix,
    code,
    name,
  }: {
    prefix: string;
    code: number;
    name?: string | null | undefined;
  }): Promise<Result<SolicitationCode, RepositoryError>> {
    try {
      return Ok(
        await this.prisma.solicitationCode.create({
          data: {
            prefix,
            code,
            name: name ?? null,
          },
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async setSolicitationCode(
    solicitationCodeParam: SolicitationCodeUniqueParam,
    {
      name,
    }: {
      name?: string | undefined | null;
    }
  ): Promise<Result<SolicitationCode, RepositoryError>> {
    try {
      return Ok(
        await this.prisma.solicitationCode.update({
          where:
            "code" in solicitationCodeParam
              ? { prefix_code: solicitationCodeParam }
              : solicitationCodeParam,
          data: {
            name: name ?? null,
          },
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams?: false
  ): Promise<
    Result<
      SolicitationCode,
      RepositoryError | ActionDeniedError | InvariantError
    >
  >;
  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams: true
  ): Promise<
    Result<
      SolicitationCode & { teams: readonly Team[] },
      RepositoryError | ActionDeniedError | InvariantError
    >
  >;
  async getSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    includeTeams?: boolean
  ): Promise<
    Result<
      SolicitationCode | (SolicitationCode & { teams: readonly Team[] }),
      RepositoryError | ActionDeniedError | InvariantError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntryWithMeta.findUnique({
        where: entryParam,
        include: {
          solicitationCodeOverride: includeTeams
            ? { include: { teams: true } }
            : true,
          ddn: {
            select: {
              solicitationCode: includeTeams
                ? { include: { teams: true } }
                : true,
            },
          },
          dbFundsEntry: {
            select: {
              dbFundsTeam: {
                select: {
                  solicitationCode: includeTeams
                    ? { include: { teams: true } }
                    : true,
                },
              },
            },
          },
        },
      });
      if (!entry) {
        return Err(new NotFoundError("FundraisingEntry"));
      }

      const solicitationCode =
        entry.solicitationCodeOverride ??
        entry.ddn?.solicitationCode ??
        entry.dbFundsEntry?.dbFundsTeam.solicitationCode;

      if (!solicitationCode) {
        return Err(new NotFoundError("SolicitationCode", "FundraisingEntry"));
      }
      return Ok(solicitationCode);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getEntriesForSolicitationCode(
    solicitationCodeParam: SimpleUniqueParam
  ): Promise<
    Result<
      readonly WideFundraisingEntryWithMeta[],
      InvariantError | RepositoryError
    >
  > {
    try {
      const entries = await this.prisma.fundraisingEntryWithMeta.findMany({
        where: {
          OR: [
            { solicitationCodeOverride: solicitationCodeParam },
            {
              ddn: { solicitationCode: solicitationCodeParam },
              solicitationCodeOverride: null,
            },
            {
              dbFundsEntry: {
                dbFundsTeam: { solicitationCode: solicitationCodeParam },
              },
              solicitationCodeOverride: null,
            },
          ],
        },
        include: wideFundraisingEntryInclude,
      });
      return Ok(entries);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async getTeamsForSolitationCode(
    solicitationCodeParam: SimpleUniqueParam,
    {
      marathonParam,
    }: {
      marathonParam?: UniqueMarathonParam;
    }
  ): Promise<
    Result<readonly Team[], RepositoryError | ActionDeniedError | NotFoundError>
  > {
    try {
      const teams = await this.prisma.team.findMany({
        where: {
          solicitationCode: solicitationCodeParam,
          marathon: marathonParam,
        },
      });
      return Ok(teams);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async assignSolitationCodeToTeam(
    teamParam: SimpleUniqueParam,
    solicitationCodeParam: SimpleUniqueParam
  ): Promise<Result<None, RepositoryError | ActionDeniedError>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: teamParam,
        include: { solicitationCode: true },
      });
      if (!team) {
        return Err(new NotFoundError("Team"));
      }
      if (team.solicitationCode) {
        return Err(
          new ActionDeniedError("Team already has a solicitation code")
        );
      }

      await this.prisma.team.update({
        where: teamParam,
        data: {
          solicitationCode: { connect: solicitationCodeParam },
        },
      });

      return Ok(None);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async removeSolicitationCodeFromTeam(
    teamParam: SimpleUniqueParam
  ): Promise<Result<None, RepositoryError | ActionDeniedError>> {
    try {
      const team = await this.prisma.team.findUnique({
        where: teamParam,
        include: { solicitationCode: true },
      });
      if (!team) {
        return Err(new NotFoundError("Team"));
      }
      if (!team.solicitationCode) {
        return Err(
          new ActionDeniedError("Team does not have a solicitation code")
        );
      }

      await this.prisma.team.update({
        where: teamParam,
        data: {
          solicitationCode: { disconnect: true },
        },
      });

      return Ok(None);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async overrideSolicitationCodeForEntry(
    entryParam: FundraisingEntryUniqueParam,
    solicitationCodeParam: SimpleUniqueParam
  ): Promise<
    Result<
      FundraisingEntry,
      RepositoryError | ActionDeniedError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntry.findUnique({
        where: entryParam,
      });
      if (!entry) {
        return Err(new NotFoundError("FundraisingEntry"));
      }

      await this.prisma.fundraisingEntry.update({
        where: entryParam,
        data: {
          solicitationCodeOverride: { connect: solicitationCodeParam },
        },
      });

      return Ok(entry);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async removeSolicitationCodeOverrideForEntry(
    entryParam: FundraisingEntryUniqueParam
  ): Promise<
    Result<
      FundraisingEntry,
      RepositoryError | ActionDeniedError | NotFoundError
    >
  > {
    try {
      const entry = await this.prisma.fundraisingEntry.findUnique({
        where: entryParam,
      });
      if (!entry) {
        return Err(new NotFoundError("FundraisingEntry"));
      }

      await this.prisma.fundraisingEntry.update({
        where: entryParam,
        data: {
          solicitationCodeOverride: { disconnect: true },
        },
      });

      return Ok(entry);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async findAllSolicitationCodes(): Promise<
    Result<readonly SolicitationCode[], RepositoryError>
  > {
    try {
      return Ok(
        await this.prisma.solicitationCode.findMany({
          orderBy: [
            {
              prefix: "asc",
            },
            {
              code: "asc",
            },
            {
              name: "asc",
            },
          ],
        })
      );
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }

  async findSolicitationCodeByUnique(
    param: SolicitationCodeUniqueParam
  ): Promise<Result<SolicitationCode, RepositoryError | NotFoundError>> {
    try {
      const code = await this.prisma.solicitationCode.findUnique({
        where: "code" in param ? { prefix_code: param } : param,
      });
      if (!code) {
        return Err(new NotFoundError("SolicitationCode"));
      }
      return Ok(code);
    } catch (error: unknown) {
      return handleRepositoryError(error);
    }
  }
}
