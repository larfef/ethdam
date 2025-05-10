import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Vault", function() {

	async function deployVault() {
		const [owner, otherAccount] = await hre.ethers.getSigners();

		const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(owner);

		return { vault, owner, otherAccount };
	}

	describe("Deployement", function() {
		it("Should set the right owner", async function() {
				const { vault, owner } = await loadFixture(deployVault);
	
				expect(await vault.owner()).to.equal(owner.address);
		})
	})

	describe("Betting Functionality", function() {
		it("Should allow a user to place a bet and send Ether to the contract", async function() {
			const {vault, owner, otherAccount} = await loadFixture(deployVault);

			const matchId = 1;
			const teamId = 2;
			const amount = hre.ethers.parseEther("0.5");

			const initialVaultBalance = await hre.ethers.provider.getBalance(vault.target);
			const initialOtherAccountBalance = await hre.ethers.provider.getBalance(otherAccount.address);

			const tx = await vault.connect(otherAccount).bet(matchId, teamId, {
				value: amount
			})

			const receipt = await tx.wait();

			const finalVaultBalance = await hre.ethers.provider.getBalance(vault.target);
			const finalOtherAccountBalance = await hre.ethers.provider.getBalance(otherAccount.address);

			expect(finalVaultBalance).to.equal(initialVaultBalance + amount);

			const gasUsed = receipt.gasUsed;
			const gasPrice = receipt.gasPrice;
			const gasCost = gasUsed * gasPrice;
	
			expect(finalOtherAccountBalance).to.equal(initialOtherAccountBalance - amount - gasCost);
	
			const bets = await vault.getBets(matchId);
			expect(bets.length).to.equal(1);
	
			const placedBet = bets[0];
			expect(placedBet.amount).to.equal(amount);
			expect(placedBet.better).to.equal(otherAccount.address);
			expect(placedBet.result).to.equal(teamId);

		})

		it("Should revert if bet amount is zero", async function() {
			const { vault, otherAccount } = await loadFixture(deployVault);
	
			const matchId = 2;
			const teamId = 1;
			const zeroBetAmount = hre.ethers.parseEther("0");
	
			await expect(
				vault.connect(otherAccount).bet(matchId, teamId, {
					value: zeroBetAmount
				})
			).to.be.revertedWith("Bet amount must be greater than zero");
		});

	})
})

