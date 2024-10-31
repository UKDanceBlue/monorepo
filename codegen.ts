import { resolvers } from "graphql-scalars";

import { readdirSync } from "fs";

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
  },
  scalars: {
    LuxonDateRange: "string",
    LuxonDuration: "string",
    GlobalId: "string",
    ...graphqlScalarsClientDefs,
  },
  strictScalars: true,
  immutableTypes: true,
  emitLegacyCommonJSImports: false,
};

const generates: CodegenConfig["generates"] = {};

// We do this readdir thing in case a partial copy of the monorepo is being used
const packages = readdirSync("./packages");
if (packages.includes("mobile")) {
  generates["packages/mobile/src/graphql/"] = {
    preset: "client",
    presetConfig,
    documents: ["packages/mobile/src"],
    config,
  };
}
if (packages.includes("portal")) {
  generates["packages/portal/graphql/"] = {
    preset: "client",
    presetConfig,
    documents: ["packages/portal/src"],
    config,
  };
}
const codegenConfig: CodegenConfig = {
  schema: "schema.graphql",
  hooks: {
    onError: (e) => {
      console.error("Error generating GraphQL client:", e);
    },
  },
  noSilentErrors: true,
  emitLegacyCommonJSImports: false,
  generates,
  ignoreNoDocuments: true,
  config,
};

export default codegenConfig;
