import * as mongoose from 'mongoose';
import { TickerSchema } from '../models/Ticker';
import { Request, Response } from 'express';

const Ticker = mongoose.model('Ticker', TickerSchema);

export class TickerController {

    public createTicker(req: Request, res: Response): void {
        const ticker = new Ticker(req.body);
        console.log(req.body);
        ticker.save((err, ticker) => {
            if (err) {
                res.send(err);
            }
            res.json(ticker);
        });
    }

    public updateTicker(req: Request, res: Response): void {
        Ticker.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true },
            (err, ticker) => {
                if (err) {
                    res.send(err);
                }
                res.json(ticker);
            });
    }

    public getTickers(req: Request, res: Response): void {
        console.log(req);
        Ticker.find({}, (err, ticker) => {
            if (err) {
                res.send(err);
            }
            res.json(ticker);
        });
    }

    public getTicker(req: Request, res: Response): void {
        Ticker.findById(req.params.contactId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public deleteTicker(req: Request, res: Response): void {
        Ticker.remove({ _id: req.params.contactId }, (err, ) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted ticker!' });
        });
    }

}