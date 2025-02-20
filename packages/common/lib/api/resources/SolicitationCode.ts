import { NonNegativeIntResolver } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, ObjectType, registerEnumType } from "type-graphql";

import { Node } from "../relay.js";
import type { GlobalId } from "../scalars/GlobalId.js";
import { GlobalIdScalar } from "../scalars/GlobalId.js";
import { TimestampedResource } from "./Resource.js";

export const SolicitationCodeTag = {
  MiniMarathon: "MiniMarathon",
  DancerTeam: "DancerTeam",
  Active: "Active",
  General: "General",
} as const;
export type SolicitationCodeTag =
  (typeof SolicitationCodeTag)[keyof typeof SolicitationCodeTag];

export const solicitationCodeTagColors = {
  MiniMarathon: "#90b",
  DancerTeam: "#33f",
  Active: "#30d048",
  General: "#950",
} as const satisfies Record<SolicitationCodeTag, string>;

export const solicitationCodeTagWeight = {
  MiniMarathon: 101,
  DancerTeam: 102,
  Active: 0,
  General: 50,
} as const satisfies Record<SolicitationCodeTag, number>;

export function stringifySolicitationCodeTag(tag: SolicitationCodeTag): string {
  switch (tag) {
    case SolicitationCodeTag.MiniMarathon: {
      return "Mini Marathons";
    }
    case SolicitationCodeTag.DancerTeam: {
      return "Dancer Team";
    }
    default: {
      return tag;
    }
  }
}

export function sortSolicitationCodeTags(
  tags: SolicitationCodeTag[]
): SolicitationCodeTag[] {
  return tags.toSorted((a, b) => {
    return solicitationCodeTagWeight[a] - solicitationCodeTagWeight[b];
  });
}

registerEnumType(SolicitationCodeTag, {
  name: "SolicitationCodeTag",
  description: "The tags for a solicitation code",
});

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

  @Field(() => [SolicitationCodeTag])
  tags!: SolicitationCodeTag[];

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
    tags: SolicitationCodeTag[];
    createdAt: DateTime;
    updatedAt: DateTime;
  }) {
    return SolicitationCodeNode.createInstance().withValues(init);
  }
}
