import { Prisma, PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildImageOrder, buildImageWhere } from "./imageRepositoryUtils.js";

const imageBooleanKeys = [] as const;
type ImageBooleanKey = (typeof imageBooleanKeys)[number];

const imageDateKeys = ["createdAt", "updatedAt"] as const;
type ImageDateKey = (typeof imageDateKeys)[number];

const imageIsNullKeys = [] as const;
type ImageIsNullKey = (typeof imageIsNullKeys)[number];

const imageNumericKeys = ["width", "height"] as const;
type ImageNumericKey = (typeof imageNumericKeys)[number];

const imageOneOfKeys = [] as const;
type ImageOneOfKey = (typeof imageOneOfKeys)[number];

const imageStringKeys = ["alt"] as const;
type ImageStringKey = (typeof imageStringKeys)[number];

export type ImageFilters = FilterItems<
  ImageBooleanKey,
  ImageDateKey,
  ImageIsNullKey,
  ImageNumericKey,
  ImageOneOfKey,
  ImageStringKey
>;

type UniqueImageParam = { id: number } | { uuid: string };

@Service()
export class ImageRepository {
  constructor(private prisma: PrismaClient) {}

  findImageByUnique(param: UniqueImageParam) {
    return this.prisma.image.findUnique({
      where: param,
      include: { file: true },
    });
  }

  listImages({
    filters,
    order,
    skip,
    take,
  }: {
    filters?: readonly ImageFilters[] | undefined | null;
    order?: readonly [key: string, sort: SortDirection][] | undefined | null;
    skip?: number | undefined | null;
    take?: number | undefined | null;
  }) {
    const where = buildImageWhere(filters);
    const orderBy = buildImageOrder(order);

    return this.prisma.image.findMany({
      where,
      orderBy,
      skip: skip ?? undefined,
      take: take ?? undefined,
      include: { file: true },
    });
  }

  countImages({
    filters,
  }: {
    filters?: readonly ImageFilters[] | undefined | null;
  }) {
    const where = buildImageWhere(filters);

    return this.prisma.image.count({
      where,
    });
  }

  createImage(data: Prisma.ImageCreateInput) {
    return this.prisma.image.create({ data });
  }

  updateImage(param: UniqueImageParam, data: Prisma.ImageUpdateInput) {
    try {
      return this.prisma.image.update({
        where: param,
        data,
        include: { file: true },
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

  deleteImage(param: UniqueImageParam) {
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
