import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

type UniqueParam =
  | {
      id: number;
    }
  | {
      uuid: string;
    };

@Service()
export class EventOccurrenceRepository {
  constructor(private prisma: PrismaClient) {}

  findEventOccurrenceByUnique(param: UniqueParam) {
    return this.prisma.eventOccurrence.findUnique({ where: param });
  }

  findOccurrencesByEventUnique(param: UniqueParam) {
    return this.prisma.eventOccurrence.findMany({
      where: {
        event: param,
      },
    });
  }
}
