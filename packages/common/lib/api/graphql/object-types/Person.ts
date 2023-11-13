import { Field, ID, ObjectType } from "type-graphql";

import { AuthSource } from "../../../auth/index.js";

import { Resource } from "./Resource.js";
import { RoleResource } from "./Role.js";

@ObjectType()
export class AuthIdList {
  @Field(() => AuthSource)
  source!: AuthSource;

  @Field(() => String)
  value!: string;
}

@ObjectType()
export class PersonResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => [AuthIdList])
  authIds!: AuthIdList[]; // TODO: decide if this needs to be secured
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

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<PersonResource>) {
    return PersonResource.doInit(init);
  }
}
