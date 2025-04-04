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

export function ordinalString(string: number) {
  const j = string % 10,
    k = string % 100;
  if (j === 1 && k !== 11) {
    return `${string}st`;
  }
  if (j === 2 && k !== 12) {
    return `${string}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${string}rd`;
  }
  return `${string}th`;
}
