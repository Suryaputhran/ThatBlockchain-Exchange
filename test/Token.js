const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(),"ether")
}
describe("Token", () => {

    let token, accounts, deployer

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token")
    token = await Token.deploy("Fenix", "FNX", "18", "1000000")

    accounts = await ethers.getSigners()
    deployer = accounts[0]
  })

  describe("Deployment", () => {

      const name = "Fenix"
      const symbol = "FNX"
      const decimals = "18"
      const totalSupply = tokens("1000000")

    it("The Name is correct.", async () => {
          expect(await token.name()).to.equal(name)
      })

      it("The Symbol is correct.", async () => {
          expect(await token.symbol()).to.equal(symbol)
      })

      it("The Decimals is correct.", async () => {
          expect(await token.decimals()).to.equal(decimals)
      })

      it("The TotalSupply is correct.", async () => {
          expect(await token.totalSupply()).to.equal(totalSupply)
      })

      it( "Assigns the TotalSupply to deployer.", async () => {
          expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
      })

  })

  // describe spending...

  //describe approving...

  //describe ....

})
