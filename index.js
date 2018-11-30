const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const faker = require('faker');

app.use(express.static(__dirname + '/WebContent'));

const players = {};

io.on('connection', (socket) => {
  const pl = {
    name: faker.internet.userName()
  };
  pl.x = Math.round(Math.random() * 1320);
  pl.y = Math.round(Math.random() * 880);
  pl.color = Math.round(Math.random() *16777215);
  players[pl.name] = pl;
  socket.broadcast.emit('joined', pl);
  socket.emit('players', players);


  console.log('players', players);

  socket.on('name-change', newName =>{
    delete players[pl.name];
    pl.name = newName;
    players[pl.name] = pl;
    io.emit('players', players);
  });

  socket.on('disconnect', () => {
    delete players[pl.name];
    io.emit('left', pl);
  });

});
server.listen(3000, () => {
  console.log('listening on *:3000');
});