import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "jest-expo",
  transform: {
    "^.+\\.tsx?$": [ "ts-jest", { tsConfig: { jsx: "react-jsx" } } ],
    // "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
  },
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/jest.setup.js",
  ],
  moduleFileExtensions: [
    "js", "ts", "tsx"
  ],
  transformIgnorePatterns: ["node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base|react-native-svg)"],
  coverageReporters: [
    "json-summary", "text", "lcov"
  ],
  "setupFilesAfterEnv": [ "@testing-library/jest-native/extend-expect", "<rootDir>/jest.setup.ts" ],
  automock: false,
};

export default jestConfig;
