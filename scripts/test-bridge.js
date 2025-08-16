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
        // Transfer tokens to user1
        const transferAmount = hre.ethers.utils.parseEther("1000");
        console.log("Transferring tokens to user1...");
        const transferTx = await bridgeToken.connect(owner).transfer(user1.address, transferAmount);
        await transferTx.wait();
        console.log("Tokens transferred to user1");

        // Check initial balance
        const initialBalance = await bridgeToken.balanceOf(user1.address);
        console.log("Initial balance:", hre.ethers.utils.formatEther(initialBalance));

        // Lock tokens
        const amountToLock = hre.ethers.utils.parseEther("100");
        const destinationChainId = 1338; // Polygon chain ID from .env

        // Approve bridge to spend tokens
        console.log("Approving tokens...");
        const approveTx = await bridgeToken.connect(user1).approve(tokenBridge.address, amountToLock);
        await approveTx.wait();
        console.log("Tokens approved");

        // Lock tokens
        console.log("Locking tokens...");
        const lockTx = await tokenBridge.connect(user1).lockTokens(amountToLock, destinationChainId);
        const receipt = await lockTx.wait();
        
        // Get the transaction ID from events
        const lockEvent = receipt.events.find(event => event.event === 'TokensLocked');
        console.log("Tokens locked. Transaction ID:", lockEvent.args.transactionId);

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