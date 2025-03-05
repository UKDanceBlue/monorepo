import { Service } from "@freshgum/typedi";
import { BatchType, type Prisma, PrismaClient } from "@prisma/client";
import {
  Report,
  type SolicitationCodeTag,
  stringifyDDNBatchType,
} from "@ukdanceblue/common";
import {
  type ExtendedError,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import { Err, Ok, type Result } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";

@Service([PrismaService])
export class FundraisingReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async fundraisingTotalsBySolicitation(
    baseWhere: Prisma.FundraisingEntryWithMetaWhereInput
  ) {
    const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
      by: ["solicitationCodeText", "batchType"],
      _sum: {
        amount: true,
      },
      where: baseWhere,
    });
    const totals = data.reduce<
      Record<string, Partial<Record<BatchType, number>>>
    >((acc, entry) => {
      const code = entry.solicitationCodeText;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  public async fundraisingTypeByTeamPerDay(
    baseWhere: Prisma.FundraisingEntryWithMetaWhereInput
  ) {
    const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
      by: ["donatedOn", "batchType", "solicitationCodeText"],
      _sum: {
        amount: true,
      },
      where: baseWhere,
      orderBy: { donatedOn: "asc" },
    });
    const totals = data.reduce<
      Record<string, Record<string, Partial<Record<BatchType, number>>>>
    >((acc, entry) => {
      const date =
        entry.donatedOn && DateTime.fromJSDate(entry.donatedOn).toISODate();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
            Total: Object.values(values).reduce((acc, value) => acc + value, 0),
          })),
        }))
      )
    );
  }

  public async fundraisingTotalsByDonatedTo(
    baseWhere: Prisma.FundraisingEntryWithMetaWhereInput
  ) {
    const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
      by: ["donatedTo", "solicitationCodeText"],
      _sum: {
        amount: true,
      },
      where: baseWhere,
    });
    return Ok(
      Report.fromJson(
        ["Donated To", "Total", "Solicitation Code"],
        [
          {
            title: "Totals By Donated To",
            data: data.map((entry) => ({
              "Donated To": entry.donatedTo,
              "Total": entry._sum.amount?.toNumber() ?? 0,
              "Solicitation Code": entry.solicitationCodeText,
            })),
          },
        ]
      )
    );
  }

  public async fundraisingTotalsByDay(
    baseWhere: Prisma.FundraisingEntryWithMetaWhereInput
  ) {
    const data = await this.prisma.fundraisingEntryWithMeta.groupBy({
      by: ["donatedOn", "batchType"],
      _sum: {
        amount: true,
      },
      where: baseWhere,
      orderBy: { donatedOn: "asc" },
    });
    const totals = data.reduce<
      Record<string, Partial<Record<BatchType, number>>>
    >((acc, entry) => {
      const date =
        entry.donatedOn && DateTime.fromJSDate(entry.donatedOn).toISODate();
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

  public async fundraisingSummary(
    baseWhere: Prisma.FundraisingEntryWithMetaWhereInput
  ) {
    const data = await this.prisma.fundraisingEntryWithMeta.findMany({
      orderBy: { donatedOn: "asc" },
      where: baseWhere,
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

  buildSolicitationCodeQuery(
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
}
