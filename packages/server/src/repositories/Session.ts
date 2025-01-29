import { type Container, Service } from "@freshgum/typedi";
import { type Person, Session } from "@prisma/client";
import { AuthSource } from "@ukdanceblue/common";
import {
  ErrorCode,
  ExtendedError,
  InvariantError,
  toBasicError,
  UnauthenticatedError,
} from "@ukdanceblue/common/error";
import { type CookieOptions, Handler } from "express";
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { DateTime, Duration } from "luxon";
import { AsyncResult, Err, Ok } from "ts-results-es";

import { isDevelopmentToken, jwtSecretToken } from "#lib/typediTokens.js";

const { sign, verify } = jsonwebtoken;

import * as Sentry from "@sentry/node";

import { breadCrumbTrace, logger } from "#lib/logging/standardLogging.js";
import { PrismaService } from "#lib/prisma.js";

import { buildDefaultRepository } from "./Default.js";
import {
  PersonRepository,
  type UniquePersonParam,
} from "./person/PersonRepository.js";
import { type AsyncRepositoryResult, type RepositoryError } from "./shared.js";

export const SESSION_LENGTH = Duration.fromObject({ day: 1 });
const JWT_ISSUER = "https://app.danceblue.org";
export const SESSION_COOKIE_NAME = "ukdanceblue_session";

export type SessionValue = Session & { person: Person | null };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session: SessionValue | null;
      getService: typeof Container.get;
    }
  }
}

