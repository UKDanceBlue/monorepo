import { PointEntryModel } from "./PointEntry.js";
import { TeamModel } from "./Team.js";

TeamModel.hasMany(PointEntryModel, {
  foreignKey: {
    name: "teamId",
    allowNull: false,
  },
});
PointEntryModel.belongsTo(TeamModel, {
  foreignKey: {
    name: "teamId",
    allowNull: false,
  },
});
