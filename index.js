const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const faker = require('faker');

app.use(express.static(__dirname + '/public'));

const players = {};

io.on('connection', (socket) => {
  const pl = {
    name: faker.internet.userName()
  };
  pl.x = Math.round(Math.random() * 1320);
  pl.y = Math.round(Math.random() * 880);
  pl.color = Math.round(Math.random() *16777215);
  pl.id = socket.id;
  players[pl.id] = pl;
  socket.broadcast.emit('joined', pl);
  socket.emit('players', players);


  console.log('players', players);

  socket.on('name-change', newName =>{
    delete players[pl.id];
    pl.name = newName;
    players[pl.id] = pl;
    io.emit('players', players);
  });

  socket.on('move', newPos => {
    pl.x += newPos.x;
    pl.y += newPos.y;
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    delete players[pl.id];
    io.emit('left', pl);
  });

});
server.listen(3000, () => {
  console.log('listening on *:3000');
});
