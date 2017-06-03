'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');

var sassInput = 'public/assets/sass/**/*.scss';
var sassOutput = 'public/assets/css/';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
}

gulp.task('build-css', function() {
  return gulp
    .src(sassInput)
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest(sassOutput));
});

gulp.task('watch', function() {
  return gulp
    .watch(sassInput, ['build-css'])
    .on('change', function(event) {
      gutil.log(gutil.colors.gray(event.path) + ' was ' + gutil.colors.gray(event.type) + ', running tasks...');
    });
});

gulp.task('run', function(){
  return gutil.log('Gulp is running!')
});

gulp.task('default', ['run', 'build-css', 'watch']);