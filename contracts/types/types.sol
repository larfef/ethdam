// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

struct Bet {
	uint256 amount;
	address better;
	uint256	result;
}

struct Result {
	uint256 matchId;
	uint256 result;
}
