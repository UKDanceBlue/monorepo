import { readFile } from "fs/promises";
import { join } from "path";

import { AccessControl, AccessLevel } from "@ukdanceblue/common";
import { FieldResolver, ObjectType, Query, Resolver } from "type-graphql";

import { logDir } from "#environment";
import { auditLoggerFileName } from "#logging/auditLogging.js";

@ObjectType()
export class Administration {
  @FieldResolver(() => Boolean)
  ok() {
    return true;
  }
}

@Resolver(() => Administration)
export class AdministrationResolver {
  @AccessControl({ accessLevel: AccessLevel.SuperAdmin })
  @Query(() => Administration)
  administration(): Promise<Administration> {
    return Promise.resolve(new Administration());
  }

  @AccessControl({ accessLevel: AccessLevel.SuperAdmin })
  @Query(() => String)
  async auditLog(): Promise<string> {
    const fileLookup = await readFile(join(logDir, auditLoggerFileName));
    return fileLookup.toString("utf8");
  }
}
