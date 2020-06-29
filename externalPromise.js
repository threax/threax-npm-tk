"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalPromise = void 0;
/**
 * This is a wrapper for a promise that exposes the resolve
 * and reject functions.
 */
class ExternalPromise {
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this.resolveCb = resolve;
            this.rejectCb = reject;
        });
    }
    resolve(data) {
        this.resolveCb(data);
    }
    reject(error) {
        this.rejectCb(error);
    }
    get Promise() {
        return this._promise;
    }
}
exports.ExternalPromise = ExternalPromise;
;
//# sourceMappingURL=externalPromise.js.map