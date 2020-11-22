import express from 'express';
import http from 'http';
import { Socket, Server } from "socket.io";
import bodyParser from 'body-parser';
import initDB from './database/Database';
import { TickerController } from './controllers/TickerController';
import * as mongoose from 'mongoose';
import { TickerSchema } from './models/Ticker';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(bodyParser.json);
app.use(bodyParser.urlencoded({ extended: false }));

initDB();

const ticketController: TickerController = new TickerController();
const Ticker = mongoose.model('Ticker', TickerSchema);

app.get('/', function (_req, res) {
    res.sendFile(`${__dirname}/index.html`);
});

app.get('/tickers', function(req, res): void {
    Ticker.find({}, (err, ticker) => {
        if (err) {
            res.send(err);
        }
        res.json(ticker);
    });
})

app.route('/tickers')
    .get(ticketController.getTickers)

io.on("connection", function (socket: Socket) {
    console.log("a user connected");

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});