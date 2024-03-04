import type { Linter } from "eslint";
import eslintPluginVitest from "eslint-plugin-vitest";

const vitestConfig: Linter.FlatConfig = {
  files: ["**/*.test.ts", "**/*.test.tsx"],
  plugins: {
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
  ignores: ["**/mobile/**"],
};

export default vitestConfig;
