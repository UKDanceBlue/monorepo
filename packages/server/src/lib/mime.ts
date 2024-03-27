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

const httpTokenCodePoints = new Set([
  0x21, 0x23, 0x24, 0x26, 0x27, 0x2a, 0x2b, 0x2d, 0x2e, 0x5e, 0x5f, 0x60, 0x7c,
  0x7e,
]);
function isHttpTokenCodePoint(codePoint: number | undefined): boolean {
  if (codePoint === undefined) return false;
  // First check if alphanumeric
  if (codePoint >= 0x30 && codePoint <= 0x39) return true;
  if (codePoint >= 0x41 && codePoint <= 0x5a) return true;
  if (codePoint >= 0x61 && codePoint <= 0x7a) return true;
  // Then check if in the list
  return httpTokenCodePoints.has(codePoint);
}

function isHttpWhitespace(codePoint: number | undefined): boolean {
  if (codePoint === undefined) return false;
  return (
    codePoint === 0x09 ||
    codePoint === 0x20 ||
    codePoint === 0x0a ||
    codePoint === 0x0d
  );
}

function trimHttpWhitespace(input: string): string {
  let start = 0;
  let end = input.length;
  while (start < end && isHttpWhitespace(input.codePointAt(start))) {
    start++;
  }
  while (end > start && isHttpWhitespace(input.codePointAt(end - 1))) {
    end--;
  }
  return input.slice(start, end);
}

/**
 * Parse a MIME type string.
 *
 * @see https://mimesniff.spec.whatwg.org/#parsing-a-mime-type
 */
export function parseMimeType(input: string): MimeType {
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
    // If type is the empty string ...
    if (!isHttpTokenCodePoint(input.codePointAt(position))) {
      throw new Error("Invalid MIME type (type contains invalid characters)");
    }
    type += input[position];
  }
  if (type.length === 0) {
    // ... or does not solely contain HTTP token code points, then return failure.
    throw new Error("Invalid MIME type (type is empty)");
  } else if (position >= input.length) {
    // if position is past the end of input, then return failure.
    throw new Error("Invalid MIME type (missing subtype)");
  }
  // Advance position by 1. (This skips past U+002F (/).)
  position++;

  // Let subtype be the result of collecting a sequence of code points that are not U+003B (;) from input, given position.
  let subtype = "";
  for (; position < input.length; position++) {
    if (input[position] === ";") {
      break;
    }
    // If subtype is the empty string ...
    if (!isHttpTokenCodePoint(input.codePointAt(position))) {
      throw new Error(
        "Invalid MIME type (subtype contains invalid characters)"
      );
    }
    subtype += input[position];
  }
  // Remove any trailing HTTP whitespace from subtype.
  subtype = trimHttpWhitespace(subtype);
  if (subtype.length === 0) {
    // ... or does not solely contain HTTP token code points, then return failure.
    throw new Error("Invalid MIME type (subtype is empty)");
  }

  // Let mimeType be a new MIME type record whose type is type, in ASCII lowercase, and subtype is subtype, in ASCII lowercase.
  const mimeType: MimeType = {
    type: type.toLowerCase(),
    subtype: subtype.toLowerCase(),
    parameters: [],
  };

  // While position is not past the end of input:
  while (position < input.length) {
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
      // If parameterName is the empty string ...
      if (!isHttpTokenCodePoint(input.codePointAt(position))) {
        throw new Error(
          "Invalid MIME type (parameter name contains invalid characters)"
        );
      }
      parameterName += input[position];
    }
    // Set parameterName to parameterName, in ASCII lowercase.
    parameterName = parameterName.toLowerCase();
    if (position < input.length) {
      // If position is not past the end of input, then:
      if (input[position] === ";") {
        // If the code point at position within input is U+003B (;), then continue.
        continue;
      } else {
        // Else, advance position by 1. (This skips past U+003D (=).)
        position++;
      }
    } else {
      // If position is past the end of input, then break.
      break;
    }

    // Let parameterValue be null.
    let parameterValue = null;
    if (input[position] === '"') {
      // If the code point at position within input is U+0022 ("), then:
      // Let value be the empty string.
      parameterValue = "";
      // Assert: the code point at position within input is U+0022 (").
      if (input[position] !== '"') {
        throw new Error(
          `Invalid MIME type (expected quote in parameter value)`
        );
      }
      // Advance position by 1.
      position++;
      // While true:
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
      while (true) {
        // Append the result of collecting a sequence of code points that are not U+0022 (") or U+005C (\) from input, given position, to value.
        for (; position < input.length; position++) {
          if (input[position] === '"' || input[position] === "\\") {
            break;
          }
          parameterValue += input[position];
        }
        // If position is past the end of input, then break.
        if (position >= input.length) {
          break;
        }
        // Let quoteOrBackslash be the code point at position within input.
        const quoteOrBackslash = input[position];
        // Advance position by 1.
        position++;
        if (quoteOrBackslash === "\\") {
          // If quoteOrBackslash is U+005C (\), then:
          if (position >= input.length) {
            // If position is past the end of input, then append U+005C (\) to value and break.
            parameterValue += "\\";
            break;
          }
          // Append the code point at position within input to value.
          parameterValue += input[position];
          // Advance position by 1.
          position++;
        } else {
          // Otherwise:
          // Assert: quoteOrBackslash is U+0022 (").
          if (quoteOrBackslash !== '"') {
            throw new Error(
              "Invalid MIME type (expected quote in parameter value)"
            );
          }
          // Break.
          break;
        }
      }
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
      parameterValue = trimHttpWhitespace(parameterValue);
      // If parameterValue is the empty string, then continue.
      if (parameterValue.length === 0) {
        continue;
      }
    }

    // If all of the following are true
    if (
      // parameterName is not the empty string
      parameterName !== "" &&
      // parameterName solely contains HTTP token code points
      [...parameterName].every((char) =>
        isHttpTokenCodePoint(char.codePointAt(0))
      ) &&
      // parameterValue solely contains HTTP quoted-string token code points
      [...parameterValue].every((char) =>
        isHttpTokenCodePoint(char.codePointAt(0))
      ) &&
      // mimeType’s parameters[parameterName] does not exist
      !mimeType.parameters.some(([key]) => key === parameterName)
    ) {
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
