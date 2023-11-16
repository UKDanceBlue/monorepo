import { PersonModel } from "./Person.js";
import { PointEntryModel } from "./PointEntry.js";

PersonModel.hasMany(PointEntryModel, {
  foreignKey: {
    name: "personFromId",
    allowNull: true,
  },
  as: "pointEntries",
});
PointEntryModel.belongsTo(PersonModel, {
  foreignKey: {
    name: "personFromId",
    allowNull: true,
  },
  as: "personFrom",
});
