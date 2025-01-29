import type { PrismaClient } from "@prisma/client";
import type { Mock } from "vitest";
import { vi } from "vitest";

import { PrismaService } from "#lib/prisma.js";

import { testContainer } from "./testContainer.js";

export function loadPrismaMock() {
  const mocksToClear: Mock[] = [];

  function makeMockFn() {
    const mock = vi.fn();
    mocksToClear.push(mock);
    return mock;
  }
  function makeModelMock() {
    const modelMock = {
      findMany: makeMockFn(),
      findUnique: makeMockFn(),
      findUniqueOrThrow: makeMockFn(),
      findFirst: makeMockFn(),
      findFirstOrThrow: makeMockFn(),
      aggregate: makeMockFn(),
      count: makeMockFn(),
      create: makeMockFn(),
      createMany: makeMockFn(),
      delete: makeMockFn(),
      deleteMany: makeMockFn(),
      groupBy: makeMockFn(),
      update: makeMockFn(),
      updateMany: makeMockFn(),
      upsert: makeMockFn(),
      fields: undefined as never,
    };
    // Add one more mock for the `fields` property
    const fieldsMock = makeMockFn();
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

  const prismaMock = {
    $connect: makeMockFn(),
    $disconnect: makeMockFn(),
    $executeRaw: makeMockFn(),
    $executeRawUnsafe: makeMockFn(),
    $queryRaw: makeMockFn(),
    $queryRawUnsafe: makeMockFn(),
    $transaction: makeMockFn() as unknown as PrismaClient["$transaction"],
    $use: makeMockFn(),
    $extends: makeMockFn() as unknown as PrismaClient["$extends"],
    $on: makeMockFn(),
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

    get prismaClient(): PrismaClient {
      return this as unknown as PrismaClient;
    },
  };

  testContainer.set(
    {
      id: PrismaService,
      type: null,
      value: prismaMock.prismaClient,
      container: testContainer,
    },
    []
  );

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
    resetMocks: () => {
      mocksToClear.forEach((mock) => {
        mock.mockClear();
      });
    },
  };
}
