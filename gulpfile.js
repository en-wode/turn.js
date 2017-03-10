// Load plugins
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache');

var sourceMaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var remember = require('gulp-remember');

// Styles
gulp.task('styles', function () {
  return gulp.src('src/css/*.less')
    .pipe(sourceMaps.init())
    .pipe(cache('less'))
    .pipe(less())
    .pipe(remember('less'))
    .pipe(sourceMaps.write('dist/css/'))
    .pipe(gulp.dest('dist/css/'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Clean
gulp.task('clean', function () {
  return gulp.src('dist/', { read: false })
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.run('styles', 'scripts');
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('src/css/*.less', 'styles');

    // Watch .js files
    gulp.watch('src/js/*.js', 'scripts');

});