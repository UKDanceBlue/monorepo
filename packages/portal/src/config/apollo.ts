import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  TypePolicy,
  // FieldFunctionOptions,
} from "@apollo/client/cache/inmemory/policies";

const API_URL = "http://localhost:4000/graphql";

function listResponseTypePolicy(
  __typename: string,
  policy: Readonly<TypePolicy> = {}
): TypePolicy {
  return {
    ...policy,
    fields: {
      ...policy.fields,
      data: {
        read(_, { args, toReference }) {
          return toReference({
            __typename,
            uuid: args?.uuid,
          });
        },
      },
    },
  };
}

const cache = new InMemoryCache({
  typePolicies: {
    ListDevicesResponse: listResponseTypePolicy("ListDevicesResponse"),
  },
});

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: cache,
});
