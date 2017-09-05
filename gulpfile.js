/* eslint-env node */
const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const nodemon = require('gulp-nodemon')
const rename = require('gulp-rename')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require(path.resolve('config/webpack.config.js'))
const webpackConfigDev = require(path.resolve('config/webpack-dev.config.js'))

gulp.task('sass', () =>
  gulp.src(path.resolve('src/styles/master.scss'))
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./dist/styles'))
)

// Possible duplicate?
gulp.task('sassDev', () =>
  gulp.src(path.resolve('src/styles/master.scss'))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./dist/styles'))
)

// Possible duplicate?
gulp.task('webpack', () =>
  gulp.src(path.resolve('src/js/index.js'))
  .pipe(webpackStream(webpackConfig, webpack)) // Create sourcemaps for better debbuging
  .on('error', function handleError() {
    this.emit('end')
  })
  .pipe(gulp.dest('./dist'))
)

// Possible duplicate?
gulp.task('webpackDev', () =>
  gulp.src(path.resolve('src/js/index.js'))
  .pipe(sourcemaps.init())
  .pipe(webpackStream(webpackConfigDev, webpack)) // Create sourcemaps for better debbuging
  .on('error', function handleError() {
    this.emit('end')
  })
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./dist'))
)

gulp.task('start', () => {
  nodemon({
    script: 'server.js',
    ignore: ['/src/**', '/dist'],
    env: { 'NODE_ENV': 'development' }
  })
})

gulp.task('watch', () => {
  gulp.watch('src/js/**/*.js', ['webpackDev'])
  gulp.watch('src/styles/**/*.scss', ['sassDev'])
})

gulp.task('develop', ['sassDev', 'webpackDev', 'start', 'watch'])
gulp.task('build', ['sass', 'webpack'])
