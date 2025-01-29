import { Service } from "@freshgum/typedi";
import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { sqlLogger } from "#logging/sqlLogging.js";

const options = {
  log: [
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "query",
    },
  ],
} satisfies Prisma.PrismaClientOptions;

@Service([])
export class PrismaService extends PrismaClient<typeof options> {
  constructor() {
    super(options);

    this.$on("query", (e) => {
      sqlLogger.sql(e.query);
    });
    this.$on("info", (e) => {
      sqlLogger.info(e.message);
    });
    this.$on("warn", (e) => {
      sqlLogger.warning(e.message);
    });
    this.$on("error", (e) => {
      sqlLogger.error(e.message);
    });
  }
}
