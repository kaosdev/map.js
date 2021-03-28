const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { babel } = require("@rollup/plugin-babel");
const istanbul = require("rollup-plugin-istanbul");

module.exports = function (config) {
  config.set({
    basePath: "",
    plugins: [
      "karma-jasmine",
      "karma-rollup-preprocessor",
      "karma-jasmine-html-reporter",
      "karma-chrome-launcher",
      "karma-spec-reporter",
      "karma-coverage",
    ],
    frameworks: ["jasmine"],

    files: [{ pattern: "src/**/*.spec.ts", watched: false }],

    preprocessors: {
      "**/*.ts": ["rollup"],
    },

    rollupPreprocessor: {
      plugins: [
        nodeResolve({
          exclude: "node_modules/**",
          extensions: [".js", ".ts"],
        }),
        babel({
          babelHelpers: "bundled",
          exclude: "node_modules/**",
          extensions: [".js", ".ts"],
          plugins: [
            ["@babel/plugin-transform-typescript", { allowNamespaces: true }],
          ],
        }),
        istanbul({
          exclude: ["src/**/*.spec.ts", "node_modules/**"],
        }),
      ],
      output: {
        format: "iife",
        name: "bundle",
        sourcemap: "inline",
      },
    },

    coverageReporter: {
      type: "lcov",
      dir: "coverage/",
      subdir: ".",
      includeAllSources: true,
    },

    browsers: ["ChromeHeadless"],

    reporters: ["kjhtml", "spec", "coverage"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,

    client: {
      clearContext: false,
      captureConsole: true,
    },
  });
};
