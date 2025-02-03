import { Field, InterfaceType } from "type-graphql";

import type { GlobalId } from "./scalars/GlobalId.js";
import { GlobalIdScalar } from "./scalars/GlobalId.js";

@InterfaceType()
export abstract class Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String, {
    description: "A human-readable string representing the object.",
  })
  text(): string {
    return this.id.id;
  }
}
