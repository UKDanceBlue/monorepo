import { GraphQLScalarType, Kind } from "graphql";
import type { Result } from "ts-results-es";
import { Err, Ok } from "ts-results-es";

import {
  type BasicError,
  InvalidArgumentError,
  toBasicError,
} from "../../error/index.js";
import { debugStringify } from "../../utility/errors/debugStringify.js";
import {
  arrayToBase64String,
  base64StringToArray,
  strToUTF8Arr,
  UTF8ArrToStr,
} from "../../utility/primitive/base64.js";

const uuidRegex = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/i;

export interface GlobalId {
  typename: string;
  id: string;
}

export function parseGlobalId(
  value: string
): Result<GlobalId, InvalidArgumentError | BasicError> {
  try {
    const plain = UTF8ArrToStr(base64StringToArray(value));
    const [typename, id, ...rest] = plain.split(":");
    if (rest.length > 0) {
      return Err(
        new InvalidArgumentError(
          "GlobalId can only parse strings with one colon"
        )
      );
    }
    if (!typename || !id) {
      return Err(
        new InvalidArgumentError("GlobalId can only parse strings with a colon")
      );
    }
    return Ok({ typename, id });
  } catch (error) {
    return Err(toBasicError(error));
  }
}

export function assertGlobalId(
  value: unknown
): Result<GlobalId, InvalidArgumentError> {
  return !isGlobalId(value)
    ? Err(
        new InvalidArgumentError(`${debugStringify(value)} is not a global ID`)
      )
    : Ok(value);
}

export function serializeGlobalId(value: GlobalId): string {
  return arrayToBase64String(strToUTF8Arr(`${value.typename}:${value.id}`));
}

export function isGlobalId(value: unknown): value is GlobalId {
  if (typeof value === "object") {
    if (
      value &&
      typeof value === "object" &&
      "typename" in value &&
      "id" in value
    ) {
      const { typename, id } = value;
      if (typeof typename !== "string" || typeof id !== "string") {
        return false;
      }
      return true;
    }
  }
  return false;
}

export const GlobalIdScalar = new GraphQLScalarType({
  name: "GlobalId",
  description: "GlobalId custom scalar type",
  extensions: {},
  parseValue(value): { typename: string; id: string } {
    if (typeof value === "object") {
      if (
        value &&
        typeof value === "object" &&
        "typename" in value &&
        "id" in value
      ) {
        const { typename, id } = value;
        if (typeof typename !== "string" || typeof id !== "string") {
          throw new TypeError(
            "GlobalIdScalar can only parse objects with typename and id as strings"
          );
        }
        return { typename, id };
      } else {
        throw new TypeError(
          "GlobalIdScalar can only parse objects with typename and id"
        );
      }
    } else if (typeof value === "string") {
      const parsed = parseGlobalId(value);
      if (parsed.isErr()) {
        throw new TypeError(parsed.error.message);
      }
      if (!uuidRegex.test(parsed.value.id)) {
        throw new TypeError("GlobalIdScalar can only parse valid UUIDs");
      }
      return parsed.value;
    } else {
      throw new TypeError("GlobalIdScalar can only parse strings or objects");
    }
  },
  serialize(value): string {
    if (typeof value === "object") {
      if (
        value &&
        typeof value === "object" &&
        "typename" in value &&
        "id" in value
      ) {
        const { typename, id } = value;
        if (typeof typename !== "string" || typeof id !== "string") {
          throw new TypeError(
            "GlobalIdScalar can only serialize objects with typename and id as strings"
          );
        }
        return serializeGlobalId({ typename, id });
      } else {
        throw new TypeError(
          "GlobalIdScalar can only serialize objects with typename and id"
        );
      }
    } else {
      throw new TypeError("GlobalIdScalar can only serialize objects");
    }
  },
  parseLiteral(ast): { typename: string; id: string } {
    if (ast.kind === Kind.STRING) {
      const plain = UTF8ArrToStr(base64StringToArray(ast.value));
      const [typename, id, ...rest] = plain.split(":");
      if (rest.length > 0) {
        throw new TypeError(
          "GlobalIdScalar can only parse strings with one colon"
        );
      }
      if (!typename || !id) {
        throw new TypeError(
          "GlobalIdScalar can only parse strings with a colon"
        );
      }
      return { typename, id };
    } else {
      throw new TypeError(
        "GlobalIdScalar can only parse literal string values"
      );
    }
  },
});
