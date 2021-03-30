import { nodeResolve } from "@rollup/plugin-node-resolve";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";

export default (args) => {
  const isProd = args.configProduction;
  const plugins = [
    nodeResolve(),
    ...(isProd
      ? [
          terser(),
          cleanup({
            comments: "none",
          }),
        ]
      : []),
  ];

  return {
    input: "./src/docs.js",
    output: {
      dir: "./assets/javascript/",
      format: "esm",
      chunkFileNames: isProd ? "[name]-[hash].js" : "[name].js",
    },
    plugins,
  };
};
