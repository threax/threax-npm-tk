"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is a wrapper for a promise that exposes the resolve
 * and reject functions.
 */
var ExternalPromise = /** @class */ (function () {
    function ExternalPromise() {
        var _this = this;
        this._promise = new Promise(function (resolve, reject) {
            _this.resolveCb = resolve;
            _this.rejectCb = reject;
        });
    }
    ExternalPromise.prototype.resolve = function (data) {
        this.resolveCb(data);
    };
    ExternalPromise.prototype.reject = function (error) {
        this.rejectCb(error);
    };
    Object.defineProperty(ExternalPromise.prototype, "Promise", {
        get: function () {
            return this._promise;
        },
        enumerable: true,
        configurable: true
    });
    return ExternalPromise;
}());
exports.ExternalPromise = ExternalPromise;
;
//# sourceMappingURL=externalPromise.js.map