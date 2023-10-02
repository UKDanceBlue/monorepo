import { MembershipModel } from "./Membership.js";
import { PersonModel } from "./Person.js";
import { TeamModel } from "./Team.js";

MembershipModel.belongsTo(PersonModel, {
  foreignKey: "personId",
  as: "person",
});

PersonModel.hasMany(MembershipModel, {
  foreignKey: "personId",
  as: "memberships",
});

MembershipModel.belongsTo(TeamModel, {
  foreignKey: "teamId",
  as: "team",
});

TeamModel.hasMany(MembershipModel, {
  foreignKey: "teamId",
  as: "memberships",
});
