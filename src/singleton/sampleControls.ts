import CanAvpControl from '../control/sample/CanAvp';
import CctvAvpControl from '../control/sample/CctvAvp';
import CctvMonitControl from '../control/sample/CctvMonit';
class SampleControls {

	isEmitting: boolean = false;

	canAvp!: CanAvpControl;
	cctvAvp!: CctvAvpControl;
	cctvMonit!: CctvMonitControl;

	emitEndCheckTimer!: NodeJS.Timer;
	interval: number = 1000; // ms

	constructor() {

	}

	allEmitEndCheck() {
		this.emitEndCheckTimer = setInterval(() => {

			if(this.canAvp.isEnd && this.cctvAvp.isEnd && this.cctvMonit.isEnd) {
				this.isEmitting = false;
				clearInterval(this.emitEndCheckTimer);
			}

		}, this.interval);
	}

}

export const sampleControls = new SampleControls();