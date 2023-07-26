"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const __dirname = path_1.default.resolve();
(() => {
    const originDataFiles = fs_1.default.readdirSync(path_1.default.join(__dirname, '/data/origin'));
    console.log(originDataFiles);
    for (const eachPath of originDataFiles) {
        const setPath = `/data/origin/${eachPath}`;
        const set = eachPath.split('_')[0]; // set1, set2, set3
        const interval = eachPath.split('_')[1]; // 0.1, 1
        const canAvpCarPath = path_1.default.join(__dirname, `${setPath}/can-avp-car-data.json`);
        const cctvAvpCarPath = path_1.default.join(__dirname, `${setPath}/cctv-avp-car-data.json`);
        const cctvMonitPath = path_1.default.join(__dirname, `${setPath}/cctv-monitoring-data.json`);
        const canAvpCarArr = [];
        const cctvAvpCarArr = [];
        const cctvMonitArr = [];
        fs_1.default.readFile(canAvpCarPath, 'utf8', (err, data) => {
            ;
            if (err)
                console.log(`can't read file ${canAvpCarPath}`);
            data.split('}{').map(object => {
                if (object[0] !== '{') {
                    object = '{' + object;
                }
                if (object[object.length - 1] !== '}') {
                    object = object + '}';
                }
                canAvpCarArr.push(JSON.parse(object));
            });
            const writePath = `/data/transformed/${set}/${interval}/canAvpCar.json`;
            fs_1.default.writeFileSync(path_1.default.join(__dirname, writePath), JSON.stringify(canAvpCarArr).replaceAll('},{', '},\n{'));
        });
        fs_1.default.readFile(cctvAvpCarPath, 'utf8', (err, data) => {
            if (err)
                console.log(`can't read file ${cctvAvpCarPath}`);
            // console.log(data);
            data.split('}{').map(object => {
                if (object[0] !== '{') {
                    object = '{' + object;
                }
                if (object[object.length - 1] !== '}') {
                    object = object + '}';
                }
                cctvAvpCarArr.push(JSON.parse(object));
            });
            const writePath = `/data/transformed/${set}/${interval}/cctvAvpCar.json`;
            fs_1.default.writeFileSync(path_1.default.join(__dirname, writePath), JSON.stringify(cctvAvpCarArr).replaceAll('},{', '},\n{'));
        });
        fs_1.default.readFile(cctvMonitPath, 'utf8', (err, data) => {
            if (err)
                console.log(`can't read file ${cctvMonitPath}`);
            // console.log(data);
            data.split('}{').map(object => {
                if (object[0] !== '{') {
                    object = '{' + object;
                }
                if (object[object.length - 1] !== '}') {
                    object = object + '}';
                }
                const each = JSON.parse(object);
                const carCords = each['car-coordinate'];
                const orderedCords = sortCoordinatesByDistance(carCords);
                each['car-coordinate'] = orderedCords;
                cctvMonitArr.push(each);
            });
            const writePath = `/data/transformed/${set}/${interval}/cctvMonit.json`;
            fs_1.default.writeFileSync(path_1.default.join(__dirname, writePath), JSON.stringify(cctvMonitArr).replaceAll('},{', '},\n{'));
        });
    }
    function distanceToOrigin(coord) {
        // Calculate the distance between the given coordinate and [0, 0]
        const [x, y] = coord;
        return Math.sqrt(x * x + y * y);
    }
    function sortCoordinatesByDistance(coords) {
        // Sort the coordinates based on their distance to [0, 0]
        return coords.sort((coordA, coordB) => {
            const distA = distanceToOrigin(coordA);
            const distB = distanceToOrigin(coordB);
            return distA - distB;
        });
    }
})();
//# sourceMappingURL=dataSetToArray.mjs.map