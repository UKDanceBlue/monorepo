import { fileURLToPath } from "url";

import { Result } from "ts-results-es";
import type { MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

import { ConfigurationResolver } from "#resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "#resolvers/DeviceResolver.js";
import { EventResolver } from "#resolvers/EventResolver.js";
import { FeedResolver } from "#resolvers/FeedResolver.js";
import { FundraisingAssignmentResolver } from "#resolvers/FundraisingAssignmentResolver.js";
import { FundraisingEntryResolver } from "#resolvers/FundraisingEntryResolver.js";
import { ImageResolver } from "#resolvers/ImageResolver.js";
import { LoginStateResolver } from "#resolvers/LoginState.js";
import { MarathonHourResolver } from "#resolvers/MarathonHourResolver.js";
import { MarathonResolver } from "#resolvers/MarathonResolver.js";
import { MembershipResolver } from "#resolvers/MembershipResolver.js";
import { NodeResolver } from "#resolvers/NodeResolver.js";
import {
  NotificationDeliveryResolver,
  NotificationResolver,
} from "#resolvers/NotificationResolver.js";
import { PersonResolver } from "#resolvers/PersonResolver.js";
import { PointEntryResolver } from "#resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "#resolvers/PointOpportunityResolver.js";
import { TeamResolver } from "#resolvers/TeamResolver.js";

import { ConcreteError, toBasicError } from "./error/error.js";
import { CatchableConcreteError } from "./formatError.js";
import { logger } from "./logging/logger.js";

const schemaPath = fileURLToPath(
  new URL("../../../../schema.graphql", import.meta.url)
);

/**
 * Logs errors, as well as allowing us to return a result from a resolver
 */
const errorHandlingMiddleware: MiddlewareFn = async (_, next) => {
  let result;
  try {
    result = (await next()) as unknown;
  } catch (error) {
    logger.error("An error occurred in a resolver", error);
    throw error;
  }

  if (Result.isResult(result)) {
    if (result.isErr()) {
      logger.error("An error occurred in a resolver", result.error);
      throw new CatchableConcreteError(
        result.error instanceof ConcreteError
          ? result.error
          : toBasicError(result.error)
      );
    } else {
      return result.value as unknown;
    }
  } else {
    return result;
  }
};

const resolvers = [
  ConfigurationResolver,
  DeviceResolver,
  EventResolver,
  ImageResolver,
  PersonResolver,
  MembershipResolver,
  NotificationResolver,
  NotificationDeliveryResolver,
  TeamResolver,
  LoginStateResolver,
  PointEntryResolver,
  PointOpportunityResolver,
  MarathonHourResolver,
  MarathonResolver,
  FeedResolver,
  FundraisingAssignmentResolver,
  FundraisingEntryResolver,
  NodeResolver,
] as const;

for (const service of resolvers) {
  // @ts-expect-error Typedi doesn't seem to like it, but it works
  if (!Container.has(service)) {
    logger.crit(`Failed to resolve service: "${service.name}"`);
  } else {
    try {
      // @ts-expect-error Typedi doesn't seem to like it, but it works
      Container.get(service);
    } catch (error) {
      logger.crit(`Failed to resolve service: "${service.name}"`, error);
    }
  }
}

export default await buildSchema({
  resolvers,
  emitSchemaFile: schemaPath,
  globalMiddlewares: [errorHandlingMiddleware],
  container: Container,
});
