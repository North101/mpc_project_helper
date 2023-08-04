const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');

const config = {
  entry: {
    content: path.join(__dirname, "src/content.tsx"),
    background: path.join(__dirname, "src/background.ts"),
  },
  devtool: "source-map",
  output: { path: path.join(__dirname, "dist"), filename: "[name].js" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    fallback: {
      util: require.resolve("util/"),
    }
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new WebpackExtensionManifestPlugin({
      config: './manifest.json',
      pkgJsonProps: [
        'version'
      ],
    }),
  ],
};

module.exports = config;
