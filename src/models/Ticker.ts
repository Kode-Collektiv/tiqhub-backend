import { Document, Schema } from 'mongoose';
import { TickerMessage, TickerMessageSchema } from './TickerMessageSchema';

export interface Ticker extends Document {
    _id: string;
    history: [TickerMessage];
}

export const TickerSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    history: [TickerMessageSchema],
    accessToken: {
        type: String,
        required: true
    }
});