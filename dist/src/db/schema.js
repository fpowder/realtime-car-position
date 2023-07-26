"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CctvMonitSchema = exports.CctvAvpSchema = exports.CanAvpSchema = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_aggregate_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-aggregate-paginate-v2"));
const CanAvpSchema = new mongoose_1.Schema({
    // _id: Types.ObjectId,
    lpn: String,
    abnormal: [Number],
    timestamp: Number,
    serverInterval: Number
}, { versionKey: false });
exports.CanAvpSchema = CanAvpSchema;
const CctvAvpSchema = new mongoose_1.Schema({
    // _id: Types.ObjectId,
    position: [Number],
    abnormal: [Number],
    alignment_direction: Number,
    alignment_angle: Number,
    timestamp: Number,
    serverInterval: Number
}, { versionKey: false });
exports.CctvAvpSchema = CctvAvpSchema;
const CctvMonitSchema = new mongoose_1.Schema({
    // _id: Types.ObjectId,
    num_of_car: Number,
    'car-coordinate': [[Number]],
    num_of_person: Number,
    'person-coordinate': [[Number]],
    'available-parking': Number,
    parking_space_section: [[Number]],
    timestamp: Number,
    serverInterval: Number
}, { versionKey: false });
exports.CctvMonitSchema = CctvMonitSchema;
CanAvpSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
CctvAvpSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
CctvMonitSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
//# sourceMappingURL=schema.js.map