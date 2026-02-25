const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import("jest").Config} */
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)"],
  collectCoverageFrom: [
    "<rootDir>/**/*.{ts,tsx}",
    "!<rootDir>/.next/**",
    "!**/node_modules/**",
    "!**/*.d.ts",
    "!<rootDir>/jest.config.js",
    "!**/__tests__/**",
  ],
};

module.exports = createJestConfig(customJestConfig);

