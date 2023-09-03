require("@nomicfoundation/hardhat-toolbox");
var task = require("hardhat/config").task;
require("dotenv").config({ path: ".env" });
const privateKeys = process.env.METAMASK_PRIVATE_KEYS || ""

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      chainId: 1337
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(",")
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(",")
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: privateKeys.split(",")

    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [privateKeys] 
    },
    mumbai: {
      url: "https://polygon-rpc.com",
      accounts: '4ff581f219bafcf5af91d52e1a8b484fd93123a475437ee96d293ff423338632'
    
    }
  }
};