
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

var game = new Phaser.Game(1920, 1080, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var players = {};

  var socket = io();

  var cursors;

function preload() {
  game.load.image('player', './assets/images/idle.png');
}

function create() {

  cursors = game.input.keyboard.createCursorKeys();



  document.getElementById('nickname-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    socket.emit('name-change',document.getElementById('nickname-form').children[0].value);
  });


  socket.on('joined', pl => {
    console.log('player joined', pl);

    addPlayer(pl);

  });

  socket.on('players', players => {
    Object.keys(players).map(k=> players[k]).forEach(pl => {
      updatePlayer(pl);
    });
  });

  socket.on('left', pl =>{
      const player = players[pl.name];
      player.destroy();
      delete players[pl.name];
  });


  // app.ticker.add((delta) => {
  //   sprite.x += 15 * delta;
  // });
  function updatePlayer(pl) {
    const player = players[pl.name];
    if (!player) {
      addPlayer(pl);
      return;
     }

    player.x = pl.x;
    player.y = pl.y;

  }
  function addPlayer(pl) {
       const player =  game.add.sprite(pl.x, pl.y, 'player');
       player.scale.x = 0.3;
       player.scale.y = 0.3;
       player.anchor.setTo(0.5, 0.5);
       // sprite.tint = pl.color;

       players[pl.name] = player;

  }

};
  
function update() {

    if (cursors.left.isDown) {
        console.log('emitting');
        socket.emit('move', -10);
    }
    if (cursors.right.isDown) {
        socket.emit('move', 10);
    }
  // ¯ \_(ツ)_/¯ 
  // "surprise me"
}