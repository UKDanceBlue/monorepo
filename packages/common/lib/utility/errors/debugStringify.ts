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

  if (typeof value === "object" && !(value instanceof Error)) {
    if (value === null) {
      return "[null]";
    }

    try {
      const cache = new Set<unknown>();
      return JSON.stringify(
        value,
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
      );
    } catch {
      return String(value as unknown);
    }
  } else {
    switch (typeof value) {
      case "undefined": {
        return "[undefined]";
      }
      case "function": {
        return `[function: ${value.name}]`;
      }
      default: {
        return String(value as unknown);
      }
    }
  }
}
