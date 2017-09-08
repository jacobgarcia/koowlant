/* eslint-env node */
const gulp = require('gulp')
const sass = require('gulp-sass')
const nodemon = require('gulp-nodemon')
const rename = require('gulp-rename')
const webpack = require('webpack')
const path = require('path')
const gutil = require('gulp-util')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpackConfig = require(path.resolve('config/webpack.config.js'))
const sourcemaps = require('gulp-sourcemaps')
// const WebpackDevServer = require("webpack-dev-server")

const myDevConfig = Object.create(webpackConfig)
myDevConfig.devtool = "sourcemap"
myDevConfig.devServer = { inline: true, compress: true }

const prodConfig = Object.create(webpackConfig)
prodConfig.plugins = [
  new UglifyJSPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]

const prodCompiler = webpack(prodConfig)
const devCompiler = webpack(myDevConfig)

gulp.task('sass', () =>
  gulp.src(path.resolve('src/styles/master.scss'))
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/styles'))
)

// Possible duplicate?
gulp.task('sassDev', () =>
  gulp.src(path.resolve('src/styles/master.scss'))
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/styles'))
)

// Possible duplicate?
gulp.task('webpack:build-prod', callback =>
  prodCompiler.run((error, stats) => {
    if (error) throw new gutil.PluginError("webpack:build-dev", error);
    gutil.log("[webpack:build-dev]", stats.toString({
      colors: true
    }))
    callback()
  })
)

// Possible duplicate?
gulp.task('webpack:build-dev', callback => {
    // Start a webpack-dev-server
    devCompiler.run((error, stats) => {
      if (error) throw new gutil.PluginError("webpack:build-dev", error);
      gutil.log("[webpack:build-dev]", stats.toString({
        colors: true
      }))
      callback()
    })
})

// gulp.task('webpack-dev-server', () => {
//   // Start a webpack-dev-server
//   new WebpackDevServer(webpack(myDevConfig), {
//     publicPath: './dist',
//     historyApiFallback: true,
//     host: 'localhost',
//     hot: true,
//     stats: {
//       colors: true
//     }
//   }).listen(8080, "localhost", error => {
//     if (error) throw new gutil.PluginError("webpack-dev-server", error)
//     gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html")
//   })
// })
//
//

gulp.task('start', () => {
  nodemon({
    script: 'server.js',
    ignore: ['/src/**', '/dist'],
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['webpack:build-dev'])
  gulp.watch('src/styles/**/*.scss', ['sassDev'])
})

gulp.task('develop', ['start', 'sassDev', 'webpack:build-dev', 'watch'])
gulp.task('prod', ['sass', 'webpack:build-prod'])
