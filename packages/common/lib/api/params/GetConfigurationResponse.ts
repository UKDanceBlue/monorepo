import { DateTimeISOResolver } from "graphql-scalars";
import { Field, InputType, ObjectType } from "type-graphql";

import { ConfigurationNode } from "../resources/Configuration.js";

@ObjectType("GetConfigurationByUuidResponse")
export class GetConfigurationResponse {
  @Field(() => ConfigurationNode)
  data!: ConfigurationNode;
}

@InputType()
export class CreateConfigurationInput implements Partial<ConfigurationNode> {
  @Field()
  key!: string;

  @Field()
  value!: string;

  @Field(() => DateTimeISOResolver, { nullable: true })
  validAfter!: Date | null;

  @Field(() => DateTimeISOResolver, { nullable: true })
  validUntil!: Date | null;
}
