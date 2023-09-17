import { Container } from "typedi"

export * from "./ConfigurationServiceInterface.js"
export * from "./DeviceServiceInterface.js"
export * from "./EventServiceInterface.js"
export * from "./ImageServiceInterface.js"
export * from "./NotificationServiceInterface.js"
export * from "./PersonServiceInterface.js"
export * from "./PointEntryServiceInterface.js"
export * from "./PointOpportunityServiceInterface.js"
export * from "./TeamServiceInterface.js"

export const graphQLServiceContainer = Container.of("db-graphql-services");
