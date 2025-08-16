const hre = require("hardhat");
require('dotenv').config();

async function main() {
    // Get contract instances
    const BridgeToken = await hre.ethers.getContractFactory("BridgeToken");
    const TokenBridge = await hre.ethers.getContractFactory("TokenBridge");
    
    const bridgeToken = await BridgeToken.attach(process.env.ETHEREUM_TOKEN_ADDRESS);
    const tokenBridge = await TokenBridge.attach(process.env.ETHEREUM_BRIDGE_ADDRESS);

    // Get signers
    const [owner, user1] = await hre.ethers.getSigners();
    console.log("Testing with address:", user1.address);

    try {
        // Check initial balance
        const initialBalance = await bridgeToken.balanceOf(user1.address);
        console.log("Initial balance:", hre.ethers.utils.formatEther(initialBalance));

        // Unlock tokens (simulating bridge operator)
        const amountToUnlock = hre.ethers.utils.parseEther("100");
        const transactionId = "0x966da9641c9cdbca4f4d5a7cbac20cf04cdeb6d49edf78b12fa8dbabb1b9647b"; // Use the transaction ID from previous lock

        console.log("Unlocking tokens...");
        const unlockTx = await tokenBridge.connect(owner).unlockTokens(
            user1.address,
            amountToUnlock,
            transactionId
        );
        const receipt = await unlockTx.wait();
        
        console.log("Tokens unlocked");

        // Check final balance
        const finalBalance = await bridgeToken.balanceOf(user1.address);
        console.log("Final balance:", hre.ethers.utils.formatEther(finalBalance));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });