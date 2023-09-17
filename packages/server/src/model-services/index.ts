// Import all files in same directory ending with "Service.ts"
// Use async import to allow for dynamic import

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = join(fileURLToPath(import.meta.url), "..");

const files = await readdir(__dirname);

await Promise.all(
  files
    .filter((file) => file.endsWith("Service.js"))
    .map(async (file) => {
      await import(join(__dirname, file));
    })
);