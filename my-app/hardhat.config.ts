import { HardhatUserConfig } from "hardhat/config";
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

// Provide your wallet private key
const privateKey = process.env.PRIVATE_KEY;

//Provide your SKALE endpoint address
const skale = process.env.SKALE_CHAIN_ENDPOINT;

const config: HardhatUserConfig = {
  // module.exports = {
  defaultNetwork: "skale",
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    skale: {
      url: skale,
      accounts: [`privateKey`],
    },
  },
};
export default config;
