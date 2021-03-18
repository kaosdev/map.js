import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import { terser } from "rollup-plugin-terser";

const sassPlugin = scss({
  output: "dist/css/style.css",
  failOnError: true,
  sass: require("sass"),
  outputStyle: "compressed",
});

const copySass = copy({
  targets: [{ src: "src/styles/**/*", dest: "dist/scss" }],
});

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/map.js",
      format: "esm",
    },
    plugins: [sassPlugin, copySass, nodeResolve(), typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/map.min.js",
      format: "esm",
    },
    plugins: [
      sassPlugin,
      copySass,
      nodeResolve(),
      typescript(),
      terser(),
      cleanup({
        comments: "none",
      }),
    ],
  },
];
