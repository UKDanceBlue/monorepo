import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";
import type { Class } from "utility-types";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";

@ObjectType()
export abstract class Resource {
  /**
   * This method should return a unique identifier for the instance.
   * This is usually a UUID, but should never be the numeric ID of
   * the instance in the database (that should remain internal)
   *
   * WARNING: This method is not implemented by all resources. If you
   * need to use this method, make sure the resource you are using
   * implements it.
   */
  public getUniqueId(): string {
    throw new Error(`Method not implemented by subclass.`);
  }

  protected static doInit<R extends object>(this: Class<R>, init: object): R {
    const instance = new this();
    Object.assign(instance, init);
    return instance;
  }
}

@ObjectType()
export abstract class TimestampedResource extends Resource {
  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;
  get createdAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.createdAt ?? null);
  }

  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;
  get updatedAtDateTime(): DateTime | null {
    return dateTimeFromSomething(this.updatedAt ?? null);
  }
}
