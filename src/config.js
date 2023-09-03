// config.js

const ethers = require('ethers');
    
const maticMumbaiNetwork = {
  name: 'Polygon Mumbai Testnet', 
  chainId: 80001,
  urls: ['https://matic-mumbai.chainstacklabs.com'],
  nativeCurrency: {
    name: 'Mumbai Matic',
    symbol: 'MATIC', 
    decimals: 18
  }
}

const maticMumbaiProvider = new ethers.providers.StaticJsonRpcProvider(
  maticMumbaiNetwork.urls[0],
  {
    chainId: maticMumbaiNetwork.chainId,
    name: maticMumbaiNetwork.name
  }
);

module.exports = {
  maticMumbaiProvider,
  maticMumbaiNetwork 
}