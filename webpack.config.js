const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = 'development';
const stats = mode === 'development' ? 'errors-warnings' : { children: false };
const devtool = mode === 'development' ? 'eval-cheap-source-map' : false;

module.exports = {
  mode: 'development',
  entry: {
    macmillan: './dev/scripts/pages/index.js',
    register: './dev/scripts/pages/register.js',
    login: './dev/scripts/pages/login.js',
    styles: './dev/styles/index.scss',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/assets'),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  resolve: {
    modules: [
      "node_modules"
    ]
  },
  stats: stats,
  devtool: devtool,
};
