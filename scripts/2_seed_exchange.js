const {ethers} = require("hardhat");
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), "ether")
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
async function main() {

    // Fetch accounts from wallet - these are unlocked
    const accounts = await ethers.getSigners();

    const Auriga = await ethers.getContractAt("Token", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9")
    console.log(`Token fetched: ${Auriga.address}`)

    const Empyrean = await ethers.getContractAt("Token", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707")
    console.log(`Token fetched: ${Empyrean.address}`)

    const Finix = await ethers.getContractAt("Token", "0x0165878A594ca255338adfa4d48449f69242Eb8F")
    console.log(`Token fetched: ${Finix.address}`)

    const Helix = await ethers.getContractAt("Token", "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853")
    console.log(`Token fetched: ${Helix.address}`)

    const Quantum = await ethers.getContractAt("Token", "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6")
    console.log(`Token fetched: ${Quantum.address}`)

    const Sirius = await ethers.getContractAt("Token", "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318")
    console.log(`Token fetched: ${Sirius.address}`)

    const Zeroconium = await ethers.getContractAt("Token", "0x610178dA211FEF7D417bC0e6FeD39F05609AD788")
    console.log(`Token fetched: ${Zeroconium.address}`)

    //Fetch the deployed DecentralizedExchange
    const decentralizedexchange = await ethers.getContractAt("DecentralizedExchange", "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e")
    console.log(`Token fetched: ${decentralizedexchange.address}`)

    //Give tokens to account[1]
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)

    //user1 transfers 10,000
    let transaction, result
    transaction = await Auriga.connect(sender).transfer(receiver.address, amount)
    console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    //Set up exchange users
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)

    //User1 approves 10,000 Finix tokens
    transaction = await Finix.connect(user1).approve(decentralizedexchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}`)

    //User1 deposit 10,000 Finix tokens
    transaction = await decentralizedexchange.connect(user1).depositToken(Finix.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user1.address}\n`)

    //User2 approves 10,000 Auriga tokens
    transaction = await Auriga.connect(user2).approve(decentralizedexchange.address, amount)
    await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}`)

    //user2  deposits 10,000 Auriga tokens
    transaction = await decentralizedexchange.connect(user2).depositToken(Auriga.address, amount)
    await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user2.address}\n`)

    //Make & Cancel Orders
    //user1 makes order to get tokens
    let orderId
    transaction = await decentralizedexchange.connect(user1).makeOrder(Finix.address, tokens(10), Auriga.address, tokens(55))
    await transaction.wait()
    console.log(`Made Order from ${user1.address}`)
    
    //Cancel Orders
    //user1 cancels order
    orderId = result.events[0].args.orderId
    transaction = await decentralizedexchange.connect(user1).cancelOrder(orderId)
    await transaction.wait()
    console.log(`Cancelled Order from ${user1.address}\n`)

    //wait 1 seconds
    await wait(1)

    //Fill Orders
    //user1 makes order to get tokens
    transaction = await decentralizedexchange.connect(user1).makeOrder(Finix.address, tokens(20), Auriga.address, tokens(70))
    await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    //user2 fills order
    orderId = result.events[0].args.orderId
    transaction = await decentralizedexchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled Order from ${user1.address}\n`)

    //wait 1 seconds
    await wait(1)

    //user1 makes another order
    transaction = await decentralizedexchange.connect(user1).makeOrder(Finix.address, tokens(16), Auriga.address, tokens(23))
    await transaction.wait()
    console.log(`Made Order from ${user1.address}`)

    //user2 fills the order again
    orderId = result.events[0].args.orderId
    transaction = await decentralizedexchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled Order from ${user1.address}\n`)

    //wait 1 seconds
    await wait(1)

    //users2 fills final order
    orderId = result.events[0].args.orderId
    transaction = await decentralizedexchange.connect(user2).fillOrder(orderId)
    result = await transaction.wait()
    console.log(`Filled Order from ${user1.address}\n`)

    //wait 1 seconds
    await wait(1)

    /////////////////////////////////////
    //Seed open orders

    //user1 makes orders
    for(let i = 1; i <= 10; i++){
        transaction = await decentralizedexchange.connect(user1).makeorder(Finix.address, tokens(10 * i), Auriga.address, tokens(20))
        result = await transaction.wait()
        console.log(`Made Order from ${user1.address}`)
        //wait 1  seconds
        await wait(1)
    }

    for(let i = 1; i <= 10; i++){
        transaction = await decentralizedexchange.connect(user2).makeorder(Auriga.address, tokens(10), Finix.address, tokens(20 * i))
        result = await transaction.wait()
        console.log(`Made Order from ${user2.address}`)
        //wait 1  seconds
        await wait(1)
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});