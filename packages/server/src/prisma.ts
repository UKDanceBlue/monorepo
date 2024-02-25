import type { $Enums } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { DbRole, MembershipPositionType } from "@ukdanceblue/common";
import { Container } from "typedi";

export const prisma = new PrismaClient().$extends({
  result: {
    person: {
      dbRole: {
        needs: {
          committeeRole: true,
          // The memberships field cannot be added because it is a relation - https://github.com/prisma/prisma/issues/20091
          // If that issue is fixed, we should take another look at this
        },
        compute(data: {
          committeeRole: $Enums.CommitteeRole | null;
          memberships?: {
            position?: $Enums.MembershipPosition;
          }[];
        }) {
          // We may not have a full data object, so we need to make sure we return the least permissive role
          if (data.committeeRole) {
            return DbRole.Committee;
          } else if (data.memberships) {
            let isCaptain = false;
            let isMember = false;
            for (const membership of data.memberships) {
              if (membership.position === MembershipPositionType.Captain) {
                isCaptain = true;
                break;
              } else if (
                membership.position === MembershipPositionType.Member
              ) {
                isMember = true;
              }
            }
            if (isCaptain) {
              return DbRole.TeamCaptain;
            } else if (isMember) {
              return DbRole.TeamMember;
            }
          }
          return DbRole.Public;
        },
      },
    },
  },
});

Container.set<typeof prisma>(PrismaClient, prisma);

if (!Container.has(PrismaClient)) {
  throw new Error("PrismaClient not registered");
}
