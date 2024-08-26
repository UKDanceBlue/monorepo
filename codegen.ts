import { resolvers } from "graphql-scalars";

import { readdirSync } from "fs";

import type { CodegenConfig } from "@graphql-codegen/cli";
import type { ClientPresetConfig } from "@graphql-codegen/client-preset";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript";
import type { GraphQLScalarTypeExtensions } from "graphql";

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

const presetConfig: ClientPresetConfig = {
  fragmentMasking: {
    unmaskFunctionName: "getFragmentData",
  },
};

const config: TypeScriptPluginConfig = {
  useTypeImports: true,
  enumsAsConst: true,
  immutableTypes: true,
  enumValues: {
    AuthSource: "../index.js#AuthSource",
    // AccessLevel: "../index.js#AccessLevel",
    DbRole: "../index.js#DbRole",
    // CommitteeRole: "../index.js#CommitteeRole",
    // CommitteeIdentifier: "../index.js#CommitteeIdentifier",
    // ErrorCode: "../index.js#ErrorCode",
    MembershipPositionType: "../index.js#MembershipPositionType",
    TeamLegacyStatus: "../index.js#TeamLegacyStatus",
    TeamType: "../index.js#TeamType",
    SortDirection: "../index.js#SortDirection",
    // Comparator: "../index.js#Comparator",
    NumericComparator: "../index.js#NumericComparator",
    StringComparator: "../index.js#StringComparator",
    // IsComparator: "../index.js#IsComparator",
  },
  scalars: {
    LuxonDateRange: "string",
    LuxonDuration: "string",
    GlobalId: "string",
    ...graphqlScalarsClientDefs,
  },
  strictScalars: true,
};

const generates: CodegenConfig["generates"] = {};
const packages = readdirSync("./packages");
if (packages.includes("mobile")) {
  generates["./packages/common/lib/graphql-client-mobile/"] = {
    preset: "client",
    presetConfig,
    config,
    documents: [
      "./packages/mobile/src/**/*.ts",
      "./packages/mobile/src/**/*.tsx",
    ],
  };
}
if (packages.includes("portal")) {
  generates["./packages/common/lib/graphql-client-portal/"] = {
    preset: "client",
    presetConfig,
    config,
    documents: [
      "./packages/portal/src/**/*.ts",
      "./packages/portal/src/**/*.tsx",
    ],
  };
}
const codegenConfig: CodegenConfig = {
  schema: "schema.graphql",
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client:", e);
    },
  },
  emitLegacyCommonJSImports: false,
  generates,
  watch: true,
};

export default codegenConfig;
