import { PointEntryModel } from "./PointEntry.js";
import { PointOpportunityModel } from "./PointOpportunity.js";

PointOpportunityModel.hasMany(PointEntryModel, {
  foreignKey: {
    name: "pointOpportunityId",
    allowNull: true,
  },
  as: "pointEntries",
});
PointEntryModel.belongsTo(PointOpportunityModel, {
  foreignKey: {
    name: "pointOpportunityId",
    allowNull: true,
  },
  as: "pointOpportunity",
});
