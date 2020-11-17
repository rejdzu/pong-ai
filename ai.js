class AI{
  constructor(brain, load = false) {
    this.key = DIRECTION.IDLE

    this.player1Score = 1;
    this.player2Score = 1;
    this.fitness = 0;

    if (brain) {
      if (load) {
        this.brain = new NeuralNetwork(brain, 5, 8, 2);
      } else {
        this.brain = brain.copy();
      }
    } 
    else{
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  dispose(){
    this.brain.dispose();
  }

  mutate() {
    this.brain.mutate(0.1);
  }

  think(state) {
    let inputs = [];
    inputs[0] = state.ball.x;
    inputs[1] = state.ball.y;
    inputs[2] = state.player1.y;
    inputs[3] = state.player1.score;
    inputs[4] = state.player2.score;

    let output = this.brain.predict(inputs);
    this.key = DIRECTION.IDLE;
    if (output[0] > output[1]) {
      this.key = DIRECTION.UP;
    }
    else if (output[1] > output[0]) {
      this.key = DIRECTION.DOWN;
    }

    //console.log(output[0] + "      " + output[1]);

    this.player1Score = state.player1.score + 1;
    this.player2Score = state.player2.score + 1;
  }

  update(){
    Pong.setPlayerMove(this.key);
  }
}
