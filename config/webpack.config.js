/* eslint-env node */
const path = require("path")
// const webpack = require('webpack')

module.exports = {
  cache: true,
  entry: path.resolve('src/js/index.js'),
  output: {
    path: path.resolve('dist'),
    // publicPath: 'dist/',
    filename: 'bundle.min.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   // enable HMR globally
  //
  //   new webpack.NamedModulesPlugin(),
  //   // prints more readable module names in the browser console on HMR updates
  //
  //   new webpack.NoEmitOnErrorsPlugin(),
  //   // do not emit compiled assets that include errors
  // ]
}
