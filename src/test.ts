import fs from 'fs';
import CctvAvpControl from './control/sample/CctvAvp';
import { CctvAvp } from './@types/data';
import { Vector3 } from 'three';
import { gsap } from 'gsap';
import { appRoot } from './server';
import { logger } from '../logger';

(() => {
	gsap.ticker.fps(10);
	const cctvAvpPath: string = `${appRoot}/data/transformed/set2/1/cctvAvpCar.json`;
	const set = 'set2';
	const interval = 1;

	fs.readFile(cctvAvpPath, 'utf-8', (err, data) => {
		if(err) return;
		const cctvAvpData: CctvAvp[] = JSON.parse(data);
		const avpCarPosition = new Vector3(cctvAvpData[0].position[0], 0 , cctvAvpData[0].position[1]);
		const timeline = gsap.timeline();

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
		// 			logger.info('on complete: ', avpCarPosition);
		// 		}
		// 	},
		// );

		for(let i = 1; i < cctvAvpData.length - 2; i++) {
			const nextPos = cctvAvpData[i].position;
		    const nextVec = new Vector3(nextPos[0], 0, nextPos[1]);

			timeline.to(
				avpCarPosition,
				{
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
						logger.info('on complete: ', avpCarPosition);
						console.log(`${i} done.`);
					}
				},
			);
		}
	});

})();