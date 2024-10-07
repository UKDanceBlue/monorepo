import { DateTimeISOResolver, VoidResolver } from "graphql-scalars";
import { ObjectType, Field, InputType } from "type-graphql";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLArrayOkResponse,
  AbstractGraphQLCreatedResponse,
} from "./ApiResponse.js";
import { ConfigurationNode } from "../resources/Configuration.js";
import { VoidScalar } from "../scalars/Void.js";

@ObjectType("GetConfigurationByUuidResponse", {
  implements: AbstractGraphQLOkResponse<ConfigurationNode>,
})
export class GetConfigurationResponse extends AbstractGraphQLOkResponse<ConfigurationNode> {
  @Field(() => ConfigurationNode)
  data!: ConfigurationNode;
}
@ObjectType("GetAllConfigurationsResponse", {
  implements: AbstractGraphQLArrayOkResponse<ConfigurationNode>,
})
export class GetAllConfigurationsResponse extends AbstractGraphQLArrayOkResponse<ConfigurationNode> {
  @Field(() => [ConfigurationNode])
  data!: ConfigurationNode[];
}
@ObjectType("CreateConfigurationResponse", {
  implements: AbstractGraphQLCreatedResponse<ConfigurationNode>,
})
export class CreateConfigurationResponse extends AbstractGraphQLCreatedResponse<ConfigurationNode> {
  @Field(() => ConfigurationNode)
  data!: ConfigurationNode;
}
@ObjectType("CreateConfigurationsResponse", {
  implements: AbstractGraphQLCreatedResponse<typeof VoidScalar>,
})
export class CreateConfigurationsResponse extends AbstractGraphQLOkResponse<
  typeof VoidScalar
> {
  @Field(() => VoidResolver)
  data!: typeof VoidScalar;
}
@ObjectType("DeleteConfigurationResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeleteConfigurationResponse extends AbstractGraphQLOkResponse<never> {}
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
