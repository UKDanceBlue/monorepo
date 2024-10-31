import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const folder = "packages/mobile/src/graphql";
const files = readdirSync(folder);

for (const file of files) {
  const content = readFileSync(join(folder, file), "utf8");
  const newContent = content
    .replace("from './graphql.js';", "from './graphql';")
    .replace("from './fragment-masking.js'", "from './fragment-masking'")
    .replace("from './gql.js';", "from './gql';")
    .replace('from "./graphql.js";', 'from "./graphql";')
    .replace('from "./fragment-masking.js"', 'from "./fragment-masking"')
    .replace('from "./gql.js";', 'from "./gql";')
    .replace(
      "/* eslint-disable */",
      `/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable unicorn/prefer-export-from */
/* eslint-disable sort-imports/exports */`
    );
  writeFileSync(join(folder, file), newContent);
}
