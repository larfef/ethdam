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

	describe("Bet storage", function() {
		it("Should store the bet data and update contract state correctly", async function() {
			const {vault, owner, otherAccount} = await loadFixture(deployVault);

			const matchId = 1;
			const amount = 1000;

			await vault.connect(owner).storeBetData(amount, matchId);

			const bets = await vault.getBets(matchId);

			expect(bets.length).to.equal(1);

			const bet = bets[0];

			expect(bet.amount).to.equal(amount);
			expect(bet.better).to.equal(owner.address);
		})
	})

})

