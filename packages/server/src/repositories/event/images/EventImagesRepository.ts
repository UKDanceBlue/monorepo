import { PrismaClient } from "@prisma/client";
import { LegacyError, LegacyErrorCode } from "@ukdanceblue/common";
import { Service } from "@freshgum/typedi";

import type { Prisma } from "@prisma/client";

type UniqueParam =
  | {
      eventId: number;
      imageId: number;
    }
  | {
      eventUuid: string;
      imageUuid: string;
    }
  | {
      eventId: number;
      imageUuid: string;
    }
  | {
      eventUuid: string;
      imageId: number;
    };

type BasicUniqueParam = { id: number } | { uuid: string };

// import { prismaToken } from "#prisma";

// @Service([prismaToken])
// export class EventOccurrenceRepository {
//   constructor(private prisma: PrismaClient) {}

//   findEventOccurrenceByUnique(param: UniqueParam) {
//     return this.prisma.eventOccurrence.findUnique({ where: param });
//   }

//   findOccurrencesByEventUnique(param: UniqueParam) {
//     return this.prisma.eventOccurrence.findMany({
//       where: {
//         event: param,
//       },
//     });
//   }
// }

import { prismaToken } from "#prisma";

@Service([prismaToken])
export class EventImagesRepository {
  constructor(private prisma: PrismaClient) {}

  findEventImageByUnique(param: UniqueParam) {
    return this.prisma.eventImage.findFirst({
      where: eventImageWhereFromParam(param),
      include: { image: true },
    });
  }

  findEventImagesByEventUnique(param: BasicUniqueParam) {
    return this.prisma.eventImage.findMany({
      where: {
        event: param,
      },
      include: { image: { include: { file: true } } },
    });
  }

  /**
   * Creates an image for an event
   * @param eventParam The ID of the event to add the image to
   * @param imageProps The properties of the image to add
   * @returns The image-event relationship that was created
   */
  async createEventImageForEvent(
    eventParam: BasicUniqueParam,
    imageProps: Prisma.ImageCreateWithoutEventImagesInput
  ) {
    return this.prisma.eventImage.create({
      data: {
        event: { connect: eventParam },
        image: { create: imageProps },
      },
      include: { image: true },
    });
  }

  /**
   * Adds an existing image to an event
   * @param eventParam The ID of the event to add the image to
   * @param imageParam The ID of the image to add
   * @returns The image-event relationship that was created
   */
  async addExistingImageToEvent(
    eventParam: BasicUniqueParam,
    imageParam: BasicUniqueParam
  ) {
    return this.prisma.eventImage.create({
      data: {
        event: { connect: eventParam },
        image: { connect: imageParam },
      },
      include: { image: { include: { file: true } } },
    });
  }

  /**
   * @param param A specifier for the image-event relationship to remove
   * @returns Whether the image-event relationship was removed successfully
   */
  async removeEventImageByUnique(param: UniqueParam): Promise<boolean> {
    const { count } = await this.prisma.eventImage.deleteMany({
      where: eventImageWhereFromParam(param),
    });

    if (count === 0) {
      return false;
    } else if (count === 1) {
      return true;
    } else {
      throw new LegacyError(
        LegacyErrorCode.InternalFailure,
        "Expected to remove at most one event-image relationship, but removed more than one."
      );
    }
  }
}

function eventImageWhereFromParam(param: UniqueParam) {
  const where: Prisma.EventImageWhereInput = {};
  if ("eventId" in param) {
    where.eventId = param.eventId;
  } else {
    where.event = { uuid: param.eventUuid };
  }
  if ("imageId" in param) {
    where.imageId = param.imageId;
  } else {
    where.image = { uuid: param.imageUuid };
  }
  return where;
}
