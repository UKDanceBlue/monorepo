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
    .replace("/* eslint-disable */", "");
  writeFileSync(join(folder, file), newContent);
}
