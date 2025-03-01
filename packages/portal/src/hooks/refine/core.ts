import type { BaseKey } from "@refinedev/core";

import type { RefineResourceName } from "#config/refine/resources.tsx";

export type PropsWithRequired<T> = T extends { id?: BaseKey }
  ? Omit<T, "id" | "resource"> & { id: string; resource: RefineResourceName }
  : T extends { resource?: string }
    ? Omit<T, "resource"> & { resource: RefineResourceName }
    : T;
