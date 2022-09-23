// @ts-ignore: will return to solve
const hre = require("hardhat");

async function main() {
  const PublicJobBoard = await hre.ethers.getContractFactory("PublicJobBoard");
  const publicBoard = await PublicJobBoard.deploy();

  await publicBoard.deployed();

  console.log("PublicJobBoard.sol deployed to:", publicBoard.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
