import { NonNegativeIntResolver } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { createNodeClasses, Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

@ObjectType({
  implements: [Node],
})
export class SolicitationCodeNode extends TimestampedResource implements Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  prefix!: string;

  @Field(() => NonNegativeIntResolver)
  code!: number;

  @Field(() => String, { nullable: true })
  name?: string | undefined | null;

  @Field(() => String)
  text(): string {
    if (!this.name) {
      return `${this.prefix}${this.code.toString().padStart(4, "0")}`;
    } else {
      return `${this.prefix}${this.code.toString().padStart(4, "0")} - ${
        this.name
      }`;
    }
  }

  public getUniqueId(): string {
    return this.id.id;
  }

  public static init(init: {
    id: string;
    prefix: string;
    code: number;
    name?: string | undefined | null;
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return SolicitationCodeNode.createInstance().withValues(init);
  }
}

export const {
  SolicitationCodeConnection,
  SolicitationCodeEdge,
  SolicitationCodeResult,
} = createNodeClasses(SolicitationCodeNode, "SolicitationCode");
