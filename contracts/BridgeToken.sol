// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title BridgeToken
 * @dev ERC20 token with minting and burning functionality, owned by a single account.
 * The owner can mint new tokens and burn tokens from any address.
 */
contract BridgeToken is ERC20, Ownable, ERC20Burnable {
    /**
     * @dev Emitted when new tokens are minted
     */
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Emitted when tokens are burned
     */
    event TokensBurned(address indexed from, uint256 amount);

    /**
     * @dev Constructor that mints initial supply to the contract deployer
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param initialSupply The initial supply of tokens to mint
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @dev Creates `amount` new tokens for `to`
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     * Requirements:
     * - only callable by owner
     * - `to` cannot be the zero address
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "BridgeToken: mint to the zero address");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from the caller's account
     * @param amount The amount of tokens to burn
     * Requirements:
     * - only callable by owner
     * - caller must have at least `amount` tokens
     */
    function burn(uint256 amount) public override onlyOwner {
        _burn(_msgSender(), amount);
        emit TokensBurned(_msgSender(), amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, deducting from the caller's allowance
     * @param account The account to burn tokens from
     * @param amount The amount of tokens to burn
     * Requirements:
     * - only callable by owner
     * - caller must have allowance for `account`'s tokens of at least `amount`
     * - `account` must have at least `amount` tokens
     */
    function burnFrom(address account, uint256 amount) public override onlyOwner {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }
}