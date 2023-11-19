import { faker } from "@faker-js/faker";
import type { CreationAttributes } from "@sequelize/core";
import {
  TeamLegacyStatus,
  TeamType,
  committeeNames,
} from "@ukdanceblue/common";

import { TeamModel } from "../../models/Team.js";

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
