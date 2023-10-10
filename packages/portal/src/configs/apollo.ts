import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  FieldPolicy,
  FieldReadFunction,
  // FieldFunctionOptions,
} from "@apollo/client/cache/inmemory/policies";
import type {
  // ListEventsQueryVariables,
  // QueryListEventsArgs,
  Query,
} from "@ukdanceblue/common/graphql-client-admin/raw-types";

const API_URL = "http://localhost:4000/graphql";

const cacheQueryFields: {
  [fieldName in keyof Query]?:
    | FieldPolicy<Query[fieldName], Query[fieldName], Query[fieldName]>
    | FieldReadFunction<Query[fieldName], Query[fieldName]>;
} = {
  events: {
    // merge(
    //   existing,
    //   incoming,
    //   {
    //     args,
    //     toReference,
    //   }: FieldFunctionOptions<QueryListEventsArgs, ListEventsQueryVariables>
    // ) {
    //   if (!existing) {
    //     return incoming;
    //   }
    //   const merged = {
    //   };
    //   return merged;
    // },
  },
};

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: cacheQueryFields,
    },
  },
});

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: cache,
});
