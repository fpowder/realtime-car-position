import * as mqtt from 'mqtt';
import path from 'path';
import fs from 'fs';

/**
 * LG u+ mqtt broker url
 */
// const url = 'mqtt://106.103.228.177:1883';
const url = 'mqtt://alt-console.com:18831';
// const url = 'mqtt://192.168.1.78:1883';

const interval = 0.225; // 0.2 sec
const pathInterval = 0.2;
const set = 'set3';
const rootPath = path.resolve();

// const fileSetList = fs.readdirSync(path.join(rootPath, '/data/transformed'));

const canAvpPath: string = `${rootPath}/data/transformed/${set}/${pathInterval}/canAvpCar.json`;
const cctvAvpPath: string = `${rootPath}/data/transformed/${set}/${pathInterval}/cctvAvpCar.json`;
const cctvMonitPath: string = `${rootPath}/data/transformed/${set}/${pathInterval}/cctvMonit.json`;

// const canAvpDataJson = fs.readFileSync(canAvpPath, 'utf-8');
// const canAvpData: Object[] = JSON.parse(canAvpDataJson);

const cctvAvpDataJson = fs.readFileSync(cctvAvpPath, 'utf-8');
const cctvAvpData: Object[] = JSON.parse(cctvAvpDataJson);

const cctvMonitDataJson = fs.readFileSync(cctvMonitPath, 'utf-8');
const cctvMonitData: Object[] = JSON.parse(cctvMonitDataJson);

(() => {
    const mqttTestClient = mqtt.connect(url, {
        connectTimeout: 10000,
        reconnectPeriod: 2000
    });
    
    mqttTestClient.on('connect', () => {
        // let canAvpIdx = 0;
        // const inter1 = setInterval(() => {

        //     if(canAvpIdx === canAvpData.length) clearInterval(inter1);
        //     if(canAvpIdx < canAvpData.length) {
        //         mqttTestClient.publish('/auto/edge/server/json/canavpcardata', JSON.stringify(canAvpData[canAvpIdx]));
        //         canAvpIdx++;
        //     }
        
        // }, interval * 1000);

        let cctvAvpIdx = 0;
        const inter2 = setInterval(() => {
            
            
            if(cctvAvpIdx === cctvAvpData.length) clearInterval(inter2);
            if(cctvAvpIdx < cctvAvpData.length) {
                mqttTestClient.publish('/auto/edge/server/json/cctvavpcardata', JSON.stringify(cctvAvpData[cctvAvpIdx]));
                cctvAvpIdx++;
            }
        
        }, interval * 1000);

        let idx = 0;
        const inter3 = setInterval(() => {
        
            if(idx === cctvMonitData.length) clearInterval(inter3);
            if(idx < cctvMonitData.length) {
                mqttTestClient.publish('/auto/edge/server/json/cctvmonitoring', JSON.stringify(cctvMonitData[idx]))
                idx++;
            }
        
        }, interval * 1000);
    });
    
})();



