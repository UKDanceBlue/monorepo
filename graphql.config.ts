import type { IGraphQLConfig } from "graphql-config";

import { resolvers } from "graphql-scalars";

import type { CodegenConfig } from "@graphql-codegen/cli";
import type { ClientPresetConfig } from "@graphql-codegen/client-preset";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript";
import type { GraphQLScalarTypeExtensions } from "graphql";

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

const presetConfig: ClientPresetConfig = {
  fragmentMasking: {
    unmaskFunctionName: "getFragmentData",
  },
};

// NOTE: this configuration object requires the patch in `.yarn/patches/@graphql-codegen-client-preset-npm-4.3.3-ec8a799259.patch` which is automatically applied by Yarn
// If you get errors with types not matching up between GraphQL an @ukdanceblue/common, then the patch probably isn't working
const config: TypeScriptPluginConfig = {
  useTypeImports: true,
  enumsAsConst: true,
  enumValues: {
    AuthSource: "@ukdanceblue/common#AuthSource",
    AccessLevel: "@ukdanceblue/common#AccessLevel",
    DbRole: "@ukdanceblue/common#DbRole",
    CommitteeRole: "@ukdanceblue/common#CommitteeRole",
    CommitteeIdentifier: "@ukdanceblue/common#CommitteeIdentifier",
    // ErrorCode: "@ukdanceblue/common#ErrorCode",
    MembershipPositionType: "@ukdanceblue/common#MembershipPositionType",
    TeamLegacyStatus: "@ukdanceblue/common#TeamLegacyStatus",
    TeamType: "@ukdanceblue/common#TeamType",
    SortDirection: "@ukdanceblue/common#SortDirection",
    // Comparator: "@ukdanceblue/common#Comparator",
    NumericComparator: "@ukdanceblue/common#NumericComparator",
    StringComparator: "@ukdanceblue/common#StringComparator",
    // IsComparator: "@ukdanceblue/common#IsComparator",
    BatchType: "@ukdanceblue/common#BatchType",
  },
  scalars: {
    LuxonDateRange: "string",
    LuxonDuration: "string",
    GlobalId: "string",
    ...graphqlScalarsClientDefs,
  },
  strictScalars: true,
  immutableTypes: true,
};

const generates: CodegenConfig["generates"] = {};

const codegenConfig: CodegenConfig = {
  schema: "schema.graphql",
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client:", e);
    },
    afterAllFileWrite: [
      "node scripts/fix-codegen.js",
      "eslint --fix",
      "prettier --write",
    ],
    beforeOneFileWrite: (_, content) => {
      return content
        .replace("from './graphql.js';", "from './graphql';")
        .replace("from './fragment-masking.js'", "from './fragment-masking'")
        .replace("from './gql.js';", "from './gql';")
        .replace('from "./graphql.js";', 'from "./graphql";')
        .replace('from "./fragment-masking.js"', 'from "./fragment-masking"')
        .replace('from "./gql.js";', 'from "./gql";')
        .replace(
          "/* eslint-disable */",
          "/* eslint-disable @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unnecessary-type-parameters, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-invalid-void-type, @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/consistent-type-definitions, @typescript-eslint/array-type, unicorn/prefer-export-from, sort-imports/exports */"
        );
    },
  },
  noSilentErrors: true,
  emitLegacyCommonJSImports: false,
  generates,
  ignoreNoDocuments: true,
  config,
};

const iGqlConfig: IGraphQLConfig = {
  projects: {
    portal: {
      schema: "./schema.graphql",
      documents: "./packages/portal/src/**/*.{graphql,js,ts,jsx,tsx}",
      extensions: {
        codegen: {
          ...codegenConfig,
          generates: {
            "packages/portal/graphql/": {
              preset: "client",
              presetConfig,
              documents: ["packages/portal/src"],
              config,
            },
          },
        },
      },
    },
    mobile: {
      schema: "./schema.graphql",
      documents: "./packages/mobile/src/**/*.{graphql,js,ts,jsx,tsx}",
      exclude: ["./packages/mobile/src/graphql/**/*"],
      extensions: {
        codegen: {
          ...codegenConfig,
          generates: {
            "packages/mobile/src/graphql/": {
              preset: "client",
              presetConfig,
              documents: ["packages/mobile/src"],
              config,
            },
          },
        },
      },
    },
  },
};

export default iGqlConfig;
