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
   // polygon: {
   //   url: "https://polygon-rpc.com",
   //   accounts: [privateKeys] }, 
   
    mumbai: {
      url: 'https://polygon-mumbai.infura.io/v3/864f9e71b0c24c089ff6fc55a56dc033',
      accounts:[ '4ff581f219bafcf5af91d52e1a8b484fd93123a475437ee96d293ff423338632',
                '0c1cb4aabe1d70603db34899f1410fa988be0472d711c2315cb110a1ca72a9bb',
                '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6'
    ] }  
  
  }
};