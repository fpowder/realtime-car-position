"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const CanAvp_1 = tslib_1.__importDefault(require("../control/sample/CanAvp"));
const CctvAvp_1 = tslib_1.__importDefault(require("../control/sample/CctvAvp"));
const CctvMonit_1 = tslib_1.__importDefault(require("../control/sample/CctvMonit"));
const sampleControls_1 = require("../singleton/sampleControls");
const server_1 = require("../server");
const sampleRouter = express_1.default.Router();
const intervals = [0.1, 0.2, 1];
const fileSetList = fs_1.default.readdirSync(path_1.default.join(server_1.appRoot, '/data/transformed/'));
// console.log('filelist', fileSetList)
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
    if (!fileSetList.includes(body.set)) {
        res.status(400).send({
            message: 'file set name must be one of lists',
            fileSetList: fileSetList
        });
        return;
    }
    if (sampleControls_1.sampleControls.isEmitting === true) {
        res.status(200).send({ message: 'sample data emitting is already stared' });
        return;
    }
    try {
        const interval = body.interval;
        // temporary fix normalCarInterval to 0.1 for sample data test
        const normalCarInterval = 0.1;
        const set = body.set;
        const canAvpPath = `${server_1.appRoot}/data/transformed/${set}/${interval}/canAvpCar.json`;
        const cctvAvpPath = `${server_1.appRoot}/data/transformed/${set}/${interval}/cctvAvpCar.json`;
        const cctvMonitPath = `${server_1.appRoot}/data/transformed/${set}/${interval}/cctvMonit.json`;
        // const cctvMonitPath: string = `${appRoot}/data/transformed/${set}/${normalCarInterval}/cctvMonit.json`;
        // can avp data emit by interval
        /* fs.readFile(canAvpPath, 'utf-8', (err, data) => {
            if(err) return;
            const canAvpData: Object[] = JSON.parse(data);

            sampleControls.canAvp = new CanAvpControl(interval, canAvpData as (CanAvp)[], 'canAvp');
            sampleControls.canAvp.start();
        });

        fs.readFile(cctvAvpPath, 'utf-8', (err, data) => {
            if(err) return;
            const cctvAvpData: Object[] = JSON.parse(data);

            sampleControls.cctvAvp = new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
            sampleControls.cctvAvp.start();

            // new CctvAvpControl(interval, cctvAvpData as (CctvAvp)[], 'cctvAvp');
        });

        fs.readFile(cctvMonitPath, 'utf-8', (err, data) => {
            if(err) return;
            const cctvMonitData: Object[] = JSON.parse(data);

            sampleControls.cctvMonit = new CctvMonitControl(interval, cctvMonitData as (CctvMonit)[], 'cctvMonit');
            sampleControls.cctvMonit.start();
        }); */
        const canAvpDataJson = fs_1.default.readFileSync(canAvpPath, 'utf-8');
        const canAvpData = JSON.parse(canAvpDataJson);
        const cctvAvpDataJson = fs_1.default.readFileSync(cctvAvpPath, 'utf-8');
        const cctvAvpData = JSON.parse(cctvAvpDataJson);
        const cctvMonitDataJson = fs_1.default.readFileSync(cctvMonitPath, 'utf-8');
        const cctvMonitData = JSON.parse(cctvMonitDataJson);
        sampleControls_1.sampleControls.canAvp = new CanAvp_1.default(interval, canAvpData, 'canAvp');
        sampleControls_1.sampleControls.cctvAvp = new CctvAvp_1.default(interval, cctvAvpData, 'cctvAvp');
        sampleControls_1.sampleControls.cctvMonit = new CctvMonit_1.default(interval, cctvMonitData, 'cctvMonit');
        sampleControls_1.sampleControls.canAvp.start();
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
    var _a, _b, _c;
    try {
        if (!sampleControls_1.sampleControls.isEmitting) {
            res.status(200).send({ message: 'sample data emitting is not started yet' });
            return;
        }
        sampleControls_1.sampleControls.isEmitting = false;
        (_a = sampleControls_1.sampleControls.canAvp) === null || _a === void 0 ? void 0 : _a.stop();
        (_b = sampleControls_1.sampleControls.cctvAvp) === null || _b === void 0 ? void 0 : _b.stop();
        (_c = sampleControls_1.sampleControls.cctvMonit) === null || _c === void 0 ? void 0 : _c.stop();
        res.status(200).send({ message: 'sample data socket emit stopped' });
    }
    catch (e) {
        console.log('error occured on sample data control stop process.');
        res.status(500).send({ message: e });
    }
});
sampleRouter.post('/resume', (req, res) => {
    var _a, _b, _c;
    try {
        (_a = sampleControls_1.sampleControls.canAvp) === null || _a === void 0 ? void 0 : _a.start();
        (_b = sampleControls_1.sampleControls.cctvAvp) === null || _b === void 0 ? void 0 : _b.start();
        (_c = sampleControls_1.sampleControls.cctvMonit) === null || _c === void 0 ? void 0 : _c.start();
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