import { Field, ObjectType } from "type-graphql";

import { CommitteeIdentifier } from "../../authorization/structures.js";
import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class CommitteeNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => CommitteeIdentifier)
  identifier!: CommitteeIdentifier;

  static init(init: {
    id: string;
    identifier: CommitteeIdentifier;
    updatedAt?: Date | null;
    createdAt?: Date | null;
  }) {
    return this.createInstance().withValues(init);
  }

  public getUniqueId(): string {
    return this.id.id;
  }
}
