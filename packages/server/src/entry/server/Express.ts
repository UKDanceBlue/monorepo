import http from "node:http";

import { Service } from "@freshgum/typedi";
import express from "express";

@Service([])
export class ExpressModule {
  public readonly app: express.Application;
  public readonly httpServer: http.Server;

  constructor() {
    this.app = express();
    this.app.set("trust proxy", true);

    this.httpServer = http.createServer(this.app);
  }
}
