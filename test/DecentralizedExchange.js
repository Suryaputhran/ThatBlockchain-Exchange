const { ethers } = require("hardhat");
const { expect } = require("chai");
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),"ether")
}
describe("Decentralized Exchange", () => {

    let deployer, feeAccount, decentralizedexchange

    const feePercent = 10

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]

        const DecentralizedExchange = await ethers.getContractFactory("DecentralizedExchange")
        decentralizedexchange = await DecentralizedExchange.deploy(feeAccount.address, feePercent)
    })

    describe("Deployment", () => {

        it("Tracks the fee account.", async () => {
            expect(await decentralizedexchange.feeAccount()).to.equal(feeAccount.address)
        })

        it("Tracks the fee percent.", async () => {
            expect(await decentralizedexchange.feePercent()).to.equal(feePercent)
        })

    })
})