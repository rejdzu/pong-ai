// taken from The Coding Train

function nextGeneration() {
  gen++;
  maxScore=0;
  calculateFitness();
  var bot = bots[0];
  console.log(bot.fitness);
  var newBot = bot.fitness < 0.3 ? new AI() : new AI(bot.brain);
  newBot.mutate();
  bot.dispose();
  bots[0] = newBot;

  /*for (let i = 0; i < TOT; i++) {
    bots[i].dispose();
  }*/
  /*for (let i = 0; i < TOT; i++) {
    bots[i] = pickOne();
  }*/
}

function mutateAI() {
  var newBot = new AI(bot.brain);
  newBot.mutate();
  bot.dispose();
  bots[0] = newBot;
}

function pickOne() {
  let index = 0;
  /*let r = random(1);
  while (r > 0) {
    r = r - bots[index].fitness;
    index++;
  }
  index--;*/
  let bot = bots[index];
  let child = new AI(bot.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  /*let sum = 0;
  for (let bot of savedBots) {
    sum += bot.score;
  }
  for (let bot of savedBots) {
    bot.fitness = bot.score / sum;
  }*/
  let bot = bots[0];
  bot.fitness = bot.player1Score / bot.player2Score;
}
