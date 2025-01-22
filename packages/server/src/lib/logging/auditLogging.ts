/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import { Container } from "@freshgum/typedi";
import type { JsonObject } from "@prisma/client/runtime/library";
import type {
  AccessControlParam,
  GlobalId,
  PrimitiveObject,
  Subject,
} from "@ukdanceblue/common";
import { isGlobalId, serializeGlobalId } from "@ukdanceblue/common";
import type { GraphQLResolveInfo } from "graphql";
import { AsyncResult, Result } from "ts-results-es";
import type { ArgsDictionary } from "type-graphql";
import {
  createMethodMiddlewareDecorator,
  getMetadataStorage,
} from "type-graphql";
import type { LeveledLogMethod, Logger } from "winston";
import { createLogger, format, transports } from "winston";

import type { GraphQLContext } from "#auth/context.js";
import { logDirToken, prismaToken } from "#lib/typediTokens.js";
import { isDevelopmentToken } from "#lib/typediTokens.js";

import { logger } from "./standardLogging.js";

const logDir = Container.get(logDirToken);

export interface AuditLogger extends Logger {
  action: (
    message: string,
    meta: {
      details?: PrimitiveObject;
      userId?: string | number;
      subjectGlobalId?: string | GlobalId;
    }
  ) => void;

  info: LeveledLogMethod;
  warn: never;
  help: never;
  data: never;
  debug: never;
  prompt: never;
  http: never;
  verbose: never;
  input: never;
  silly: never;
  emerg: never;
  alert: never;
  crit: never;
  warning: never;
  notice: never;
}

export const auditLoggerFileName = "audit.log.json";

const fileTransport = new transports.File({
  filename: auditLoggerFileName,
  dirname: logDir,
  silent: logDir === "TEST",
  maxsize: 1_000_000,
  maxFiles: 3,
  format: format.combine(format.timestamp(), format.json()),
});

const writeAuditLog = (
  message: string,
  details?: PrimitiveObject,
  userId?: string | number,
  subjectGlobalId?: string | GlobalId
) =>
  Container.get(prismaToken).auditLog.create({
    data: {
      summary: message,
      details: details ? (details as JsonObject) : {},
      user: userId
        ? typeof userId === "string"
          ? { connect: { uuid: userId } }
          : { connect: { id: userId } }
        : undefined,
      subjectGlobalId: subjectGlobalId
        ? typeof subjectGlobalId === "string"
          ? subjectGlobalId
          : serializeGlobalId(subjectGlobalId)
        : undefined,
    },
  });

const isDevelopment = Container.get(isDevelopmentToken);
const auditLogger = createLogger({
  silent: !isDevelopment,
  transports: [fileTransport],
  levels: {
    info: 6,
    action: 3,
  },
}) as AuditLogger;

auditLogger.info("Audit Logger initialized");

export function WithAuditLogging() {
  return createMethodMiddlewareDecorator<GraphQLContext>(
    async ({ args, context, info }, next) => {
      if (info.rootValue) {
        return next;
      }
      const { authorizedFields } = getMetadataStorage();
      const auth = authorizedFields.find(
        ({ fieldName }) => fieldName === info.fieldName
      )?.roles[0] as AccessControlParam<"PersonNode"> | undefined;

      const result = await next();

      await logAuditEvent(auth, info, args, result, context);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    }
  );
}

function pathToString(path: GraphQLResolveInfo["path"]): string {
  let current: GraphQLResolveInfo["path"] | undefined = path;
  let result = "";
  while (current) {
    result = `${current.key}.${result}`;
    current = current.prev;
  }
  return result;
}

export async function logAuditEvent(
  auth: AccessControlParam<"PersonNode"> | undefined,
  info: GraphQLResolveInfo,
  args: ArgsDictionary,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
  context: GraphQLContext
) {
  let message: string;

  const path = pathToString(info.path);

  if (auth) {
    const [action, subject, field] = auth;
    let loadedSubject: Subject | undefined;
    let result;
    if (typeof subject === "function") {
      result = subject(
        info,
        args,
        info.rootValue as Record<string, unknown> | undefined
      );
      if (result instanceof AsyncResult) {
        result = await result.promise;
      }
    } else {
      result = subject;
    }

    if (Result.isResult(result)) {
      if (result.isErr()) {
        logger.error("Error resolving subject", { error: result });
        loadedSubject = undefined;
      } else {
        loadedSubject = result.value;
      }
    }

    if (typeof loadedSubject === "string") {
      message = `${action} ${loadedSubject}${field} at ${path}`;
    } else if (typeof loadedSubject === "object") {
      message = loadedSubject.id
        ? `${action} ${loadedSubject.kind}[id=${loadedSubject.id}]${field}  at ${path}`
        : `${action} ${loadedSubject.kind}${field}  at ${path}`;
    } else {
      loadedSubject satisfies undefined;
      message = `${action} ${path}`;
    }
  } else {
    message = `accessed ${path}`;
  }

  let id = undefined;
  if ("id" in args) {
    if (isGlobalId(args.id)) {
      id = serializeGlobalId(args.id);
    } else if (typeof args.id === "string") {
      id = args.id;
    }
  } else if ("input" in args && "id" in args.input) {
    if (isGlobalId(args.input.id)) {
      id = serializeGlobalId(args.input.id);
    } else if (typeof args.input.id === "string") {
      id = args.input.id;
    }
  } else if ("id" in result) {
    if (isGlobalId(result.id)) {
      id = serializeGlobalId(result.id);
    } else if (typeof result.id === "string") {
      id = result.id;
    }
  } else if ("data" in result && "id" in result.data) {
    if (isGlobalId(result.data.id)) {
      id = serializeGlobalId(result.data.id);
    } else if (typeof result.data.id === "string") {
      id = result.data.id;
    }
  } else if ("value" in result && "id" in result.value) {
    if (isGlobalId(result.value.id)) {
      id = serializeGlobalId(result.value.id);
    } else if (typeof result.value.id === "string") {
      id = result.value.id;
    }
  } else if (
    "value" in result &&
    "value" in result.value &&
    "id" in result.value.value
  ) {
    if (isGlobalId(result.value.value.id)) {
      id = serializeGlobalId(result.value.value.id);
    } else if (typeof result.value.value.id === "string") {
      id = result.value.value.id;
    }
  }

  try {
    auditLogger.action(message, {
      details: args,
      userId: context.authenticatedUser?.id.id,
      subjectGlobalId: id,
    });
    await writeAuditLog(message, args, context.authenticatedUser?.id.id, id);
  } catch (error) {
    logger.error("Error writing audit log", { error });
  }
}
