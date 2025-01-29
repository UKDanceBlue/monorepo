import { Service } from "@freshgum/typedi";
import { Expo } from "expo-server-sdk";

import { expoApiKeyToken } from "#lib/typediTokens.js";

@Service([expoApiKeyToken])
export class ExpoService extends Expo {
  constructor(apiKey: string) {
    super({ accessToken: apiKey });
  }
}
