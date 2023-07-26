import express, { Request, Response} from 'express';
import path from 'path';
import fs from 'fs';

import CanAvpControl from '../control/sample/CanAvp';
import CctvAvpControl from '../control/sample/CctvAvp';
import CctvMonitControl from '../control/sample/CctvMonit';
import { sampleControls } from '../singleton/sampleControls';

import { logger } from '../../logger';
import { appRoot } from '../server';
import { CanAvp, CctvAvp, CctvMonit } from '../@types/data';

const sampleRouter = express.Router();

const intervals = [0.1, 0.2, 1];
const fileSetList = fs.readdirSync(path.join(appRoot, '/data/transformed/'));

// console.log('filelist', fileSetList)

sampleRouter.use(express.json());

sampleRouter.post('/data', (req: Request, res: Response) => {
	const body = req.body;
	if(!body.interval || !body.set) {
		res.status(400).send({ message: 'request body must includes interval and set value.' });
		return;
	}

	if(!intervals.includes(body.interval)) {
		res.status(400).send({ 
			message: 'interval value must be one of intervals',
			intervals: intervals
		});
		return;
	}

	if(!fileSetList.includes(body.set)) {
		res.status(400).send({
			message: 'file set name must be one of lists',                                                     
			fileSetList: fileSetList
		});
		return;
	}

	if(sampleControls.isEmitting === true) {
		res.status(200).send({ message: 'sample data emitting is already stared' });
		return;
	}

	try {

		const interval: number = body.interval;
		// temporary fix normalCarInterval to 0.1 for sample data test
		const normalCarInterval: number = 0.1; 
		const set: string = body.set;

		const canAvpPath: string = `${appRoot}/data/transformed/${set}/${interval}/canAvpCar.json`;
		const cctvAvpPath: string = `${appRoot}/data/transformed/${set}/${interval}/cctvAvpCar.json`;
		const cctvMonitPath: string = `${appRoot}/data/transformed/${set}/${interval}/cctvMonit.json`;
		// const cctvMonitPath: string = `${appRoot}/data/transformed/${set}/${normalCarInterval}/cctvMonit.json`;

		// can avp data emit by interval
		/* fs.readFile(canAvpPath, 'utf-8', (err, data) => {
			if(err) return;
			const canAvpData: Object[] = JSON.parse(data);

			sampleControls.canAvp = new CanAvpControl(interval, canAvpData as (CanAvp)[], 'canAvp');
			sampleControls.canAvp.start();
		});

		fs.readFile(cctvAvpPath, 'utf-8', (err, data) => {
			if(err) return;
			const cctvAvpData: Object[] = JSON.parse(data);

			sampleControls.cctvAvp = new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
			sampleControls.cctvAvp.start();

			// new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
		});

		fs.readFile(cctvMonitPath, 'utf-8', (err, data) => {
			if(err) return;
			const cctvMonitData: Object[] = JSON.parse(data);

			sampleControls.cctvMonit = new CctvMonitControl(interval, cctvMonitData as (CctvMonit)[], 'cctvMonit');
			sampleControls.cctvMonit.start();
		}); */

		const canAvpDataJson = fs.readFileSync(canAvpPath, 'utf-8');
		const canAvpData: Object[] = JSON.parse(canAvpDataJson);

		const cctvAvpDataJson = fs.readFileSync(cctvAvpPath, 'utf-8');
		const cctvAvpData: Object[] = JSON.parse(cctvAvpDataJson);

		const cctvMonitDataJson = fs.readFileSync(cctvMonitPath, 'utf-8');
		const cctvMonitData: Object[] = JSON.parse(cctvMonitDataJson);

		sampleControls.canAvp = new CanAvpControl(interval, canAvpData as (CanAvp)[], 'canAvp');
		sampleControls.cctvAvp = new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
		sampleControls.cctvMonit = new CctvMonitControl(interval, cctvMonitData as (CctvMonit)[], 'cctvMonit');

		sampleControls.canAvp.start();
		sampleControls.cctvAvp.start();
		sampleControls.cctvMonit.start();

		sampleControls.isEmitting = true;
		sampleControls.allEmitEndCheck();
		
	} catch(e) {
		console.log('error occured on /sample/data route');
		res.status(400).send({message: 'error occrured on creating sample e-avp data.'});
	} finally {
		res.status(200).send({message: 'create parking lot realtime data emit started.'});
	}

});

sampleRouter.post('/stop', (req: Request, res: Response) => {

	try {
		
		if(!sampleControls.isEmitting) {
			res.status(200).send({message: 'sample data emitting is not started yet'});
			return;
		}
		sampleControls.isEmitting = false;
		sampleControls.canAvp?.stop();
		sampleControls.cctvAvp?.stop();
		sampleControls.cctvMonit?.stop();
		res.status(200).send({message: 'sample data socket emit stopped'});
	} catch(e) {
		console.log('error occured on sample data control stop process.');
		res.status(500).send({message: e});
	}
	
});

sampleRouter.post('/resume', (req: Request, res: Response) => {
	try {
		sampleControls.canAvp?.start();
		sampleControls.cctvAvp?.start();
		sampleControls.cctvMonit?.start();

		res.status(200).send({message: 'resuming sample data emit on socket'});
	} catch(e) {
		console.log(`can't resume sample data emit on socket.`);
		res.status(500).send({
			message: `can't resume sample data emit on socket.`,
			err: e
		});
	}
});
   
export const sample = sampleRouter;
