"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const three_1 = require("three");
const gsap_1 = require("gsap");
const server_1 = require("./server");
(() => {
    gsap_1.gsap.ticker.fps(10);
    const cctvAvpPath = `${server_1.appRoot}/data/transformed/set2/1/cctvAvpCar.json`;
    const set = 'set2';
    const interval = 1;
    fs_1.default.readFile(cctvAvpPath, 'utf-8', (err, data) => {
        if (err)
            return;
        const cctvAvpData = JSON.parse(data);
        const avpCarPosition = new three_1.Vector3(cctvAvpData[0].position[0], 0, cctvAvpData[0].position[1]);
        const timeline = gsap_1.gsap.timeline();
        // gsap.to(
        // 	avpCarPosition,
        // 	{
        // 		ease: 'none',
        // 		x: 211,
        // 		y: 0,
        // 		z: 222,
        // 		duration: interval,
        // 		onStart: () => {
        // 			// console.log('current i: ', i);
        // 		},
        // 		onUpdate: () => {
        // 			console.log('on update: ', avpCarPosition);
        // 		},
        // 		onComplete: () => {
        // 			console.log('on complete: ', avpCarPosition);
        // 		}
        // 	},
        // );
        for (let i = 1; i < cctvAvpData.length - 2; i++) {
            const nextPos = cctvAvpData[i].position;
            const nextVec = new three_1.Vector3(nextPos[0], 0, nextPos[1]);
            timeline.to(avpCarPosition, {
                ease: 'none',
                x: nextVec.x,
                y: nextVec.y,
                z: nextVec.z,
                duration: interval,
                onStart: () => {
                    console.log('current i: ', i);
                },
                onUpdate: () => {
                    console.log('on update: ', avpCarPosition);
                },
                onComplete: () => {
                    console.log('on complete: ', avpCarPosition);
                    console.log(`${i} done.`);
                }
            });
        }
    });
})();
//# sourceMappingURL=test.js.map