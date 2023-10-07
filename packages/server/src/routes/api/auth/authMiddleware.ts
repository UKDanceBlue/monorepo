import type { NextFunction, Request, Response } from "express";
import { Issuer } from "openid-client";

export const authMiddleware = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!res.locals.oidcClient) {
      const microsoftGateway = await Issuer.discover(
        process.env.MS_OIDC_URL ?? ""
      );
      res.locals.oidcClient = new microsoftGateway.Client({
        client_id: process.env.MS_CLIENT_ID ?? "",
        client_secret: process.env.MS_CLIENT_SECRET ?? "",
        redirect_uris: [
          new URL(
            "/api/auth/oidc-callback",
            res.locals.applicationUrl.toString()
          ).toString(),
        ],
        response_types: ["code"],
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
