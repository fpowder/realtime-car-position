import { Schema, model, connect } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const CanAvpSchema = new Schema({
    lpn: String,
    abnormal: [Number],
    timestamp: Number
});

const CctvAvpSchema = new Schema({
    position: [Number],
    abnormal: [Number],
    alignment_direction: Number,
    alignment_angle: Number,
    timestamp: Number
});

const CctvMonitSchema = new Schema({
    num_of_car: Number,
    'car-coordinate': [[Number]],
    num_of_person: Number,
    'person-coordinate': [[Number]],
    'available-parking': Number,
    parking_space_section: [[Number]],
    timestamp: Number
});


(async() => {

    await connect('mongodb://localhost:27017/e_avp');

    CanAvpSchema.plugin(mongooseAggregatePaginate);
    CctvAvpSchema.plugin(mongooseAggregatePaginate);
    CctvMonitSchema.plugin(mongooseAggregatePaginate);

    mongooseAggregatePaginate(CanAvpSchema);
    mongooseAggregatePaginate(CctvAvpSchema);
    mongooseAggregatePaginate(CctvMonitSchema);

    const CanAvp = model('canAvp', CanAvpSchema, 'canAvp');
    const CctvAvp = model('cctvAvp', CctvAvpSchema, 'cctvAvp');
    const CctvMonit = model('cctvMonit', CctvMonitSchema, 'cctvMonit');

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

    

})();