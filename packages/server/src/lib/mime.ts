import {
  collectHttpQuotedString,
  isHttpQuotedStringTokenCodePoint,
  isHttpTokenCodePoint,
  isHttpWhitespace,
  trimHttpWhitespace,
} from "./whatwg.js";

/**
 * Represents a MIME type.
 *
 * @see https://mimesniff.spec.whatwg.org/#mime-type-representation
 */
interface MimeType {
  type: string;
  subtype: string;
  parameters: [key: string, value: string][];
}

/**
 * Parse a MIME type string.
 *
 * @see https://mimesniff.spec.whatwg.org/#parsing-a-mime-type
 */
export function parseMimeType(input: string): MimeType {
  /* type */

  // Remove any leading and trailing HTTP whitespace from input.
  input = trimHttpWhitespace(input);
  // Let position be a position variable for input, initially pointing at the start of input.
  let position = 0;
  // Let type be the result of collecting a sequence of code points that are not U+002F (/) from input, given position.
  let type = "";
  for (; position < input.length; position++) {
    if (input[position] === "/") {
      break;
    }
    type += input[position];
  }
  //  If type is the empty string or does not solely contain HTTP token code points, then return failure.
  if (type.length === 0) {
    throw new Error("Invalid MIME type (type is empty)");
  } else {
    for (let i = 0; i < type.length; i++) {
      if (!isHttpTokenCodePoint(type.codePointAt(i))) {
        throw new Error(
          `Invalid MIME type (type contains invalid characters: '${type[i]
            ?.charCodeAt(0)
            .toString(16)}' at position ${i})`
        );
      }
    }
  }

  // if position is past the end of input, then return failure.
  if (position >= input.length) {
    throw new Error("Invalid MIME type (missing subtype)");
  }
  // Advance position by 1. (This skips past U+002F (/).)
  position++;

  /* subtype */

  // Let subtype be the result of collecting a sequence of code points that are not U+003B (;) from input, given position.
  let subtype = "";
  for (; position < input.length; position++) {
    if (input[position] === ";") {
      break;
    }
    subtype += input[position];
  }
  // Remove any trailing HTTP whitespace from subtype.
  subtype = trimHttpWhitespace(subtype, "end");
  // If subtype is the empty string or does not solely contain HTTP token code points, then return failure.
  if (subtype.length === 0) {
    throw new Error("Invalid MIME type (subtype is empty)");
  }
  for (let i = 0; i < subtype.length; i++) {
    if (!isHttpTokenCodePoint(subtype.codePointAt(i))) {
      throw new Error(
        `Invalid MIME type (subtype contains invalid characters: '${subtype[i]
          ?.charCodeAt(0)
          .toString(16)}' at position ${i})`
      );
    }
  }

  // Let mimeType be a new MIME type record whose type is type, in ASCII lowercase, and subtype is subtype, in ASCII lowercase.
  const mimeType: MimeType = {
    type: type.toLowerCase(),
    subtype: subtype.toLowerCase(),
    parameters: [],
  };

  /* parameters */

  // While position is not past the end of input:
  while (position < input.length) {
    /* parameterName */

    // Advance position by 1. (This skips past U+003B (;).)
    position++;
    // Consume HTTP whitespace from input, given position.
    while (isHttpWhitespace(input.codePointAt(position))) {
      position++;
    }
    let parameterName = "";
    // Let parameterName be the result of collecting a sequence of code points that are not U+003B (;) or U+003D (=) from input, given position.
    for (; position < input.length; position++) {
      if (input[position] === ";" || input[position] === "=") {
        break;
      }
      parameterName += input[position];
    }
    // Set parameterName to parameterName, in ASCII lowercase.
    parameterName = parameterName.toLowerCase();
    // If position is not past the end of input, then:
    if (position < input.length) {
      // If the code point at position within input is U+003B (;), then continue.
      if (input[position] === ";") {
        continue;
      }
      // Else, advance position by 1. (This skips past U+003D (=).)
      else {
        position++;
      }
    } else {
      // If position is past the end of input, then break.
      break;
    }

    /* parameterValue */

    // Let parameterValue be null.
    let parameterValue = null;
    if (input.codePointAt(position) === 0x22) {
      // If the code point at position within input is U+0022 ("), then:
      // Set parameterValue to the result of collecting an HTTP quoted string from input, given position and true.
      const { output, position: newPosition } = collectHttpQuotedString(
        input,
        position,
        true
      );
      parameterValue = output;
      position = newPosition;
      // Collect a sequence of code points that are not U+003B (;) from input, given position.
      for (; position < input.length; position++) {
        if (input[position] === ";") {
          break;
        }
      }
    } else {
      // Otherwise:
      // Set parameterValue to the result of collecting a sequence of code points that are not U+003B (;) from input, given position.
      parameterValue = "";
      for (; position < input.length; position++) {
        if (input[position] === ";") {
          break;
        }
        parameterValue += input[position];
      }
      // Remove any trailing HTTP whitespace from parameterValue.
      parameterValue = trimHttpWhitespace(parameterValue, "end");
      // If parameterValue is the empty string, then continue.
      if (parameterValue.length === 0) {
        continue;
      }
    }

    // If all of the following are true
    let ok = true;
    // parameterName is not the empty string
    if (parameterName === "") {
      ok = false;
    }
    // parameterName solely contains HTTP token code points
    for (let i = 0; i < parameterName.length; i++) {
      if (!isHttpTokenCodePoint(parameterName.codePointAt(i))) {
        ok = false;
        break;
      }
    }
    // parameterValue solely contains HTTP quoted-string token code points
    for (let i = 0; i < parameterValue.length; i++) {
      if (!isHttpQuotedStringTokenCodePoint(parameterValue.codePointAt(i))) {
        ok = false;
        break;
      }
    }
    // mimeType’s parameters[parameterName] does not exist
    if (ok && !mimeType.parameters.some(([key]) => key === parameterName)) {
      // then set mimeType’s parameters[parameterName] to parameterValue.
      mimeType.parameters.push([parameterName, parameterValue]);
    }
  }

  // Return mimeType.
  return mimeType;
}

/**
 * Serialize a MIME type.
 *
 * @see https://mimesniff.spec.whatwg.org/#serializing-a-mime-type
 */
export function serializeMimeType(mimeType: MimeType): string {
  // Let serialization be the concatenation of mimeType’s type, U+002F (/), and mimeType’s subtype.
  let serialization = `${mimeType.type}/${mimeType.subtype}`;
  // For each name → value of mimeType’s parameters:
  for (const [name, value] of mimeType.parameters) {
    // Append U+003B (;) to serialization.
    serialization += ";";
    // Append name to serialization.
    serialization += name;
    // Append U+003D (=) to serialization.
    serialization += "=";
    // If value does not solely contain HTTP token code points or value is the empty string, then:
    if (
      ![...value].every((char) => isHttpTokenCodePoint(char.codePointAt(0))) ||
      value === ""
    ) {
      // Append U+0022 (") to serialization.
      serialization += '"';
      // Precede each occurrence of U+0022 (") or U+005C (\) in value with U+005C (\).
      for (const char of value) {
        if (char === '"' || char === "\\") {
          serialization += "\\";
        }
        serialization += char;
      }
      // Append U+0022 (") to value.
      serialization += '"';
    } else {
      // Otherwise:
      // Append value to serialization.
      serialization += value;
    }
  }

  // Return serialization.
  return serialization;
}
