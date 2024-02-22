import fs from "fs";
import path from "path";

const dir = fs.readdirSync(".");

for (const folder of dir.filter((f) => fs.lstatSync(f).isDirectory())) {
  const upperFolder = folder.charAt(0).toUpperCase() + folder.slice(1);
  // skip if non-empty
  if (fs.readdirSync(folder).length > 0) {
    continue;
  }

  console.log(`Creating files for ${folder}`);

  // Folder name
  const folderPath = path.resolve(folder);

  fs.writeFileSync(
    path.join(folderPath, `${folder}ModelToResource.ts`),
    `import type { ${upperFolder} } from "@prisma/client";
import { ${upperFolder}Resource } from "@ukdanceblue/common";

export function ${folder}ModelToResource(${folder}Model: ${upperFolder}): ${upperFolder}Resource {
  return ${upperFolder}Resource.init({
    uuid: ${folder}Model.uuid,
  });
}
`
  );

  fs.writeFileSync(
    path.join(folderPath, `${upperFolder}Repository.ts`),
    `
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { build${upperFolder}Order, build${upperFolder}Where } from "./${folder}RepositoryUtils.js";

const ${folder}BooleanKeys = [] as const;
type ${upperFolder}BooleanKey = (typeof ${folder}BooleanKeys)[number];

const ${folder}DateKeys = ["createdAt", "updatedAt"] as const;
type ${upperFolder}DateKey = (typeof ${folder}DateKeys)[number];

const ${folder}IsNullKeys = [] as const;
type ${upperFolder}IsNullKey = (typeof ${folder}IsNullKeys)[number];

const ${folder}NumericKeys = [] as const;
type ${upperFolder}NumericKey = (typeof ${folder}NumericKeys)[number];

const ${folder}OneOfKeys = [] as const;
type ${upperFolder}OneOfKey = (typeof ${folder}OneOfKeys)[number];

const ${folder}StringKeys = [] as const;
type ${upperFolder}StringKey = (typeof ${folder}StringKeys)[number];

export type ${upperFolder}Filters = FilterItems<
  ${upperFolder}BooleanKey,
  ${upperFolder}DateKey,
  ${upperFolder}IsNullKey,
  ${upperFolder}NumericKey,
  ${upperFolder}OneOfKey,
  ${upperFolder}StringKey
>;

@Service()
export class ${upperFolder}Repository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}`
  );

  fs.writeFileSync(
    path.join(folderPath, `${folder}RepositoryUtils.ts`),
    `import type { ${upperFolder}Filters } from "./${upperFolder}Repository.ts";
import type { ${upperFolder}, Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";
import { buildFilter } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

export function build${upperFolder}Order(
  order: string,
  direction: SortDirection
) {
  const orderBy: Prisma.${upperFolder}OrderByWithRelationInput = {};

  for (const [key, sort] of order ?? []) {
    switch (key) {
      case "createdAt":
      case "updatedAt": {
        orderBy[key] = sort === SortDirection.ASCENDING ? "asc" : "desc";
        break;
      }
      default: {
        throw new Error(\`Unsupported sort key: \${key}\`);
      }
    }
  }
  return orderBy;
}

export function build${upperFolder}Where(
  filters: ${upperFolder}Filters[]
) {
  const where: Prisma.${upperFolder}WhereInput = {};

  for (const filter of filters ?? []) {
    switch (filter.field) {
      default: {
        throw new Error(\`Unsupported filter key: \${filter.field}\`);
      }
    }
  }
  return where;
}
`
  );
}
