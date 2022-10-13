const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./pages/test.js",
  resolve: {
    fallback: {
      fs: false,
      path: false,
      util: false,
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./pages/test.js",
      filename: "test.js",
    }),
  ],
};
