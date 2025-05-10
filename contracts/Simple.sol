// contracts/EthVault.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EthVault
 * @dev A simple smart contract to receive and withdraw Ether.
 */
contract Simple is Ownable {

    /**
     * @dev Initializes the contract setting the deployer as the owner.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev This function is automatically executed when Ether is sent to the contract
     * without specifying a function to call (e.g., via a plain transfer).
     * It must be `external` and `payable`.
     */
    receive() external payable {
        // Optionally, you could add an event here to log incoming Ether transfers:
        // emit EthReceived(msg.sender, msg.value);
    }

    /**
     * @dev Allows the owner to withdraw a specified amount of Ether from the vault.
     * @param _amount The amount of Ether (in Wei) to withdraw.
     */
    function withdrawEth(uint256 _amount) public onlyOwner {
        // Ensure the contract has enough Ether to fulfill the withdrawal request.
        require(address(this).balance >= _amount, "Vault: Insufficient ETH balance");
        
        // Send Ether to the owner using a low-level call for robustness.
        // The `payable(owner())` cast is necessary to send Ether.
        (bool success, ) = payable(owner()).call{value: _amount}("");
        require(success, "Vault: ETH transfer failed");
    }

    /**
     * @dev Returns the current Ether balance of the contract.
     * @return The Ether balance of the contract in Wei.
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}