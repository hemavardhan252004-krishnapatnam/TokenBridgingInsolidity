const hre = require("hardhat");

async function main() {
  // Deploy BridgeToken
  const BridgeToken = await hre.ethers.getContractFactory("BridgeToken");
  const bridgeToken = await BridgeToken.deploy(
    "Bridge Token",    // name
    "BTKN",           // symbol
    1000000           // initialSupply
  );
  await bridgeToken.deployed();
  console.log("BridgeToken deployed to:", bridgeToken.address);

  // Deploy TokenBridge
  const TokenBridge = await hre.ethers.getContractFactory("TokenBridge");
  const tokenBridge = await TokenBridge.deploy(bridgeToken.address);
  await tokenBridge.deployed();
  console.log("TokenBridge deployed to:", tokenBridge.address);

  // Grant MINTER_ROLE to TokenBridge
  const tx = await bridgeToken.transferOwnership(tokenBridge.address);
  await tx.wait();
  console.log("Ownership transferred to TokenBridge");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });