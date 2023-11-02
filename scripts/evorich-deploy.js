const { ethers } = require("ethers");

async function main() {
  // Define your contract factory names and parameters
  const tokenNames = ["Auriga", "Empyrean", "Finix", "Helix", "Quantum", "Sirius", "Zeroconium"];
  const tokenSymbols = ["AUG", "EMP", "FNX", "HLX", "QTM", "SRS", "ZRC"];
  const tokenDecimals = 18;
  const tokenTotalSupply = "100000000";

  const [deployer, feeAccount] = await ethers.getSigners();

  // Deploy tokens and decentralized exchange
  const DecentralizedExchange = await ethers.getContractFactory("DecentralizedExchange");

  const decentralizedexchange = await DecentralizedExchange.deploy(feeAccount.address, 10);
  await decentralizedexchange.deployed();
  console.log(`DecentralizedExchange deployed to: ${decentralizedexchange.address}`);

  const deployedContracts = {
    decentralizedexchange: {
      address: decentralizedexchange.address,
    },
  };

  for (let i = 0; i < tokenNames.length; i++) {
    const Token = await ethers.getContractFactory("Token");

    const token = await Token.deploy(tokenNames[i], tokenSymbols[i], tokenDecimals, tokenTotalSupply);
    await token.deployed();
    console.log(`${tokenNames[i]} deployed to: ${token.address}`);

    deployedContracts[tokenNames[i]] = {
      address: token.address,
    };
  }

  console.log("Deployed Contracts:", deployedContracts);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
