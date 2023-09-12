import { Field, ObjectType } from "type-graphql";

import { CommitteeRole, DbRole } from "../../../auth/index.js";

import { Resource } from "./Resource.js";

@ObjectType()
export class RoleResource extends Resource {
  @Field(() => DbRole)
  dbRole!: DbRole;
  @Field(() => CommitteeRole, { nullable: true })
  committeeRole!: CommitteeRole | null;
  @Field(() => String, { nullable: true })
  committee!: string | null;

  public static init(init: Partial<RoleResource>) {
    return RoleResource.doInit(init);
  }
}
