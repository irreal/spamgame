
import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';

var game = new Phaser.Game(1820, 880, Phaser.AUTO, '', { preload: preload, create: create, update: update });

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
      const player = players[pl.id];
      player.destroy();
      delete players[pl.id];
  });


  // app.ticker.add((delta) => {
  //   sprite.x += 15 * delta;
  // });
  function updatePlayer(pl) {
    const player = players[pl.id];
    if (!player) {
      addPlayer(pl);
      return;
     }

    player.x = pl.x;
    player.y = pl.y;
    player.children[0].text = pl.name;

  }
  function addPlayer(pl) {
       const player =  game.add.sprite(pl.x, pl.y, 'player');
       player.scale.x = 0.3;
       player.scale.y = 0.3;
       player.anchor.setTo(0, 0);
       const nickname = game.add.text(0,0,pl.name,{ font: "65px Arial", fill: "#ff0044", align: "center" });
       player.addChild(nickname);
       // sprite.tint = pl.color;

       players[pl.id] = player;

  }

};
  
function update() {

  const moves = {x: 0, y: 0};
    if (cursors.left.isDown) {
      moves.x = -10;
    }
    if (cursors.right.isDown) {
      moves.x = 10;
    }
    if (cursors.up.isDown) {
      moves.y = -10;
    }
    if (cursors.down.isDown) {
      moves.y = 10;
    }

    if (moves.x || moves.y) {
      if (moves.x && moves.y) {
        moves.x = moves.x / 2;
        moves.y = moves.y / 2;
      }
      socket.emit('move', moves);
    }
  // ¯ \_(ツ)_/¯ 
  // "surprise me"
}