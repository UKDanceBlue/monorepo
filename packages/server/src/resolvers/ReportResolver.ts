import { Service } from "@freshgum/typedi";
import {
  AccessControlAuthorized,
  Report,
  ReportArgs,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { Err, Ok } from "ts-results-es";
import { Args, Query, Resolver } from "type-graphql";

import { drizzleToken } from "#lib/typediTokens.js";

/**
 * This resolver makes direct queries to the database to generate reports, it is the exception to the rule of using repositories.
 */
@Resolver(() => Report)
@Service([drizzleToken])
export class ReportResolver {
  constructor(protected readonly db: Drizzle) {}

  @AccessControlAuthorized("list", "FundraisingEntryNode")
  @Query(() => Report, {
    name: "report",
    description:
      "The output of this query is not stable. Do not rely on an exact format.",
  })
  async fundraisingReport(
    @Args(() => ReportArgs) args: ReportArgs
  ): AsyncResult<Report, ConcreteError> {
    switch (args.report) {
      case "summary": {
        const data = await this.prisma.fundraisingEntryWithMeta.findMany({
          orderBy: { donatedOn: "asc" },
          where: {
            donatedOn: {
              gte: args.from ?? undefined,
              lte: args.to ?? undefined,
            },
          },
          select: {
            createdAt: true,
            donatedOn: true,
            solicitationCodeText: true,
            donatedBy: true,
            amount: true,
            enteredByPerson: {
              select: {
                name: true,
                email: true,
              },
            },
            donatedTo: true,
            notes: true,
          },
        });
        return Ok(
          Report.fromJson(
            [
              "Date Entered",
              "Donated On",
              "Solicitation Code",
              "Donated By",
              "Total",
              "Entered By",
              "Donated To",
              "Notes",
            ],
            [
              {
                title: "Summary",
                data: data.map((entry) => ({
                  "Date Entered": entry.createdAt.toLocaleDateString(),
                  "Donated On": entry.donatedOn?.toLocaleDateString(),
                  "Solicitation Code": entry.solicitationCodeText,
                  "Donated By": entry.donatedBy,
                  "Total": entry.amount?.toNumber(),
                  "Entered By":
                    entry.enteredByPerson?.name ?? entry.enteredByPerson?.email,
                  "Donated To": entry.donatedTo,
                  "Notes": entry.notes,
                })),
              },
            ]
          )
        );
      }
      case "totals-by-day": {
        const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
          by: ["donatedOn", "batchType"],
          _sum: {
            amount: true,
          },
          where: {
            donatedOn: {
              gte: args.from ?? undefined,
              lte: args.to ?? undefined,
            },
          },
          orderBy: { donatedOn: "asc" },
        });
        const totals = data.reduce<
          Record<string, Partial<Record<BatchType, number>>>
        >((acc, entry) => {
          const date =
            entry.donatedOn && DateTime.fromJSDate(entry.donatedOn).toISODate();
          if (!date || !entry.batchType) {
            return acc;
          }
          if (!acc[date]) {
            acc[date] = {};
          }
          acc[date][entry.batchType] = entry._sum.amount?.toNumber() ?? 0;
          return acc;
        }, {});
        return Ok(
          Report.fromJson(
            [
              "Date",
              ...Object.values(BatchType).map((type) =>
                stringifyDDNBatchType(type)
              ),
              "Total",
            ],
            [
              {
                title: "Totals By Day",
                data: Object.entries(totals).map(([date, values]) => ({
                  Date: date,
                  ...Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [
                      stringifyDDNBatchType(key as BatchType),
                      value,
                    ])
                  ),
                  Total: Object.values(values).reduce(
                    (acc, value) => acc + value,
                    0
                  ),
                })),
              },
            ]
          )
        );
      }

      case "type-by-team-per-day": {
        const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
          by: ["donatedOn", "batchType", "solicitationCodeText"],
          _sum: {
            amount: true,
          },
          where: {
            donatedOn: {
              gte: args.from ?? undefined,
              lte: args.to ?? undefined,
            },
          },
          orderBy: { donatedOn: "asc" },
        });
        const totals = data.reduce<
          Record<string, Record<string, Partial<Record<BatchType, number>>>>
        >((acc, entry) => {
          const date =
            entry.donatedOn && DateTime.fromJSDate(entry.donatedOn).toISODate();
          if (!date || !entry.batchType || !entry.solicitationCodeText) {
            return acc;
          }
          if (!acc[date]) {
            acc[date] = {};
          }
          if (!acc[date][entry.solicitationCodeText]) {
            acc[date][entry.solicitationCodeText] = {};
          }
          acc[date][entry.solicitationCodeText]![entry.batchType] =
            entry._sum.amount?.toNumber() ?? 0;
          return acc;
        }, {});
        return Ok(
          Report.fromJson(
            [
              "Date",
              "Team",
              ...Object.values(BatchType).map((type) =>
                stringifyDDNBatchType(type)
              ),
              "Total",
            ],
            Object.entries(totals).map(([date, teams]) => ({
              title: date,
              data: Object.entries(teams).map(([team, values]) => ({
                Date: date,
                Team: team,
                ...Object.fromEntries(
                  Object.entries(values).map(([key, value]) => [
                    stringifyDDNBatchType(key as BatchType),
                    value,
                  ])
                ),
                Total: Object.values(values).reduce(
                  (acc, value) => acc + value,
                  0
                ),
              })),
            }))
          )
        );
      }

      case "totals-by-solicitation": {
        const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
          by: ["solicitationCodeText", "batchType"],
          _sum: {
            amount: true,
          },
          where: {
            donatedOn: {
              gte: args.from ?? undefined,
              lte: args.to ?? undefined,
            },
          },
        });
        const totals = data.reduce<
          Record<string, Partial<Record<BatchType, number>>>
        >((acc, entry) => {
          const code = entry.solicitationCodeText;
          if (!code || !entry.batchType) {
            return acc;
          }
          if (!acc[code]) {
            acc[code] = {};
          }
          acc[code][entry.batchType] = entry._sum.amount?.toNumber() ?? 0;
          return acc;
        }, {});
        return Ok(
          Report.fromJson(
            [
              "Solicitation Code",
              ...Object.values(BatchType).map((type) =>
                stringifyDDNBatchType(type)
              ),
              "Total",
            ],
            [
              {
                title: "Totals By Solicitation",
                data: Object.entries(totals).map(([code, values]) => ({
                  "Solicitation Code": code,
                  ...Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [
                      stringifyDDNBatchType(key as BatchType),
                      value,
                    ])
                  ),
                  "Total": Object.values(values).reduce(
                    (acc, value) => acc + value,
                    0
                  ),
                })),
              },
            ]
          )
        );
      }

      default: {
        return Err(new InvalidArgumentError("Invalid report type"));
      }
    }
  }
}