@Service([PrismaService, jwtSecretToken, isDevelopmentToken, PersonRepository])
export class SessionRepository extends buildDefaultRepository("Session", {}) {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly jwtSecret: string,
    private readonly isDevelopment: boolean,
    private readonly personRepository: PersonRepository
  ) {
    super(prisma);
  }

  public uniqueToWhere() {
    throw new Error("Method not implemented.");
  }

  private get sessionCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: !this.isDevelopment,
      sameSite: "strict",
      maxAge: SESSION_LENGTH.as("milliseconds"),
    };
  }

  newSession({
    user,
    authSource,
    ip,
    userAgent,
  }: {
    user: UniquePersonParam | null;
    authSource: AuthSource;
    ip?: string;
    userAgent?: string;
  }): AsyncRepositoryResult<SessionValue> {
    if (authSource === AuthSource.None) {
      return Err(
        new InvariantError(
          "Cannot create a session with an auth source of None"
        )
      ).toAsyncResult();
    }
    return this.handleQueryError(
      this.prisma.session.create({
        data: {
          authSource,
          ip,
          userAgent,
          person: user
            ? { connect: this.personRepository.uniqueToWhere(user) }
            : undefined,
          expiresAt: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
        },
        include: { person: true },
      })
    );
  }

  verifySession(
    token: string,
    { ip }: { ip?: string }
  ): AsyncRepositoryResult<SessionValue, UnauthenticatedError> {
    return new AsyncResult<string, RepositoryError | UnauthenticatedError>(
      new Promise((resolve) => {
        try {
          verify(
            token,
            this.jwtSecret,
            {
              complete: false,
              issuer: JWT_ISSUER,
            },
            (err, decoded) => {
              if (err) {
                if (
                  err.message === "invalid signature" ||
                  err.message === "jwt expired"
                ) {
                  resolve(Err(new UnauthenticatedError()));
                } else {
                  resolve(Err(toBasicError(err)));
                }
              } else if (!decoded) {
                resolve(Err(new InvariantError("No decoded token")));
              } else if (typeof decoded !== "object") {
                resolve(
                  Err(new InvariantError("Decoded token is not a string"))
                );
              } else if (!decoded.sub) {
                resolve(Err(new InvariantError("No sub in decoded token")));
              } else {
                resolve(Ok(decoded.sub));
              }
            }
          );
        } catch (error) {
          resolve(
            Err(
              String(error) === "jwt expired"
                ? new UnauthenticatedError()
                : toBasicError(error)
            )
          );
        }
      })
    )
      .andThen((decoded) => {
        return this.handleQueryError(
          this.prisma.session.findUnique({
            where: { uuid: decoded },
            include: { person: true },
          })
        );
      })
      .andThen((session) =>
        session ? Ok(session) : Err(new UnauthenticatedError())
      )
      .andThen((session) => {
        if (session.expiresAt < new Date() || session.ip !== ip) {
          return this.deleteSession(session).andThen(() =>
            Err(new UnauthenticatedError())
          );
        } else {
          return Ok(session);
        }
      });
  }

  signSession(session: Session): AsyncResult<string, RepositoryError> {
    return new AsyncResult<string, RepositoryError>(
      new Promise((resolve) => {
        sign(
          {
            iss: JWT_ISSUER,
            sub: session.uuid,
            exp: Math.floor(session.expiresAt.getTime() / 1000),
          },
          this.jwtSecret,
          {},
          (err, token) => {
            if (err) {
              resolve(Err(toBasicError(err)));
            } else if (!token) {
              resolve(Err(new InvariantError("No token signed")));
            } else {
              resolve(Ok(token));
            }
          }
        );
      })
    );
  }

  refreshSession(session: Session): AsyncRepositoryResult<SessionValue> {
    return this.handleQueryError(
      this.prisma.session.update({
        where: { id: session.id },
        data: {
          expiresAt: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
        },
        include: { person: true },
      })
    );
  }

  deleteSession(session: Session): AsyncRepositoryResult<void> {
    return this.handleQueryError(
      this.prisma.session.delete({ where: { id: session.id } })
    ).map(() => undefined);
  }

  gcOldSessions(): AsyncRepositoryResult<void> {
    return this.handleQueryError(
      this.prisma.session.deleteMany({
        where: { expiresAt: { lte: new Date() } },
      })
    ).map(() => undefined);
  }

  get expressMiddleware(): Handler {
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.trace("Session middleware", {
        method: req.method,
        url: req.url,
      });

      let token = (req.cookies as Partial<Record<string, string>>)[
        SESSION_COOKIE_NAME
      ]
        ? String(
            (req.cookies as Partial<Record<string, string>>)[
              SESSION_COOKIE_NAME
            ]
          )
        : undefined;
      let tokenFromCookie = false;
      if (token) {
        tokenFromCookie = true;
      } else {
        let authorizationHeader =
          req.headers.Authorization || req.headers.authorization;
        if (Array.isArray(authorizationHeader)) {
          authorizationHeader = authorizationHeader[0];
        }
        if (authorizationHeader?.startsWith("Bearer ")) {
          token = authorizationHeader.substring("Bearer ".length);
        }
      }
      if (!token) {
        req.session = null;
        next();
      } else {
        const result = this.verifySession(token, {
          ip: req.ips[0] ?? req.ip,
        })
          .andThen(
            (
              session
            ): AsyncRepositoryResult<SessionValue, UnauthenticatedError> => {
              req.session = session;

              breadCrumbTrace("Session verified", {
                sessionUuid: session.uuid,
                personEmail: session.person?.email,
              });

              Sentry.setUser({
                email: session.person?.email,
                id: session.person?.uuid,
                ip_address: session.ip ?? undefined,
              });

              Sentry.setContext("session", {
                uuid: session.uuid,
                source: session.authSource,
              });

              return this.refreshSession(session);
            }
          )
          .andThen((session) => this.signSession(session));
        const awaited = await result.promise;
        if (awaited.isOk()) {
          if (tokenFromCookie) {
            res.cookie(SESSION_COOKIE_NAME, token, this.sessionCookieOptions);
          }
          next();
        } else {
          req.session = null;
          if (
            awaited.error instanceof ExtendedError &&
            awaited.error.tag === ErrorCode.Unauthenticated &&
            tokenFromCookie
          ) {
            res.clearCookie(SESSION_COOKIE_NAME);
            next();
          } else {
            next(awaited.error);
          }
        }
      }
    };
  }

  doExpressRedirect(
    req: express.Request,
    res: express.Response,
    jwt: string,
    redirectTo: string,
    returning: (string | object | undefined)[]
  ) {
    if (returning.includes("token")) {
      redirectTo = `${redirectTo}?token=${encodeURIComponent(jwt)}`;
    }
    if (returning.includes("cookie")) {
      res.cookie(SESSION_COOKIE_NAME, jwt, {
        httpOnly: true,
        sameSite: req.secure ? "none" : "lax",
        secure: req.secure,
        expires: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
      });
    }
    return res.redirect(redirectTo);
  }
}
