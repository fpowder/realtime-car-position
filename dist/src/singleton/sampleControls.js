"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleControls = void 0;
class SampleControls {
    constructor() {
        this.isEmitting = false;
        this.interval = 1000; // ms
    }
    allEmitEndCheck() {
        this.emitEndCheckTimer = setInterval(() => {
            if (this.canAvp.isEnd && this.cctvAvp.isEnd && this.cctvMonit.isEnd) {
                this.isEmitting = false;
                clearInterval(this.emitEndCheckTimer);
            }
        }, this.interval);
    }
}
exports.sampleControls = new SampleControls();
//# sourceMappingURL=sampleControls.js.map