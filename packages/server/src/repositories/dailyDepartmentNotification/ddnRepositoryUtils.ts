import type { Prisma } from "@prisma/client";
import type { FilterItem } from "@ukdanceblue/common";
import type { SortDirection } from "@ukdanceblue/common";

import {
  numericFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type {
  DailyDepartmentNotificationFilters,
  DailyDepartmentNotificationOrderKeys,
} from "./DDNRepository.js";

export function buildDailyDepartmentNotificationOrder(
  order:
    | readonly [
        key: DailyDepartmentNotificationOrderKeys,
        sort: SortDirection,
      ][]
    | null
    | undefined
) {
  const orderBy: Prisma.DailyDepartmentNotificationOrderByWithRelationInput[] =
    [];
  const solicitationCodeOrderBy: Prisma.DailyDepartmentNotificationOrderByWithRelationInput["solicitationCode"] =
    {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "Amount": {
        orderBy.push({ combinedAmount: sort });
        break;
      }
      case "Donor": {
        orderBy.push({ combinedDonorSort: sort });
        break;
      }
      case "Comment": {
        orderBy.push({ comment: sort });
        break;
      }
      case "SolicitationCodeNumber": {
        solicitationCodeOrderBy.code = sort;
        break;
      }
      case "SolicitationCodeName": {
        solicitationCodeOrderBy.name = sort;
        break;
      }
      case "SolicitationCodePrefix": {
        solicitationCodeOrderBy.prefix = sort;
        break;
      }
      case "BatchType": {
        orderBy.push({ batch: { batchId: sort } });
        break;
      }
      default: {
        throw new Error(`Unsupported sort key: ${String(key)}`);
      }
    }
  }
  if (Object.keys(solicitationCodeOrderBy).length > 0)
    orderBy.push({ solicitationCode: solicitationCodeOrderBy });
  return orderBy;
}

export function buildDailyDepartmentNotificationWhere(
  filters: readonly DailyDepartmentNotificationFilters[] | null | undefined
) {
  const where: Prisma.DailyDepartmentNotificationWhereInput = {};
  const solicitationCodeWhere: Prisma.DailyDepartmentNotificationWhereInput["solicitationCode"] =
    {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "Amount": {
        where.combinedAmount = numericFilterToPrisma(filter);
        break;
      }
      case "BatchType": {
        function getBatchIdChar(value: string) {
          switch (value) {
            case "Check": {
              return "C";
            }
            case "Transmittal": {
              return "T";
            }
            case "CreditCard": {
              return "D";
            }
            case "ACH": {
              return "A";
            }
            case "NonCash": {
              return "N";
            }
            case "PayrollDeduction": {
              return "X";
            }
            case "Unknown":
            default: {
              throw new Error(`Unknown batch type: ${String(value)}`);
            }
          }
        }
        if (filter.negate) {
          return {
            not: {
              OR: filter.value.map((v) => ({
                batch: {
                  batchId: { endsWith: `${getBatchIdChar(v)}1` },
                },
              })),
            },
          };
        }
        return {
          OR: filter.value.map((v) => ({
            batch: {
              batchId: { endsWith: `${getBatchIdChar(v)}1` },
            },
          })),
        };
      }
      case "Donor": {
        where.combinedDonorName = stringFilterToPrisma(filter);
        break;
      }
      case "Comment": {
        where.comment = stringFilterToPrisma(filter);
        break;
      }
      case "SolicitationCodeNumber": {
        solicitationCodeWhere.code = oneOfFilterToPrisma(filter);
        break;
      }
      case "SolicitationCodeName": {
        solicitationCodeWhere.name = stringFilterToPrisma(filter);
        break;
      }
      case "SolicitationCodePrefix": {
        solicitationCodeWhere.prefix = oneOfFilterToPrisma(filter);
        break;
      }
      default: {
        throw new Error(
          `Unsupported filter key: ${String(
            (filter as FilterItem<never, never>).field
          )}`
        );
      }
    }
  }
  if (Object.keys(solicitationCodeWhere).length > 0)
    where.solicitationCode = solicitationCodeWhere;
  return where;
}
