Token Bridge Project
A simple token bridge implementation between Ethereum and Polygon networks using Hardhat. This project demonstrates cross-chain token transfers with proper locking and unlocking mechanisms.

Features
ERC20 token with mint/burn capabilities
Bridge contract for cross-chain transfers
Security features including reentrancy protection
Transaction tracking to prevent double-spending
Prerequisites
Node.js (v14+ recommended)
npm or yarn
Hardhat
Installation
# Install dependencies
npm install

# Install OpenZeppelin contracts
npm install @openzeppelin/contracts
ETHEREUM_RPC_URL="your_ethereum_rpc_url" POLYGON_RPC_URL="your_polygon_rpc_url" BRIDGE_OPERATOR_PRIVATE_KEY="your_operator_private_key" DEPLOYER_PRIVATE_KEY="your_deployer_private_key"

Contract Deployment

Start local Hardhat network
npx hardhat node

Deploy contracts (in a new terminal)
npx hardhat run scripts/deploy.js --network localhost

Testing the Bridge

npx hardhat run scripts/test-bridge.js --network localhost
