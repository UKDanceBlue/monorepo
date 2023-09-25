import { EventModel } from "./Event.js";
import { ImageModel } from "./Image.js";

ImageModel.belongsToMany(EventModel, {
  through: "event_images",
});

EventModel.belongsToMany(ImageModel, {
  through: "event_images",
});
