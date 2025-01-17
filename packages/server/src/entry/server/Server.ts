import { Service } from "@freshgum/typedi";

import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import {
  isDevelopmentToken,
  logDirToken,
  loggingLevelToken,
} from "#lib/typediTokens.js";

import type { EntryPoint } from "../EntryPoint.js";
import { ApolloModule } from "./Apollo.js";
import { ExpressModule } from "./Express.js";
import { PortalModule } from "./Portal.js";
import { SentryInstrumentation } from "./SentryInstrumentation.js";

@Service([
  ApolloModule,
  ExpressModule,
  PortalModule,
  SentryInstrumentation,
  logDirToken,
  loggingLevelToken,
  isDevelopmentToken,
])
export class Server implements EntryPoint {
  constructor(
    private readonly apolloModule: ApolloModule,
    private readonly expressModule: ExpressModule,
    private readonly portalModule: PortalModule,
    private readonly sentryInstrumentation: SentryInstrumentation,
    private readonly logDir: string,
    private readonly loggingLevel: SyslogLevels,
    private readonly isDevelopment: boolean
  ) {}

  async start(): Promise<void> {
    this.sentryInstrumentation.init();

    const { logger } = await import("#logging/logger.js");
    logger.info(
      `Logger initialized with level "${this.loggingLevel}", writing log files to "${this.logDir}"`
    );

    this.expressModule.init();
    logger.debug("Express initialized");

    await this.apolloModule.init();
    logger.debug("Apollo initialized");

    this.expressModule.startMiddlewares();
    logger.debug("Express middlewares started");

    await this.apolloModule.start();
    logger.debug("Apollo started");

    await this.expressModule.startRoutes();
    logger.debug("Express routes started");

    if (process.env.SSR === "enable_unstable_ssr") {
      if (!this.isDevelopment) {
        logger.error(
          "SSR is not supported in production, please remove the SSR environment variable"
        );
        process.exit(1);
      } else {
        logger.warning(
          "Enabling SSR rendered portal, this functionality is not complete and may not work as expected"
        );
      }
      await this.portalModule.startSsr();
    } else {
      await this.portalModule.startSpa();
    }
    logger.debug("Portal started");

    this.expressModule.startErrorHandlers();
    logger.debug("Express error handlers started");

    await this.expressModule.start();
    logger.debug("Express started");

    await import("#jobs/index.js");
    logger.debug("Jobs started");

    logger.info("DanceBlue Server Started");
  }
}
