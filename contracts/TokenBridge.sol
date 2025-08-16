// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./BridgeToken.sol";

contract TokenBridge is Ownable, ReentrancyGuard {
    BridgeToken public token;
    mapping(bytes32 => bool) public processedTransactions;
    
    uint256 public constant MIN_AMOUNT = 1;
    uint256 public constant MAX_AMOUNT = 1000000 * 10 ** 18;

    event TokensLocked(
        address indexed from, 
        uint256 amount, 
        uint256 chainId, 
        bytes32 indexed transactionId
    );
    event TokensUnlocked(
        address indexed to, 
        uint256 amount, 
        bytes32 indexed transactionId
    );

    constructor(address _token) {
        require(_token != address(0), "Invalid token address");
        token = BridgeToken(_token);
    }

    function lockTokens(
        uint256 amount, 
        uint256 destinationChainId
    ) external nonReentrant {
        require(amount >= MIN_AMOUNT, "Amount below minimum");
        require(amount <= MAX_AMOUNT, "Amount above maximum");
        require(destinationChainId != block.chainid, "Invalid destination chain");
        
        bytes32 transactionId = keccak256(
            abi.encodePacked(
                msg.sender,
                amount,
                destinationChainId,
                block.timestamp
            )
        );

        // First approve the bridge to spend tokens
        token.burnFrom(msg.sender, amount);
        
        emit TokensLocked(msg.sender, amount, destinationChainId, transactionId);
    }

    function unlockTokens(
        address to,
        uint256 amount,
        bytes32 transactionId
    ) external onlyOwner nonReentrant {
        require(!processedTransactions[transactionId], "Transaction already processed");
        require(to != address(0), "Invalid address");
        require(amount >= MIN_AMOUNT, "Amount below minimum");
        require(amount <= MAX_AMOUNT, "Amount above maximum");

        processedTransactions[transactionId] = true;
        token.mint(to, amount);

        emit TokensUnlocked(to, amount, transactionId);
    }
}