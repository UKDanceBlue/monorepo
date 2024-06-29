import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";
import type { Class } from "utility-types";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { GlobalId } from "../scalars/GlobalId.js";

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

  protected static createInstance<R extends object>(this: Class<R>): R {
    return new this();
  }

  protected withValues<R extends { id: GlobalId }, D extends { id: string }>(
    this: R,
    values: D
  ): R {
    this.id = { id: values.id, typename: this.constructor.name };
    return this;
  }
}

@ObjectType()
export abstract class TimestampedResource extends Resource {
  @Field(() => Date, { nullable: true })
  createdAt!: Date;
  get createdAtDateTime(): DateTime {
    return dateTimeFromSomething(this.createdAt);
  }

  @Field(() => Date, { nullable: true })
  updatedAt!: Date;
  get updatedAtDateTime(): DateTime {
    return dateTimeFromSomething(this.updatedAt);
  }
}
