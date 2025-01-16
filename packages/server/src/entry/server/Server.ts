import { Service } from "@freshgum/typedi";

import type { SyslogLevels } from "#lib/logging/SyslogLevels.js";
import { logDirToken, loggingLevelToken } from "#lib/typediTokens.js";

import { EntryPoint } from "../EntryPoint.js";

@Service([logDirToken, loggingLevelToken])
export class Server extends EntryPoint {
  constructor(
    private readonly logDir: string,
    private readonly loggingLevel: SyslogLevels
  ) {
    super();
  }

  async start(): Promise<void> {}
}
