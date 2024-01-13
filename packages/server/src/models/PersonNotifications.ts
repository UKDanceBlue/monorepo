import { NotificationModel } from "./Notification.js";
import { PersonModel } from "./Person.js";

NotificationModel.belongsToMany(PersonModel, {
  through: "person_notifications",
});
PersonModel.belongsToMany(NotificationModel, {
  through: "person_notifications",
});
