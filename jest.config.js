module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    // transform files with ts-jest
    "^.+\\.(js|ts)$": "ts-jest",
  },
  transformIgnorePatterns: [
    // allow lit-html transformation
    "node_modules/(?!lit-html)",
  ],
};
