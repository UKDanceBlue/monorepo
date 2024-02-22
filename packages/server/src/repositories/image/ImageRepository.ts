
import { PrismaClient } from "@prisma/client";
import type { SortDirection } from "@ukdanceblue/common";
import { Service } from "typedi";

import type { FilterItems } from "../../lib/prisma-utils/gqlFilterToPrismaFilter.js";

import { buildImageOrder, buildImageWhere } from "./imageRepositoryUtils.js";

const imageBooleanKeys = [] as const;
type ImageBooleanKey = (typeof imageBooleanKeys)[number];

const imageDateKeys = ["createdAt", "updatedAt"] as const;
type ImageDateKey = (typeof imageDateKeys)[number];

const imageIsNullKeys = [] as const;
type ImageIsNullKey = (typeof imageIsNullKeys)[number];

const imageNumericKeys = [] as const;
type ImageNumericKey = (typeof imageNumericKeys)[number];

const imageOneOfKeys = [] as const;
type ImageOneOfKey = (typeof imageOneOfKeys)[number];

const imageStringKeys = [] as const;
type ImageStringKey = (typeof imageStringKeys)[number];

export type ImageFilters = FilterItems<
  ImageBooleanKey,
  ImageDateKey,
  ImageIsNullKey,
  ImageNumericKey,
  ImageOneOfKey,
  ImageStringKey
>;

@Service()
export class ImageRepository {
  constructor(
    private prisma: PrismaClient,
    ) {}
}