import { Service } from "@freshgum/typedi";
import { type Prisma } from "@prisma/client";
import {
  AccessControlAuthorized,
  FundraisingReportArgs,
  Report,
  type SolicitationCodeTag,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  type ExtendedError,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { Err, Ok, type Result } from "ts-results-es";
import { Args, Query, Resolver } from "type-graphql";

import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { FundraisingReportRepository } from "#repositories/fundraising/FundraisingReportRepository.js";

/**
 * This resolver makes direct queries to the database to generate reports, it is the exception to the rule of using repositories.
 */
@Resolver(() => Report)
@Service([FundraisingReportRepository])
export class ReportResolver {
  constructor(
    private readonly fundraisingReportRepository: FundraisingReportRepository
  ) {}

  @AccessControlAuthorized("list", ["every", "FundraisingEntryNode"])
  @Query(() => Report, {
    name: "report",
    description:
      "The output of this query is not stable. Do not rely on an exact format.",
  })
  @WithAuditLogging()
  async fundraisingReport(
    @Args(() => FundraisingReportArgs) args: FundraisingReportArgs
  ): Promise<ConcreteResult<Report>> {
    const solicitationCodeQuery = buildSolicitationCodeQuery(
      args.solicitationCodeIds?.map(({ id }) => id) ?? null,
      args.solicitationCodeTags ?? null,
      args.requireAllTags ?? false
    );
    if (solicitationCodeQuery.isErr()) {
      return solicitationCodeQuery;
    }
    const baseWhere = {
      donatedOn: {
        gte: args.from?.toISO() ?? undefined,
        lte: args.to?.toISO() ?? undefined,
      },
      ...solicitationCodeQuery.value,
    } satisfies Prisma.FundraisingEntryWithMetaWhereInput;

    switch (args.report) {
      case "summary": {
        return this.fundraisingReportRepository.fundraisingSummary(baseWhere);
      }
      case "totals-by-day": {
        return this.fundraisingReportRepository.fundraisingTotalsByDay(
          baseWhere
        );
      }
      case "totals-by-donated-to": {
        return this.fundraisingReportRepository.fundraisingTotalsByDonatedTo(
          baseWhere
        );
      }
      case "type-by-team-per-day": {
        return this.fundraisingReportRepository.fundraisingTypeByTeamPerDay(
          baseWhere
        );
      }
      case "totals-by-solicitation": {
        return this.fundraisingReportRepository.fundraisingTotalsBySolicitation(
          baseWhere
        );
      }

      default: {
        return Err(new InvalidArgumentError("Invalid report type"));
      }
    }
  }
}

function buildSolicitationCodeQuery(
  solicitationCodeUuids: string[] | null,
  solicitationCodeTags: SolicitationCodeTag[] | null,
  requireAllTags: boolean
): Result<Prisma.FundraisingEntryWithMetaWhereInput, ExtendedError> {
  if (solicitationCodeUuids && solicitationCodeTags) {
    return new Err(
      new InvalidArgumentError(
        "Cannot provide both solicitationCodeIds and solicitationCodeTags"
      )
    );
  }
  if (!solicitationCodeUuids && !solicitationCodeTags) {
    return Ok({});
  }

  const solicitationCodeQuery = solicitationCodeUuids
    ? ({
        uuid: {
          in: solicitationCodeUuids,
        },
      } satisfies Prisma.SolicitationCodeWhereInput)
    : solicitationCodeTags
      ? ({
          tags: {
            [requireAllTags ? "hasEvery" : "hasSome"]: solicitationCodeTags,
          },
        } satisfies Prisma.SolicitationCodeWhereInput)
      : ({} satisfies Prisma.SolicitationCodeWhereInput);

  return Ok({
    OR: [
      {
        solicitationCodeOverrideId: null,
        OR: [
          {
            ddn: {
              solicitationCode: solicitationCodeQuery,
            },
          },
          {
            dbFundsEntry: {
              dbFundsTeam: {
                solicitationCode: solicitationCodeQuery,
              },
            },
          },
        ],
      },
      {
        solicitationCodeOverride: solicitationCodeQuery,
      },
    ],
  });
}
