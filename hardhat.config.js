require('dotenv').config(); // Load environment variables

module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {
      chainId: 1337,
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.METAMASK_PRIVATE_KEYS],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.METAMASK_PRIVATE_KEYS],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.METAMASK_PRIVATE_KEYS],
    },
    mumbai: {
      url: 'https://polygon-mumbai.infura.io/v3/864f9e71b0c24c089ff6fc55a56dc033',
      accounts: [
        '4ff581f219bafcf5af91d52e1a8b484fd93123a475437ee96d293ff423338632',
        '0c1cb4aabe1d70603db34899f1410fa988be0472d711c2315cb110a1ca72a9bb',
        '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
      ],
    },
    // Evorich Chain Testnet configuration
    evorichTestnet: {
      url: "https://rpc.dev.chain.metadap.io/",
      chainId: 119193,
      gas: "auto",
      gasPrice: "auto",
      accounts: [process.env.EVORICH_TESTNET_PRIVATE_KEYS],
    },
  },
};
