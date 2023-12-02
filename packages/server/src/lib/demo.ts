import {
  AuthSource,
  DbRole,
  MembershipPositionType,
  TeamLegacyStatus,
} from "@ukdanceblue/common";

import { sequelizeDb } from "../data-source.js";
import { MembershipModel } from "../models/Membership.js";
import { PersonModel } from "../models/Person.js";
import { PointEntryModel } from "../models/PointEntry.js";
import { TeamModel } from "../models/Team.js";

export async function getOrMakeDemoUser() {
  return sequelizeDb.transaction(async () => {
    const [demoUser] = await PersonModel.findOrCreate({
      where: {
        email: "demo-user@dancblue.org",
        linkblue: "demo-user",
        dbRole: DbRole.TeamCaptain,
        authIds: {
          [AuthSource.Demo]: ["demo-user"],
        },
      },
    });
    const [demoTeam] = await TeamModel.findOrCreate({
      where: {
        name: "Demo Team",
        legacyStatus: TeamLegacyStatus.DemoTeam,
      },
    });
    await MembershipModel.findOrCreate({
      where: {
        personId: demoUser.id,
        teamId: demoTeam.id,
        position: MembershipPositionType.Captain,
      },
    });
    await PointEntryModel.findOrCreate({
      where: {
        personFromId: demoUser.id,
        teamId: demoTeam.id,
        points: 1,
        comment: "Demo point",
      },
    });
    return {
      demoUser,
      demoTeam,
    };
  });
}
