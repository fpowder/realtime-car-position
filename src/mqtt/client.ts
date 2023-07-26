import * as mqtt from 'mqtt';
import { gsap } from 'gsap';
import { Vector3 } from 'three';
import { Server } from 'socket.io';

import { url, sendInterval, emitInterval, subsPath } from '../config/data';

import { filter } from '../control/data/Filter';

/* mqtt 수신 데이터를 클라이언트로 전송하는 class */
export default class MqttClient {

    client: mqtt.Client;
   
    io: Server;

    avpCarPosition: Vector3 = new Vector3();
    avpCarNextPosition: Vector3 = new Vector3();

    wayVector: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    formerVector: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    avpCarTl: gsap.core.Timeline = gsap.timeline();

    initialAvpPositionSet: boolean = false;

    emitIntervalCnt: { cctvMonit: number, canAvp: number, cctvAvp: number } = {
        cctvMonit: 0,
        canAvp: 0,
        cctvAvp: 0
    }

    canAvpTime: number = Date.now();
    cctvAvpTime: number = Date.now();
    cctvMonitTime: number = Date.now();

    constructor(io: Server) {
        this.client = mqtt.connect(url, {
            connectTimeout: 10000,
            reconnectPeriod: 2000,
        });

        this.io = io;

        gsap.ticker.fps(20);
        // if(emitInterval === 1000) gsap.ticker.fps(30);
        // if(emitInterval === 500) gsap.ticker.fps(30);

        this.client.on('connect', () => {
            this.subscribe();
            this.onMessageHandler();
        });
    }

    subscribe()  {
        for(let subsKey in subsPath) {
            this.client.subscribe(subsPath[subsKey]);

            // need to add logger
            console.log(`subscribe path to ${subsPath[subsKey]}`);
        }
    }

