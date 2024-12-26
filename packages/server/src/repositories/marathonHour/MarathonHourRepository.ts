import { Service } from "@freshgum/typedi";

const marathonHourBooleanKeys = [] as const;
type MarathonHourBooleanKey = (typeof marathonHourBooleanKeys)[number];

const marathonHourDateKeys = [
  "shownStartingAt",
  "createdAt",
  "updatedAt",
] as const;
type MarathonHourDateKey = (typeof marathonHourDateKeys)[number];

const marathonHourIsNullKeys = [] as const;
type MarathonHourIsNullKey = (typeof marathonHourIsNullKeys)[number];

const marathonHourNumericKeys = [] as const;
type MarathonHourNumericKey = (typeof marathonHourNumericKeys)[number];

const marathonHourOneOfKeys = ["marathonYear"] as const;
type MarathonHourOneOfKey = (typeof marathonHourOneOfKeys)[number];

const marathonHourStringKeys = ["title", "details", "durationInfo"] as const;
type MarathonHourStringKey = (typeof marathonHourStringKeys)[number];

export type MarathonHourOrderKeys =
  | "title"
  | "details"
  | "durationInfo"
  | "marathonYear"
  | "shownStartingAt"
  | "createdAt"
  | "updatedAt";

export type MarathonHourFilters = FilterItems<
  MarathonHourBooleanKey,
  MarathonHourDateKey,
  MarathonHourIsNullKey,
  MarathonHourNumericKey,
  MarathonHourOneOfKey,
  MarathonHourStringKey
>;

type UniqueParam = { id: number } | { uuid: string };

import { and, desc, eq, gte, lte } from "drizzle-orm";
import { DateTime } from "luxon";

import { sqlCurrentTimestamp } from "#lib/sqlValues.js";
import {
  buildDefaultRepository,
  Transaction,
} from "#repositories/DefaultRepository.js";
import {
  MarathonRepository,
  UniqueMarathonParam,
} from "#repositories/marathon/MarathonRepository.js";
import { marathon, marathonHour } from "#schema/tables/marathon.sql.js";

@Service([MarathonRepository])
export class MarathonHourRepository extends buildDefaultRepository(
  marathonHour,
  {},
  {} as UniqueParam
) {
  constructor(private readonly marathonRepository: MarathonRepository) {
    super();
  }
  public uniqueToWhere(by: UniqueParam) {
    return "id" in by
      ? eq(marathonHour.id, by.id)
      : eq(marathonHour.uuid, by.uuid);
  }

  findCurrentMarathonHour() {
    return db.query.marathonHour.findFirst({
      where: and(
        lte(marathonHour.shownStartingAt, sqlCurrentTimestamp),
        gte(marathon.endDate, sqlCurrentTimestamp)
      ),
      with: { marathon: true },
      orderBy: desc(marathonHour.shownStartingAt),
    });
  }

  async getMaps(param: UniqueParam) {
    const rows = await this.prisma.marathonHour.findUnique({
      where: param,
      include: {
        maps: { orderBy: { imageId: "asc" }, include: { image: true } },
      },
    });
    return rows?.maps.map((map) => map.image);
  }

  createMarathonHour({
    init: { marathon, ...init },
    tx,
  }: {
    init: {
      title: string;
      details?: string | undefined | null;
      marathon: UniqueMarathonParam;
      shownStartingAt: DateTime<true>;
      durationInfo: string;
    };
    tx?: Transaction;
  }) {
    return this.marathonRepository
      .findOne({ by: marathon })
      .andThen(({ id: marathonId }) =>
        this.create({ init: { marathonId, ...init }, tx })
      );
  }

  updateMarathonHour({
    by: param,
    init: { marathon, title, details, shownStartingAt, durationInfo },
  }: {
    by: UniqueParam;
    init: {
      marathon: UniqueMarathonParam;
      title: string;
      details?: string | undefined | null;
      shownStartingAt: DateTime<true>;
      durationInfo: string;
    };
  }) {
    try {
      return this.marathonRepository
        .findOne({ by: marathon })
        .andThen(({ id: marathonId }) =>
          this.update({
            by: param,
            init: {
              title,
              details: details ?? null,
              marathonId,
              shownStartingAt,
              durationInfo,
            },
          })
        );
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

  addMap(param: UniqueParam, image: { id: number } | { uuid: string }) {
    try {
      return this.prisma.marathonHour.update({
        where: param,
        data: {
          maps: {
            connect: image,
          },
        },
      });
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

  removeMap(param: UniqueParam, image: { id: number } | { uuid: string }) {
    try {
      return this.prisma.marathonHour.update({
        where: param,
        data: {
          maps: {
            disconnect: image,
          },
        },
      });
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
}
