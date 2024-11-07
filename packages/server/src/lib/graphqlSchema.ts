import { Container } from "@freshgum/typedi";
import {
  ConcreteError,
  FormattedConcreteError,
  toBasicError,
} from "@ukdanceblue/common/error";
import { Err, Option, Result } from "ts-results-es";
import type { MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";
import { fileURLToPath } from "url";

import { logger } from "#logging/logger.js";
import { ConfigurationResolver } from "#resolvers/ConfigurationResolver.js";
import {
  DailyDepartmentNotificationBatchResolver,
  DailyDepartmentNotificationResolver,
} from "#resolvers/DailyDepartmentNotification.js";
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

const schemaPath = fileURLToPath(
  new URL("../../../../schema.graphql", import.meta.url)
);

/**
 * Logs errors, as well as allowing us to return results and options from resolvers
 *
 * NOTE: be careful working in this function as the types are mostly 'any', meaning you won't get much type checking
 */
const errorHandlingMiddleware: MiddlewareFn = async ({ info }, next) => {
  let result: unknown;
  try {
    result = (await next()) as unknown;
  } catch (error) {
    logger.error(
      "An error occurred in a resolver",
      typeof error !== "object" ? { error } : error
    );
    throw error;
  }

  if (Result.isResult(result)) {
    if (result.isErr()) {
      let concreteError: Err<ConcreteError>;
      let stack: string | undefined;
      if (result.error instanceof ConcreteError) {
        concreteError = result;
        stack = result.stack;
      } else {
        concreteError = Err(toBasicError(result.error));
        stack = concreteError.error.stack;
      }

      const error = new FormattedConcreteError(concreteError, info);
      logger.error("An error occurred in a resolver", {
        message: concreteError.error.detailedMessage,
        stack,
      });
      throw error;
    } else {
      result = result.value as unknown;
    }
  }

  if (Option.isOption(result)) {
    result = result.unwrapOr(null);
  }

  return result;
};

const resolvers = [
  ConfigurationResolver,
  DeviceResolver,
  DailyDepartmentNotificationResolver,
  DailyDepartmentNotificationBatchResolver,
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
  try {
    // @ts-expect-error This is a valid operation
    Container.get(service);
  } catch (error) {
    logger.crit(`Failed to get service: "${service.name}"`, error);
    process.exit(1);
  }
}

export default await buildSchema({
  resolvers,
  emitSchemaFile: schemaPath,
  globalMiddlewares: [errorHandlingMiddleware],
  container: {
    get(someClass) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
      return Container.get(someClass, false);
    },
  },
  validate: true,
});
