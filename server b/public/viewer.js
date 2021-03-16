// var room = prompt('Enter room name:');
var room = 'test';
var socket = io.connect();
if (room !== '') {
    socket.emit('create or join', room);
    console.log('Attempted to create or join room', room);
}
socket.on('created', function(room) {
    console.log('Created room ' + room);
});
socket.on('full', function(room) {
    console .log('Room ' + room + ' is full');
});
socket.on('join', function (room){
    console.log('Another peer made a request to join room ' + room);
    console.log('This peer is the initiator of room ' + room + '!');
});
socket.on('joined', function(room) {
    console.log('joined: ' + room);
});
socket.on('log', function(array) {
    console.log.apply(console, array);
});
var localVideo = document.querySelector('#local-video');
let blobArray = [];
socket.on('message', function(arrayBuffer) {
    console.log(arrayBuffer);
    blobArray.push(new Blob([new Uint8Array(arrayBuffer)], {'type':'video/mp4'}));
    let currentTime = localVideo.currentTime;
    let blob = new Blob(blobArray, {'type':'video/mp4'});
    localVideo.src = window.URL.createObjectURL(blob);
    localVideo.currentTime = currentTime;
});
