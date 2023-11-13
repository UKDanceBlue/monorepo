import { URLResolver } from "graphql-scalars";
import { DateTime } from "luxon";
import { Field, ID, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../custom-scalars/DateTimeScalar.js";

import { Resource } from "./Resource.js";

// TODO: Maybe remove

@ObjectType()
export class LoginFlowSessionResource extends Resource {
  @Field(() => ID)
  uuid!: string;
  @Field(() => String)
  codeVerifier!: string;
  @Field(() => DateTimeScalar)
  creationDate!: DateTime;
  @Field(() => URLResolver, { nullable: true })
  redirectToAfterLogin!: URL | null;

  public getUniqueId(): string {
    return this.uuid;
  }

  public static init(init: Partial<LoginFlowSessionResource>) {
    return LoginFlowSessionResource.doInit(init);
  }
}
