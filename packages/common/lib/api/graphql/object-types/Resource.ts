import type { Class } from "utility-types";

import type { ExcludeValues } from "../../../util/TypeUtils.js";

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
  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected static init<R extends Resource>(init: R): Resource {
    throw new Error(`Method not implemented by subclass.`);
  }
}
