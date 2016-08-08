'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var precss            = require('precss');
var autoprefixer      = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    // new ExtractTextPlugin( "bundle.css" ),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    // common lib
    new webpack.ProvidePlugin({
      '$': 'jquery',
      '_': 'lodash',
      'Promise': 'bluebird',
      'fetch': 'whatwg-fetch'
    }),
    // copy dependencies
    new CopyWebpackPlugin([
      { from: 'src/dependencies', to: 'dependencies' }
    ]),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()

  ],
  eslint: {
    configFile: './.eslintrc'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ["eslint-loader"],
        exclude: [
          /node_modules/
        ]

      }
    ],
    loaders: [
      // js/jsx
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: __dirname
      },
      // css
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
        // loader:  ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      // sass
      { 
        test: /\.scss$/,
        loader: 'style!css!postcss!sass'
      }
      ] 
  },
  postcss: function () {
    return [precss, autoprefixer];
  }
}