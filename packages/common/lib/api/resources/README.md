# Resources

## What is a resource?

Resources are the main data containers in the DanceBlue app and server. They
serve as the main way to send data across a codebase. They also include
utilities for validating and (de)serializing themselves.

## How do I define a resource?

A resource needs four things to work:

1. A class that extends Resource

> The class should have all mandatory fields as non-nullable, and all optional
> fields as nullable. It's fields should never be undefined. It's constructor
> should take an initializer object (see requirement 3) and set all fields to
> their corresponding values. It should also have a validateSelf method that
> checks the type and invariants of all fields and a toPlain method that
> converts the resource to a plain object.

2. A plain object interface that extends PlainResourceObject

> The plain object interface should have all fields as either primitives or
> other plain object interfaces. It should never have any fields that are
> instances of Resource. It's keys should be the same as the keys of the
> corresponding initializer interface (see requirement 3).

3. An initializer interface that extends PlainResourceObject

> The initializer interface should have all fields as either primitives or
> resource instances. It's keys do not necessarily need to be the same as the
> properties of the corresponding class (see requirement 1).

4. A static type assertion (and corresponding static methods) that ensures the
   class satisfies ResourceStatic

> The static type assertion should be almost identical to the one in the example
> below. This assertions requires the presence of a static fromPlain method that
> takes a plain object and returns an instance of the class. It does require
> some other static methods, but they are defined in the parent class and should
> not need to be overridden.

## Example

Below is an example of how a resource should be set up

```typescript
import { DateTime, Duration } from "luxon";

import { isArrayOf } from "../../index.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType, checkUnion } from "../../util/resourceValidation.js";

import type { PlainImage } from "./Image.js";
import { ImageResource } from "./Image.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";

export class SomeResource extends Resource {
  resourceId!: string;

  images!: ImageResource[] | string[] | null;

  dates!: DateTime[];

  duration!: Duration | null;

  requiredText!: string;

  optionalText!: string | null;

  constructor({
    resourceId,
    images,
    dates,
    duration,
    requiredText,
    optionalText,
  }: SomeResourceInitializer) {
    super();
    this.resourceId = resourceId;
    this.images = images ?? null;
    this.dates = dates;
    this.duration = duration ?? null;
    this.requiredText = requiredText;
    this.optionalText = optionalText ?? null;
  }

  // Validate the fields of this resource, should check type and invariants
  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.resourceId, errors);
    checkUnion(
      [
        {
          type: "Resource",
          options: {
            classToCheck: ImageResource,
            isArray: true,
          },
        },
        {
          type: "string",
          options: {
            isArray: true,
          },
        },
      ],
      this.images,
      errors,
      { allowNull: true }
    );
    checkType("DateTime", this.dates, errors, { isArray: true });
    if (this.dates.length === 0) {
      errors.push(new ValidationError("dates is empty."));
    }
    if (this.dates.some((o) => !o.isValid)) {
      errors.push(new ValidationError("dates contains invalid dates."));
    }
    checkType("Duration", this.duration, errors, { allowNull: true });
    if (this.duration != null && !this.duration.isValid) {
      errors.push(new ValidationError("duration is invalid."));
    }
    if (this.duration != null && this.duration.as("milliseconds") < 0) {
      errors.push(new ValidationError("duration cannot be negative."));
    }
    checkType("string", this.requiredText, errors);
    checkType("string", this.optionalText, errors, { allowNull: true });
    return errors;
  }

  // Convert an instance of SomeResource to a plain object
  public toPlain(): PlainEvent {
    let images: string[] | PlainImage[] | null = null;
    if (this.images != null) {
      images = isArrayOf(this.images, "string")
        ? this.images
        : this.images.map((i) => i.toPlain());
    }

    return {
      resourceId: this.resourceId,
      images,
      dates: this.dates
        .map((o) => o.toISO())
        .filter((o): o is NonNullable<typeof o> => o != null),
      duration: this.duration?.toISO() ?? null,
      requiredText: this.requiredText,
      optionalText: this.optionalText,
    };
  }

  // Convert a plain object to an instance of SomeResource
  public static fromPlain(plain: PlainEvent): SomeResource {
    let images: ImageResource[] | string[] | null = null;
    if (plain.images != null) {
      images = isArrayOf(plain.images, "string")
        ? plain.images
        : plain.images.map((i) => ImageResource.fromPlain(i));
    }

    return new SomeResource({
      resourceId: plain.resourceId,
      images,
      dates: plain.dates.map((o) => DateTime.fromISO(o)),
      duration: plain.duration ? Duration.fromISO(plain.duration) : null,
      requiredText: plain.requiredText,
      optionalText: plain.optionalText,
    });
  }
}

// Plain object representation of SomeResource, good for serialization
export interface PlainEvent
  extends PlainResourceObject<SomeResourceInitializer> {
  resourceId: string;
  images: string[] | PlainImage[] | null;
  dates: string[];
  duration: string | null;
  requiredText: string;
  optionalText: string | null;
}

// Initializer object for SomeResource's constructor
export interface SomeResourceInitializer {
  resourceId: SomeResource["resourceId"];
  images?: SomeResource["images"];
  dates: SomeResource["dates"];
  duration?: SomeResource["duration"];
  requiredText: SomeResource["requiredText"];
  optionalText?: SomeResource["optionalText"];
}

// This line doesn't *really* do anything, but it will cause a type error if
// this subclass falls out of sync with the ResourceStatic interface
SomeResource satisfies ResourceStatic<SomeResource, PlainEvent>;
```
