"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
const tslib_1 = require("tslib");
// react build javascript service router
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const server_1 = require("../server");
const dirname = path_1.default.resolve();
const frontPath = path_1.default.join(server_1.appRoot, '../../../e-avp-parking-lot-react/build/');
const pageRouter = express_1.default.Router();
pageRouter.use(express_1.default.json());
pageRouter.get('/', (req, res) => {
    console.log(dirname);
    console.log(frontPath);
    res.sendFile(path_1.default.join(frontPath, '/index.html'));
});
pageRouter.get('/static/**', (req, res) => {
    res.sendFile(path_1.default.join(frontPath, req.originalUrl));
});
pageRouter.get('/models/**', (req, res) => {
    res.sendFile(path_1.default.join(frontPath, req.originalUrl));
});
exports.page = pageRouter;
//# sourceMappingURL=page.js.map