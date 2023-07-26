import * as mqtt from 'mqtt';
import { url, subsPath } from '../config/data';

import { connect } from 'mongoose';
import { url as dbUrl, options } from '../config/db';

// import db models
import { CanAvp, CctvAvp, CctvMonit } from '../db/model';

export default class MqttLog {
    
    client: mqtt.Client;
    mongoose: Promise<typeof import('mongoose')>;

    canAvpTime: number = Date.now();
    cctvAvpTime: number = Date.now();
    cctvMonitTime: number = Date.now();

    constructor() {
        this.client = mqtt.connect(url, {
            connectTimeout: 10000,
            reconnectPeriod: 2000
        });

        this.subscribe();
        this.mongoose = connect(dbUrl, options);
    }

    subscribe()  {
        for(let subsKey in subsPath) {
            this.client.subscribe(subsPath[subsKey]);

            // need to add logger
            console.log(`subscribe path to ${subsPath[subsKey]} on Log Handler`);
        }
    }

    async onMessageLogHandler() {
        (await this.mongoose).Connection;
        this.client.on('message', (topic, payload) => {
            console.log('on message on log onMessageLogHandler!!!');
            const data = JSON.parse(payload.toString());
            if(topic === subsPath['canAvp']) {
                // interval calculation
                const now = Date.now();
                const interval = Date.now() - this.canAvpTime;
                this.canAvpTime = now;
                data.serverInterval = interval;

                // data save
                new CanAvp(data).save();
            }

            if(topic === subsPath['cctvAvp']) {
                // interval calculation
                const now = Date.now();
                const interval = Date.now() - this.cctvAvpTime;
                this.cctvAvpTime = now;
                data.serverInterval = interval;

                // data save
                new CctvAvp(data).save();                
            }
            
            if(topic === subsPath['cctvMonit']) {
                // check timedelay from former data received time
                const now = Date.now();
                const interval = Date.now() - this.cctvMonitTime;
                this.cctvMonitTime = now;
                data.serverInterval = interval;

                // data save
                new CctvMonit(data).save();
                
            }
        });
    }

}
