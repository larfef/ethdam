// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./types/types.sol";

contract Vault is Ownable {

	mapping (uint256 => Bet[]) bets;

	constructor(address initialOwner) Ownable(initialOwner) {}

	function storeBetData(uint256 amount, uint256 matchId) public {
		
		Bet memory newBet;
		newBet.amount = amount;
		newBet.better = msg.sender;

		Bet[] storage matchBets = bets[matchId];
		matchBets.push(newBet);
	}

	function getBets(uint256 matchId) public view returns (Bet[] memory) {
		return bets[matchId];
	}
}