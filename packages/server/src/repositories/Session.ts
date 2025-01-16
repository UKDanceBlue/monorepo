import { type Container, Service } from "@freshgum/typedi";
import { type Person, PrismaClient, Session } from "@prisma/client";
import { AuthSource } from "@ukdanceblue/common";
import {
  ConcreteError,
  ErrorCode,
  InvariantError,
  toBasicError,
  UnauthenticatedError,
} from "@ukdanceblue/common/error";
import { type CookieOptions, Handler } from "express";
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import { DateTime, Duration } from "luxon";
import { AsyncResult, Err, Ok } from "ts-results-es";

import {
  isDevelopmentToken,
  jwtSecretToken,
  prismaToken,
} from "#lib/typediTokens.js";

const { sign, verify } = jsonwebtoken;

import { buildDefaultRepository } from "./Default.js";
import {
  PersonRepository,
  type UniquePersonParam,
} from "./person/PersonRepository.js";
import { type AsyncRepositoryResult, type RepositoryError } from "./shared.js";

export const SESSION_LENGTH = Duration.fromObject({ day: 1 });
const JWT_ISSUER = "https://danceblue.org";
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

@Service([prismaToken, jwtSecretToken, isDevelopmentToken, PersonRepository])
export class SessionRepository extends buildDefaultRepository("Session", {}) {
  constructor(
    protected readonly prisma: PrismaClient,
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
    { ip, userAgent }: { ip?: string; userAgent?: string }
  ): AsyncRepositoryResult<SessionValue, UnauthenticatedError> {
    return new AsyncResult<string, RepositoryError>(
      new Promise((resolve) => {
        verify(
          token,
          this.jwtSecret,
          { complete: false, issuer: JWT_ISSUER },
          (err, decoded) => {
            if (err) {
              resolve(Err(toBasicError(err)));
            } else if (!decoded) {
              resolve(Err(new InvariantError("No decoded token")));
            } else if (typeof decoded !== "string") {
              resolve(Err(new InvariantError("Decoded token is not a string")));
            } else {
              resolve(Ok(decoded));
            }
          }
        );
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
        if (
          session.expiresAt < new Date() ||
          session.ip !== ip ||
          session.userAgent !== userAgent
        ) {
          return this.handleQueryError(
            this.prisma.session.delete({
              where: { uuid: session.uuid },
            })
          ).andThen(() => Err(new UnauthenticatedError()));
        } else {
          return Ok(session);
        }
      });
  }

  signSession(session: Session): AsyncResult<string, RepositoryError> {
    return new AsyncResult<string, RepositoryError>(
      new Promise((resolve) => {
        sign(
          session.uuid,
          this.jwtSecret,
          { issuer: JWT_ISSUER },
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
        where: { uuid: session.uuid },
        data: {
          expiresAt: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
        },
        include: { person: true },
      })
    );
  }

  deleteSession(session: Session): AsyncRepositoryResult<void> {
    return this.handleQueryError(
      this.prisma.session.delete({ where: { uuid: session.uuid } })
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
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        })
          .andThen(
            (
              session
            ): AsyncRepositoryResult<SessionValue, UnauthenticatedError> => {
              req.session = session;
              return this.refreshSession(session);
            }
          )
          .andThen((session) => this.signSession(session))
          .andThen<undefined, undefined>((token) => {
            if (tokenFromCookie) {
              res.cookie(SESSION_COOKIE_NAME, token, this.sessionCookieOptions);
            }
            next();
            return Ok(undefined);
          })
          .orElse<undefined>((error) => {
            req.session = null;
            if (
              error instanceof ConcreteError &&
              error.tag === ErrorCode.Unauthenticated &&
              tokenFromCookie
            ) {
              res.clearCookie(SESSION_COOKIE_NAME);
            } else {
              next(error);
            }
            return Ok(undefined);
          }) satisfies AsyncResult<undefined, undefined>;
        await result.promise;
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
