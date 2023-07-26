"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CctvMonit = exports.CctvAvp = exports.CanAvp = void 0;
const schema_1 = require("./schema");
const mongoose_1 = require("mongoose");
exports.CanAvp = (0, mongoose_1.model)('canAvp', schema_1.CanAvpSchema, 'canAvp');
exports.CctvAvp = (0, mongoose_1.model)('cctvAvp', schema_1.CctvAvpSchema, 'cctvAvp');
exports.CctvMonit = (0, mongoose_1.model)('cctvMonit', schema_1.CctvMonitSchema, 'cctvMonit');
//# sourceMappingURL=model.js.map