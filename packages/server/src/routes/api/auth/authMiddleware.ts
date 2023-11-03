import type { NextFunction, Request, Response } from "express";
import { Issuer } from "openid-client";

import { msClientId, msClientSecret, msOidcUrl } from "../../../environment.js";

export const authMiddleware = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!res.locals.oidcClient) {
      const microsoftGateway = await Issuer.discover(msOidcUrl);
      res.locals.oidcClient = new microsoftGateway.Client({
        client_id: msClientId,
        client_secret: msClientSecret,
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
