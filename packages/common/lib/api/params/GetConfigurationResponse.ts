import { MinDate } from "class-validator";
import { DateTime } from "luxon";
import { Field, InputType, ObjectType } from "type-graphql";

import { ConfigurationNode } from "../resources/Configuration.js";
import { DateTimeISOScalar } from "../scalars/DateTimeISO.js";

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

  @Field(() => DateTimeISOScalar, { nullable: true })
  validAfter!: DateTime | null;

  @MinDate(() => new Date())
  @Field(() => DateTimeISOScalar, { nullable: true })
  validUntil!: DateTime | null;
}
