import express, { Request, Response} from 'express';

import CctvAvpControl from '../control/sample/CctvAvp';
import CctvMonitControl from '../control/sample/CctvMonit';
import { sampleControls } from '../singleton/sampleControls';

import { CctvAvp, CctvMonit } from '../@types/data';

// sample data
import { cctvAvp } from '../data/cctvAvp';
import { cctvMonit } from '../data/cctvMonit';

const sampleRouter = express.Router();

const intervals = [0.1, 0.2, 1];

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

	if(sampleControls.isEmitting === true) {
		res.status(200).send({ message: 'sample data emitting is already stared' });
		return;
	}

	try {

        const cctvAvpData: CctvAvp[] = cctvAvp;
        const cctvMonitData: CctvMonit[] = cctvMonit;

        const interval: number = body.interval;

		sampleControls.cctvAvp = new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
		sampleControls.cctvMonit = new CctvMonitControl(interval, cctvMonitData as (CctvMonit)[], 'cctvMonit');

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
