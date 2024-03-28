const sparseHttpTokenCodePoints = new Set([
  0x21, 0x23, 0x24, 0x25, 0x26, 0x27, 0x2a, 0x2b, 0x2d, 0x2e, 0x5e, 0x5f, 0x60,
  0x7c, 0x7e,
]);
export function isHttpTokenCodePoint(codePoint: number | undefined): boolean {
  if (codePoint === undefined) return false;
  // First check if alphanumeric
  if (codePoint >= 0x30 && codePoint <= 0x39) return true;
  if (codePoint >= 0x41 && codePoint <= 0x5a) return true;
  if (codePoint >= 0x61 && codePoint <= 0x7a) return true;
  // Then check if in the list
  return sparseHttpTokenCodePoints.has(codePoint);
}
export function isHttpQuotedStringTokenCodePoint(
  codePoint: number | undefined
): boolean {
  if (codePoint === undefined) return false;
  if (codePoint === 0x09) return true;
  if (codePoint >= 0x20 && codePoint <= 0x7e) return true;
  if (codePoint >= 0x80 && codePoint <= 0xff) return true;
  return false;
}
export function isHttpWhitespace(codePoint: number | undefined): boolean {
  if (codePoint === undefined) return false;
  return (
    codePoint === 0x0a || // LF
    codePoint === 0x0d || // CR
    codePoint === 0x09 || // TAB
    codePoint === 0x20 // SPACE
  );
}
export function trimHttpWhitespace(
  input: string,
  direction: "start" | "end" | "both" = "both"
): string {
  let start = 0;
  let end = input.length;
  if (direction === "start" || direction === "both") {
    while (start < end && isHttpWhitespace(input.codePointAt(start))) {
      start++;
    }
  }
  if (direction === "end" || direction === "both") {
    while (end > start && isHttpWhitespace(input.codePointAt(end - 1))) {
      end--;
    }
  }
  return input.slice(start, end);
}

export function collectHttpQuotedString(
  input: string,
  position: number,
  extractValue = false
): { output: string; position: number } {
  const positionStart = position;
  let value = "";

  // Assert: the code point at position within input is U+0022 (").
  if (input.codePointAt(position) !== 0x22) {
    throw new Error('Invalid input. Expected starting quote (").');
  }

  // Advance position by 1.
  position++;

  for (;;) {
    // Append the result of collecting a sequence of code points that are not U+0022 (") or U+005C (\) from input, given position, to value.
    while (
      position < input.length &&
      input.codePointAt(position) !== 0x22 &&
      input.codePointAt(position) !== 0x5c
    ) {
      value += input.charAt(position);
      position++;
    }

    // If position is past the end of input, then break.
    if (position >= input.length) {
      break;
    }

    // Let quoteOrBackslash be the code point at position within input.
    const quoteOrBackslash = input.codePointAt(position);

    // Advance position by 1.
    position++;

    if (quoteOrBackslash === 0x5c) {
      // If quoteOrBackslash is U+005C (\), then:
      if (position >= input.length) {
        // If position is past the end of input, then append U+005C (\) to value and break.
        value += "\\";
        break;
      }

      // Append the code point at position within input to value.
      value += input.charAt(position);
      // Advance position by 1.
      position++;
    } else {
      // Otherwise:
      // Assert: quoteOrBackslash is U+0022 (").
      // Break.
      break;
    }
  }

  return extractValue
    ? // If extract-value is true, then return value.
      { output: value, position }
    : // Return the code points from positionStart to position, inclusive, within input.
      { output: input.slice(positionStart, position + 1), position };
}
