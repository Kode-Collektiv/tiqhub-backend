import * as mongoose from 'mongoose';
import { TickerSchema } from '../models/Ticker';
import { Request, Response } from 'express';
import {sign} from "jsonwebtoken";

const Ticker = mongoose.model('Ticker', TickerSchema);

export class TickerController {

    private static _createTickerAccessToken(tickerId: string): string {
        return sign( {tickerId: tickerId}, "WONDERFULSECRET", { expiresIn: '12h' });
    }

    public createTicker(req: Request, res: Response): void {
        const tickerBody = req.body;

        // create Access Token
        tickerBody.accessToken = TickerController._createTickerAccessToken(tickerBody.name);

        // create Ticker and safe
        const ticker = new Ticker(tickerBody);
        ticker.save((err, ticker) => {
            if (err) {
                res.status(400).send(err);
            }
            res.json(ticker);
        });
    }

    public updateTicker(req: Request, res: Response): void {
        Ticker.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true },
            (err, ticker) => {
                if (err) {
                    res.status(400).send(err);
                }
                res.json(ticker);
            });
    }

    public getTickers(req: Request, res: Response): void {
        Ticker.find({}, (err, ticker) => {
            if (err) {
                res.status(400).send(err);
            }
            res.json(ticker);
        });
    }

    public getTicker(req: Request, res: Response): void {
        Ticker.findById(req.params.id, (err, ticker) => {
            if (err) {
                res.status(404).send(err);
            }
            res.json(ticker);
        });
    }

    public deleteTicker(req: Request, res: Response): void {
        Ticker.remove({ _id: req.params.id }, (err,) => {
            if (err) {
                res.status(404).send(err);
            }
            res.json({ message: 'Successfully deleted ticker!' });
        });
    }

}