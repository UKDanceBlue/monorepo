import { fileURLToPath } from "url";

import type { MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

import { ConfigurationResolver } from "../resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "../resolvers/DeviceResolver.js";
import { EventResolver } from "../resolvers/EventResolver.js";
import { ImageResolver } from "../resolvers/ImageResolver.js";
import { LoginStateResolver } from "../resolvers/LoginState.js";
import { MembershipResolver } from "../resolvers/MembershipResolver.js";
import {
  NotificationDeliveryResolver,
  NotificationResolver,
} from "../resolvers/NotificationResolver.js";
import { PersonResolver } from "../resolvers/PersonResolver.js";
import { PointEntryResolver } from "../resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "../resolvers/PointOpportunityResolver.js";
import { TeamResolver } from "../resolvers/TeamResolver.js";

import { logger } from "./logging/logger.js";

const schemaPath = fileURLToPath(
  new URL("../../../../schema.graphql", import.meta.url)
);

const errorHandlingMiddleware: MiddlewareFn = async (_, next) => {
  try {
    return void (await next());
  } catch (error) {
    logger.error("An error occurred in a resolver", error);
    throw error;
  }
};

export default await buildSchema({
  resolvers: [
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
  ],
  emitSchemaFile: schemaPath,
  globalMiddlewares: [errorHandlingMiddleware],
  container: Container,
});
