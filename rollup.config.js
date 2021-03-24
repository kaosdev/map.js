import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "esm/map.js",
      format: "esm",
    },
    plugins: [nodeResolve(), typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "esm/map.min.js",
      format: "esm",
    },
    plugins: [
      nodeResolve(),
      typescript(),
      terser(),
      cleanup({
        comments: "none",
      }),
    ],
  },
];
