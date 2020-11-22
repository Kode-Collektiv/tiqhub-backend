import { Document, Schema } from 'mongoose';

export interface TickerMessage extends Document {
    text: string;
    timestamp: number;
}

export const TickerMessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
}, { _id: false });