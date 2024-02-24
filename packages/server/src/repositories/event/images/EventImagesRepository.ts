import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

type UniqueParam = {
  eventId: number;
  imageId: number;
};

type UniqueEventParam = { id: number } | { uuid: string };

// @Service()
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

@Service()
export class EventImagesRepository {
  constructor(private prisma: PrismaClient) {}

  findEventImageByUnique(param: UniqueParam) {
    return this.prisma.eventImage.findUnique({
      where: { eventId_imageId: param },
    });
  }

  findEventImagesByEventUnique(param: UniqueEventParam) {
    return this.prisma.eventImage.findMany({
      where: {
        event: param,
      },
    });
  }
}
