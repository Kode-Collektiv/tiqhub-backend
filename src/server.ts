import express, { Request, Response } from 'express';
import http from 'http';
import { Socket, Server } from "socket.io";
import initDB from './database/Database';
import { TickerController } from './controllers/TickerController';

const app = express();
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