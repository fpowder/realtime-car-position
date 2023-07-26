import { io } from '../../server';
import { CanAvp } from '../../@types/data';

export default class CanAvpControl {

	data: CanAvp[];

	stoppedIdx: number = 0;
	idx: number = 0;
	interval: number;

	timer!: NodeJS.Timer;

	dataType: string;
	isEnd: boolean = false;

	constructor(interval: number, data: CanAvp[], dataType: string) {

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

			console.log('Can avp current Idx : ', this.idx);
			console.log('Can avp current handled data : ' , this.data[this.idx]);
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

	publish(data: CanAvp): void {
		io.emit('canAvp', data);
		return;
	}
}