    onMessageHandler() {
        this.client.on('message', (topic, payload) => {
            if(payload.length === 0) { console.log('payload is zero'); return; }
            try {
                const toJsonData = payload.toString();
                // need to add logger
                console.log(`[ message on topic ${topic} ]`);
                console.log('payload string: ', toJsonData);
                console.log(JSON.parse(toJsonData), '\n');
            } catch(e) {
                console.log('error occured on onMessageHandle()');
                console.log(e);
            }

            // canAvp data handle
            if(topic === subsPath['canAvp']) {
                /* 데이터 publishing 주기 컨트롤시 사용 */
                // if(this.skipByInterval('canAvp')) return;
                // this.emitIntervalCnt['canAvp']++;

                const data = JSON.parse(payload.toString());

                // interval calculation
                const now = Date.now();
                const interval = Date.now() - this.canAvpTime;
                this.canAvpTime = now;
                data.serverInterval = interval;

                this.io.emit('canAvp', data);
                
            }

            // cctvMonit data handle
            if(topic === subsPath['cctvMonit']) {
                /* 데이터 publishing 주기 컨트롤시 사용 */
                // if(this.skipByInterval('cctvMonit')) return;
                // this.emitIntervalCnt['cctvMonit']++;

                const data = JSON.parse(payload.toString());
                console.log('cctv monit emit Data', data);
                // if(data['car-coordinate'].length === 0) return;

                // interval calculation
                const now = Date.now();
                const interval = Date.now() - this.cctvMonitTime;
                this.cctvMonitTime = now;
                data.serverInterval = interval;

                filter.setCctvMonitData(data);
                // 일반차량 위치와 자율차 위치 필터를 사용할경우 사용
                // filter.removeDuplicateCord();
                // filter.normalCarCloseFilter();


                this.io.emit('cctvMonit', filter.cctvMonitData);
                // console.log('cctvMonitData out filter', JSON.stringify(data));
                // console.log('cnt out filter', this.cnt++);
            }

            // cctvAvp data handle
            if(topic === subsPath['cctvAvp']) {
                const data = JSON.parse(payload.toString());

                // interval calculation
                const now = Date.now();
                const interval = Date.now() - this.cctvAvpTime;
                this.cctvAvpTime = now;
                data.serverInterval = interval;

                // 일반차량 위치와 자율차 위치 필터를 사용할경우 사용
                filter.setCctvAvpData(data);

                /* 데이터 publishing 주기 컨트롤시 사용 */
                // if(this.skipByInterval('cctvAvp')) return;
                // this.emitIntervalCnt['cctvAvp']++;

                const avpPosition = data['position'] ? data['position'] : [0, 0];

                // avpCar initial position and next Postion set
                if(avpPosition.length === 0 && avpPosition[0] === 0) return;
                if(!this.initialAvpPositionSet) {
                    this.avpCarPosition = new Vector3(avpPosition[0], 0, avpPosition[1]);
                    this.avpCarNextPosition = new Vector3(avpPosition[0], 0, avpPosition[1]);
                    this.initialAvpPositionSet = true;
                    return;
                }

                const position = this.avpCarPosition.clone();
                const nextPosition = this.avpCarNextPosition.clone();

                //calculate wayVector
                this.wayVector = {
                    x: nextPosition.x,
                    y: 0,
                    z: nextPosition.z,
                };

                if (nextPosition.distanceTo(position) >= 20) {
                    data.wayVector = nextPosition;
                    this.formerVector = this.wayVector;
                } else {
                    data.wayVector = this.formerVector;
                }

                if (position.x === 0 || nextPosition.x === 0) {
                    data.show = false;
                } else data.show = true;

                this.io.emit('cctvAvp', data);
                this.io.emit(
                    'avpCarPosition',
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

                this.avpCarPosition = this.avpCarNextPosition.clone();
                this.avpCarNextPosition = new Vector3(avpPosition[0], 0, avpPosition[1]);
                
                // avp position segmentation temporary removed
                /* this.avpCarTl.to(position, {
                    ease: 'none',
                    x: nextPosition.x,
                    y: nextPosition.y,
                    z: nextPosition.z,
                    duration: emitInterval / 1000 - (emitInterval / 1000 / 13),
                    onStart: () => {
    
                        //calculate wayVector
                        this.wayVector = {
                            x: nextPosition.x,
                            y: 0,
                            z: nextPosition.z,
                        };
    
                        if (
                            nextPosition.distanceTo(position) >= 30 &&
                            emitInterval / 1000 === 1
                        ) {
                            data.wayVector = nextPosition;

                        } else if (
                            nextPosition.distanceTo(position) >= 20 &&
                            emitInterval / 1000 === 0.4
                        ) {
                            data.wayVector = nextPosition;
                        } else if ( 
                            nextPosition.distanceTo(position) >= 20 &&
                            emitInterval / 1000 === 0.6
                        ) {
                            data.wayVector = nextPosition;
                        } else if ( 
                            nextPosition.distanceTo(position) >= 25 &&
                            emitInterval / 1000 === 0.8
                        ) {
                            data.wayVector = nextPosition;
                        }
    
                        if (position.x === 0 || nextPosition.x === 0) {
                            data.show = false;
                        } else data.show = true;
    
                        this.io.emit('cctvAvp', data);
                    },
                    onUpdate: () => {
                        // console.log('on update: ', this.avpCarPosition);
                        this.io.emit(
                            'avpCarPosition',
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

                        this.avpCarPosition = this.avpCarNextPosition.clone();
                        this.avpCarNextPosition = new Vector3(avpPosition[0], 0, avpPosition[1]);

                    },
                }); // this.avpCarTl.to 
                */
            }

        });
    } // onMessageHandle

    skipByInterval(dataType: string): boolean {
        if(sendInterval === emitInterval) return false;
        if(this.emitIntervalCnt[dataType] !== 0)  {
            if(this.emitIntervalCnt[dataType] === (emitInterval / sendInterval - 1)) {
                this.emitIntervalCnt[dataType] = 0;
                return true;
            } 
            this.emitIntervalCnt[dataType]++; 
            return true;
        }

        return false;
    
    }

}
