var ExternalPromise = (function () {
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

    module.exports = ExternalPromise;