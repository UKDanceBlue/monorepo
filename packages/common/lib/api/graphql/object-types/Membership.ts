import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

import { Resource } from "./Resource.js";

export const MembershipPositionType = {
  Member: "Member",
  Captain: "Captain",
} as const;
export type MembershipPositionType =
  (typeof MembershipPositionType)[keyof typeof MembershipPositionType];

registerEnumType(MembershipPositionType, {
  name: "MembershipPositionType",
  description: "The position of a member on a team",
});

@ObjectType()
export class MembershipResource extends Resource {
  @Field(() => ID)
  uuid!: string;

  @Field(() => MembershipPositionType)
  position!: MembershipPositionType;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<MembershipResource>) {
    return MembershipResource.doInit(init);
  }
}
