import type { ValidationArguments, ValidationOptions } from "class-validator";
import { registerDecorator } from "class-validator";
import { DateTime } from "luxon";

export function IsBeforeDateTime(
  property: string,
  orEqual = false,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isBeforeDateTime",
      target: object.constructor,
      propertyName,
      constraints: [property, orEqual],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName, orEqual] = args.constraints as [
            string,
            boolean,
          ];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          return (
            DateTime.isDateTime(value) &&
            DateTime.isDateTime(relatedValue) &&
            (orEqual ? value <= relatedValue : value < relatedValue)
          );
        },
      },
    });
  };
}

export function IsAfterDateTime(
  property: string,
  orEqual = false,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isAfterDateTime",
      target: object.constructor,
      propertyName,
      constraints: [property, orEqual],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName, orEqual] = args.constraints as [
            string,
            boolean,
          ];
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ];
          return (
            DateTime.isDateTime(value) &&
            DateTime.isDateTime(relatedValue) &&
            (orEqual ? value >= relatedValue : value > relatedValue)
          );
        },
      },
    });
  };
}
