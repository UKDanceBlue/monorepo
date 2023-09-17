import type { GraphQLResource } from "@ukdanceblue/common";
import { GraphQLService } from "@ukdanceblue/common";

import { InvariantError } from "../lib/CustomErrors.js";
import { modelServiceDeleteHelper, modelServiceGetByUuidHelper, modelServiceSetHelper } from "./helpers.js";
// import {NotificationModel, NotificationIntermediate} from "../models/Notification.js";

// export class 