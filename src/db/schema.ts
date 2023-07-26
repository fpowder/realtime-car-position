import { Schema, Types } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface ICanAvp {
    _id: Types.ObjectId;
    lpn: string;
    abnormal: Types.Array<number>;
    timestamp: number;
    serverInterval: number;
}

export interface ICctvAvp {
    _id: Types.ObjectId;
    position: Types.Array<number>;
    abnormal: Types.Array<number>;
    alignment_direction: number;
    alignment_angle: number;
    timestamp: number;
    serverInterval: number;
}

export interface ICctvMonit {
    _id: Types.ObjectId;
    num_of_car: number;
    'car-coordinate': Types.Array<Types.Array<number>>;
    num_of_person: number;
    'person-coordinate': Types.Array<Types.Array<number>>;
    'available-parking': number;
    parking_space_section: Types.Array<Types.Array<number>>;
    timestamp: number
    serverInterval: number;
}

const CanAvpSchema = new Schema<ICanAvp>({
    // _id: Types.ObjectId,
    lpn: String,
    abnormal: [Number],
    timestamp: Number,
    serverInterval: Number
}, { versionKey: false });

const CctvAvpSchema = new Schema<ICctvAvp>({
    // _id: Types.ObjectId,
    position: [Number],
    abnormal: [Number],
    alignment_direction: Number,
    alignment_angle: Number,
    timestamp: Number,
    serverInterval: Number
}, { versionKey: false });

const CctvMonitSchema = new Schema<ICctvMonit>({
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

CanAvpSchema.plugin(mongooseAggregatePaginate);
CctvAvpSchema.plugin(mongooseAggregatePaginate);
CctvMonitSchema.plugin(mongooseAggregatePaginate);

export { CanAvpSchema, CctvAvpSchema, CctvMonitSchema };
