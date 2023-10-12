import { buildSchema } from "type-graphql";

import { ConfigurationResolver } from "../resolvers/ConfigurationResolver.js";
import { DeviceResolver } from "../resolvers/DeviceResolver.js";
import { EventResolver } from "../resolvers/EventResolver.js";
import { ImageResolver } from "../resolvers/ImageResolver.js";
import { MembershipResolver } from "../resolvers/MembershipResolver.js";
import { PersonResolver } from "../resolvers/PersonResolver.js";

export default await buildSchema({
  resolvers: [
    ConfigurationResolver,
    DeviceResolver,
    EventResolver,
    ImageResolver,
    PersonResolver,
    MembershipResolver,
  ],
  emitSchemaFile: true,
});
