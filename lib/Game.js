const inquirer = require("inquirer");
const Enemy = require("../lib/Enemy");
const Player = require("../lib/Player");

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
          if (!this.player.getInventory()) {
            console.log(`${this.player.name} has no potions remaining...`);
            return this.checkEndOfBattle();
          }

          inquirer
            .prompt({
              type: "list",
              message: "Which potion to use?",
              name: "action",
              choices: this.player
                .getInventory()
                .map((item, index) => `${index + 1}: ${item.name}`),
            })
            .then(({ action }) => {
              const potionDetails = action.split(": ");

              this.player.usePotion(potionDetails[0] - 1);
              console.log(
                `${this.player.name} doth used a ${potionDetails[1]} potion`
              );

              this.checkEndOfBattle();
            });
        } else {
          const damage = this.player.getAttackValue();
          this.currentEnemy.reduceHealth(damage);

          console.log(
            `${this.player.name} has attached the ${this.currentEnemy.name}`
          );
          console.log(this.currentEnemy.getHealth());

          this.checkEndOfBattle();
        }
      });
  } else {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}`);
    console.log(this.player.getHealth());

    this.checkEndOfBattle();
  }
};

Game.prototype.checkEndOfBattle = function () {
  if (this.player.isAlive() && this.currentEnemy.isAlive()) {
    this.isPlayerTurn = !this.isPlayerTurn;
    this.battle();
  } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
    console.log(
      `${this.player.name} defeated the vile and ghastly ${this.currentEnemy.name}`
    );

    this.player.addPotion(this.currentEnemy.potion.name);
    console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

    this.roundNumber++;

    if (this.roundNumber < this.enemies.length) {
      this.currentEnemy = this.enemies[this.roundNumber];
      this.startNewBattle();
    } else {
      console.log(`${this.player.name} haveth woneth the entireth thingeth!!`);
    }
  } else {
    console.log("LOSER!!");
  }
};

module.exports = Game;
