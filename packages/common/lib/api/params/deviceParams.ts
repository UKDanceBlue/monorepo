import { ArgsType, Field, InputType, Int, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { DeviceNode } from "../resources/Device.js";
import { GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import {
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetDeviceByUuidResponse", {
  implements: AbstractGraphQLOkResponse<DeviceNode>,
})
export class GetDeviceByUuidResponse extends AbstractGraphQLOkResponse<DeviceNode> {
  @Field(() => DeviceNode)
  data!: DeviceNode;
}
@ObjectType("ListDevicesResponse", {
  implements: AbstractGraphQLPaginatedResponse<DeviceNode>,
})
export class ListDevicesResponse extends AbstractGraphQLPaginatedResponse<DeviceNode> {
  @Field(() => [DeviceNode])
  data!: DeviceNode[];
}
@ObjectType("RegisterDeviceResponse", {
  implements: AbstractGraphQLOkResponse<DeviceNode>,
})
export class RegisterDeviceResponse extends AbstractGraphQLOkResponse<DeviceNode> {
  @Field(() => DeviceNode)
  data!: DeviceNode;
}
@ObjectType("DeleteDeviceResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeleteDeviceResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
export class RegisterDeviceInput {
  @Field(() => String, {
    description: "For legacy reasons, this can be a GlobalId or a raw UUID",
  })
  deviceId!: string;

  @Field(() => String, {
    description: "The Expo push token of the device",
    nullable: true,
  })
  expoPushToken?: string | undefined | null;

  @Field(() => String, {
    description: "base64 encoded SHA-256 hash of a secret known to the device",
  })
  verifier!: string;

  @Field(() => GlobalIdScalar, {
    description: "The ID of the last user to log in on this device",
    nullable: true,
  })
  lastUserId?: GlobalId | undefined | null;
}

@ArgsType()
export class ListDevicesArgs extends FilteredListQueryArgs<
  "expoPushToken" | "lastSeen" | "createdAt" | "updatedAt",
  "expoPushToken",
  never,
  never,
  "lastSeen" | "createdAt" | "updatedAt",
  never
>("DeviceResolver", {
  all: ["expoPushToken", "lastSeen", "createdAt", "updatedAt"],
  string: ["expoPushToken"],
  date: ["lastSeen", "createdAt", "updatedAt"],
}) {}

@ArgsType()
export class NotificationDeliveriesArgs {
  // TODO: Handle this in the normal authorization flow instead of here
  @Field(() => String, {
    nullable: true,
    description:
      "The verifier code for this device, if it does not match then the query will be rejected",
  })
  verifier?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  pageSize?: number;
}
