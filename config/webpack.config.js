/* eslint-env node */
const path = require("path")
// const webpack = require('webpack')

module.exports = {
  cache: true,
  entry: path.resolve('src/js/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react', 'stage-2']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
