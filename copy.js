"use strict";
var copy = require('copy');

module.exports = function (files, outDir) {
    copy(
        files,
        outDir,
        function (err, file) {
            if (err) { throw err };
        }
    );
};