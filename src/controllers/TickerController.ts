import * as mongoose from 'mongoose';
import { Ticker, TickerSchema } from '../models/Ticker';
import { TickerMessage } from '../models/TickerMessageSchema';
import { Request, Response } from 'express';

const Ticker = mongoose.model('Ticker', TickerSchema);

export class TickerController {

    public createTicker(req: Request, res: Response): void {
        const ticker = new Ticker(req.body);
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

    public saveTickerMessage(id: string, msg: TickerMessage): void {
        Ticker.findOneAndUpdate({ _id: id }, { $push: { 'history': msg } },
            (err, ) => {
                if (err) {
                    console.log(err)
                }
            });
    }
}