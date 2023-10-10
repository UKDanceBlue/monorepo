import { Field, ObjectType } from "type-graphql";
import type { Class } from "utility-types";

@ObjectType()
export abstract class Resource {
  @Field(() => Date, { nullable: true })
  createdAt?: Date | null;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date | null;

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

  protected static doInit<R extends object>(
    this: Class<R>,
    init: Partial<R>
  ): R {
    const instance = new this();
    Object.assign(instance, init);
    return instance;
  }

  protected static init<R extends Resource>(_init: R): Resource {
    throw new Error(`Method not implemented by subclass.`);
  }
}
