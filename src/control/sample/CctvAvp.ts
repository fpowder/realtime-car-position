import { gsap } from "gsap";
import { io } from "../../server";
import { Vector3 } from "three";
import { CctvAvp } from "../../@types/data";
import { logger } from "../../../logger";

export default class CctvAvpControl {
    data: CctvAvp[];

    stoppedIdx: number = 0;
    idx: number = 0;
    interval: number;

    timer!: NodeJS.Timer;

    dataType: string;
    avpCarPosition: Vector3 = new Vector3();
    avpCarNextPosition: Vector3 = new Vector3();

    // initial avpCar position set?
    setInitialAvpCarPosition: boolean = false;
    avpCarTl: gsap.core.Timeline = gsap.timeline();

    setStartPosition: boolean = false;

    wayVector: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

    isEnd: boolean = false;

    constructor(interval: number, data: CctvAvp[], dataType: string) {
        this.interval = interval;
        this.data = data;
        this.dataType = dataType;
        this.idx = 0;
        this.avpCarPosition = new Vector3(
            data[0].position[0],
            0,
            data[0].position[1]
        );
        this.avpCarNextPosition = new Vector3(
            data[1].position[0],
            0,
            data[1].position[1]
        );

        if (interval === 0.1) gsap.ticker.fps(10);
        if (interval === 1) gsap.ticker.fps(30);
        if (interval === 0.2) gsap.ticker.fps(30);

        this.avpCarTl = gsap.timeline();
        this.start();
    }

    start(): void {
        this.publish();
    }

    stop(): void {
        this.avpCarTl.pause().kill();
        this.avpCarTl = gsap.timeline();
        this.setStartPosition = false;
    }

    reset(): void {
        this.idx = 0;
        this.stop();
    }

    publish(): void {
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

                    const data: any = this.data[this.idx];

                    if (
                        nextPosition.distanceTo(position) >= 10 &&
                        this.interval === 0.2
                    ) {
                        data.wayVector = nextPosition;
                    } else if (
                        nextPosition.distanceTo(position) >= 10 &&
                        this.interval === 0.1
                    ) {
                        data.wayVector = nextPosition;
                    } else if (
                        nextPosition.distanceTo(position) >= 30 &&
                        this.interval === 0.6
                    ) {
                        data.wayVector = nextPosition;
                    } else if (
                        nextPosition.distanceTo(position) >= 20 &&
                        this.interval === 0.4
                    ) {
                        data.wayVector = nextPosition;
                    }

                    if (position.x !== 0) {
                        data.show = true;
                    } else data.show = false;

                    io.emit("cctvAvp", data);
                },
                onUpdate: () => {
                    // console.log('on update: ', this.avpCarPosition);
                    io.emit(
                        "avpCarPosition",
                        (() => {
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
                        })()
                    );
                },
                onComplete: () => {
                    console.log("cctv avp on complete: ", this.avpCarPosition);
                    this.idx++;
                    console.log("cctv avp on complete idx: ", this.idx);

                    if (this.idx === this.data.length - 1) {
                        this.isEnd = true;
                        return;
                    }

                    this.avpCarPosition = new Vector3(
                        this.data[this.idx].position[0],
                        0,
                        this.data[this.idx].position[1]
                    );
                    this.avpCarNextPosition = new Vector3(
                        this.data[this.idx + 1].position[0],
                        0,
                        this.data[this.idx + 1].position[1]
                    );
                    this.publish();
                },
            }); // this.avpCarTl.to
        }
    }
}
