import { Service } from "@freshgum/typedi";

import { drizzleToken } from "#lib/typediTokens.js";
import { RouterService } from "#routes/RouteService.js";

@Service([drizzleToken])
export default class HealthCheckRouter extends RouterService {
  constructor(protected readonly db: Drizzle) {
    super("/healthcheck");

    this.addGetRoute("/", async (_, res) => {
      try {
        await prisma.$connect();
      } catch {
        res.type("text/plain");
        res.status(500);
        res.send("Database connection error");
        return;
      }

      res.type("text/plain");
      res.status(200);
      res.send("OK");
    });
  }
}
