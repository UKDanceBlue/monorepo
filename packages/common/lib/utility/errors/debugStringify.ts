// eslint-disable-next-line @typescript-eslint/consistent-type-imports
let inspect: typeof import("util").inspect | undefined = undefined;

try {
  // eslint-disable-next-line unicorn/prefer-top-level-await
  void import("util").then((mod) => {
    inspect = mod.inspect;
  });
} catch {
  // ignore
}

export function debugStringify(value: unknown, colors = false): string {
  if (inspect) {
    return inspect(value, { depth: 2, colors });
  }

  if (typeof value === "object" && value && !(value instanceof Error)) {
    try {
      const cache = new Set<unknown>();
      return (
        JSON.stringify(
          value,
          //@ts-expect-error - The declaration is weird
          (_key, value: unknown) => {
            if (value !== null && typeof value === "object") {
              // Duplicate reference found, discard key
              if (cache.has(value)) return;

              // Store value in our collection
              cache.add(value);
            }
            return value;
          },
          2
        ) ?? "[UNKNOWN]"
      );
    } catch {
      return String(value);
    }
  } else {
    return String(value);
  }
}
