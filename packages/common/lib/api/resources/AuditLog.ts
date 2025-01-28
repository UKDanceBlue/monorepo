import { JSONObjectResolver } from "graphql-scalars";
import type { DateTime } from "luxon";
import { Field, ObjectType } from "type-graphql";

import type { PrimitiveObject } from "../../utility/primitive/TypeUtils.js";
import { Node } from "../relay.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { Resource } from "./Resource.js";

@ObjectType({ implements: [Node] })
export class AuditLogNode extends Resource implements Node {
  userId?: number | null | undefined;
  subjectGlobalId?: string | null;

  @Field(() => GlobalIdScalar)
  id!: GlobalId;

  @Field(() => String)
  summary!: string;

  @Field(() => JSONObjectResolver, { nullable: true })
  details?: PrimitiveObject | null | undefined;

  @Field(() => DateTimeScalar, { nullable: true })
  createdAt!: DateTime;

  @Field(() => String)
  text(): string {
    return this.summary;
  }

  static init(init: {
    id: string;
    summary: string;
    details?: PrimitiveObject | null | undefined;
    createdAt: DateTime;
    userId?: number | null | undefined;
    subjectGlobalId?: string | null | undefined;
  }): AuditLogNode {
    return this.createInstance().withValues(init);
  }

  public getUniqueId(): string {
    return this.id.id;
  }
}
