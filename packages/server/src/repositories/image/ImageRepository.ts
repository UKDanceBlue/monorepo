import { Service } from "@freshgum/typedi";
import { Prisma, PrismaClient } from "@prisma/client";
import type {
  FieldsOfListQueryArgs,
  ListImagesArgs,
} from "@ukdanceblue/common";

type UniqueImageParam = SimpleUniqueParam;

import type { DefaultArgs } from "@prisma/client/runtime/library";
import { Ok } from "ts-results-es";

import { PrismaService } from "#lib/prisma.js";
import {
  buildDefaultRepository,
  type FindAndCountParams,
  type FindAndCountResult,
} from "#repositories/Default.js";
import type {
  AsyncRepositoryResult,
  SimpleUniqueParam,
} from "#repositories/shared.js";

const imageRepositoryInclude = { file: true };

@Service([PrismaService])
export class ImageRepository extends buildDefaultRepository<
  PrismaClient["image"],
  UniqueImageParam,
  FieldsOfListQueryArgs<ListImagesArgs>,
  typeof imageRepositoryInclude
>("Image", {
  alt: {
    getOrderBy: (dir) => Ok({ alt: dir }),
    getWhere: (placeholder) => Ok({ alt: placeholder }),
    searchable: true,
  },
  height: {
    getOrderBy: (dir) => Ok({ height: dir }),
    getWhere: (placeholder) => Ok({ height: placeholder }),
  },
  width: {
    getOrderBy: (dir) => Ok({ width: dir }),
    getWhere: (placeholder) => Ok({ width: placeholder }),
  },
  createdAt: {
    getOrderBy: (dir) => Ok({ createdAt: dir }),
    getWhere: (placeholder) => Ok({ createdAt: placeholder }),
  },
  updatedAt: {
    getOrderBy: (dir) => Ok({ updatedAt: dir }),
    getWhere: (placeholder) => Ok({ updatedAt: placeholder }),
  },
}) {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  public uniqueToWhere(by: UniqueImageParam): Prisma.ImageWhereUniqueInput {
    return ImageRepository.simpleUniqueToWhere(by);
  }

  findImageByUnique(param: UniqueImageParam) {
    return this.prisma.image.findUnique({
      where: param,
      include: imageRepositoryInclude,
    });
  }

  findAndCount({
    tx,
    ...params
  }: FindAndCountParams<
    "createdAt" | "updatedAt" | "alt" | "width" | "height"
  >): AsyncRepositoryResult<
    FindAndCountResult<
      Prisma.ImageDelegate<DefaultArgs, Prisma.PrismaClientOptions>,
      { include: typeof imageRepositoryInclude }
    >
  > {
    return this.parseFindManyParams(params)
      .toAsyncResult()
      .andThen((params) =>
        this.handleQueryError(
          (tx ?? this.prisma).image.findMany({
            ...params,
            include: imageRepositoryInclude,
          })
        ).map((rows) => ({ rows, params }))
      )
      .andThen(({ rows, params }) =>
        this.handleQueryError(
          (tx ?? this.prisma).image.count({
            where: params.where,
            orderBy: params.orderBy,
          })
        ).map((total) => ({
          selectedRows: rows,
          total,
        }))
      );
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
      // TODO: Clean up orphaned files
      return this.prisma.image.delete({
        where: param,
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
}
