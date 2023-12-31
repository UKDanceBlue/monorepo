import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";
import type { CommitteeIdentifier } from "@ukdanceblue/common";
import {
  CommitteeRole,
  MembershipPositionType,
  TeamType,
} from "@ukdanceblue/common";

import { MembershipModel } from "../../models/Membership.js";
import { PersonModel } from "../../models/Person.js";
import { TeamModel } from "../../models/Team.js";

export default async function () {
  const membershipData: CreationAttributes<MembershipModel>[] = [];

  const people = await PersonModel.findAll();
  const teams = await TeamModel.findAll({ where: { type: TeamType.Spirit } });
  const committees = await TeamModel.findAll({
    where: { type: TeamType.Committee },
  });

  const hasCaptainMap = new WeakMap<TeamModel, boolean>();
  const membershipMap = new WeakMap<TeamModel, Set<[PersonModel, boolean]>>();

  for (const team of [...teams, ...committees]) {
    membershipMap.set(team, new Set());
  }

  await Promise.all(
    people.map(async (person) => {
      const isCommitteeMember = faker.datatype.number({ min: 0, max: 10 }) > 9;

      if (isCommitteeMember) {
        const committee = faker.helpers.arrayElement(committees);
        let isCaptain = false;
        if (!hasCaptainMap.get(committee)) {
          isCaptain = true;
          hasCaptainMap.set(committee, true);
        }
        membershipMap.get(committee)!.add([person, isCaptain]);
        hasCaptainMap.set(committee, isCaptain);
        await person.update({
          committeeRole: isCaptain ? CommitteeRole.Chair : CommitteeRole.Member,
          committeeName: committee.persistentIdentifier as CommitteeIdentifier,
        });
      } else {
        const team = faker.helpers.arrayElement(teams);
        let isCaptain = false;
        if (!hasCaptainMap.get(team)) {
          isCaptain = true;
          hasCaptainMap.set(team, true);
        } else if (faker.datatype.number({ min: 0, max: 10 }) > 9.3) {
          isCaptain = true;
        }
        membershipMap.get(team)!.add([person, isCaptain]);
      }
    })
  );

  for (const team of [...teams, ...committees]) {
    const members = membershipMap.get(team)!;
    for (const [person, isCaptain] of members) {
      membershipData.push({
        personId: person.id,
        teamId: team.id,
        position: isCaptain
          ? MembershipPositionType.Captain
          : MembershipPositionType.Member,
      });
    }
  }

  await MembershipModel.bulkCreate(membershipData);
}
