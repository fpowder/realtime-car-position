"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mqtt = tslib_1.__importStar(require("mqtt"));
const data_1 = require("../config/data");
const mongoose_1 = require("mongoose");
const db_1 = require("../config/db");
// import db models
const model_1 = require("../db/model");
class MqttLog {
    constructor() {
        this.canAvpTime = Date.now();
        this.cctvAvpTime = Date.now();
        this.cctvMonitTime = Date.now();
        this.client = mqtt.connect(data_1.url, {
            connectTimeout: 10000,
            reconnectPeriod: 2000
        });
        this.subscribe();
        this.mongoose = (0, mongoose_1.connect)(db_1.url, db_1.options);
    }
    subscribe() {
        for (let subsKey in data_1.subsPath) {
            this.client.subscribe(data_1.subsPath[subsKey]);
            // need to add logger
            console.log(`subscribe path to ${data_1.subsPath[subsKey]} on Log Handler`);
        }
    }
    onMessageLogHandler() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (yield this.mongoose).Connection;
            this.client.on('message', (topic, payload) => {
                console.log('on message on log onMessageLogHandler!!!');
                const data = JSON.parse(payload.toString());
                if (topic === data_1.subsPath['canAvp']) {
                    // interval calculation
                    const now = Date.now();
                    const interval = Date.now() - this.canAvpTime;
                    this.canAvpTime = now;
                    data.serverInterval = interval;
                    // data save
                    new model_1.CanAvp(data).save();
                }
                if (topic === data_1.subsPath['cctvAvp']) {
                    // interval calculation
                    const now = Date.now();
                    const interval = Date.now() - this.cctvAvpTime;
                    this.cctvAvpTime = now;
                    data.serverInterval = interval;
                    // data save
                    new model_1.CctvAvp(data).save();
                }
                if (topic === data_1.subsPath['cctvMonit']) {
                    // check timedelay from former data received time
                    const now = Date.now();
                    const interval = Date.now() - this.cctvMonitTime;
                    this.cctvMonitTime = now;
                    data.serverInterval = interval;
                    // data save
                    new model_1.CctvMonit(data).save();
                }
            });
        });
    }
}
exports.default = MqttLog;
//# sourceMappingURL=log.js.map