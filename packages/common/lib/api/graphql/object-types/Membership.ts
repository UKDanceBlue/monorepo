import { Field, ID, ObjectType } from "type-graphql";

import type { MarathonYearString } from "../../SimpleTypes.js";
import { Resource } from "./Resource.js";

@ObjectType()
export class MembershipResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  marathonYear!: MarathonYearString;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<MembershipResource>) {
    return MembershipResource.doInit(init);
  }
}
