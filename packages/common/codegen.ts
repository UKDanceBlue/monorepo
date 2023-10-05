import { CodegenConfig } from "@graphql-codegen/cli";

import { dirname, join, normalize } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  useTypeImports: true,
  enumsAsConst: true,
  immutableTypes: true,
  useIndexSignature: true,
  enumValues: {
    // Comparator: '../api/request/ListQueryTypes.js#Comparator',
    StringComparator: "../api/request/ListQueryTypes.js#StringComparator",
    NumericComparator: "../api/request/ListQueryTypes.js#NumericComparator",
    // IsComparator: '../api/request/ListQueryTypes.js#IsComparator',
    SortDirection: "../api/request/ListQueryTypes.js#SortDirection",
    TeamType: "../api/graphql/object-types/Team.js#TeamType",
    AuthSource: "../auth/index.js#AuthSource",
    // AccessLevel: '../auth/index.js#AccessLevel',
    DbRole: "../auth/index.js#DbRole",
    CommitteeRole: "../auth/index.js#CommitteeRole",
    ClientAction: "../api/response/JsonResponse.js#ClientAction",
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
};
const presetConfig = {
  fragmentMasking: {
    unmaskFunctionName: "getFragmentData",
  },
};
const codegenConfig: CodegenConfig = {
  schema: "../server/schema.graphql",
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client: ", e);
    },
  },
  emitLegacyCommonJSImports: false,
  generates: {
    "./lib/graphql-client-public/": {
      preset: "client",
      presetConfig,
      config,
      documents: ["../mobile/src/graphql/**/*.graphql"],
    },
    "./lib/graphql-client-admin/": {
      preset: "client",
      presetConfig,
      config,
      documents: ["../portal/src/graphql/**/*.ts"],
    },
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;
