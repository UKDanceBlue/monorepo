import type { ESLint, Linter } from "eslint";
import eslintPluginNode from "eslint-plugin-node";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactNative from "eslint-plugin-react-native";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

import { extractPluginRules } from "./util.js";

const reactPlugins = [
  {
    plugin: eslintPluginReact,
    ruleSets: ["jsx-runtime"],
    globals: [],
    name: "react",
  },
  {
    plugin: eslintPluginReactHooks,
    ruleSets: ["recommended"],
    globals: [],
    name: "react-hooks",
  },
];

export default [
  // @ukdanceblue/common
  makePackageConfig("common/lib", [], {}, {}, [
    "es2015",
    "shared-node-browser",
  ]),
  // @ukdanceblue/portal
  makePackageConfig(
    "portal/src",
    [
      ...reactPlugins,
      {
        plugin: eslintPluginReactRefresh,
        ruleSets: [],
        globals: [],
        name: "react-refresh",
      },
    ],
    {
      "react-refresh/only-export-components": "warn",
    },
    {
      react: {
        version: "detect",
      },
    },
    ["es2017", "browser"]
  ),
  // @ukdanceblue/server
  makePackageConfig(
    "server/src",
    [
      {
        plugin: eslintPluginNode,
        ruleSets: [],
        globals: ["recommended-module"],
        name: "node",
      },
    ],
    {
      "no-process-exit": "error",
      "node/no-deprecated-api": "error",
      "node/no-extraneous-import": "error",
      "node/no-extraneous-require": "error",
      "node/no-exports-assign": "error",
      "node/no-missing-require": "error",
      "node/no-unpublished-bin": "error",
      "node/no-unpublished-import": "error",
      "node/no-unpublished-require": "error",
      "node/process-exit-as-throw": "error",
      "node/shebang": "error",
    },
    {},
    ["nodeBuiltin"]
  ),
  // @ukdanceblue/mobile
  makePackageConfig(
    "mobile",
    [
      ...reactPlugins,
      {
        plugin: eslintPluginReactNative,
        ruleSets: ["all"],
        globals: [],
        name: "react-native",
      },
    ],
    {
      "react-native/no-inline-styles": "off", // TODO: tighten this up
      "react-native/no-color-literals": "off", // TODO: tighten this up
      "react-native/no-raw-text": "off",
      "unicorn/prefer-top-level-await": "off",
    },
    {
      react: {
        version: "detect",
      },
    },
    [],
    {
      languageOptions: {
        globals: {
          ...eslintPluginReactNative.environments?.["react-native"]?.globals,
        },
      },
    }
  ),
];

interface PackagePluginConfig {
  plugin: ESLint.Plugin;
  ruleSets: string[];
  globals: string[];
  name: string;
}

function makePackageConfig(
  folder: string,
  plugins: PackagePluginConfig[],
  rules: Linter.RulesRecord,
  settings: Record<string, unknown>,
  globalKeys: (keyof typeof globals)[],
  overrides?: Partial<Linter.FlatConfig>
): Linter.FlatConfig {
  const base = {
    files: [
      `packages/**/${folder}/**/**/*.js`,
      `packages/**/${folder}/**/**/*.ts`,
      `packages/**/${folder}/**/**/*.jsx`,
      `packages/**/${folder}/**/**/*.tsx`,
    ],
    plugins: plugins.reduce<Record<string, ESLint.Plugin>>((acc, plugin) => {
      acc[plugin.name] = plugin.plugin;
      return acc;
    }, {}),
    languageOptions: {
      globals: {
        ...globalKeys.reduce<Record<string, boolean>>((acc, key) => {
          return { ...acc, ...globals[key] };
        }, {}),
        ...plugins.reduce<Record<string, boolean>>((acc, plugin) => {
          plugin.globals.forEach((global) => {
            return {
              ...acc,
              ...(plugin.plugin.configs?.[global] as ESLint.ConfigData<never>)
                .globals,
            };
          });
          return acc;
        }, {}),
      },
      parserOptions: {
        project: `./packages/${folder}/tsconfig.json`,
      },
    },
    rules: {
      ...plugins.reduce((acc, plugin) => {
        plugin.ruleSets.forEach((ruleSet) => {
          const rules = extractPluginRules(plugin.plugin, ruleSet);
          if (rules) {
            acc = {
              ...acc,
              ...rules,
            };
          }
        });
        return acc;
      }, {}),
      ...rules,
    },
    settings,
  };

  // Deep merge the base config with the overrides
  return {
    ...base,
    ...overrides,
    languageOptions: {
      ...base.languageOptions,
      ...overrides?.languageOptions,
      parserOptions: {
        ...base.languageOptions.parserOptions,
        ...overrides?.languageOptions?.parserOptions,
      },
    },
    rules: {
      ...base.rules,
      ...overrides?.rules,
    },
    settings: {
      ...base.settings,
      ...overrides?.settings,
    },
  };
}
