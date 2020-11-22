import express, { Request, Response } from 'express';
import http from 'http';
import { Socket, Server } from "socket.io";
import initDB from './database/Database';
import { TickerController } from './controllers/TickerController';
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

    console.log(tickerId)

    if (tickerId) {
        socket.join(tickerId);
        console.log('received ticker id ' + tickerId)
    }

    socket.on(tickerId, (broadcast) => {
        io.to(tickerId).emit('broadcast', broadcast);
    });

    console.log("a user connected");

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