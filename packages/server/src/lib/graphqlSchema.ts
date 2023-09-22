import { buildSchema } from "type-graphql";

import { ConfigurationResolver } from "../resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "../resolvers/DeviceResolver.js";
import { EventResolver } from "../resolvers/EventResolver.js";
import { ImageResolver } from "../resolvers/ImageResolver.js";
import { PersonResolver } from "../resolvers/PersonResolver.js";

export default await buildSchema({
  resolvers: [
    ConfigurationResolver,
    EventResolver,
    ImageResolver,
    PersonResolver,
    DeviceResolver
  ],
  emitSchemaFile: true
});
