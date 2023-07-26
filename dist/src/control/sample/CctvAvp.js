"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gsap_1 = require("gsap");
const server_1 = require("../../server");
const three_1 = require("three");
class CctvAvpControl {
    constructor(interval, data, dataType) {
        this.stoppedIdx = 0;
        this.idx = 0;
        this.avpCarPosition = new three_1.Vector3();
        this.avpCarNextPosition = new three_1.Vector3();
        // initial avpCar position set?
        this.setInitialAvpCarPosition = false;
        this.avpCarTl = gsap_1.gsap.timeline();
        this.setStartPosition = false;
        this.wayVector = { x: 0, y: 0, z: 0 };
        this.isEnd = false;
        this.interval = interval;
        this.data = data;
        this.dataType = dataType;
        this.idx = 0;
        this.avpCarPosition = new three_1.Vector3(data[0].position[0], 0, data[0].position[1]);
        this.avpCarNextPosition = new three_1.Vector3(data[1].position[0], 0, data[1].position[1]);
        if (interval === 0.1)
            gsap_1.gsap.ticker.fps(10);
        if (interval === 1)
            gsap_1.gsap.ticker.fps(30);
        if (interval === 0.2)
            gsap_1.gsap.ticker.fps(30);
        this.avpCarTl = gsap_1.gsap.timeline();
        this.start();
    }
    start() {
        this.publish();
    }
    stop() {
        this.avpCarTl.pause().kill();
        this.avpCarTl = gsap_1.gsap.timeline();
        this.setStartPosition = false;
    }
    reset() {
        this.idx = 0;
        this.stop();
    }
    publish() {
        // recursive way
        if (this.idx !== this.data.length - 2) {
            const position = this.avpCarPosition.clone();
            const nextPosition = this.avpCarNextPosition.clone();
            this.avpCarTl.to(position, {
                ease: "none",
                x: nextPosition.x,
                y: nextPosition.y,
                z: nextPosition.z,
                duration: this.interval,
                onStart: () => {
                    console.log("cctv avp current i: ", this.idx);
                    //calculate wayVector
                    this.wayVector = {
                        x: nextPosition.x,
                        y: 0,
                        z: nextPosition.z,
                    };
                    const data = this.data[this.idx];
                    if (nextPosition.distanceTo(position) >= 10 &&
                        this.interval === 0.2) {
                        data.wayVector = nextPosition;
                    }
                    else if (nextPosition.distanceTo(position) >= 10 &&
                        this.interval === 0.1) {
                        data.wayVector = nextPosition;
                    }
                    else if (nextPosition.distanceTo(position) >= 30 &&
                        this.interval === 0.6) {
                        data.wayVector = nextPosition;
                    }
                    else if (nextPosition.distanceTo(position) >= 20 &&
                        this.interval === 0.4) {
                        data.wayVector = nextPosition;
                    }
                    if (position.x !== 0) {
                        data.show = true;
                    }
                    else
                        data.show = false;
                    server_1.io.emit("cctvAvp", data);
                },
                onUpdate: () => {
                    // console.log('on update: ', this.avpCarPosition);
                    server_1.io.emit("avpCarPosition", (() => {
                        const data = {
                            x: position.x,
                            y: position.y,
                            z: position.z,
                            direction: {
                                x: nextPosition.x,
                                y: nextPosition.y,
                                z: nextPosition.z,
                            },
                        };
                        return data;
                    })());
                },
                onComplete: () => {
                    console.log("cctv avp on complete: ", this.avpCarPosition);
                    this.idx++;
                    console.log("cctv avp on complete idx: ", this.idx);
                    if (this.idx === this.data.length - 1) {
                        this.isEnd = true;
                        return;
                    }
                    this.avpCarPosition = new three_1.Vector3(this.data[this.idx].position[0], 0, this.data[this.idx].position[1]);
                    this.avpCarNextPosition = new three_1.Vector3(this.data[this.idx + 1].position[0], 0, this.data[this.idx + 1].position[1]);
                    this.publish();
                },
            }); // this.avpCarTl.to
        }
    }
}
exports.default = CctvAvpControl;
//# sourceMappingURL=CctvAvp.js.map