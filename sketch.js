const TOT = 1;
let bots = [];
let savedBots = [];
let counter = 0;
let slider;
let gen = 0;
let maxScore = 0;

let width = 700;
let height = 500;

let pause = false;
let loadingModel = false;

let Pong;

function setup() {
  createCanvas(width, height);
  tf.setBackend('cpu');
  for (let i = 0; i < TOT; i++) {
    bots[i] = new AI();
  }

  Pong = Object.assign({}, Game);
  Pong.initialize(width, height);

  setupUpload();
}

function reloadModel(model) {
  loadingModel = true;

  for (let i = 0; i < TOT; i++) {
    bots[i].dispose();
  }

  for (let i = 0; i < TOT; i++) {
    bots[i] = new AI(model, true);
  }

  Pong = Object.assign({}, Game);
  Pong.initialize(width, height);

  loadingModel = false;
}

function draw(){
  if (pause || loadingModel) return;

  var isNewTurn = Pong.getIsNewTurn();

  Pong.update();

  var halfWidth = width / 2;
  var halfHeight = height / 2;

  fill('#2c3e50')
  rect(0, 0, width, height);
  fill('white');

  var player1 = Pong.getPlayer1();
  var player2 = Pong.getPlayer2();
  var ball = Pong.getBall();
  //var turnReset = Pong.getTurnReset();

  if(isNewTurn && player2.score > player1.score + 5) {
    if (player2.score > player1.score + 5) {
      counter = 0;
      nextGeneration();
      Pong = Object.assign({}, Game);
      Pong.initialize(width, height);
    }
    else if (player2.score > player1.score) {
      mutateAI();
    }
    return;
  }

  rect(player1.x, player1.y, player1.width, player1.height);
  rect(player2.x, player2.y, player2.width, player2.height);

  if (ball.shouldRender) {
    rect(ball.x, ball.y, ball.width, ball.height);
  }

  drawingContext.setLineDash([3, 15]);
  stroke(255);
  strokeWeight(3);
  line(halfWidth, 50, halfWidth, height - 50);
  drawingContext.setLineDash([]);
  stroke(0);
  strokeWeight(0);

  textSize(26);
  textAlign(CENTER, CENTER);
  text(player1.score, halfWidth - 80, 20);
  text(player2.score, halfWidth + 80, 20);

  for (let bot of bots) {
    bot.think({
      ball: ball,
      player1: player1,
      player2: player2
    });
    bot.update();
  }

  //if (bots.length === 0) {
  // if (Pong._turnDelayIsOver() && turnReset && player2.score > player1.score) {
  //   counter = 0;
  //   nextGeneration();
  // }

  //textSize(12);
  //text('Round ' + (Pong.round + 1), halfWidth, 20);

  /*for (let n = 0; n < slider.value(); n++){

    if (counter % 70 == 0){
      pos = random(0,250);
      b = new Bar(pos);
      bars.push(b);
    }

    counter++;

    for (let i = bars.length - 1; i >= 0; i--){
      bars[i].update();
      for (let j = bots.length - 1; j >= 0; j--){
        if (bars[i].hits(bots[j])) {
          savedBots.push(bots.splice(j, 1)[0]);
        }
      }
      if (bars[i].offscreen()){
        bars.splice(i, 1);
      }
    }

    for (let i = bots.length - 1; i >= 0; i--){
      if(bots[i].hitGround()){
        bots[i].vy=0;
        bots[i].y=height - bots[i].r/2;
      }

      if (bots[i].offScreen()) {
        savedBots.push(bots.splice(i, 1)[0]);
      }
    }

    for (let bot of bots) {
      bot.think(bars);
      bot.update();
    }

    if (bots.length === 0) {
      counter = 0;
      nextGeneration();
      bars = [];
    }
  }*/

  //background(21, 22, 36);

  maxScore = 0
  for (let bot of bots) {
    //bot.show();
    maxScore = max(maxScore, bot.fitness);
  }

  textSize(12);
  noStroke();
  fill(180);
  text('max: ' + maxScore, 40, 30);
  text('gen: ' + gen, 40, 85);

  /*for (let bar of bars) {
    bar.show();
  }*/
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    Pong.player1.move = DIRECTION.UP;
  } else if (keyCode === DOWN_ARROW) {
    Pong.player1.move = DIRECTION.DOWN;
  }
  else if (keyCode === ESCAPE) {
    Pong = Object.assign({}, Game);
    Pong.initialize(width, height);
  }
  else if (key === 'p') {
    pause = !pause;
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    Pong.player1.move = DIRECTION.IDLE;
  } else if (keyCode === DOWN_ARROW) {
    Pong.player1.move = DIRECTION.IDLE;
  }
}