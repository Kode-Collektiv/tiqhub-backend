import express from 'express';
import http from 'http';
import { Socket, Server } from "socket.io";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

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