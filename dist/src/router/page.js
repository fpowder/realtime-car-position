"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
const tslib_1 = require("tslib");
// react build javascript service router
const express_1 = tslib_1.__importDefault(require("express"));
const pageRouter = express_1.default.Router();
pageRouter.use(express_1.default.json());
pageRouter.get('/', (req, res) => {
    res.json({ message: 'server is running' });
});
exports.page = pageRouter;
//# sourceMappingURL=page.js.map