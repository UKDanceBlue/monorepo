import { Field, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";

@ObjectType()
export class ConfigurationResource extends Resource {
  @Field(() => String)
  key!: string;

  public getUniqueId(): string {
    return this.key;
  }

  public static init(init: Partial<ConfigurationResource>) {
    return ConfigurationResource.doInit(init);
  }
}
