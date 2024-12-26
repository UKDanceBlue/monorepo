import { MinDate } from "class-validator";
import { DateTime } from "luxon";
import { Field, InputType, ObjectType } from "type-graphql";

import { ConfigurationNode } from "../resources/Configuration.js";
import { DateTimeScalar } from "../scalars/DateTimeISO.js";

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

  @Field(() => DateTimeScalar, { nullable: true })
  validAfter!: DateTime | null;

  @MinDate(() => new Date())
  @Field(() => DateTimeScalar, { nullable: true })
  validUntil!: DateTime | null;
}
