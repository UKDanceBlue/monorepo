import { EventModel } from "./Event.js";
import { EventOccurrenceModel } from "./EventOccurrence.js";

EventModel.hasMany(EventOccurrenceModel, {
  foreignKey: "eventId",
  as: "occurrences",
});

EventOccurrenceModel.belongsTo(EventModel, {
  foreignKey: "eventId",
  as: "event",
});

EventModel.addScope("defaultScope", {
  include: [
    {
      model: EventOccurrenceModel,
      as: "occurrences",
    },
  ],
});
