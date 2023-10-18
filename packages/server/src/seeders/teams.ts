import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";
import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";

import { TeamModel } from "../models/Team.js";

const greekLetters = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Theta",
  "Kappa",
  "Lambda",
  "Mu",
  "Omicron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  "Phi",
  "Chi",
  "Psi",
  "Omega",
];

export default async function () {
  const teamData: CreationAttributes<TeamModel>[] = [];
  for (let i = 0; i < 12; i++) {
    const isGreek = Math.random() > 0.4;
    const name = isGreek
      ? faker.helpers.arrayElements(greekLetters, 3).join(" ")
      : faker.company.name();
    teamData.push({
      name,
      marathonYear: "DB24",
      type: TeamType.Spirit,
      legacyStatus: faker.datatype.boolean()
        ? TeamLegacyStatus.ReturningTeam
        : TeamLegacyStatus.NewTeam,
    });
  }
  await TeamModel.bulkCreate(teamData);

  const committeeData: CreationAttributes<TeamModel>[] = [];
  const committeeNames = {
    "morale-committee": "Morale Committee",
    "programming-committee": "Programming Committee",
    "fundraising-committee": "Fundraising Committee",
    "community-development-committee": "Community Development Committee",
    "dancer-relations-committee": "Dancer Relations Committee",
    "family-relations-committee": "Family Relations Committee",
    "tech-committee": "Tech Committee",
    "operations-committee": "Operations Committee",
    "marketing-committee": "Marketing Committee",
    "corporate-committee": "Corporate Committee",
    "mini-marathons-committee": "Mini Marathons Committee",
  };

  for (const [identifier, name] of Object.entries(committeeNames)) {
    committeeData.push({
      name,
      marathonYear: "DB24",
      type: TeamType.Committee,
      legacyStatus: TeamLegacyStatus.ReturningTeam,
      persistentIdentifier: identifier,
    });
  }

  await TeamModel.bulkCreate(committeeData);
}
