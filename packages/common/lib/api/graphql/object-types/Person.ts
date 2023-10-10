import { Field, ID, ObjectType } from "type-graphql";

import { AuthSource } from "../../../auth/index.js";

import { Resource } from "./Resource.js";
import { RoleResource } from "./Role.js";
import { TeamResource } from "./Team.js";

@ObjectType()
export class PersonResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => AuthSource)
  authIds!: Partial<Record<AuthSource, string>>;
  @Field(() => String, { nullable: true })
  firstName!: string | null;
  @Field(() => String, { nullable: true })
  lastName!: string | null;
  @Field(() => String)
  email!: string;
  @Field(() => String, { nullable: true })
  linkblue!: string | null;
  @Field(() => RoleResource)
  role!: RoleResource;
  @Field(() => [TeamResource])
  memberOf!: TeamResource[] | string[];
  @Field(() => [TeamResource])
  captainOf!: TeamResource[] | string[];

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PersonResource>) {
    return PersonResource.doInit(init);
  }
}
