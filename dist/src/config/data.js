"use strict";
/**
 * LG u+ mqtt broker url
 */
// export const url = 'mqtt://106.103.228.177:1883';
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitInterval = exports.sendInterval = exports.subsPath = exports.url = void 0;
/* alt-a test mqtt broker */
exports.url = 'mqtt://alt-console.com:18831';
// export const url = 'mqtt://192.168.1.78:1883';
exports.subsPath = {
    cctvMonit: '/auto/edge/server/json/cctvmonitoring',
    canAvp: '/auto/edge/server/json/canavpcardata',
    cctvAvp: '/auto/edge/server/json/cctvavpcardata'
};
exports.sendInterval = 200; // ms
exports.emitInterval = 600; // ms
//# sourceMappingURL=data.js.map