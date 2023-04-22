const { ethers } = require("hardhat");
const { expect } = require("chai");
describe("Token", () => {

  let Token

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token")
    token = await Token.deploy()
  })

  it("It has correct name", async () => {
    expect(await token.name()).to.equal("Fenix")
  })

  it("It has correct symbol", async () => {
    expect(await token.symbol()).to.equal("FNX")
  })

})