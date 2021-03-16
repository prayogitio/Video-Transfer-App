const express = require('express');
const formidable = require('formidable');
const io = require('socket.io-client');
const path = require('path');
const fs = require('fs');
const socket = io.connect("http://localhost:4002");
socket.once('connect', function() {
    console.log('connected to localhost:4002');
    socket.on('clientEvent', function(data) {
        console.log('message from server:', data);
        socket.emit('serverEvent', "thanks server! for sending '" + data + "'", socket.id);
    });
});
 
const app = express();
app.use(express.static(__dirname + "/public"));
app.post('/upload', (req, res, next) => {
    const videoId = '100595';
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        res.json({
            'videoId': videoId,
            fields,
            files
        });
        let filePath = files.file.path;
        var rawData = fs.readFileSync(filePath);
        socket.emit('videoDataEvent', {'filePath':filePath, 'bin':rawData});
    });
});
app.listen(4001, () => {
    console.log('Server listening on http://localhost:4001 ...');
});
