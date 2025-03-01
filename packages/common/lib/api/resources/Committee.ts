import { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { CommitteeIdentifier } from "../../authorization/structures.js";
import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class CommitteeNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar, { nullable: false })
  id!: GlobalId;

  @Field(() => CommitteeIdentifier, { nullable: false })
  identifier!: CommitteeIdentifier;

  @Field(() => String, { nullable: false })
  text(): string {
    return this.identifier;
  }

  static init(init: {
    id: string;
    identifier: CommitteeIdentifier;
    updatedAt?: DateTime | undefined | null;
    createdAt?: DateTime | undefined | null;
  }) {
    return this.createInstance().withValues(init);
  }

  public getUniqueId(): string {
    return this.id.id;
  }
}
