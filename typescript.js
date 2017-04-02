var gulp = require("gulp"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps");
var ts = require('gulp-typescript');
var jsnsAmdWrapper = require('jsns/amd-wrapper.js');

function compileJsnsTs(settings) {

    var output = settings.output;
    if (!settings.suppressAutoExtension && output && !output.endsWith('.js')) {
        output += '.js';
    }

    var piped = gulp.src(settings.libs, { base: settings.base })
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: false,
            allowJs: true,
            isolatedModules: true,
            module: 'amd'
        }))
        .pipe(jsnsAmdWrapper(settings));

    if (settings.concat === true) {
        piped = piped.pipe(concat(output))
            .pipe(rename(output));
    }

    if (settings.minify === true) {
        piped = piped.pipe(uglify())
    }

    piped = piped
        .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: settings.sourceRoot }))
        .pipe(gulp.dest(settings.dest));

    return piped;
};
module.exports = compileJsnsTs;