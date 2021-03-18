const path = require("path");
const Html = require("html-webpack-plugin");
const Css = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash:20].js",
  },

  devServer: { compress: true },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: Css.loader,
          },
          {
            loader: "css-loader",
          },
        ],
      },
    ],
  },

  plugins: [
    new Html({
      template: "src/index.html",
      inject: "body",
      filename: "index.html",
    }),
    new Css(),
  ],
};
