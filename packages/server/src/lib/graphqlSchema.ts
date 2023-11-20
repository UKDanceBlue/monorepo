import { MiddlewareFn, buildSchema } from "type-graphql";

import { logError } from "../logger.js";
import { ConfigurationResolver } from "../resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "../resolvers/DeviceResolver.js";
import { EventResolver } from "../resolvers/EventResolver.js";
import { ImageResolver } from "../resolvers/ImageResolver.js";
import { LoginStateResolver } from "../resolvers/LoginState.js";
import { MembershipResolver } from "../resolvers/MembershipResolver.js";
import { NotificationResolver } from "../resolvers/NotificationResolver.js";
import { PersonResolver } from "../resolvers/PersonResolver.js";
import { PointEntryResolver } from "../resolvers/PointEntryResolver.js";
import { TeamResolver } from "../resolvers/TeamResolver.js";
import { customAuthChecker } from "../resolvers/authChecker.js";

const errorHandlingMiddleware: MiddlewareFn = async (_, next) => {
  try {
    return await next();
  } catch (err) {
    logError("An error occurred in a resolver", err);
    throw err;
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
  ],
  emitSchemaFile: true,
  authChecker: customAuthChecker,
  authMode: "error",
  globalMiddlewares: [errorHandlingMiddleware],
});
