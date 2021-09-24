module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/.socialgouv"],
  transform: {
    "\\.[j]sx?$": "babel-jest",
  },
};
