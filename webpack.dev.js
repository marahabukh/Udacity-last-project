import path, { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const currentFile = fileURLToPath(import.meta.url);
const rootDir = dirname(currentFile);

export default {
  mode: "development",
  entry: "./src/client/main.js",
  output: {
    filename: "app.bundle.js",
    path: resolve(rootDir, "public"),
    library: "MainApp",
    libraryTarget: "var",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: true,
    }),
    new HtmlWebpackPlugin({
      template: "./src/client/templates/main.html",
      filename: "index.html",
    }),
  ],
};
