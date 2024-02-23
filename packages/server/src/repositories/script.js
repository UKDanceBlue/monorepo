import fs from "fs";
import path from "path";

for (const folder of [
  "event",
  "image",
  "membership",
  "notification",
  "pointEntry",
  "pointOpportunity",
  "team",
]) {
  const upperFolder = folder.charAt(0).toUpperCase() + folder.slice(1);

  console.log(`Replacing files for ${folder}`);

  // Folder name
  const folderPath = path.resolve(folder);

  fs.writeFileSync(
    path.join(folderPath, `${upperFolder}Repository.ts`),
    `
import { Prisma, PrismaClient } from "@prisma/client";
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

type Unique${upperFolder}Param = { id: number } | { uuid: string };

@Service()
export class ${upperFolder}Repository {
  constructor(
    private prisma: PrismaClient,
    ) {}

    find${upperFolder}ByUnique(param: Unique${upperFolder}Param) {
      return this.prisma.${folder}.findUnique({where: param});
    }

    list${upperFolder}({
      filters,
      order,
      skip,
      take,
    }: {
      filters?: readonly ${upperFolder}Filters[] | undefined | null;
      order?: readonly [key: string, sort: SortDirection][] | undefined | null;
      skip?: number | undefined | null;
      take?: number | undefined | null;
    }) {
      const where = build${upperFolder}Where(filters);
      const orderBy = build${upperFolder}Order(order);

      return this.prisma.${folder}.findMany({
        where,
        orderBy,
        skip: skip ?? undefined,
        take: take ?? undefined,
      });
    }

    count${upperFolder}({
      filters,
    }: {
      filters?: readonly ${upperFolder}Filters[] | undefined | null;
    }) {
      const where = build${upperFolder}Where(filters);

      return this.prisma.${folder}.count({
        where,
      });
    }

    create${upperFolder}(data: Prisma.${upperFolder}CreateInput) {
      return this.prisma.${folder}.create({ data });
    }

    update${upperFolder}(param: Unique${upperFolder}Param, data: Prisma.${upperFolder}UpdateInput) {
      try {
        return this.prisma.${folder}.update({ where: param, data });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return null;
        } else {
          throw error;
        }
      }
    }

    delete${upperFolder}(param: Unique${upperFolder}Param) {
      try {
        return this.prisma.${folder}.delete({ where: param });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return null;
        } else {
          throw error;
        }
      }
    }
}`
  );

  fs.writeFileSync(
    path.join(folderPath, `${folder}RepositoryUtils.ts`),
    `import type { Prisma } from "@prisma/client";
import { SortDirection } from "@ukdanceblue/common";

import type { ${upperFolder}Filters } from "./${upperFolder}Repository.ts";

export function build${upperFolder}Order(
  order: readonly [key: string, sort: SortDirection][] | null | undefined
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
  filters: readonly ${upperFolder}Filters[] | null | undefined
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
