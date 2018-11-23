let type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas"
}

PIXI.utils.sayHello(type)


//Create a Pixi Application
let app = new PIXI.Application({
  width: 1920,
  height: 1080
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x061639;
PIXI.loader
  .add("idle.png")
  .load(setup);

function setup() {
  let texture = PIXI.utils.TextureCache["idle.png"];
  var socket = io();

  let style =  new PIXI.TextStyle({
    fontFamily: "Arial",
    fontSize: 42,
    fill: "white",
    stroke: '#ff3300',
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
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
    spr = app.stage.children.find(c=>c.player && c.player.name === pl.name);
    app.stage.removeChild(spr);
  });

  // app.ticker.add((delta) => {
  //   sprite.x += 15 * delta;
  // });
  function updatePlayer(pl) {
    spr = app.stage.children.find(c=>c.player && c.player.name === pl.name);
    if (!spr) {
      addPlayer(pl);
      return;
    }

    spr.x = pl.x;
    spr.y = pl.y;
  }
  function addPlayer(pl) {
    const sprite = new PIXI.Sprite(texture)
    sprite.player = pl;
    sprite.x = pl.x;
    sprite.y = pl.y;
    sprite.scale.x = 0.3;
    sprite.scale.y = 0.3; 
    sprite.tint = pl.color;

    console.log('test');
    const text = new PIXI.Text(pl.name, style);
    sprite.addChild(text);

    app.stage.addChild(sprite);
  }

}

