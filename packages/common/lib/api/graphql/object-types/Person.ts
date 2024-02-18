import { Field, ID, ObjectType } from "type-graphql";

import { AuthSource } from "../../../auth/index.js";

import { TimestampedResource } from "./Resource.js";
import { RoleResource, defaultRole } from "./Role.js";

@ObjectType()
export class AuthIdPair {
  @Field(() => AuthSource)
  source!: AuthSource;

  @Field(() => String)
  value!: string;

  public static isAuthIdList(obj: unknown): obj is AuthIdPair {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "source" in obj &&
      "value" in obj &&
      typeof (obj as AuthIdPair).source === "string" &&
      typeof (obj as AuthIdPair).value === "string"
    );
  }

  public static isAuthIdListArray(obj: unknown): obj is AuthIdPair[] {
    return (
      Array.isArray(obj) && obj.every((item) => AuthIdPair.isAuthIdList(item))
    );
  }
}

@ObjectType()
export class PersonResource extends TimestampedResource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => [AuthIdPair])
  authIds!: AuthIdPair[]; // TODO: decide if this needs to be secured
  @Field(() => String, { nullable: true })
  name!: string | null;
  @Field(() => String)
  email!: string;
  @Field(() => String, { nullable: true })
  linkblue!: string | null;
  @Field(() => RoleResource)
  role!: RoleResource;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: {
    uuid: string;
    authIds?: AuthIdPair[] | null;
    name?: string | null;
    email: string;
    linkblue?: string | null;
    role?: RoleResource | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    const resource = PersonResource.doInit({
      uuid: init.uuid,
      email: init.email,
    });

    resource.authIds = init.authIds ?? [];
    resource.name = init.name ?? null;
    resource.linkblue = init.linkblue ?? null;
    resource.role = init.role ?? defaultRole;
    resource.createdAt = init.createdAt ?? null;
    resource.updatedAt = init.updatedAt ?? null;

    return resource;
  }
}
