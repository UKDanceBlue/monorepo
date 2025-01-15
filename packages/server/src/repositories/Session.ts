import { type Container, Service } from "@freshgum/typedi";
import { PrismaClient, Session } from "@prisma/client";
import { AuthSource } from "@ukdanceblue/common";
import {
  ConcreteError,
  ErrorCode,
  InvariantError,
  toBasicError,
  UnauthenticatedError,
} from "@ukdanceblue/common/error";
import { type CookieOptions, Handler } from "express";
import { sign, verify } from "jsonwebtoken";
import { DateTime, Duration } from "luxon";
import { AsyncResult, Err, Ok } from "ts-results-es";

import {
  isDevelopmentToken,
  jwtSecretToken,
  prismaToken,
} from "#lib/typediTokens.js";

import { buildDefaultRepository } from "./Default.js";
import {
  PersonRepository,
  type UniquePersonParam,
} from "./person/PersonRepository.js";
import { type AsyncRepositoryResult, type RepositoryError } from "./shared.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      session: Session | null;
      getService: typeof Container.get;
    }
  }
}

export const SESSION_LENGTH = Duration.fromObject({ day: 1 });
const JWT_ISSUER = "https://danceblue.org";
const SESSION_COOKIE_NAME = "ukdanceblue_session";

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
    user: UniquePersonParam;
    userAgent: string;
    ip: string;
    authSource: AuthSource;
  }): AsyncRepositoryResult<Session> {
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
          person: { connect: this.personRepository.uniqueToWhere(user) },
          expiresAt: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
        },
      })
    );
  }

  verifySession(
    token: string,
    { ip, userAgent }: { ip?: string; userAgent?: string }
  ): AsyncRepositoryResult<Session | null, UnauthenticatedError> {
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

  refreshSession(session: Session): AsyncRepositoryResult<Session> {
    return this.handleQueryError(
      this.prisma.session.update({
        where: { uuid: session.uuid },
        data: {
          expiresAt: DateTime.now().plus(SESSION_LENGTH).toJSDate(),
        },
      })
    );
  }

  get expressMiddleware(): Handler {
    return async (req, res, next) => {
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
            (session): AsyncRepositoryResult<Session, UnauthenticatedError> => {
              if (!session) {
                return Err(new UnauthenticatedError()).toAsyncResult();
              }
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
}
