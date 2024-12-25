import { fileURLToPath } from "node:url";

import eslintJs from "@eslint/js";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import eslintPluginVitest from "@vitest/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginNode from "eslint-plugin-n";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginSortImports from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import { dirname } from "path";
import eslintTs from "typescript-eslint";
const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));

/**
 * @param {import("@typescript-eslint/utils/ts-eslint").FlatConfig.Rules} overrides
 * @param {import("@typescript-eslint/utils/ts-eslint").FlatConfig.ConfigArray[]} configsList
 * @returns {import("@typescript-eslint/utils/ts-eslint").FlatConfig.Rules}
 */
function getTsEslintRulesFrom(overrides, ...configsList) {
  /** @type {import("@typescript-eslint/utils/ts-eslint").FlatConfig.Rules}*/
  let rules = {};
  for (const configs of configsList) {
    for (const config of configs) {
      rules = { ...rules, ...config.rules };
    }
  }
  return { ...rules, ...overrides };
}

export default eslintTs.config(
  {
    name: "Global Ignored Files",
    ignores: [
      "*.d.ts",
      "node_modules/**/*",
      "coverage/**/*",
      "packages/*/dist/**/*",
      "build/**/*",
      ".next/**/*",
      "*.json",
      ".yarn/**/*",
      "compose-volumes/**/*",
      "packages/mobile/.expo",
      "**/typedoc.config.mjs",
    ],
  },
  {
    name: "ESLint Recommended",
    ...eslintJs.configs.recommended,
  },
  {
    name: "Global",
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      // Possible Errors
      "radix": "error",
      "yoda": "error",
      "prefer-template": "warn",
      "curly": "error",
      "grouped-accessor-pairs": "error",
      "no-implicit-coercion": [
        "error",
        {
          allow: ["!!"],
        },
      ],
      "no-implicit-globals": "error",
      "no-lonely-if": "error",
      "no-var": "error",
      "prefer-const": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      // TODO: Enable these rules and use them to guide cleaning up the codebase, figure out exact limits later
      // "complexity": ["warn", { max: 10, variant: "modified" }],
      // "max-lines": [
      //   "warn",
      //   { max: 300, skipBlankLines: true, skipComments: true },
      // ],
      // "max-nested-callbacks": ["warn", { max: 4 }],
      // "max-depth": ["warn", { max: 4 }],
      // "max-params": ["warn", { max: 4 }],
      "no-useless-concat": "error",
      "prefer-numeric-literals": "error",
      "prefer-object-spread": "error",
      "array-callback-return": "error",
      "no-await-in-loop": "error",
      "no-constant-binary-expression": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "require-atomic-updates": ["error", { allowProperties: true }],
      "eqeqeq": ["error", "smart"],
      // Unicorn Plugin
      "unicorn/better-regex": "error",
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-destructuring": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/custom-error-definition": "off",
      "unicorn/error-message": "error",
      "unicorn/escape-case": "error",
      "unicorn/expiring-todo-comments": "error",
      "unicorn/explicit-length-check": "error",
      // TODO: decide on a convention "unicorn/filename-case": "error",
      "unicorn/new-for-builtins": "error",
      "unicorn/no-array-method-this-argument": "error",
      "unicorn/no-array-push-push": "error",
      "unicorn/no-await-expression-member": "error",
      "unicorn/no-console-spaces": "error",
      "unicorn/no-hex-escape": "error",
      "unicorn/no-instanceof-array": "error",
      "unicorn/no-new-array": "error",
      "unicorn/no-new-buffer": "error",
      "unicorn/no-object-as-default-parameter": "error",
      "unicorn/no-thenable": "error",
      "unicorn/no-this-assignment": "error",
      "unicorn/no-typeof-undefined": "error",
      "unicorn/no-unreadable-iife": "error",
      "unicorn/no-useless-length-check": "error",
      "unicorn/no-useless-promise-resolve-reject": "error",
      "unicorn/no-useless-spread": "error",
      "unicorn/no-zero-fractions": "error",
      "unicorn/number-literal-case": "error",
      "unicorn/numeric-separators-style": "error",
      "unicorn/prefer-array-find": "error",
      "unicorn/prefer-array-flat": "error",
      "unicorn/prefer-array-flat-map": "error",
      "unicorn/prefer-array-index-of": "error",
      "unicorn/prefer-array-some": "error",
      "unicorn/prefer-code-point": "error",
      "unicorn/prefer-date-now": "error",
      "unicorn/prefer-default-parameters": "error",
      "unicorn/prefer-export-from": "error",
      "unicorn/prefer-includes": "error",
      "unicorn/prefer-logical-operator-over-ternary": "error",
      "unicorn/prefer-math-trunc": "error",
      "unicorn/prefer-modern-math-apis": "error",
      "unicorn/prefer-native-coercion-functions": "error",
      "unicorn/prefer-negative-index": "error",
      "unicorn/prefer-number-properties": "error",
      "unicorn/prefer-object-from-entries": "error",
      "unicorn/prefer-prototype-methods": "error",
      "unicorn/prefer-reflect-apply": "error",
      "unicorn/prefer-regexp-test": "error",
      "unicorn/prefer-set-has": "error",
      "unicorn/prefer-set-size": "error",
      "unicorn/prefer-string-replace-all": "error",
      "unicorn/prefer-string-starts-ends-with": "error",
      "unicorn/prefer-string-trim-start-end": "error",
      "unicorn/prefer-switch": "error",
      "unicorn/prefer-ternary": ["error", "only-single-line"],
      "unicorn/prefer-top-level-await": "error",
      "unicorn/prefer-type-error": "error",
      "unicorn/relative-url-style": "error",
      "unicorn/require-array-join-separator": "error",
      "unicorn/require-number-to-fixed-digits-argument": "error",
      "unicorn/switch-case-braces": "error",
      "unicorn/text-encoding-identifier-case": "error",
      "unicorn/throw-new-error": "error",
      // Personal preferences
      "class-methods-use-this": "off",
    },
  },
  {
    name: "Baseline React Configuration",
    files: ["packages/**/*.jsx", "packages/**/*.tsx"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-refresh": eslintPluginReactRefresh,
      "react-hooks": eslintPluginReactHooks,
      "react": eslintPluginReact,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // We don't need to import React in every file for JSX
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },
  {
    name: "Baseline TypeScript",
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: eslintTs.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: projectRoot,
      },
    },
    plugins: {
      "@typescript-eslint": eslintTs.plugin,
    },
    rules: getTsEslintRulesFrom(
      {
        // We can disable this one because we're using better-typescript-lib
        "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
        // This is disabled because vscode already shows us deprecated methods
        "@typescript-eslint/no-deprecated": "off",
        // This is disabled because typescript already shows us unused variables
        "@typescript-eslint/no-unused-vars": "off",
        // Non-null assertions are fine in limited cases
        "@typescript-eslint/no-non-null-assertion": "off",
        // We don't need to enforce this
        "@typescript-eslint/no-confusing-void-expression": "off",
        // Disabled for performance
        "@typescript-eslint/no-misused-promises": "off",
        // Disabled for performance
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/return-await": "error",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
          },
        ],
        "@typescript-eslint/consistent-type-exports": [
          "error",
          { fixMixedExportsWithInlineTypeSpecifier: false },
        ],
        "@typescript-eslint/unbound-method": [
          "error",
          {
            ignoreStatic: true,
          },
        ],
        "no-restricted-syntax": [
          "error",
          {
            selector: "TSEnumDeclaration",
            message: "Use an object with `as const` instead of an enum.",
          },
        ],
        "@typescript-eslint/restrict-template-expressions": [
          "error",
          {
            allowNumber: true,
          },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "off",
      },
      eslintTs.configs.strictTypeChecked,
      eslintTs.configs.stylisticTypeChecked
    ),
  },
  {
    name: "Non-package files",
    files: [
      "./*.ts",
      "./scripts/*.ts",
      "./packages/portal/vite.config.ts",
      "./packages/common/jest.config.ts",
      "./yarn.config.cjs",
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.es2020, ...globals["shared-node-browser"] },
    },
  },
  {
    name: "Common-specific",
    files: ["packages/common/**/*.ts", "packages/common/**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.es2020, ...globals["shared-node-browser"] },
    },
  },
  {
    name: "Portal-specific",
    files: ["packages/portal/**/*.ts", "packages/portal/**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: { ...globals.es2020, ...globals.browser },
    },
  },
  {
    name: "Mobile-specific",
    files: ["packages/mobile/**/*.ts", "packages/mobile/**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.es2021,
        ...globals["shared-node-browser"],
      },
    },
    rules: {
      // There is no top-level await in React Native
      "unicorn/prefer-top-level-await": "off",
      // Sometimes we need to use require in React Native
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    name: "GraphQL (Portal)",
    files: ["packages/portal/**/*.ts", "packages/portal/**/*.tsx"],
    processor: graphqlPlugin.processor,
  },
  {
    name: "GraphQL (Mobile)",
    files: ["packages/mobile/**/*.ts", "packages/mobile/**/*.tsx"],
    processor: graphqlPlugin.processor,
  },
  // {
  //   name: "GraphQL",
  //   files: ["packages/**/*.graphql"],
  //   languageOptions: {
  //     parser: graphqlPlugin.parser,
  //   },
  //   plugins: {
  //     "@graphql-eslint": graphqlPlugin,
  //   },
  //   rules: {
  //     ...graphqlPlugin.configs["flat/operations-recommended"].rules,
  //     "@graphql-eslint/require-selections": "off",
  //   },
  // },
  {
    name: "Server-specific",
    files: ["packages/server/**/*.ts"],
    plugins: { node: eslintPluginNode },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.es2022, ...globals.node },
    },
    rules: {
      "node/no-deprecated-api": "error",
      "node/no-extraneous-import": "error",
      "node/no-extraneous-require": "error",
      "node/no-exports-assign": "error",
      "node/no-missing-require": "error",
      "node/no-unpublished-bin": "error",
      "node/no-unpublished-require": "error",
      "node/process-exit-as-throw": "error",
      // "node/no-unpublished-import": "off",
    },
  },
  {
    name: "Prettier",
    ...eslintConfigPrettier,
  },
  {
    name: "Vitest",
    files: ["packages/*.test.ts", "packages/*.test.tsx"],
    plugins: {
      // THIS COULD BE AN ISSUE!!!
      vitest: eslintPluginVitest,
    },
    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
      "vitest/consistent-test-filename": "warn",
      "vitest/consistent-test-it": "warn",
      "vitest/max-nested-describe": "warn",
      "vitest/no-alias-methods": "warn",
      "vitest/no-conditional-expect": "warn",
      "vitest/no-conditional-in-test": "warn",
      "vitest/no-conditional-tests": "warn",
      "vitest/no-disabled-tests": "warn",
      "vitest/no-duplicate-hooks": "warn",
      "vitest/no-focused-tests": "warn",
      "vitest/no-interpolation-in-snapshots": "warn",
      "vitest/no-large-snapshots": "warn",
      "vitest/no-mocks-import": "warn",
      "vitest/no-restricted-matchers": "warn",
      "vitest/no-restricted-vi-methods": "warn",
      "vitest/no-standalone-expect": "warn",
      "vitest/no-test-prefixes": "warn",
      "vitest/no-test-return-statement": "warn",
      "vitest/prefer-called-with": "warn",
      "vitest/prefer-comparison-matcher": "warn",
      "vitest/prefer-each": "warn",
      "vitest/prefer-equality-matcher": "warn",
      "vitest/prefer-expect-assertions": [
        "warn",
        {
          onlyFunctionsWithAsyncKeyword: true,
          onlyFunctionsWithExpectInCallback: true,
        },
      ],
      "vitest/prefer-expect-resolves": "warn",
      "vitest/prefer-hooks-in-order": "warn",
      "vitest/prefer-hooks-on-top": "warn",
      "vitest/prefer-lowercase-title": "warn",
      "vitest/prefer-mock-promise-shorthand": "warn",
      "vitest/prefer-snapshot-hint": "warn",
      "vitest/prefer-spy-on": "warn",
      "vitest/prefer-strict-equal": "warn",
      "vitest/prefer-to-be": "warn",
      "vitest/prefer-to-be-object": "warn",
      "vitest/prefer-to-contain": "warn",
      "vitest/prefer-to-have-length": "warn",
      "vitest/prefer-todo": "warn",
      "vitest/require-hook": "warn",
      "vitest/require-to-throw-message": "warn",
      "vitest/require-top-level-describe": "warn",
    },
    languageOptions: {
      globals: eslintPluginVitest.environments.env.globals,
    },
  },
  {
    name: "CJS Rules",
    files: ["packages/**/*.cjs", "*.cjs"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
    },
    rules: {
      // We can't use import/export in CJS
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    name: "Sort Imports",
    plugins: {
      "sort-imports": eslintPluginSortImports,
    },
    rules: {
      "sort-imports/imports": "error",
      "sort-imports/exports": "error",
    },
  }
);
