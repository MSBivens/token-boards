import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";

// Provide your wallet private key
const privateKey = process.env.PRIVATE_KEY;

//Provide your SKALE endpoint address
const skale = process.env.SKALE_CHAIN_ENDPOINT;

const config: HardhatUserConfig = {
  defaultNetwork: "skale",
  solidity: {
    version: "0.8.0",
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
      accounts: privateKey,
      gasPrice: 0,
    },
  },
};

export default config;
