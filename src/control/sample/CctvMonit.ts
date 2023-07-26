import { io } from '../../server';
import { CctvMonit } from '../../@types/data';

export default class CctvMonitControl {

	data: CctvMonit[];

	stoppedIdx: number = 0;
	idx: number = 0;
	interval: number;

	timer!: NodeJS.Timer;

	dataType: string;
	isEnd: boolean = false;

	constructor(interval: number, data: CctvMonit[], dataType: string) {

		this.interval = interval * 1000;
		this.data = data;
		this.dataType = dataType;
	}

	start(): void {
		this.timer = setInterval(() => {

			if(this.idx === this.data.length - 1) {
				this.isEnd = true;
				clearInterval(this.timer);
			}

			console.log('cctv monit current Idx : ', this.idx);
			console.log('cctv monit current handled data : ' , this.data[this.idx]);
			this.publish(this.data[this.idx]);
			this.idx++;
			
		}, this.interval);
	}
	
	stop(): void {
		clearInterval(this.timer);
	}

	reset(): void {
		this.idx = 0;
		this.stop();
	}

	clear(): void {
		clearInterval(this.timer);
	}

	publish(data: CctvMonit): void {
		io.emit('cctvMonit', data);
		return;
	}
}