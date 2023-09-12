import { Field, ID, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";

@ObjectType()
export class NotificationResource extends Resource {
  @Field(() => ID)
  notificationId!: string;

  public getUniqueId(): string {
    return this.notificationId;
  }

  public static init(init: Partial<NotificationResource>) {
    return NotificationResource.doInit(init);
  }
}
