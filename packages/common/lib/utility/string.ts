const whitespace = /\s/;

export function cleanTruncateString(str: string, maxLength: number): string {
  let truncated = str.slice(0, maxLength);
  const newLineIndex = truncated.indexOf("\n");
  if (newLineIndex !== -1) {
    truncated = truncated.slice(0, newLineIndex);
  } else {
    for (let i = truncated.length - 1; i >= 0; i--) {
      if (whitespace.test(truncated[i]!)) {
        truncated = truncated.slice(0, i);
        break;
      }
    }
  }
  const lastChar = truncated[truncated.length - 1];
  if (lastChar === "." || lastChar === "!" || lastChar === "?") {
    return truncated;
  }
  if (lastChar === ",") {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated.trimEnd()}…`;
}
