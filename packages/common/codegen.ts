import { CodegenConfig } from "@graphql-codegen/cli";

import { dirname, join, normalize } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: CodegenConfig = {
  schema: normalize(join(__dirname, "../server/schema.graphql")),
  documents: normalize(join(__dirname, "../client/src/**/*.graphql")),
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client: ", e);
    },
  },
  emitLegacyCommonJSImports: false,
  generates: {
    "./lib/graphql-client/": {
      preset: "client",
      // plugins: ['typescript','typescript-operations','typescript-resolvers'],
      config: {
        useTypeImports: true,
        enumsAsConst: true,
        immutableTypes: true,
        useIndexSignature: true,
        enumValues: {
          // Comparator: '../lib/api/request/ListQueryTypes.js#Comparator',
          StringComparator:
            "../lib/api/request/ListQueryTypes.js#StringComparator",
          NumericComparator:
            "../lib/api/request/ListQueryTypes.js#NumericComparator",
          // IsComparator: '../lib/api/request/ListQueryTypes.js#IsComparator',
          SortDirection: "../lib/api/request/ListQueryTypes.js#SortDirection",
          TeamType: "../lib/api/graphql/object-types/Team.js#TeamType",
          AuthSource: "../lib/auth/index.js#AuthSource",
          // AccessLevel: '../lib/auth/index.js#AccessLevel',
          DbRole: "../lib/auth/index.js#DbRole",
          CommitteeRole: "../lib/auth/index.js#CommitteeRole",
          ClientAction: "../lib/api/response/JsonResponse.js#ClientAction",
        },
        scalars: {
          DateTime: "string",
          DateTimeISO: "string",
          Duration: "string",
          Interval: "string",
          URL: "string",
          Void: "undefined",
        },
        strictScalars: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
