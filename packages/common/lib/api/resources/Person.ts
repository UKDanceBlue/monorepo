import { Field, ID, ObjectType } from "type-graphql";

import { Node, createNodeClasses } from "../relay.js";
import { AuthIdPairResource } from "../types/AuthIdPair.js";
import { RoleResource, defaultRole } from "../types/Role.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType()
export class PersonResource extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => [AuthIdPairResource], {
    deprecationReason: "This is now provided on the AuthIdPair resource.",
  })
  authIds!: AuthIdPairResource[];
  @Field(() => String, { nullable: true })
  name!: string | null;
  @Field(() => String)
  email!: string;
  @Field(() => String, { nullable: true })
  linkblue!: string | null;
  @Field(() => RoleResource)
  role!: RoleResource;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: {
    uuid: string;
    authIds?: AuthIdPairResource[] | null;
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

export const { PersonConnection, PersonEdge, PersonResult } = createNodeClasses(
  PersonResource,
  "Person"
);
