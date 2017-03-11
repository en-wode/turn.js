// Load plugins
var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean');

var sourceMaps = require('gulp-sourcemaps');
var less = require('gulp-less');

// Styles
gulp.task('styles', function () {
  return gulp.src('src/css/*.less')
    .pipe(sourceMaps.init())
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())
    .pipe(sourceMaps.write('/'))
    .pipe(gulp.dest('dist/css'));
});

// Scripts
gulp.task('scripts', function () {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Clean
gulp.task('clean', function () {
  return gulp.src('dist/', { read: false }).pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function (params) {
  gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('src/css/*.less', 'styles');

    // Watch .js files
    gulp.watch('src/js/*.js', 'scripts');

});