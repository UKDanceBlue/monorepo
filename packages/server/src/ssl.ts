import { existsSync, mkdirSync, readFileSync } from "fs";

import { logFatal, logger } from "./logger.js";

export function getKeyPair(): {
  key: string;
  cert: string;
} {
  if (!existsSync("./certs")) {
    mkdirSync("./certs");
  }

  if (existsSync("./certs/key.pem") && existsSync("./certs/cert.pem")) {
    try {
      const keyPath = "./certs/key.pem";
      const certPath = "./certs/cert.pem";

      const key = readFileSync(keyPath, "utf8");
      const cert = readFileSync(certPath, "utf8");

      logger.info("Using existing SSL keypair");

      if (key && cert) {
        return { key, cert };
      }
    } catch (error) {
      logger.error("Error reading existing SSL keypair", error);
    }
  }

  logFatal("No SSL keypair found, generate a new one.");

  return { key: "", cert: "" };
}
