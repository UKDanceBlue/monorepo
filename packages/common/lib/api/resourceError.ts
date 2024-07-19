import {
  Field,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

export const ResourceErrorCode = {
  InternalError: "InternalError",
} as const;
export type ResourceErrorCode =
  (typeof ResourceErrorCode)[keyof typeof ResourceErrorCode];

registerEnumType(ResourceErrorCode, {
  name: "ResourceErrorCode",
});

@ObjectType("ResourceError")
export class ResourceError {
  @Field(() => ResourceErrorCode, {
    description: "A specific error code to identify the error",
  })
  code!: ResourceErrorCode;

  @Field(() => String, { description: "A human readable error message" })
  message!: string;

  @Field(() => String, {
    nullable: true,
    description: "A message that should be presented to the user",
  })
  alert?: string;

  @Field(() => String, {
    nullable: true,
    description:
      "Development information about the error. should not be sent to untrusted clients (i.e. production environments)",
  })
  debugInfo?: string;
}

@InterfaceType()
export abstract class Errorable {
  @Field(() => [ResourceError])
  errors!: ResourceError[];
}
