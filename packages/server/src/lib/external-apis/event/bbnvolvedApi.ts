import type { BasicError } from "@ukdanceblue/common/error";
import { FetchError } from "@ukdanceblue/common/error";
import { DateTime } from "luxon";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";
import type { z } from "zod";

import { ZodError } from "#error/zod.js";

import { bbnvolvedEventSchema } from "./bbnvolvedEventSchema.js";

export async function getBbnvolvedEvents(
  limit: number,
  since: DateTime<true> = DateTime.now().minus({ day: 3 })
): Promise<
  Result<
    z.infer<typeof bbnvolvedEventSchema>["value"],
    ZodError | FetchError | BasicError
  >
> {
  const result = await FetchError.safeFetch(
    `https://uky.campuslabs.com/engage/api/discovery/event/search?endsAfter=${encodeURIComponent(since.toISO())}&orderByField=endsOn&orderByDirection=ascending&status=Approved&take=${limit}&query=&skip=0&organizationIds%5B0%5D=192535`,
    {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  if (result.isErr()) {
    return result;
  }
  const json = await result.value.json();
  const parsed = bbnvolvedEventSchema.safeParse(json);

  return !parsed.success
    ? Err(new ZodError(parsed.error))
    : Ok(parsed.data.value);
}
