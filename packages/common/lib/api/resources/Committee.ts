import { Field, ID, ObjectType } from "type-graphql";

import { CommitteeIdentifier } from "../../authorization/structures.js";
import { Node } from "../relay.js";

import { TimestampedResource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class CommitteeNode extends TimestampedResource implements Node {
  @Field(() => ID)
  id!: string;

  @Field(() => CommitteeIdentifier)
  identifier!: CommitteeIdentifier;

  static init(init: { id: string; identifier: CommitteeIdentifier }) {
    return this.doInit({
      id: init.id,
      identifier: init.identifier,
    });
  }

  public getUniqueId(): string {
    return this.id;
  }
}
