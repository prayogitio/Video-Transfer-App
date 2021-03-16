const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var broadcaster = '';
const room = 'test';
app.use(express.static(__dirname + "/public"));
io.sockets.on("error", e => console.log(e));
io.on('connection', function (socket) {
    console.log('connected:', socket.id);
    broadcaster = socket.id;
    socket.on('serverEvent', function (data, id) {
        console.log('new message from client:', data, id);
    });
    socket.on('videoDataEvent', function (data) {
        console.log('new message from client:', data.filePath, typeof data.bin);
        io.sockets.in(room).emit('message', data.bin);
    });
    socket.emit('clientEvent', 'Hi Client!');

    socket.on('create or join', function(room) {
        console.log('Received request to create or join room ' + room);
    
        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        console.log('Room ' + room + ' now has ' + numClients + ' client(s)');
    
        if (numClients === 0) {
            socket.join(room);
            console.log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);
        } else if (numClients === 1) {
            console.log('Client ID ' + socket.id + ' joined room ' + room);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');
        } else {
            socket.emit('full', room);
        }
    });
});
server.listen(4002, () => {
    console.log('Server listening on http://localhost:4002 ...');
});
