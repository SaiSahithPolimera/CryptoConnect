// https://eth-sepolia.g.alchemy.com/v2/yIzmJJsDg7HhzZOCglZZY_cqyuSnklmG

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia : {
      url: 'https://eth-sepolia.g.alchemy.com/v2/yIzmJJsDg7HhzZOCglZZY_cqyuSnklmG',
      accounts: ['30be80ce8ccebf24305bd8e9d841c95630e734ce32b6b2a736f1c25b9064bc74']
    }
  }
};