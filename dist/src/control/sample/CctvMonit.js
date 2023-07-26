"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../server");
class CctvMonitControl {
    constructor(interval, data, dataType) {
        this.stoppedIdx = 0;
        this.idx = 0;
        this.isEnd = false;
        this.interval = interval * 1000;
        this.data = data;
        this.dataType = dataType;
    }
    start() {
        this.timer = setInterval(() => {
            if (this.idx === this.data.length - 1) {
                this.isEnd = true;
                clearInterval(this.timer);
            }
            console.log('cctv monit current Idx : ', this.idx);
            console.log('cctv monit current handled data : ', this.data[this.idx]);
            this.publish(this.data[this.idx]);
            this.idx++;
        }, this.interval);
    }
    stop() {
        clearInterval(this.timer);
    }
    reset() {
        this.idx = 0;
        this.stop();
    }
    clear() {
        clearInterval(this.timer);
    }
    publish(data) {
        server_1.io.emit('cctvMonit', data);
        return;
    }
}
exports.default = CctvMonitControl;
//# sourceMappingURL=CctvMonit.js.map