import { GraphQLResolver, GraphQLResource } from "@ukdanceblue/common";
import { buildSchema } from "type-graphql";

export default await buildSchema({
  resolvers: [
    GraphQLResolver.ConfigurationResolver,
    GraphQLResolver.ImageResolver,
  ],
  emitSchemaFile: true
});
