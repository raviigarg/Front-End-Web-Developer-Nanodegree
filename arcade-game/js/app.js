// Whole-script strict mode syntax
'use strict';

//global variable declarations 
let MAXSPEED = 400;
let MINSPEED = 200;
let score = 0;
let highScore = 0;

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomNum(MINSPEED, MAXSPEED);
};

//random no generator between upper limit and lower limit for speed
Enemy.prototype.randomNum = function(lowerLim, upperLim) {
    return Math.floor(Math.random() * (upperLim - lowerLim + 1) + lowerLim);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < 500) {
        this.x += this.speed * dt;
    }
    else {
        this.x = -50;
        this.speed = this.randomNum(MINSPEED, MAXSPEED);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = "images/char-boy.png";
    this.x = x;
    this.y = y;
};

//checks the collisions between player and enemy
Player.prototype.checkCollisions = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if ((this.y == allEnemies[i].y) && (this.x < allEnemies[i].x + 50) && (this.x > allEnemies[i].x - 50)) {
            this.reset();
            score = 0;
        }
    }
}

Player.prototype.update = function() {
    if (this.y < 56) {
            this.reset();
            score = score + 1;
        }
    
    this.checkCollisions();

    //If score is greater than high score than score is assigned to high score
    if(highScore < score) {
            highScore = score;
    }
    //updating the score and high score
    document.getElementById('score').innerHTML = "Score : " + score + "   |   High Score : " + highScore;
};

// Changes the position of the player back to the initial
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
    this.x = 202;
    this.y = 404;
};

//handle input method for key press
//function must be within the canvas boundries
//player move up down left right with corresponding keys
Player.prototype.handleInput = function(key) {
    //for x axis boundary check
    if(key === 'left') {
        if(this.x > 0) {
            this.x -= 101;
        }
    }
    else if(key === 'right') {
        if(this.x < 404) {
            this.x += 101;
        }
    }
    //for y axis boundary check
    else if (key === 'up') {
        if(this.y > -31) {
            this.y -= 87;
        } else {
            this.reset(); //if water is hit player goes back to initial position
        }
    }
    else if(key === 'down') {
        if(this.y < 404) {
            this.y += 87;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
        new Enemy(0, 56),
        new Enemy(0, 143),
        new Enemy(0, 230)
];

var player = new Player(202, 404);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});