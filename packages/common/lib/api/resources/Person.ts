import { Field, ObjectType } from "type-graphql";

import { DbRole } from "../../authorization/structures.js";
import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

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
    name?: string | undefined | null;
    email: string;
    linkblue?: string | undefined | null;
    dbRole?: DbRole | undefined | null;
    createdAt?: Date | undefined | null;
    updatedAt?: Date | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }
}

export const { PersonConnection, PersonEdge, PersonResult } = createNodeClasses(
  PersonNode,
  "Person"
);
