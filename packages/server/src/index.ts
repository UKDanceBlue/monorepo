import "reflect-metadata";

import { Container } from "@freshgum/typedi";

import type { EntryPoint } from "./entry/EntryPoint.js";

// No top level imports that cause side effects should be used in this file
// We want to control the order of execution

const entryPointStr = process.argv[process.argv.length - 1];

let entryPoint: EntryPoint;
switch (entryPointStr) {
  case "start": {
    const { Server } = await import("./entry/server/Server.js");
    entryPoint = Container.get(Server);
    break;
  }
  case "repl": {
    const { Repl } = await import("./entry/Repl.js");
    entryPoint = Container.get(Repl);
    break;
  }
  case "seed": {
    const { Seed } = await import("./entry/Seed.js");
    entryPoint = Container.get(Seed);
    break;
  }
  default: {
    throw new Error(
      "Unrecognized entry point. Server must be started with one of 'start', 'repl', or 'seed'"
    );
  }
}

try {
  await entryPoint.start();
} catch (error) {
  console.error("Unhandled error in server startup", error);
  process.exit(1);
}
