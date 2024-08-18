import eslintJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginNode from "eslint-plugin-n";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactNative from "eslint-plugin-react-native";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginVitest from "eslint-plugin-vitest";
import eslintPluginSortImports from "eslint-plugin-simple-import-sort";
import globals from "globals";
import eslintTs from "typescript-eslint";
import { fileURLToPath } from "node:url";
import { dirname } from "path";
const projectRoot = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
function getTsEslintRulesFrom(overrides, ...configsList) {
    let rules = {};
    for (const configs of configsList) {
        for (const config of configs) {
            rules = { ...rules, ...config.rules };
        }
    }
    return { ...rules, ...overrides };
}
export default eslintTs.config({
    ignores: [
        "**/*.d.ts",
        "**/node_modules/**/*",
        "**/coverage/**/*",
        "**/dist/**/*",
        "**/build/**/*",
        "**/.next/**/*",
        "**/*.json",
        "packages/common/lib/graphql-client-*/**/*",
        ".yarn/**/*",
        "compose-volumes/**/*",
        "eslint/out/*.js",
        "packages/mobile/.expo/**/*",
    ],
}, eslintJs.configs.recommended, {
    languageOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
    },
    linterOptions: {
        reportUnusedDisableDirectives: true,
    },
    plugins: {
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
        // Possible Errors
        "no-undef": "off",
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
}, {
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
        "react-refresh/only-export-components": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",
    },
}, {
    languageOptions: {
        parser: eslintTs.parser,
        parserOptions: {
            projectService: {
                allowDefaultProject: [
                    "yarn.config.cjs",
                    "eslint.config.js",
                    "packages/mobile/babel.config.cjs",
                    "packages/mobile/metro.config.cjs",
                ],
                defaultProject: "tsconfig.json",
            },
            tsconfigRootDir: projectRoot,
        },
    },
    plugins: {
        "@typescript-eslint": eslintTs.plugin,
    },
    rules: getTsEslintRulesFrom({
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
        "@typescript-eslint/unbound-method": [
            "error",
            {
                ignoreStatic: true,
            },
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
        "@typescript-eslint/restrict-template-expressions": [
            "error",
            {
                allowNumber: true,
            },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "warn",
    }, eslintTs.configs.strictTypeChecked, eslintTs.configs.stylisticTypeChecked),
}, {
    files: ["packages/common/**/*"],
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: { ...globals.es2020, ...globals["shared-node-browser"] },
    },
}, {
    files: ["packages/portal/**/*"],
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: { ...globals.es2020, ...globals.browser },
    },
}, {
    files: ["packages/mobile/**/*"],
    plugins: {
        "react-native": eslintPluginReactNative,
    },
    languageOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        globals: {
            ...globals.es2019,
            ...eslintPluginReactNative.environments?.["react-native"]?.globals,
        },
    },
    rules: {
        "react-native/no-unused-styles": 2,
        "react-native/no-inline-styles": "off",
        "react-native/no-color-literals": "off",
        "react-native/sort-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-raw-text": "off",
        "react-native/no-single-element-style-arrays": 2,
        "unicorn/prefer-top-level-await": "off",
        "@typescript-eslint/no-require-imports": "off",
    },
}, {
    files: ["packages/server/src/**/*"],
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
        "node/shebang": "error",
        "node/no-unpublished-import": "off",
    },
}, eslintConfigPrettier, {
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
    // TODO: switch the mobile tests over to vitest
    ignores: ["**/mobile/**/*"],
}, {
    files: ["packages/**/*.cjs", "*.cjs"],
    languageOptions: {
        // Assume we're pretty limited in what we can use in CJS
        ecmaVersion: 2017,
        sourceType: "commonjs",
    },
    rules: {
        "@typescript-eslint/no-require-imports": "off",
    },
}, {
    plugins: {
        "sort-imports": eslintPluginSortImports,
    },
    rules: {
        "sort-imports/imports": "error",
        "sort-imports/exports": "error",
    },
});
