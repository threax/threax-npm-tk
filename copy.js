"use strict";
var fs = require('fs-extra');

module.exports = function (files, out) {
    copy(
        files,
        out,
        err => {
            if (err) return console.error(err)
            console.log("success!")
        }
    );
};