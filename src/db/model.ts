import { 
    ICanAvp, ICctvAvp, ICctvMonit,
    CanAvpSchema, CctvAvpSchema, CctvMonitSchema
} from './schema';
import { model } from 'mongoose';

export const CanAvp = model<ICanAvp>('canAvp', CanAvpSchema, 'canAvp');
export const CctvAvp = model<ICctvAvp>('cctvAvp', CctvAvpSchema, 'cctvAvp');
export const CctvMonit = model<ICctvMonit>('cctvMonit', CctvMonitSchema, 'cctvMonit');
