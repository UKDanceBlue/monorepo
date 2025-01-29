import "reflect-metadata";

import { Service } from "@freshgum/typedi";
import repl from "repl";

import {
  getEnvironment,
  isReplToken,
  logDirToken,
  loggingLevelToken,
  PrismaService,
} from "#lib/typediTokens.js";

import { EntryPoint } from "./EntryPoint.js";
import { DotEnvEnvironmentService } from "./environment/DotEnvEnvironmentService.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

await import("#environment");

const { Container } = await import("@freshgum/typedi");

const logDir = Container.get(logDirToken);
const loggingLevel = Container.get(loggingLevelToken);

const { logger } = await import("#logging/logger.js");

logger.info(
  `Logger initialized with level "${loggingLevel}", writing log files to "${logDir}"`
);

await import("#lib/prisma.js");

const { resolversList } = await import("#lib/resolversList.js");

Container.setValue(isReplToken, true);

@Service([DotEnvEnvironmentService])
export class Repl extends EntryPoint {
  constructor(
    private readonly dotEnvEnvironmentService: DotEnvEnvironmentService
  ) {
    super();
  }

  async start(): Promise<void> {
    await this.dotEnvEnvironmentService.populate();

    Container.setValue(isReplToken, true);

    const replServer = repl.start({
      prompt: "danceblue> ",
      useGlobal: true,
    });

    for (const resolver of resolversList) {
      // @ts-expect-error - This is a dynamic property assignment
      replServer.context[resolver.name] = Container.get(resolver);
    }

    replServer.context.getService = Container.get.bind(Container);

    replServer.context.prisma = Container.get(PrismaService);

    replServer.context.env = getEnvironment();

    // Load some utility functions
    replServer.context.dbCommon = await import("@ukdanceblue/common");
    replServer.context.luxon = await import("luxon");
    replServer.context.faker = await import("@faker-js/faker");

    replServer.defineCommand("import", {
      help: "Import a module and add it to the context",
      action: async (moduleName) => {
        const module = (await import(moduleName)) as Record<string, unknown>;
        const moduleExports = Object.keys(module);
        if (moduleExports.length === 1) {
          replServer.context[moduleExports[0]!] = module[moduleExports[0]!];
          console.log(`Imported module "${moduleExports[0]!}"`);
          replServer.displayPrompt();
        } else {
          const contextName = moduleName.split("/").pop()!;
          replServer.context[contextName] = module;
          console.log(`Imported module "${contextName}"`);
          replServer.displayPrompt();
        }
      },
    });
  }
}
