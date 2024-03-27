import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

type UniqueFileParam = { id: number } | { uuid: string };

@Service()
export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  findFileByUnique(param: UniqueFileParam) {
    return this.prisma.image.findUnique({ where: param });
  }

  listFiles({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly FileFilters[] | undefined | null;
    order?: readonly [key: string, sort: SortDirection][] | undefined | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildFileWhere(filters);
    const orderBy = buildFileOrder(order);

    return this.prisma.image.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
    });
  }

  countFiles({
    filters,
  }: {
    filters?: readonly FileFilters[] | undefined | null;
  }) {
    const where = buildFileWhere(filters);

    return this.prisma.image.count({
      where,
    });
  }

  createFile(data: Prisma.FileCreateInput) {
    return this.prisma.image.create({ data });
  }

  updateFile(param: UniqueFileParam, data: Prisma.FileUpdateInput) {
    try {
      return this.prisma.image.update({ where: param, data });
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

  deleteFile(param: UniqueFileParam) {
    try {
      return this.prisma.image.delete({ where: param });
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
