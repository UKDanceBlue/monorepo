import { Field, InputType, ObjectType } from "type-graphql";

import type { Authorization } from "../../../auth/index.js";
import {
  AccessLevel,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  isCommitteeIdentifier,
} from "../../../auth/index.js";

import { Resource } from "./Resource.js";

@InputType("RoleResourceInput")
@ObjectType()
export class RoleResource extends Resource {
  @Field(() => DbRole, { defaultValue: DbRole.None })
  dbRole!: DbRole;
  @Field(() => CommitteeRole, { nullable: true })
  committeeRole!: CommitteeRole | null;
  @Field(() => CommitteeIdentifier, { nullable: true })
  committeeIdentifier!: CommitteeIdentifier | null;

  public static init(init: Partial<RoleResource>) {
    return RoleResource.doInit(init);
  }

  static fromAuthorization(
    authorization: Readonly<Authorization>
  ): RoleResource {
    const partial: Partial<RoleResource> = {};
    partial.dbRole = authorization.dbRole;
    partial.committeeRole = authorization.committeeRole ?? null;
    if (isCommitteeIdentifier(authorization.committeeIdentifier)) {
      partial.committeeIdentifier = authorization.committeeIdentifier;
    }

    return this.init(partial);
  }

  toAuthorization(): Authorization {
    const authorization: Authorization = {
      dbRole: this.dbRole,
      accessLevel: AccessLevel.None,
    };
    if (this.committeeRole) {
      authorization.committeeRole = this.committeeRole;
    }
    if (this.committeeIdentifier) {
      authorization.committeeIdentifier = this.committeeIdentifier;
    }
    switch (this.dbRole) {
      case DbRole.None: {
        authorization.accessLevel = AccessLevel.None;
        break;
      }
      case DbRole.Public: {
        authorization.accessLevel = AccessLevel.Public;
        break;
      }
      case DbRole.TeamMember: {
        authorization.accessLevel = AccessLevel.TeamMember;
        break;
      }
      case DbRole.TeamCaptain: {
        authorization.accessLevel = AccessLevel.TeamCaptain;
        break;
      }
      case DbRole.Committee: {
        switch (this.committeeRole) {
          case CommitteeRole.Chair:
          case CommitteeRole.Coordinator: {
            authorization.accessLevel =
              this.committeeIdentifier === CommitteeIdentifier["techCommittee"]
                ? AccessLevel.Admin
                : AccessLevel.CommitteeChairOrCoordinator;
            break;
          }
          case CommitteeRole.Member: {
            authorization.accessLevel = AccessLevel.Committee;
            break;
          }
          default: {
            authorization.accessLevel = AccessLevel.None;
            break;
          }
        }
        break;
      }
      default: {
        authorization.accessLevel = AccessLevel.None;
        break;
      }
    }
    return authorization;
  }
}
