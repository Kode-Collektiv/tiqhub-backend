import express, { Request, Response } from 'express';
import http from 'http';
import { Socket, Server } from "socket.io";
import initDB from './database/Database';
import { TickerController } from './controllers/TickerController';
import * as mongoose from 'mongoose';
import { Ticker, TickerSchema } from './models/Ticker';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

initDB();
const tickerController = new TickerController();

app.get('/', function (req: Request, res: Response) {
    res.sendFile(__dirname + '/index.html');
});

app.route('/api/v1/tickers')
    .get(tickerController.getTickers)
    .post(tickerController.createTicker);

app.route('/api/v1/tickers/:id')
    .get(tickerController.getTicker)
    .put(tickerController.updateTicker)
    .delete(tickerController.deleteTicker);

io.on("connection", function (socket: Socket) {

    const tickerId = Object(socket.handshake.query)["tickerId"];

    if (tickerId) {
        socket.join(tickerId);
        console.log('new client connected to ticker id ' + tickerId);

        // check if history data is available for this ticker and return it
        const Ticker = mongoose.model('Ticker', TickerSchema);
        Ticker.findById(tickerId, (err, ticker: Ticker) => {
            if (ticker) {
                ticker.history.forEach(msg => {
                    socket.emit('broadcast', JSON.stringify(msg));
                });
            }
        });
    }

    socket.on(tickerId, (broadcast) => {
        tickerController.saveTickerMessage(tickerId, JSON.parse(broadcast));
        io.to(tickerId).emit('broadcast', broadcast);
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

server.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
});