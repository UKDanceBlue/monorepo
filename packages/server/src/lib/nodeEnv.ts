import { Container } from "@freshgum/typedi";

import { isDevelopmentToken } from "./environmentTokens.js";

export const isDevelopment = Container.get(isDevelopmentToken);
