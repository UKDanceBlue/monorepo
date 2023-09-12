import type { EditArray } from "@ukdanceblue/db-app-common";
import { EditType } from "@ukdanceblue/db-app-common";
import type { AlternativesSchema, Schema } from "joi";
import Joi from "joi";

/**
 * Converts a simple joi validator for an array's item into a validator for
 * an EditArray (used in edit routes). Does not make the array optional or
 * nullable, this should be done externally.
 *
 * @param base The base validator for the array's item
 * @return The validator for the EditArray
 */
export function makeEditArrayValidator<T>(
  base: Schema<T>
): AlternativesSchema<EditArray<T[]>> {
  return Joi.alternatives<EditArray<T[]>>(
    Joi.object({
      type: Joi.valid(EditType.MODIFY).required(),
      add: Joi.array().items(base).required(),
      remove: Joi.array().items(base).required(),
    }),
    Joi.object({
      type: Joi.valid(EditType.REPLACE).required(),
      set: Joi.array().items(base).required(),
    })
  );
}
