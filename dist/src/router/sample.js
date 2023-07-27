"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const CctvAvp_1 = tslib_1.__importDefault(require("../control/sample/CctvAvp"));
const CctvMonit_1 = tslib_1.__importDefault(require("../control/sample/CctvMonit"));
const sampleControls_1 = require("../singleton/sampleControls");
// sample data
const cctvAvp_1 = require("../data/cctvAvp");
const cctvMonit_1 = require("../data/cctvMonit");
const sampleRouter = express_1.default.Router();
const intervals = [0.1, 0.2, 1];
sampleRouter.use(express_1.default.json());
sampleRouter.post('/data', (req, res) => {
    const body = req.body;
    if (!body.interval || !body.set) {
        res.status(400).send({ message: 'request body must includes interval and set value.' });
        return;
    }
    if (!intervals.includes(body.interval)) {
        res.status(400).send({
            message: 'interval value must be one of intervals',
            intervals: intervals
        });
        return;
    }
    if (sampleControls_1.sampleControls.isEmitting === true) {
        res.status(200).send({ message: 'sample data emitting is already stared' });
        return;
    }
    try {
        const cctvAvpData = cctvAvp_1.cctvAvp;
        const cctvMonitData = cctvMonit_1.cctvMonit;
        const interval = body.interval;
        sampleControls_1.sampleControls.cctvAvp = new CctvAvp_1.default(interval, cctvAvpData, 'cctvAvp');
        sampleControls_1.sampleControls.cctvMonit = new CctvMonit_1.default(interval, cctvMonitData, 'cctvMonit');
        sampleControls_1.sampleControls.cctvAvp.start();
        sampleControls_1.sampleControls.cctvMonit.start();
        sampleControls_1.sampleControls.isEmitting = true;
        sampleControls_1.sampleControls.allEmitEndCheck();
    }
    catch (e) {
        console.log('error occured on /sample/data route');
        res.status(400).send({ message: 'error occrured on creating sample e-avp data.' });
    }
    finally {
        res.status(200).send({ message: 'create parking lot realtime data emit started.' });
    }
});
sampleRouter.post('/stop', (req, res) => {
    var _a, _b;
    try {
        if (!sampleControls_1.sampleControls.isEmitting) {
            res.status(200).send({ message: 'sample data emitting is not started yet' });
            return;
        }
        sampleControls_1.sampleControls.isEmitting = false;
        (_a = sampleControls_1.sampleControls.cctvAvp) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = sampleControls_1.sampleControls.cctvMonit) === null || _b === void 0 ? void 0 : _b.stop();
        res.status(200).send({ message: 'sample data socket emit stopped' });
    }
    catch (e) {
        console.log('error occured on sample data control stop process.');
        res.status(500).send({ message: e });
    }
});
sampleRouter.post('/resume', (req, res) => {
    var _a, _b;
    try {
        (_a = sampleControls_1.sampleControls.cctvAvp) === null || _a === void 0 ? void 0 : _a.start();
        (_b = sampleControls_1.sampleControls.cctvMonit) === null || _b === void 0 ? void 0 : _b.start();
        res.status(200).send({ message: 'resuming sample data emit on socket' });
    }
    catch (e) {
        console.log(`can't resume sample data emit on socket.`);
        res.status(500).send({
            message: `can't resume sample data emit on socket.`,
            err: e
        });
    }
});
exports.sample = sampleRouter;
//# sourceMappingURL=sample.js.map