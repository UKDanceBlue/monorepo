import { Prisma, PrismaClient } from "@prisma/client";
import { CommitteeIdentifier, SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";
import type { SimpleUniqueParam } from "../shared.js";

import * as CommitteeDescriptions from "./committeeDescriptions.js";
import {
  buildCommitteeOrder,
  buildCommitteeWhere,
} from "./committeeRepositoryUtils.js";

// Make sure that we are exporting a description for every committee
CommitteeDescriptions[
  "" as CommitteeIdentifier
] satisfies Prisma.CommitteeUpsertWithoutChildCommitteesInput;

const CommitteeOneOfKeys = ["identifier"] as const;
type CommitteeOneOfKeys = (typeof CommitteeOneOfKeys)[number];

const CommitteeDateKeys = ["createdAt", "updatedAt"] as const;
type CommitteeDateKey = (typeof CommitteeDateKeys)[number];

export type CommitteeFilters = FilterItems<
  never,
  CommitteeDateKey,
  never,
  never,
  CommitteeOneOfKeys,
  never
>;

type CommitteeUniqueParam =
  | SimpleUniqueParam
  | { identifier: CommitteeIdentifier };

@Service()
export class CommitteeRepository {
  constructor(private prisma: PrismaClient) {}

  // Finders

  findCommittees(
    filters: readonly CommitteeFilters[] | null | undefined,
    order: readonly [key: string, sort: SortDirection][] | null | undefined,
    limit?: number | undefined,
    offset?: number | undefined
  ) {
    const where = buildCommitteeWhere(filters);
    const orderBy = buildCommitteeOrder(order);

    return this.prisma.committee.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });
  }

  findCommitteeByUnique(param: CommitteeUniqueParam) {
    return this.prisma.committee.findUnique({ where: param });
  }

  // Mutators

  deleteCommittee(uuid: string) {
    try {
      return this.prisma.committee.delete({ where: { uuid } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return null;
      } else {
        throw error;
      }
    }
  }

  // Committee getter

  getCommittee(identifier: CommitteeIdentifier) {
    return this.prisma.committee.upsert({
      ...CommitteeDescriptions[identifier],
      where: { identifier },
    });
  }
}
