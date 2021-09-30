const { expect } = require("@jest/globals");
const Enemy = require("../lib/Enemy");
const Potion = require("../lib/Potion")

jest.mock("../lib/Potion");

test("creates an enemy object", () => {
    const enemy = new Enemy("goblin, sword");

    expect(enemy.name).toBe("goblin")
    expect(enemy.weapon).toBe("sword")
    expect(enemy.health).toBe(expect.any(Number))
    expect(enemy.strength).toBe(expect.any(Number))
    expect(enemy.agility).toBe(expect.any(Number))
    expect(enemy.potion).toBe(expect.any(Number))
})