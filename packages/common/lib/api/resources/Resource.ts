import { GraphQLDateTimeISO } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";
import type { Class } from "utility-types";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";
import { GlobalId, isGlobalId } from "../scalars/GlobalId.js";

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
    if ("id" in this) {
      if (isGlobalId(this.id)) {
        return this.id.id;
      } else if (typeof this.id === "string") {
        return this.id;
      }
    }
    throw new Error(`Method not implemented by subclass.`);
  }

  protected static createInstance<R extends object>(this: Class<R>): R {
    return new this();
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  protected withValues<R extends { id: GlobalId }, D extends { id: string }>(
    this: R,
    values: D
  ): R {
    Object.assign(this, values);
    this.id = { id: values.id, typename: this.constructor.name };
    return this;
  }
}

@ObjectType()
export abstract class TimestampedResource extends Resource {
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  createdAt!: Date;
  get createdAtDateTime(): DateTime {
    return dateTimeFromSomething(this.createdAt);
  }

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  updatedAt!: Date;
  get updatedAtDateTime(): DateTime {
    return dateTimeFromSomething(this.updatedAt);
  }
}
