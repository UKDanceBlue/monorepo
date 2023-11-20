import { EventModel } from "./Event.js";
import { PointOpportunityModel } from "./PointOpportunity.js";

PointOpportunityModel.belongsTo(EventModel, {
  foreignKey: "eventId",
  as: "event",
});

EventModel.hasMany(PointOpportunityModel, {
  foreignKey: "eventId",
  as: "pointOpportunities",
});
