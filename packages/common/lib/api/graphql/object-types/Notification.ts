import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { Resource } from "./Resource.js";
/*
interface FirestoreNotification {
  body: string;
  sendTime: string;
  sound?: string;
  title: string;
  payload?: Record<string, unknown>;
}
*/

export const NotificationPayloadPresentationType = {
  OPEN_URL: "OPEN_URL",
  IN_APP_VIEW: "IN_APP_VIEW",
  INFO_POPUP: "INFO_POPUP",
} as const;
export type NotificationPayloadPresentationType =
  (typeof NotificationPayloadPresentationType)[keyof typeof NotificationPayloadPresentationType];

registerEnumType(NotificationPayloadPresentationType, {
  name: "NotificationPayloadPresentationType",
  description:
    "The type of presentation for the notification, URL skips the app and opens a URL directly, IN_APP_VIEW opens a webview, and INFO_POPUP shows a popup",
});

@ObjectType()
export class NotificationPayload {
  @Field(() => NotificationPayloadPresentationType)
  presentation!: NotificationPayloadPresentationType;

  @Field({
    nullable: true,
    description:
      "A URL related to the notification, opened immediately for presentation type URL, opened in a webview for presentation type IN_APP_VIEW, and shown as a button for presentation type INFO_POPUP",
  })
  url?: string;

  @Field({
    nullable: true,
    description:
      "A title for the notification, ignored for presentation type URL, shown with the webview for presentation type IN_APP_VIEW, and shown at the top of the popup for presentation type INFO_POPUP",
  })
  title?: string;

  @Field({
    nullable: true,
    description:
      "Only shown for presentation type INFO_POPUP, shown at the bottom of the popup",
  })
  message?: string;
}

@ObjectType()
export class NotificationResource extends Resource {
  @Field(() => ID)
  uuid!: string;

  @Field()
  title!: string;

  @Field()
  body!: string;

  @Field(() => Date)
  sendTime!: Date;

  @Field(() => String, { nullable: true })
  sound!: string | null;

  @Field(() => NotificationPayload, { nullable: true })
  payload!: NotificationPayload | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<NotificationResource>) {
    return NotificationResource.doInit(init);
  }
}
