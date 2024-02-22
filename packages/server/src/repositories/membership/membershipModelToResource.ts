import type { Membership } from "@prisma/client";
import { MembershipResource } from "@ukdanceblue/common";

export function membershipModelToResource(membershipModel: Membership): MembershipResource {
  return MembershipResource.init({
    uuid: membershipModel.uuid,
  });
}
