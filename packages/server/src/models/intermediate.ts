import type { NonUndefined } from "utility-types";

declare const CoreIntermediateProperty: unique symbol;
declare const ImportantIntermediateProperty: unique symbol;

/**
 * A property that is present on all scopes (i.e. uuid)
 * Also marks as a ImportantProperty
 */
export type CoreProperty<T> = ImportantProperty<T> & {
  [CoreIntermediateProperty]?: true;
};

/**
 * A property that is required for conversion to a resource
 */
export type ImportantProperty<T> = T & {
  [ImportantIntermediateProperty]?: true;
};

type BrandRequired<T, Brand extends symbol> = {
  [Key in keyof T as IsBranded<T[Key], Brand> extends true
    ? Key
    : never]-?: NonUndefined<T[Key]>;
} & {
  [Key in keyof T as IsBranded<T[Key], Brand> extends true
    ? never
    : Key]+?: T[Key];
};

/**
 * Same as T except any properties that are branded as core are required
 */
export type CoreRequired<T> = StripBrands<
  BrandRequired<T, typeof CoreIntermediateProperty>
>;

/**
 * Same as T except any properties that are branded as resources are required
 */
export type ImportantRequired<T> = StripBrands<
  BrandRequired<T, typeof ImportantIntermediateProperty>
>;

export type StripBrands<T> = {
  [Key in keyof T]: T[Key] extends CoreProperty<infer U>
    ? U
    : T[Key] extends ImportantProperty<infer U>
    ? U
    : T[Key];
};

/**
 * Type will be true is T is branded with Brand, false otherwise
 *
 * @see https://github.com/sequelize/sequelize/blob/0338d26680a4393c1eb80188dda22557534389f9/packages/core/src/model.d.ts#LL3120C10-L3120C10
 * @license MIT
 * Copyright (c) 2014-present Sequelize Authors
 */
// How this works:
// - `A extends B` will be true if A has *at least* all the properties of B
// - If we do `A extends Omit<A, Checked>` - the result will only be true if A did not have Checked to begin with
// - So if we want to check if T is branded, we remove the brand, and check if they list of keys is still the same.
// we exclude Null & Undefined so "field: Brand<value> | null" is still detected as branded
// this is important because "Brand<value | null>" are transformed into "Brand<value> | null" to not break null & undefined
type IsBranded<
  T,
  Brand extends symbol
> = keyof NonNullable<T> extends keyof Omit<NonNullable<T>, Brand>
  ? false
  : true;
