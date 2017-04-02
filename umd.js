var gulp = require("gulp"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps");

var wrapUmd = require('jsns/umd-wrapper.js');

//Minification
function compileJavascript(settings) {
    if (settings.minify && settings.concat) {
        return minifyConcatJs(settings);
    }
    else if (settings.minify) {
        return minifyEachJs(settings);
    }
    else if (settings.concat) {
        return concatJs(settings);
    }
    else {
        return copyEachJs(settings);
    }
}
module.exports = compileJavascript;

function minifyConcatJs(settings) {
    return gulp.src(settings.libs, { base: settings.base })
        .pipe(sourcemaps.init())
        .pipe(wrapUmd(settings))
        .pipe(concat(settings.output + '.js'))
        .pipe(uglify())
        .pipe(rename(settings.output + '.min.js'))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: settings.sourceRoot }))
        .pipe(gulp.dest(settings.dest));
};

function minifyEachJs(settings) {
    return gulp.src(settings.libs, { base: settings.base })
        .pipe(sourcemaps.init())
        .pipe(wrapUmd(settings))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: settings.sourceRoot }))
        .pipe(gulp.dest(settings.dest));
};

function concatJs(settings) {
    return gulp.src(settings.libs, { base: settings.base })
        .pipe(sourcemaps.init())
        .pipe(wrapUmd(settings))
        .pipe(concat(settings.output + '.js'))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: settings.sourceRoot }))
        .pipe(gulp.dest(settings.dest));
};

function copyEachJs(settings) {
    return gulp.src(settings.libs, { base: settings.base })
        .pipe(sourcemaps.init())
        .pipe(wrapUmd(settings))
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: settings.sourceRoot }))
        .pipe(gulp.dest(settings.dest));
};