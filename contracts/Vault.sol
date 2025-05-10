// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./types/types.sol";

contract Vault is Ownable {

	mapping (uint256 => Bet[]) bets;

	uint256 private _numWin = 0;

	constructor(address initialOwner) Ownable(initialOwner) {}

	function bet(uint256 matchId, uint256 teamId) external payable {
		require(msg.value > 0, "Bet amount must be greater than 0");

		_storeBetData(msg.value, matchId, teamId);
	}

	function _storeBetData(uint256 amount, uint256 matchId, uint256 teamId) internal {
		
		Bet memory newBet;
		newBet.amount = amount;
		newBet.better = msg.sender;
		newBet.result = teamId;

		Bet[] storage matchBets = bets[matchId];
		matchBets.push(newBet);
	}

	function checkWinner(Result[] memory results) public {
		
		for (uint256 i = 0; i < results.length; ++i) {
			
			Result memory current = results[i];

			for (uint256 j = 0; j < bets[current.matchId].length; ++j) {

				if (bets[current.matchId][j].result == current.result) {
					++_numWin;
				}
			}
		}
	}

	function getNumWin() public view returns (uint256) {
		return _numWin;
	}

	function getBets(uint256 matchId) public view returns (Bet[] memory) {
		return bets[matchId];
	}
}