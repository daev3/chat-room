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
  io.emit('user connected', 'new user connected: ' + socket.id);

  socket.on('disconnect', () => {
    io.emit('user disconnected', 'user disconnected: ' + socket.id);
  });
  
  socket.on('chat message', ({msg, username}) => {
    console.log(`${username}: ${msg}`);
    io.emit('chat message', {msg, username });
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});