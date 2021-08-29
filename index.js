const express = require('express');
const http = require('http');
const { SocketAddress } = require('net');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});

io.on('connection', (socket) => {
  socket.broadcast.emit('user connected', 'new user connected: ' + socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', 'user disconnected: ' + socket.id);
  });
  
  socket.on('chat message', ({msg, id, username}) => {
    console.log(`${id}/${username}: ${msg}`);
    socket.broadcast.emit('chat message', {msg, id, username });
  });

  socket.on('user started typing', ({username, socketId}) => {
    socket.broadcast.emit('user started typing', {username, socketId});
  });

  socket.on('user stoped typing', (socketId) => {
    socket.broadcast.emit('user stoped typing', socketId);
  })
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});