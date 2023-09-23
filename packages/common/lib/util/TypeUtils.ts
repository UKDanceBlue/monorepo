export type SimplePrimitive = string | number | boolean;
export type Primitive = SimplePrimitive | null | undefined;

export function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}

export interface PrimitiveObject {
  [key: string | number | symbol]:
  | PrimitiveObject
  | PrimitiveObject[]
  | Primitive
  | Primitive[];
}

/**
 * A primitive object that only has one level of nesting, but allows for arrays
 *
 * @see PrimitiveObject
 */
export type ShallowPrimitiveObject =
  | Primitive
  | Primitive[]
  | Record<string | number | symbol, Primitive | Primitive[]>;

function isPrimitiveObjectRecurse(
  value: unknown
): value is PrimitiveObject | Primitive {
  if (isPrimitive(value)) {
    return true;
  } else if (typeof value === "object" && value !== null) {
    for (const key in value) {
      if (
        !isPrimitiveObjectRecurse((value as Record<typeof key, unknown>)[key])
      ) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

export function isPrimitiveObject(value: unknown): value is PrimitiveObject {
  if (typeof value !== "object" || value === null) {
    return false;
  } else {
    for (const key in value) {
      if (
        !isPrimitiveObjectRecurse((value as Record<typeof key, unknown>)[key])
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * This is a list of all the type strings produced by `typeof` that we allow in checkType.
 * All values are lowercase.
 *
 * function is not included because it is deceptive and doesn't tell you
 * very much about the type of the value.
 */
export type TypeOfTypeNames =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "bigint"
  | "string"
  | "symbol";

/**
 * This type maps typeof strings to their corresponding types.
 */
export type TypeOfMap<T extends TypeOfTypeNames> = T extends "undefined"
  ? undefined
  : T extends "object"
  ? object
  : T extends "boolean"
  ? boolean
  : T extends "number"
  ? number
  : T extends "bigint"
  ? bigint
  : T extends "string"
  ? string
  : T extends "symbol"
  ? symbol
  : never;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
  ? RecursivePartial<U>[]
  : T[P] extends object
  ? RecursivePartial<T[P]>
  : T[P];
};
export type OptionalNullOrUndefined<T> = Partial<{
  [K in keyof T]: NonNullable<T[K]> | null | undefined;
}>;

export type SelfOrArray<T> = T | T[];

export type RecursiveArray<T> = T | RecursiveArray<T>[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type Abstract<T> = Function & { prototype: T };
export type Constructor<T> = new (...args: unknown[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;

export type OptionalToNullable<T> = T extends object
  ? {
    [K in keyof T]: T[K] extends NonNullable<T[K]> ? T[K] : T[K] | null;
  }
  : T extends NonNullable<T>
  ? T
  : T | null;

export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

type NullishToOptionalPart1<T extends object> = Partial<
  OmitNever<{
    [K in keyof T]: T[K] extends NonNullable<T[K]>
    ? never
    : Exclude<T[K], null | undefined>;
  }>
>;

type NullishToOptionalPart2<T extends object> = OmitNever<{
  [K in keyof T]: T[K] extends NonNullable<T[K]> ? T[K] : never;
}>;

export type NullishToOptional<T extends object> = NullishToOptionalPart1<T> &
  NullishToOptionalPart2<T>;

export type ExcludeValues<T extends object, V> = OmitNever<{
  [K in keyof T]: Exclude<T[K], V>;
}>;

export function isArrayOf<TypeName extends TypeOfTypeNames>(
  value: TypeOfMap<TypeName>[] | unknown[],
  type: TypeName
): value is TypeOfMap<TypeName>[] {
  return typeof value[0] === type;
}

export const Comparator = {
  EQUALS: "eq",
  GREATER_THAN: "gt",
  LESS_THAN: "lt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  LESS_THAN_OR_EQUAL_TO: "lte",
  INCLUDES: "incl",
} as const;
export type Comparator = typeof Comparator[keyof typeof Comparator];

export const StringComparator = {
  EQUALS: "eq",
  INCLUDES: "incl",
} as const;
export type StringComparator = typeof StringComparator[keyof typeof StringComparator];

export const NumericComparator = {
  EQUALS: "eq",
  GREATER_THAN: "gt",
  LESS_THAN: "lt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  LESS_THAN_OR_EQUAL_TO: "lte",
} as const;
export type NumericComparator = typeof NumericComparator[keyof typeof NumericComparator];

export const EqualityComparator = {
  EQUALS: "eq",
} as const;
export type EqualityComparator = typeof EqualityComparator[keyof typeof EqualityComparator];

() => {
  const stringComparator: Comparator = "" as StringComparator;
  const numericComparator: Comparator = "" as NumericComparator;
  const equalityComparator: Comparator = "" as EqualityComparator;

  throw new Error("This function should never be exported");
}
