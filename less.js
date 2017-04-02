var gulp = require("gulp");
var less = require('gulp-less');
var uglifycss = require('gulp-uglifycss');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');

function compileLess(settings) {
    return gulp.src(settings.files, { base: settings.baseName })
           .pipe(plumber(function (error) {
               gutil.log(gutil.colors.red(error.message));
               this.emit('end');
           }))
           .pipe(less({
               paths: settings.importPaths
           }))
           .pipe(uglifycss({
               "maxLineLen": 80,
               "uglyComments": true
           }))
           .pipe(gulp.dest(settings.dest));
}
module.exports = compileLess;