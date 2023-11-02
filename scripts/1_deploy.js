import { ethers } from "ethers";

async function main() {
    // Define the network configuration for the Evorich Testnet
    const evorichTestnet = {
        url: "https://rpc.dev.chain.metadap.io/",
        chainId: 119193,
    };

    // Specify the deploying account's private key
    const deployingAccountPrivateKey = "0c1cb4aabe1d70603db34899f1410fa988be0472d711c2315cb110a1ca72a9bb";

    // Create a wallet using the private key and connect it to the provider
    const wallet = new ethers.Wallet(deployingAccountPrivateKey, evorichTestnet);

    // Log the address of the deploying account
    console.log(`Deploying account address: ${wallet.address}`);

    // Deploy contract function
    async function deployContract(contractName, ...args) {
        const ContractFactory = await ethers.getContractFactory(contractName);
        const contract = await ContractFactory.connect(wallet).deploy(...args);
        await contract.deployed();
        console.log(`${contractName} deployed to: ${contract.address}`);
        return contract;
    }

    // Deploy the token contracts on the Evorich Testnet
    const MetaDAPInternalVND = await deployContract("Token", "MetaDAP Internal VND", "VND", 18, "10110009000000");
    const Empyrean = await deployContract("Token", "Empyrean", "EMP", 18, "100000000");
    const Finix = await deployContract("Token", "Finix", "FNX", 18, "100000000");
    const Helix = await deployContract("Token", "Helix", "HLX", 18, "100000000");
    const Quantum = await deployContract("Token", "Quantum", "QTM", 18, "100000000");
    const Sirius = await deployContract("Token", "Sirius", "SRS", 18, "100000000");
    const Zeroconium = await deployContract("Token", "Zeroconium", "ZRC", 18, "100000000");

    // Deploy the DecentralizedExchange contract on the Evorich Testnet
    const decentralizedexchange = await deployContract("DecentralizedExchange", wallet.address, 10);

    console.log(`DecentralizedExchange deployed to: ${decentralizedexchange.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
