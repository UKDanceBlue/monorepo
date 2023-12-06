import type { MiddlewareFn } from "type-graphql";
import { buildSchema } from "type-graphql";

import { logger } from "../logger.js";
import { ConfigurationResolver } from "../resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "../resolvers/DeviceResolver.js";
import { EventResolver } from "../resolvers/EventResolver.js";
import { ImageResolver } from "../resolvers/ImageResolver.js";
import { LoginStateResolver } from "../resolvers/LoginState.js";
import { MembershipResolver } from "../resolvers/MembershipResolver.js";
import { NotificationResolver } from "../resolvers/NotificationResolver.js";
import { PersonResolver } from "../resolvers/PersonResolver.js";
import { PointEntryResolver } from "../resolvers/PointEntryResolver.js";
import { PointOpportunityResolver } from "../resolvers/PointOpportunityResolver.js";
import { TeamResolver } from "../resolvers/TeamResolver.js";

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
    TeamResolver,
    LoginStateResolver,
    PointEntryResolver,
    PointOpportunityResolver,
  ],
  emitSchemaFile: true,
  globalMiddlewares: [errorHandlingMiddleware],
});
