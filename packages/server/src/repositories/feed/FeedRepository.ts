import { FeedItem, Prisma, PrismaClient } from "@prisma/client";
import { Service } from "@freshgum/typedi";

type UniqueParam = { id: number } | { uuid: string };

import { prismaToken } from "#prisma";

@Service([prismaToken])
export class FeedRepository {
  constructor(private prisma: PrismaClient) {}

  async getCompleteFeed({ limit }: { limit: number | null | undefined }) {
    return this.prisma.feedItem.findMany({
      take: limit ?? undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async getFeedItemByUnique(param: UniqueParam) {
    return this.prisma.feedItem.findUnique({
      where: param,
    });
  }

  async createFeedItem({
    title,
    textContent,
    imageUuid,
  }: {
    title: string;
    textContent?: string | null | undefined;
    imageUuid?: string | null | undefined;
  }) {
    return this.prisma.feedItem.create({
      data: {
        title,
        textContent,
        image: imageUuid
          ? {
              connect: {
                uuid: imageUuid,
              },
            }
          : undefined,
      },
    });
  }

  async updateFeedItem(
    param: UniqueParam,
    {
      title,
      textContent,
    }: { title: string; textContent?: string | null | undefined }
  ): Promise<FeedItem | null> {
    try {
      return await this.prisma.feedItem.update({
        where: param,
        data: {
          title,
          textContent: textContent ?? null,
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

  async deleteFeedItem(param: UniqueParam): Promise<FeedItem | null> {
    try {
      return await this.prisma.feedItem.delete({
        where: param,
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

  async attachImageToFeedItem(
    feedItemParam: UniqueParam,
    imageParam: UniqueParam
  ): Promise<FeedItem | null> {
    try {
      return await this.prisma.feedItem.update({
        where: feedItemParam,
        data: {
          image: {
            connect: imageParam,
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

  async removeImageFromFeedItem(
    feedItemParam: UniqueParam
  ): Promise<FeedItem | null> {
    try {
      return await this.prisma.feedItem.update({
        where: feedItemParam,
        data: {
          image: {
            disconnect: true,
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

  async getFeedItemImage(feedItemParam: UniqueParam) {
    return this.prisma.feedItem
      .findUnique({
        where: feedItemParam,
      })
      .image({ include: { file: true } });
  }
}
