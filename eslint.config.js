import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import eslintJs from "@eslint/js";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import eslintParserTypescript from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginJest from "eslint-plugin-jest";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginNode from "eslint-plugin-node";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactNative from "eslint-plugin-react-native";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type {import('@types/eslint').Linter.FlatConfig[]}
 */
const eslintConfig = [
  {
    ignores: [
      "**/*.d.ts",
      "**/node_modules/**",
      "**/coverage/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/*.json",
    ],
  },
  eslintJs.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      import: eslintPluginImport,
      jsdoc: eslintPluginJsdoc,
      unicorn: eslintPluginUnicorn,
    },
    settings: {
      jsdoc: {
        tagNamePreference: {
          returns: "return",
        },
      },
    },
    rules: {
      ...eslintPluginImport.configs.recommended.rules,
      "import/export": "off",
      // Possible Errors
      "no-undef": "off",
      "spaced-comment": ["error", "always"],
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
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
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
      // jsdoc
      "jsdoc/no-types": "off",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      // Don't require jsdoc
      "jsdoc/require-jsdoc": "off",
      // Imports
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "import/no-cycle": "off",
      "import/no-unused-modules": "off",
      "import/no-deprecated": "off",
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "parent", "sibling", "index"],
          "pathGroups": [
            {
              pattern: "@custom-lib/**",
              group: "external",
              position: "after",
            },
          ],
          "pathGroupsExcludedImportTypes": ["builtin"],
          "alphabetize": {
            order: "asc",
          },
          "newlines-between": "always",
        },
      ],
      "sort-imports": [
        "error",
        {
          allowSeparatedGroups: true,
          ignoreDeclarationSort: true,
        },
      ],
      "import/no-unresolved": "off",
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
      "unicorn/prefer-spread": "error",
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
    files: ["**/*.spec"],
    processor: eslintPluginJest.processors[".spec"],
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      // Assume we're pretty limited in what we can use in CJS
      ecmaVersion: 2015,
      sourceType: "script",
    },
  },
  {
    ...eslintPluginImport.configs.typescript,
    files: ["**/*.ts", "**/*.tsx"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: eslintParserTypescript,
      parserOptions: {
        project: normalize(join(__dirname, "tsconfig.json")),
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypescript,
    },

    rules: {
      ...eslintPluginTypescript.configs.recommended.rules,
      ...eslintPluginTypescript.configs["eslint-recommended"].rules,
      ...eslintPluginTypescript.configs["strict-type-checked"].rules,
      ...eslintPluginTypescript.configs.strict.rules,
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/prefer-for-of": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "Use an object with `as const` instead of an enum.",
        },
      ],
      "no-redeclare": "off",
      "no-dupe-class-members": "off",
    },
  },
  {
    files: ["**/*.snap"],
    processor: eslintPluginJest.processors[".snap"],
  },
  {
    files: ["**/*.test.*"],
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
      ...eslintPluginJest.configs.style.rules,
      "jest/prefer-todo": "warn",
      "jest/consistent-test-it": ["error", { fn: "test" }],
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...eslintPluginJest.configs.recommended.env.globals,
      },
      parserOptions: {
        ecmaFeatures: {},
      },
    },
  },
  {
    files: [
      normalize("packages/**/common/lib/**/**/*.js"),
      normalize("packages/**/common/lib/**/**/*.ts"),
      normalize("packages/**/common/lib/**/**/*.jsx"),
      normalize("packages/**/common/lib/**/**/*.tsx"),
    ],
    languageOptions: {
      globals: {
        ...globals["shared-node-browser"],
        ...globals.es2015,
      },
      parserOptions: {
        project: normalize(join(__dirname, "packages/common/tsconfig.json")),
      },
    },
  },
  {
    files: [
      normalize("packages/**/mobile/**/**/*.js"),
      normalize("packages/**/mobile/**/**/*.ts"),
      normalize("packages/**/mobile/**/**/*.jsx"),
      normalize("packages/**/mobile/**/**/*.tsx"),
    ],
    plugins: {
      "react": eslintPluginReact,
      "react-native": eslintPluginReactNative,
      "react-hooks": eslintPluginReactHooks,
    },
    languageOptions: {
      globals: {
        ...eslintPluginReactNative.environments["react-native"].globals,
      },
      parserOptions: {
        project: normalize(join(__dirname, "packages/mobile/tsconfig.json")),
      },
    },
    rules: {
      ...eslintPluginReact.configs["jsx-runtime"].rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactNative.configs.all.rules,
      "react-native/no-inline-styles": "off", // TODO: tighten this up
      "react-native/no-color-literals": "off", // TODO: tighten this up
      "react-native/no-raw-text": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: [
      normalize("packages/**/portal/**/**/*.js"),
      normalize("packages/**/portal/**/**/*.ts"),
      normalize("packages/**/portal/**/**/*.jsx"),
      normalize("packages/**/portal/**/**/*.tsx"),
    ],
    plugins: {
      "react": eslintPluginReact,
      "react-hooks": eslintPluginReactHooks,
      "react-refresh": eslintPluginReactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.es2017,
        ...globals.browser,
      },
      parserOptions: {
        project: normalize(join(__dirname, "packages/portal/tsconfig.json")),
      },
    },
    rules: {
      ...eslintPluginReact.configs["jsx-runtime"].rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: [
      normalize("packages/**/server/src/**/*.js"),
      normalize("packages/**/server/src/**/*.ts"),
    ],
    plugins: {
      node: eslintPluginNode,
    },
    languageOptions: {
      parserOptions: {
        project: normalize(join(__dirname, "packages/server/tsconfig.json")),
      },
      globals: {
        ...globals.nodeBuiltin,
        ...eslintPluginNode.configs["recommended-module"].globals,
      },
    },
    rules: {
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
    settings: {},
  },
  eslintConfigPrettier,
];

export default eslintConfig;
