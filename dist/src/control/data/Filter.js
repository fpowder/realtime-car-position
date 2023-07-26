"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const three_1 = require("three");
const server_1 = require("../../server");
class Filter {
    constructor() {
        this.cctvAvpSet = false;
        this.cctvMonitSet = false;
        this.cctvAvpData = {};
        this.cctvMonitData = {};
    }
    setCctvAvpData(cctvAvpData) {
        this.cctvAvpSet = true;
        this.cctvAvpData = cctvAvpData;
    }
    setCctvMonitData(cctvMonitData) {
        this.cctvMonitSet = true;
        this.cctvMonitData = cctvMonitData;
    }
    // 일반차량 끼리의 좌표가 20이하인 좌표 제거
    normalCarCloseFilter() {
        const result = new Array();
        const data = this.cctvMonitData['car-coordinate'];
        const cnt = data.length;
        outer: for (let i = 0; i < cnt; i++) {
            const each = data[i];
            for (let j = i + 1; j < data.length; j++) {
                if (new three_1.Vector3(each[0], 0, each[1]).distanceTo(new three_1.Vector3(data[j][0], 0, data[j][1])) <= 30) {
                    continue outer;
                }
            }
            result.push(each);
        }
        this.cctvMonitData['car-coordinate'] = result;
    }
    removeDuplicateCord() {
        const avpCarPos = this.cctvAvpData['position'];
        const normalCarPos = this.cctvMonitData['car-coordinate'];
        if (!this.cctvAvpSet)
            return this.cctvMonitData['car-coordinate'];
        const result = normalCarPos.filter(eachPos => {
            if (eachPos[0] === avpCarPos[0] && eachPos[1] === avpCarPos[1]) {
                console.log('filtered!! duplicateed cord');
                return false;
            }
            else if (new three_1.Vector3(eachPos[0], 0, eachPos[1]).distanceTo(new three_1.Vector3(avpCarPos[0], 0, avpCarPos[1])) <= 40) {
                console.log('filtered!!! close cordes', new three_1.Vector3(eachPos[0], 0, eachPos[1]).distanceTo(new three_1.Vector3(avpCarPos[0], 0, avpCarPos[1])));
                return false;
            }
            else
                return true;
        });
        console.log('normalCarPos: ', `[ ${normalCarPos.toString()} ]`);
        console.log('avpCarPos', `[ ${avpCarPos.toString()} ]`);
        console.log('normal Car and avp distance: ', result);
        this.cctvMonitData['car-coordinate'] = result;
    }
    checkAndSendDataToEachPath() {
        //send data through socketio and set clear cctvAvpData and cctvMonitData in callback
        if (this.cctvAvpSet && this.cctvMonitSet) {
            this.removeDuplicateCord();
            const result = server_1.io.emit('cctvMonit', this.cctvMonitData);
            if (result) {
                this.cctvAvpSet = false;
                this.cctvMonitSet = false;
                this.cctvAvpData = {};
                this.cctvMonitData = {};
            }
        }
    }
}
exports.filter = new Filter();
//# sourceMappingURL=Filter.js.map