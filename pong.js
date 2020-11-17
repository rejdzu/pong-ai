// Global Variables
const PaddleWidth = 10;
const PaddleHeight = 50;
const PaddlePadding = 50;

const SpeedMultiplier = 1;

const BallWidth = 10;

var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];

// The ball object (The cube that bounces back and forth)
var Ball = {
	new: function (width, height, incrementedSpeed) {
		return {
			width: BallWidth,
			height: BallWidth,
			x: (width / 2) - (BallWidth / 2),
			y: (height / 2) - (BallWidth / 2),
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: (incrementedSpeed || (BallWidth / 2)) * SpeedMultiplier
		};
	}
};

// The paddle object (The two lines that move up and down)
var Paddle = {
	new: function (width, height, side) {
		return {
			width: PaddleWidth,
			height: PaddleHeight,
			x: side === 'left' ? PaddlePadding : width - PaddlePadding,
			y: (height / 2) - (PaddleHeight / 2),
			score: 0,
			move: DIRECTION.IDLE,
			speed: 10 * SpeedMultiplier
		};
	}
};

var Game = {
	initialize: function (width, height) {
		//this.canvas = document.querySelector('canvas');
		//this.context = this.canvas.getContext('2d');

		//this.width = 1400;
		//this.height = 1000;

		//this.canvas.style.width = (this.width / 2) + 'px';
		//this.canvas.style.height = (this.height / 2) + 'px';

		this.width = width;
		this.height = height;

		this.turnReset = false;

		this.player1 = Paddle.new(width, height, 'left');
		this.player2 = Paddle.new(width, height, 'right');
		this.ball = Ball.new(width, height);

		this.player2.speed = 8;
		this.running = this.over = false;
		this.turn = this.player2;
		this.timer = this.round = 0;
		this.color = '#2c3e50';

		//Pong.menu();
		//Pong.listen();
	},

	getPlayer1: function() {
		return {
			x: this.player1.x,
			y: this.player1.y,
			score: this.player1.score,
			width: this.player1.width,
			height: this.player1.height
		}
	},

	getPlayer2: function() {
		return {
			x: this.player2.x,
			y: this.player2.y,
			score: this.player2.score,
			width: this.player2.width,
			height: this.player2.height
		}
	},

	getBall: function() {
		var shouldRender = Pong._turnDelayIsOver.call(this);
		return {
			shouldRender: shouldRender,
			x: this.ball.x,
			y: this.ball.y,
			width: this.ball.width,
			height: this.ball.height
		}
	},

	getIsNewTurn: function() {
		return Pong._turnDelayIsOver.call(this) && this.turn;
	},

	setPlayerMove: function(move) {
		this.player1.move = move;
	},
	
	// Update all objects (move the player, paddle, ball, increment the score, etc.)
	update: function () {
		if (!this.over) {
			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) Pong._resetTurn.call(this, this.player2, this.player1);
			if (this.ball.x >= this.width - this.ball.width) Pong._resetTurn.call(this, this.player1, this.player2);
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

			// Move player if they player.move value was updated by a keyboard event
			if (this.player1.move === DIRECTION.UP) this.player1.y -= this.player1.speed;
			else if (this.player1.move === DIRECTION.DOWN) this.player1.y += this.player1.speed;

			// On new serve (start of each turn) move the ball to the correct side
			// and randomize the direction to add some challenge.
			if (Pong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player1 ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = Math.floor(Math.random() * this.height - 200) + 200;
				this.turn = null;
				this.turnReset = false;
			}

			// If the player collides with the bound limits, update the x and y coords.
			if (this.player1.y <= 0) this.player1.y = 0;
			else if (this.player1.y >= (this.height - this.player1.height)) this.player1.y = (this.height - this.player1.height);

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			// Handle paddle (AI) UP and DOWN movement
			if (this.player2.y > this.ball.y - (this.player2.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.player2.y -= this.player2.speed / 1.5;
				else this.player2.y -= this.player2.speed / 4;
			}
			if (this.player2.y < this.ball.y - (this.player2.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.player2.y += this.player2.speed / 1.5;
				else this.player2.y += this.player2.speed / 4;
			}

			// Handle paddle (AI) wall collision
			if (this.player2.y >= this.height - this.player2.height) this.player2.y = this.height - this.player2.height;
			else if (this.player2.y <= 0) this.player2.y = 0;

			// Handle Player-Ball collisions
			if (this.ball.x - this.ball.width <= this.player1.x && this.ball.x >= this.player1.x - this.player1.width) {
				if (this.ball.y <= this.player1.y + this.player1.height && this.ball.y + this.ball.height >= this.player1.y) {
					this.ball.x = (this.player1.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;

					//beep1.play();
				}
			}

			// Handle paddle-ball collision
			if (this.ball.x - this.ball.width <= this.player2.x && this.ball.x >= this.player2.x - this.player2.width) {
				if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
					this.ball.x = (this.player2.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;

					//beep1.play();
				}
			}
		}

		// Handle the end of round transition
		// Check to see if the player won the round.
		/*if (this.player1.score === rounds[this.round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.color = this._generateRoundColor();
				this.player1.score = this.player2.score = 0;
				this.player1.speed += 0.5;
				this.player2.speed += 1;
				this.ball.speed += 1;
				this.round += 1;

				//beep3.play();
			}
		}
		// Check to see if the paddle/AI has won the round.
		else if (this.player2.score === rounds[this.round]) {
			this.over = true;
			setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
		}*/
	},

	// Reset the ball location, the player turns and set a delay before the next round begins.
	_resetTurn: function(victor, loser) {
		this.ball = Ball.new(this.width, this.height, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();

		victor.score++;
		this.turnReset = true;
		//beep2.play();
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timer >= 100);
	},

	// Select a random color as the background of each level/round.
	_generateRoundColor: function () {
		var newColor = colors[Math.floor(Math.random() * colors.length)];
		if (newColor === this.color) return Pong._generateRoundColor();
		return newColor;
	}
};