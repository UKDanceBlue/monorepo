import { Service } from "@freshgum/typedi";

import {
  dbFundsApiKeyToken,
  dbFundsApiOriginToken,
} from "#lib/environmentTokens.js";

import { FeedService } from "./FeedService.js";

@Service([dbFundsApiOriginToken, dbFundsApiKeyToken])
export class InstagramService implements FeedService {
  constructor(
    private readonly dbFundsApiOrigin: string,
    private readonly dbFundsApiKey: string
  ) {}
  getItems() {}
}
