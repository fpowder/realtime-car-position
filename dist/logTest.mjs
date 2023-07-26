"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const mongoose_aggregate_paginate_v2_1 = tslib_1.__importDefault(require("mongoose-aggregate-paginate-v2"));
const CanAvpSchema = new mongoose_1.Schema({
    lpn: String,
    abnormal: [Number],
    timestamp: Number
});
const CctvAvpSchema = new mongoose_1.Schema({
    position: [Number],
    abnormal: [Number],
    alignment_direction: Number,
    alignment_angle: Number,
    timestamp: Number
});
const CctvMonitSchema = new mongoose_1.Schema({
    num_of_car: Number,
    'car-coordinate': [[Number]],
    num_of_person: Number,
    'person-coordinate': [[Number]],
    'available-parking': Number,
    parking_space_section: [[Number]],
    timestamp: Number
});
(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)('mongodb://localhost:27017/e_avp');
    CanAvpSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
    CctvAvpSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
    CctvMonitSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
    (0, mongoose_aggregate_paginate_v2_1.default)(CanAvpSchema);
    (0, mongoose_aggregate_paginate_v2_1.default)(CctvAvpSchema);
    (0, mongoose_aggregate_paginate_v2_1.default)(CctvMonitSchema);
    const CanAvp = (0, mongoose_1.model)('canAvp', CanAvpSchema, 'canAvp');
    const CctvAvp = (0, mongoose_1.model)('cctvAvp', CctvAvpSchema, 'cctvAvp');
    const CctvMonit = (0, mongoose_1.model)('cctvMonit', CctvMonitSchema, 'cctvMonit');
    const options = {
        page: 1,
        limit: 10
    };
    const canAvpAggre = CanAvp.aggregate();
    const cctvAvpAggre = CctvAvp.aggregate();
    const cctvMonitAggre = CctvMonit.aggregate();
    CanAvp.aggregatePaginate(canAvpAggre, options, (err, results) => {
        console.log(results);
    });
    CctvAvp.aggregatePaginate(cctvAvpAggre, options, (err, results) => {
        console.log(results);
    });
    CctvMonit.aggregatePaginate(cctvMonitAggre, options, (err, results) => {
        console.log(results);
    });
}))();
//# sourceMappingURL=logTest.mjs.map