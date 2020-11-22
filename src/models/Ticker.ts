import * as mongoose from 'mongoose';

export const TickerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    }
});