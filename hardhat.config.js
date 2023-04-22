require("@nomicfoundation/hardhat-toolbox");
var task = require("hardhat/config").task;
require("dotenv").config({ path: ".env" });

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
    localhost: {}
  }
};
