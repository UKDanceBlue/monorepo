import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { ActionDeniedError } from "@ukdanceblue/common/error";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import {
  dateFilterToPrisma,
  oneOfFilterToPrisma,
  stringFilterToPrisma,
} from "#lib/prisma-utils/gqlFilterToPrismaFilter.js";

import type { PersonFilters, PersonOrderKeys } from "./PersonRepository.js";

export function buildPersonOrder(
  order:
    | readonly [key: PersonOrderKeys, sort: SortDirection][]
    | null
    | undefined
): Result<Prisma.PersonOrderByWithRelationInput, ActionDeniedError> {
  const orderBy: Prisma.PersonOrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "name":
      case "email":
      case "linkblue":
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.asc ? "asc" : "desc";
        break;
      }
      case "committeeRole":
      case "committeeName":
      case "dbRole":
      default: {
        key satisfies "committeeRole" | "committeeName" | "dbRole";
        return Err(
          new ActionDeniedError(
            `Unsupported filter key: ${String((key as { field?: string } | undefined)?.field)}`
          )
        );
      }
    }
  }
  return Ok(orderBy);
}
export function buildPersonWhere(
  filters: readonly PersonFilters[] | null | undefined
) {
  const where: Prisma.PersonWhereInput = {};
  let membershipsWhereCommitteeRole:
    | Prisma.MembershipWhereInput["committeeRole"]
    | undefined = undefined;
  let membershipsWhereTeam: Prisma.MembershipWhereInput["team"] | undefined =
    undefined;

  for (const filter of filters ?? []) {
    switch (filter.field) {
      case "name":
      case "email":
      case "linkblue": {
        where[filter.field] = stringFilterToPrisma(filter);
        break;
      }
      case "createdAt":
      case "updatedAt": {
        where[filter.field] = dateFilterToPrisma(filter);
        break;
      }
      case "committeeRole": {
        membershipsWhereCommitteeRole = oneOfFilterToPrisma(filter);
        break;
      }
      case "committeeName": {
        membershipsWhereTeam = {
          correspondingCommittee: {
            identifier: oneOfFilterToPrisma(filter),
          },
        };
        break;
      }
      case "dbRole":
      default: {
        filter.field satisfies "dbRole";
        throw new Error(`Unsupported filter field: ${JSON.stringify(filter)}`);
      }
    }
  }
  return {
    ...where,
    memberships:
      membershipsWhereCommitteeRole || membershipsWhereTeam
        ? {
            some:
              membershipsWhereCommitteeRole && !membershipsWhereTeam
                ? {
                    committeeRole: membershipsWhereCommitteeRole,
                  }
                : !membershipsWhereCommitteeRole && membershipsWhereTeam
                  ? {
                      team: membershipsWhereTeam,
                    }
                  : {
                      committeeRole: membershipsWhereCommitteeRole,
                      team: membershipsWhereTeam,
                    },
          }
        : undefined,
  } satisfies Prisma.PersonWhereInput;
}
