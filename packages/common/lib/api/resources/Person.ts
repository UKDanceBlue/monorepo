import { TimestampedResource } from "./Resource.js";

import { DbRole } from "../../authorization/structures.js";
import { Node, createNodeClasses } from "../relay.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { Field, ObjectType } from "type-graphql";

import type { GlobalId } from "../scalars/GlobalId.js";

@ObjectType({
  implements: [Node],
})
export class PersonNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
  @Field(() => String, { nullable: true })
  name!: string | null;
  @Field(() => String)
  email!: string;
  @Field(() => String, { nullable: true })
  linkblue!: string | null;
  @Field(() => DbRole)
  dbRole!: DbRole;

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    name?: string | null;
    email: string;
    linkblue?: string | null;
    dbRole?: DbRole | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { PersonConnection, PersonEdge, PersonResult } = createNodeClasses(
  PersonNode,
  "Person"
);
