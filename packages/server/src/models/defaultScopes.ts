import { ConfigurationModel } from "./Configuration.js";
import { DeviceModel } from "./Device.js";
import { EventModel } from "./Event.js";
import { EventOccurrenceModel } from "./EventOccurrence.js";
import { ImageModel } from "./Image.js";
import { LoginFlowSessionModel } from "./LoginFlowSession.js";
import { PersonModel } from "./Person.js";
import { PointEntryModel } from "./PointEntry.js";
import { TeamModel } from "./Team.js";

ConfigurationModel.addScope("defaultScope", {
  include: [
  ]
});

DeviceModel.addScope("defaultScope", {
  include: [
  ]
});

EventModel.addScope("defaultScope", {
  include: [
    EventOccurrenceModel,
    ImageModel
  ]
});

EventOccurrenceModel.addScope("defaultScope", {
  include: [
  ]
});

ImageModel.addScope("defaultScope", {
  include: [
  ]
});

LoginFlowSessionModel.addScope("defaultScope", {
  include: [
  ]
});

PersonModel.addScope("defaultScope", {
  include: [
  ]
});

PointEntryModel.addScope("defaultScope", {
  include: [
  ]
});

TeamModel.addScope("defaultScope", {
  include: [
    PointEntryModel
  ]
});
