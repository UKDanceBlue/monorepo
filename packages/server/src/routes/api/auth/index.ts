import type { Request, Response } from "express";
import express from "express";

// import { logout } from "../../../actions/auth.js";

import { authMiddleware } from "./authMiddleware.js";
import { login } from "./login.js";
import { oidcCallback } from "./oidcCallback.js";

const authApiRouter = express.Router();

authApiRouter.use(authMiddleware);

authApiRouter.get("/logout", (_: Request, res: Response) => {
  // logout(req, res);
  res.redirect("/");
});

authApiRouter.post("/oidc-callback", oidcCallback);

authApiRouter.get("/login", login);

export default authApiRouter;
