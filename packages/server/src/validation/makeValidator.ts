import type { Schema, ValidationOptions, ValidationResult } from "joi";

/**
 * Creates a validator function for a Joi schema. The validator function
 * takes a body and throws an error if the body is invalid.
 *
 * @param schema The Joi schema to validate the body against
 * @param options The Joi validation options
 * @return A validator function
 */
export function makeValidator<const T>(
  schema: Schema<T>,
  options?: ValidationOptions
): (value: unknown) => ValidationResult<T> {
  return (value: unknown): ValidationResult<T> => {
    const result = schema.validate(value, options);

    if (result.error) {
      throw result.error;
    }

    return result;
  };
}
