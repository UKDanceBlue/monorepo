import type { CodegenConfig } from "@graphql-codegen/cli";
import type { GraphQLScalarTypeExtensions } from "graphql";
import { resolvers } from "graphql-scalars";

// import { dirname, join, normalize } from "path";
// import { fileURLToPath } from "url";

// const __dirname = dirname(fileURLToPath(import.meta.url));

const graphqlScalarsClientDefs = Object.entries(resolvers).reduce<
  Record<string, GraphQLScalarTypeExtensions["codegenScalarType"]>
>((acc, [key, value]) => {
  const { extensions } = value.toConfig();
  if (!("codegenScalarType" in extensions)) {
    return acc;
  }
  acc[key] = extensions.codegenScalarType;
  return acc;
}, {});

const presetConfig = {
  fragmentMasking: {
    unmaskFunctionName: "getFragmentData",
  },
};
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
    LuxonDateRange: "string",
    LuxonDateTime: "string",
    LuxonDuration: "string",
    ...graphqlScalarsClientDefs,
  },
  strictScalars: true,
};
const codegenConfig: CodegenConfig = {
  schema: "./packages/server/schema.graphql",
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client:", e);
    },
  },
  emitLegacyCommonJSImports: false,
  generates: {
    // "./packages/common/lib/graphql-client-public/": {
    //   preset: "client",
    //   presetConfig,
    //   config,
    //   documents: ["./packages/mobile/src/**/*.ts", "./packages/mobile/src/**/*.tsx"],
    // },
    "./packages/common/lib/graphql-client-admin/": {
      preset: "client",
      presetConfig,
      config,
      documents: [
        "./packages/portal/src/**/*.ts",
        "./packages/portal/src/**/*.tsx",
      ],
    },
  },
  watch: [
    "./packages/server/schema.graphql",
    "./packages/portal/src/**/*.ts",
    "./packages/portal/src/**/*.tsx",
    // "./packages/mobile/src/**/*.ts",
    // "./packages/mobile/src/**/*.tsx",
  ],
};

export default codegenConfig;
