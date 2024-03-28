import type { MIMEType } from "util";

import { Prisma, PrismaClient } from "@prisma/client";
import { Service } from "typedi";

type UniqueParam = { id: number } | { uuid: string };

@Service()
/**
 * This class should not be directly accessed by API routes, but rather by the FileManager class which keeps track of the storage provider.
 */
export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  findFileByUnique(param: UniqueParam) {
    return this.prisma.file.findUnique({ where: param });
  }

  createFile({
    filename,
    locationUrl,
    mimeType,
    owner,
    requiresLogin,
  }: {
    filename: string;
    locationUrl: URL | string;
    mimeType: MIMEType;
    owner?: UniqueParam;
    requiresLogin?: boolean;
  }) {
    const mimeParameters = [...mimeType.params.entries()].map(
      ([key, value]) => `${key}=${value}`
    );

    return this.prisma.file.create({
      data: {
        filename,
        locationUrl: locationUrl.toString(),
        mimeTypeName: mimeType.type,
        mimeSubtypeName: mimeType.subtype,
        mimeParameters,
        owner: {
          connect: owner,
        },
        requiresLogin,
      },
    });
  }

  updateFile(param: UniqueParam, data: Prisma.FileUpdateInput) {
    try {
      return this.prisma.file.update({ where: param, data });
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

  deleteFile(param: UniqueParam) {
    try {
      return this.prisma.file.delete({ where: param });
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
