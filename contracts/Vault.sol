// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./types/types.sol";

contract Vault is Ownable {

	mapping (uint256 => Bet[]) bets;

	uint256	_numWin = 0;

	event BetEvent(address indexed _from, uint256 _matchId, uint256 _teamId,
		uint256 amount);

	constructor(address initialOwner) Ownable(initialOwner) {}

	function bet(uint256 matchId, uint256 teamId) external payable {
		require(msg.value > 0, "Bet amount must be greater than 0");

		_storeBetData(msg.value, matchId, teamId);
		emit BetEvent(msg.sender, matchId, teamId, msg.value);
	}

	function _storeBetData(uint256 amount, uint256 matchId, uint256 teamId) internal {
		
		Bet memory newBet;
		newBet.amount = amount;
		newBet.better = msg.sender;
		newBet.result = teamId;

		Bet[] storage matchBets = bets[matchId];
		matchBets.push(newBet);
	}

	function _withdraw(address _to) public {
		require (_numWin > 0, "_numWin must be greater than 0");
		
		uint256 amountToSend = address(this).balance;

		(bool success, ) = payable(owner()).call{value: amountToSend}("");
		require(success, "Ether transfer failed");
	}

	function checkWinner(Result[] memory results) public onlyOwner {
		

		for (uint8 k = 0; k < 2; ++k)
		{
			for (uint256 i = 0; i < results.length; ++i) {
				
				Result memory current = results[i];

				for (uint256 j = 0; j < bets[current.matchId].length; ++j) {

					if (bets[current.matchId][j].result == current.result) {
						if (k == 0)
							++_numWin;
						else
						{
							_withdraw(bets[current.matchId][j].better);
							--_numWin;
						}
					}
				}
			}
		}
	}

	function getBets(uint256 matchId) public view returns (Bet[] memory) {
		return bets[matchId];
	}
}