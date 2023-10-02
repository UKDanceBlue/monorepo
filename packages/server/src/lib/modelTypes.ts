import { Model } from "@sequelize/core";
import type { CreationOptional } from "@sequelize/core";
import type { RequiredKeys } from "utility-types";

import type {
  CoreRequired,
  ImportantRequired,
} from "../models/intermediate.js";

export abstract class IntermediateClass<
  R extends object,
  SubClass extends object & IntermediateClass<R, SubClass>,
> {
  toResource(): R {
    throw new Error(`toResource() not supported on ${this.constructor.name}`);
  }

  private readonly corePropertyNames: RequiredKeys<CoreRequired<SubClass>>[];
  private readonly importantPropertyNames: (Exclude<
    RequiredKeys<ImportantRequired<SubClass>>,
    RequiredKeys<CoreRequired<SubClass>>
  > &
    string)[];

  /**
   * Through the magic of TypeScript, this class will check if the
   * required properties are present and provide accurate type
   * guards for the properties.
   *
   * However, this only works if ALL of the properties that are
   * branded as `CoreProperty` or `ImportantProperty` are passed to
   * this constructor. If you miss one, the type guards will
   * silently become inaccurate.
   *
   * Intellisense should show every property that is branded as
   * `CoreProperty` or `ImportantProperty` as a parameter to this
   * constructor, just make sure they are all included.
   *
   * @param corePropertyNames The names of all properties that are branded as `CoreProperty`
   * @param importantPropertyNames The names of all properties that are branded as `ImportantProperty`
   */
  constructor(
    corePropertyNames: RequiredKeys<CoreRequired<SubClass>>[],
    importantPropertyNames: (Exclude<
      RequiredKeys<ImportantRequired<SubClass>>,
      RequiredKeys<CoreRequired<SubClass>>
    > &
      string)[]
  ) {
    this.corePropertyNames = corePropertyNames;
    this.importantPropertyNames = importantPropertyNames;
  }

  public hasCoreProperties(
    this: SubClass,
    verbose?: false
  ): this is CoreRequired<SubClass>;
  public hasCoreProperties(this: SubClass, verbose: true): string[];
  public hasCoreProperties(
    this: SubClass,
    verbose = false
  ): string[] | boolean {
    const errors: string[] = [];

    for (const propertyName of this.corePropertyNames) {
      if (
        (this as Record<typeof propertyName, unknown>)[propertyName] ===
        undefined
      ) {
        errors.push(String(propertyName));
      }
    }

    return verbose ? errors : errors.length === 0;
  }

  public hasImportantProperties(
    this: SubClass,
    verbose?: false
  ): this is ImportantRequired<SubClass>;
  public hasImportantProperties(this: SubClass, verbose?: true): string[];
  public hasImportantProperties(
    this: SubClass,
    verbose = false
  ): string[] | boolean {
    const errors: string[] = [];

    for (const propertyName of this.importantPropertyNames) {
      if (
        (this as Record<typeof propertyName, unknown>)[propertyName] ===
        undefined
      ) {
        errors.push(String(propertyName));
      }
    }

    return verbose ? errors : errors.length === 0;
  }
}

export class WithTimestamps<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TModelAttributes extends {} = never,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
  declare readonly deletedAt: CreationOptional<Date | null>;
}
