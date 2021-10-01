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

      this.startNewBattle();
    });
};

Game.prototype.startNewBattle = function () {
  if (this.player.agility > this.currentEnemy.agility) {
    this.isPlayerTurn = true;
  } else {
    this.isPlayerTurn = false;
  }

  console.log(`${this.player.name}'s stats are as follows: `);
  console.table(this.player.getStats());
  console.log(this.currentEnemy.getDescription());
  this.battle();
};

Game.prototype.battle = function () {
  if (this.isPlayerTurn) {
    inquirer
      .prompt({
        type: "list",
        message: "What action would you like to partake?",
        name: "action",
        choices: ["Attack", "Use potion..."],
      })
      .then(({ action }) => {
        if (action === "Use potion...") {
          //follow up prompt to go here
        } else {
          const damage = this.player.getAttackValue();
          this.currentEnemy.reduceHealth(damage);

          console.log(
            `${this.player.name} has attached the ${this.currentEnemy.name}`
          );
          console.log(this.currentEnemy.getHealth());
        }
      });
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());
  }
};

module.exports = Game;
