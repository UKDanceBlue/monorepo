import { Field, ID, ObjectType } from "type-graphql";

import { DbRole } from "../../authorization/structures.js";
import { Node, createNodeClasses } from "../relay.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [TimestampedResource, Node],
})
export class PersonNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;
  @Field(() => String, { nullable: true })
  name!: string | null;
  @Field(() => String)
  email!: string;
  @Field(() => String, { nullable: true })
  linkblue!: string | null;
  @Field(() => DbRole)
  dbRole!: DbRole;

  public getUniqueId(): string {
    return this.id;
  }

  public static init(init: {
    uuid: string;
    name?: string | null;
    email: string;
    linkblue?: string | null;
    dbRole?: DbRole | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    const resource = PersonNode.doInit({
      id: init.uuid,
      email: init.email,
    });

    resource.name = init.name ?? null;
    resource.linkblue = init.linkblue ?? null;
    resource.dbRole = init.dbRole ?? DbRole.None;
    resource.createdAt = init.createdAt ?? null;
    resource.updatedAt = init.updatedAt ?? null;

    return resource;
  }
}

export const { PersonConnection, PersonEdge, PersonResult } = createNodeClasses(
  PersonNode,
  "Person"
);
