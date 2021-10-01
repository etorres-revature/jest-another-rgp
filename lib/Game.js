const inquirer = require("inquirer");
const Enemy = require("./Enemy");
const Player = require("./Player");

function Game() {
  this.roundNumber = 0;
  this.isPlayerTurn = false;
  this.enemies = [];
  this.currentEnemy;
  this.player;
}

Game.prototype.initGame = function () {
  this.enemies.push(new Enemy("goblin", "sword"));
  this.enemies.push(new Enemy("orc", "mace"));
  this.enemies.push(new Enemy("skeleton", "axe"));

  this.currentEnemy = this.enemies[0];

  inquirer
    .prompt({
      type: "text",
      name: "name",
      message: "Please enter your name, good sire.",
    })
    // desctructure the name form the prompt object
    .then(({ name }) => {
      this.player = new Player(name);

      // test object creation
      console.log(this.currentEnemy, this.player);
    });
};
