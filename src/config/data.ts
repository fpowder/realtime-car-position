/**
 * LG u+ mqtt broker url
 */
// export const url = 'mqtt://106.103.228.177:1883';

/* alt-a test mqtt broker */
export const url = 'mqtt://alt-console.com:18831';
// export const url = 'mqtt://192.168.1.78:1883';

export const subsPath = {
    cctvMonit: '/auto/edge/server/json/cctvmonitoring',
    canAvp: '/auto/edge/server/json/canavpcardata',
    cctvAvp: '/auto/edge/server/json/cctvavpcardata'
};

export let sendInterval = 200; // ms
export let emitInterval = 600; // ms
