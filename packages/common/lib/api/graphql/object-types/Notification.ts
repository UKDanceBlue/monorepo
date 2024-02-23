import { Field, ID, ObjectType } from "type-graphql";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class NotificationResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;

  @Field()
  title!: string;

  @Field()
  body!: string;

  @Field(() => Date, {
    nullable: true,
    description:
      "The time the notification should have been received by the device (if applicable)",
  })
  receivedAt?: Date | undefined | null;

  @Field({
    nullable: true,
    description:
      "A URL related to the notification, opened immediately for presentation type URL, opened in a webview for presentation type IN_APP_VIEW, and shown as a button for presentation type INFO_POPUP",
  })
  url?: string | undefined | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<NotificationResource>) {
    return NotificationResource.doInit(init);
  }
}
