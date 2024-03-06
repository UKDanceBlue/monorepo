import type { PrismaClient } from "@prisma/client";
import { vi } from "vitest";

export function makePrismaMock() {
  function makeModelMock() {
    const modelMock = {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      findFirst: vi.fn(),
      findFirstOrThrow: vi.fn(),
      aggregate: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      groupBy: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      upsert: vi.fn(),
      fields: undefined as never,
    };
    // Add one more mock for the `fields` property
    const fieldsMock = vi.fn();
    Object.defineProperty(modelMock, "fields", {
      get: fieldsMock,
    });
    return [modelMock, fieldsMock] as const;
  }

  const authIdPairMock = makeModelMock();
  const configurationMock = makeModelMock();
  const deviceMock = makeModelMock();
  const eventMock = makeModelMock();
  const eventImageMock = makeModelMock();
  const eventOccurrenceMock = makeModelMock();
  const imageMock = makeModelMock();
  const loginFlowSessionMock = makeModelMock();
  const membershipMock = makeModelMock();
  const notificationMock = makeModelMock();
  const notificationDeliveryMock = makeModelMock();
  const personMock = makeModelMock();
  const pointEntryMock = makeModelMock();
  const pointOpportunityMock = makeModelMock();
  const teamMock = makeModelMock();
  const teamsWithTotalPointsMock = makeModelMock();

  const prismaMock: PrismaClient = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $executeRaw: vi.fn(),
    $executeRawUnsafe: vi.fn(),
    $queryRaw: vi.fn(),
    $queryRawUnsafe: vi.fn(),
    $transaction: vi.fn() as unknown as PrismaClient["$transaction"],
    $use: vi.fn(),
    $extends: vi.fn() as unknown as PrismaClient["$extends"],
    $on: vi.fn(),
    authIdPair: authIdPairMock[0],
    configuration: configurationMock[0],
    device: deviceMock[0],
    event: eventMock[0],
    eventImage: eventImageMock[0],
    eventOccurrence: eventOccurrenceMock[0],
    image: imageMock[0],
    loginFlowSession: loginFlowSessionMock[0],
    membership: membershipMock[0],
    notification: notificationMock[0],
    notificationDelivery: notificationDeliveryMock[0],
    person: personMock[0],
    pointEntry: pointEntryMock[0],
    pointOpportunity: pointOpportunityMock[0],
    team: teamMock[0],
    teamsWithTotalPoints: teamsWithTotalPointsMock[0],
  };

  return {
    prismaMock,
    authIdPairFieldsMock: authIdPairMock[1],
    configurationFieldsMock: configurationMock[1],
    deviceFieldsMock: deviceMock[1],
    eventFieldsMock: eventMock[1],
    eventImageFieldsMock: eventImageMock[1],
    eventOccurrenceFieldsMock: eventOccurrenceMock[1],
    imageFieldsMock: imageMock[1],
    loginFlowSessionFieldsMock: loginFlowSessionMock[1],
    membershipFieldsMock: membershipMock[1],
    notificationFieldsMock: notificationMock[1],
    notificationDeliveryFieldsMock: notificationDeliveryMock[1],
    personFieldsMock: personMock[1],
    pointEntryFieldsMock: pointEntryMock[1],
    pointOpportunityFieldsMock: pointOpportunityMock[1],
    teamFieldsMock: teamMock[1],
    teamsWithTotalPointsFieldsMock: teamsWithTotalPointsMock[1],
  };
}
