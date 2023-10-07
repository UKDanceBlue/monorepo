import dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";

// import { logout } from "../../../actions/auth.js";

import { authMiddleware } from "./authMiddleware.js";
import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

const authApiRouter = express.Router();

dotenv.config();

if (!process.env.MS_OIDC_URL) {
  throw new Error("Missing MS_OIDC_URL environment variable");
}
if (!process.env.MS_CLIENT_ID) {
  throw new Error("Missing MS_CLIENT_ID environment variable");
}
if (!process.env.MS_CLIENT_SECRET) {
  throw new Error("Missing MS_CLIENT_SECRET environment variable");
}

authApiRouter.use(authMiddleware);

authApiRouter.get("/logout", (_: Request, res: Response) => {
  // logout(req, res);
  res.redirect("/");
});

authApiRouter.post("/oidc-callback", oidcCallback);

authApiRouter.get("/login", login);

export default authApiRouter;
