const { ethers } = require("hardhat");
const { expect } = require("chai");
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(),"ether")
}
describe("Decentralized Exchange", () => {

    let deployer, feeAccount, decentralizedexchange, token1, user1, accounts

    const feePercent = 10

    beforeEach(async () => {
        const DecentralizedExchange = await ethers.getContractFactory("DecentralizedExchange")
        const Token = await ethers.getContractFactory("Token")

        token1 = await Token.deploy("Fenix","FNX", 18, "1000000")

        accounts = await ethers.getSigners()
        deployer = accounts[0]
        feeAccount = accounts[1]
        user1 = accounts[2]

        let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
        await transaction.wait()

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

    describe("Depositing Tokens", () => {

        let transaction, result
        let amount = tokens(10)

        describe("Success", () => {

            beforeEach(async () => {
                //Approve Tokens
                transaction = await token1.connect(user1).approve(decentralizedexchange.address, amount)
                result = await transaction.wait()
                //Deposit Tokens
                transaction = await decentralizedexchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
            })

            it("Tracks the token deposit.", async () => {
                expect(await token1.balanceOf(decentralizedexchange.address)).to.equal(amount)
                expect(await decentralizedexchange.tokens(token1.address, user1.address)).to.equal(amount)

            })

            it("Emits a Deposit event.", async () => {
                const event = result.events[1] // because more than one event are emitted.
                expect(event.event).to.equal("Deposit")

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(amount)
            })
        })

        describe("Failure", () => {
            it("Fails when no tokens are approved.", async () => {
                // Don't approve any tokens before depositing
                await expect(decentralizedexchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted
            })
        })
    })

    describe("Withdrawing Tokens", () => {

        let transaction, result
        let amount = tokens(10)

        describe("Success", () => {

            beforeEach(async () => {
                //Approve Tokens
                transaction = await token1.connect(user1).approve(decentralizedexchange.address, amount)
                result = await transaction.wait()
                //Deposit Tokens
                transaction = await decentralizedexchange.connect(user1).depositToken(token1.address, amount)
                result = await transaction.wait()
                //Withdraw Tokens
                transaction = await decentralizedexchange.connect(user1).withdrawToken(token1.address, amount)
                result = await transaction.wait()
            })

            it("Withdraws token funds.", async () => {
                expect(await token1.balanceOf(decentralizedexchange.address)).to.equal(0)
                expect(await decentralizedexchange.tokens(token1.address, user1.address)).to.equal(0)
                expect(await decentralizedexchange.balanceOf(token1.address, user1.address)).to.equal(0)

            })

            it("Emits a Withdraw event.", async () => {
                const event = result.events[1] // because more than one event are emitted.
                expect(event.event).to.equal("Withdraw")

                const args = event.args
                expect(args.token).to.equal(token1.address)
                expect(args.user).to.equal(user1.address)
                expect(args.amount).to.equal(amount)
                expect(args.balance).to.equal(0)
            })
        })

        describe("Failure", () => {
            it("Fails for insufficient funds.", async () => {
                // Don't approve any tokens before depositing
                await expect(decentralizedexchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted
            })
        })
    })

    describe("Checking Balances", () => {

        let transaction, result
        let amount = tokens(10)

        beforeEach(async () => {
            //Approve Tokens
            transaction = await token1.connect(user1).approve(decentralizedexchange.address, amount)
            result = await transaction.wait()
            //Deposit Tokens
            transaction = await decentralizedexchange.connect(user1).depositToken(token1.address, amount)
            result = await transaction.wait()
        })

        it("Returns user balance.", async () => {
            expect(await decentralizedexchange.balanceOf(token1.address, user1.address)).to.equal(amount)

        })
    })
})