import { Field, InputType, ObjectType } from "type-graphql";

import type {
  AccessLevel,
  Authorization,
} from "../../authorization/structures.js";
import {
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  defaultAuthorization,
  isCommitteeIdentifier,
} from "../../authorization/structures.js";
import { roleToAccessLevel, roleToAuthorization } from "../../index.js";
import { Resource } from "../resources/Resource.js";

@InputType("RoleResourceInput")
@ObjectType()
export class Role extends Resource {
  @Field(() => DbRole, { defaultValue: DbRole.None })
  dbRole!: DbRole;
  @Field(() => CommitteeRole, { nullable: true })
  committeeRole!: CommitteeRole | null;
  @Field(() => CommitteeIdentifier, { nullable: true })
  committeeIdentifier!: CommitteeIdentifier | null;

  public static init(init: Partial<Role>) {
    return Role.doInit(init);
  }

  static fromAuthorization(authorization: Readonly<Authorization>): Role {
    const partial: Partial<Role> = {};
    partial.dbRole = authorization.dbRole;
    partial.committeeRole = authorization.committeeRole ?? null;
    if (isCommitteeIdentifier(authorization.committeeIdentifier)) {
      partial.committeeIdentifier = authorization.committeeIdentifier;
    }

    return this.init(partial);
  }

  toAuthorization(): Authorization {
    return roleToAuthorization(this);
  }

  toAccessLevel(): AccessLevel {
    return roleToAccessLevel(this);
  }
}

export const defaultRole = Role.fromAuthorization(defaultAuthorization);
