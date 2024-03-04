import { fileURLToPath } from "url";
import eslintPluginTypescript from "@typescript-eslint/eslint-plugin";
import eslintParserTypescript from "@typescript-eslint/parser";
import { extractPluginRules } from "./util.js";
const typescriptConfig = [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: eslintParserTypescript,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": eslintPluginTypescript,
        },
        rules: {
            ...extractPluginRules(eslintPluginTypescript, "recommended"),
            ...extractPluginRules(eslintPluginTypescript, "eslint-recommended"),
            ...extractPluginRules(eslintPluginTypescript, "strict-type-checked"),
            ...extractPluginRules(eslintPluginTypescript, "strict"),
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
        files: ["eslint/**/*.ts", "eslint/**/*.tsx"],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: fileURLToPath(new URL("..", import.meta.url)),
            },
        },
    },
];
export default typescriptConfig;
