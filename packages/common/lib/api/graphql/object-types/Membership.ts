import { Field, ID, ObjectType } from "type-graphql";

import { Resource } from "./Resource.js";

@ObjectType()
export class MembershipResource extends Resource {
  @Field(() => ID)
  uuid!: string;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<MembershipResource>) {
    return MembershipResource.doInit(init);
  }
}
