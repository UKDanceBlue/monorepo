import { type ErrorApiResponse, ErrorCode } from "@ukdanceblue/common";
import type { ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import { getReasonPhrase } from "http-status-codes";

import { logError } from "../logger.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    // Allow express to handle the error if headers have already been sent
    return next(error);
  }

  let httpError: createHttpError.HttpError | undefined = undefined;
  if (createHttpError.isHttpError(error)) {
    httpError = error;
  } else if (error instanceof Error) {
    httpError = createHttpError(500, error.message);
  } else {
    httpError = createHttpError(500, "Unknown error");
  }

  if (!httpError.expose && httpError.statusCode >= 500) {
    logError(error);
  }

  // Configure response
  res.status(httpError.statusCode);
  if (httpError.headers) {
    res.header(httpError.headers);
  }
  const errorReason = getReasonPhrase(httpError.statusCode);

  switch (req.accepts("html", "json", "text")) {
    // Respond with html page
    case "html": {
      if (httpError.expose) {
        res
          .type("html")
          .send(
            `<html><head><title>${httpError.statusCode
            } ${errorReason}</title></head><body><h1>${httpError.statusCode
            } ${errorReason}</h1>Message: ${httpError.message}${httpError.stack
              ? `<br><code><pre style="border-radius: 10px;background-color: #ededed;padding:1em;">Stack Trace:\n${httpError.stack}</pre></code>`
              : ""
            }</body></html>`
          );
      } else {
        res
          .type("html")
          .send(
            `<html><head><title>${httpError.statusCode} ${errorReason}</title></head><body><h1>${httpError.statusCode} ${errorReason}</h1></body></html>`
          );
      }
      break;
    }
    case "json": {
      const responseObject: ErrorApiResponse = {
        code: ErrorCode.Unknown,
        ok: false,
        errorMessage: errorReason,
      };

      if (httpError.expose) {
        responseObject.errorDetails = httpError.message;
        if (httpError.stack && process.env.NODE_ENV !== "production") {
          responseObject.errorDetails = httpError.stack;
        }
        if (httpError.cause && process.env.NODE_ENV !== "production") {
          responseObject.errorCause = httpError.cause;
        }
      }

      res.type("application/json").send(responseObject);
      break;
    }
    case "text": {
      res.type("text").send(`${httpError.statusCode} ${errorReason}`);
      break;
    }
    default: {
      // default to plain-text. send()
      res.type("text").send(`${httpError.statusCode} ${errorReason}`);
      break;
    }
  }
};
