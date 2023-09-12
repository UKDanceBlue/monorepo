import { Container } from "typedi"

export * from "./ConfigurationServiceInterface.js"
export * from "./ImageServiceInterface.js"
export const graphQLServiceContainer = Container.of("db-graphql-services");