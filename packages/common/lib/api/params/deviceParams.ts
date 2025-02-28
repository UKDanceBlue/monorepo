import { GraphQLNonNegativeInt, GraphQLPositiveInt } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { DeviceNode } from "../resources/Device.js";
import { GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@ObjectType("GetDeviceByUuidResponse")
export class GetDeviceByUuidResponse {
  @Field(() => DeviceNode, { nullable: false })
  data!: DeviceNode;
}
@ObjectType("ListDevicesResponse", {
  implements: AbstractGraphQLPaginatedResponse<DeviceNode>,
})
export class ListDevicesResponse extends AbstractGraphQLPaginatedResponse<DeviceNode> {
  @Field(() => [DeviceNode], { nullable: false })
  data!: DeviceNode[];
}
@ObjectType("RegisterDeviceResponse")
export class RegisterDeviceResponse {
  @Field(() => Boolean, { nullable: false })
  ok!: true;

  @Field(() => DeviceNode, { nullable: false })
  data!: DeviceNode;
}
@InputType()
export class RegisterDeviceInput {
  @Field(() => String, {
    description: "For legacy reasons, this can be a GlobalId or a raw UUID",
    nullable: false,
  })
  deviceId!: string;

  @Field(() => String, {
    description: "The Expo push token of the device",
    nullable: true,
  })
  expoPushToken?: string | undefined | null;

  @Field(() => String, {
    description: "base64 encoded SHA-256 hash of a secret known to the device",
    nullable: false,
  })
  verifier!: string;

  @Field(() => GlobalIdScalar, {
    description: "The ID of the last user to log in on this device",
    nullable: true,
  })
  lastUserId?: GlobalId | undefined | null;
}

@ArgsType()
export class ListDevicesArgs extends FilteredListQueryArgs("DeviceResolver", [
  "lastLogin",
  "lastLoggedInUserName",
  "lastLoggedInUserEmail",
  "createdAt",
  "updatedAt",
]) {}

@ArgsType()
export class NotificationDeliveriesArgs {
  // TODO: Handle this in the normal authorization flow instead of here
  @Field(() => String, {
    nullable: true,
    description:
      "The verifier code for this device, if it does not match then the query will be rejected",
  })
  verifier?: string;

  @Field(() => GraphQLPositiveInt, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => GraphQLNonNegativeInt, { nullable: true, defaultValue: 10 })
  pageSize?: number;
}
