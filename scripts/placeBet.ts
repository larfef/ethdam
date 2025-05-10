import { ethers } from "hardhat";

async function main() {
  // --- IMPORTANT: PASTE YOUR DEPLOYED VAULT CONTRACT ADDRESS HERE ---
  const deployedVaultAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your actual deployed address from Ignition output!

  // Get the ContractFactory for your Vault contract
  const Vault = await ethers.getContractFactory("Vault");

  // Attach to the deployed contract instance using its address
  const vault = Vault.attach(deployedVaultAddress);

  // Get signers (accounts) from Hardhat's provider.
  // The first signer is typically the deployer. We'll use 'user1' for placing the bet.
  const [deployer, user1] = await ethers.getSigners();

  // Define bet parameters
  const matchId = 123;
  const teamId = 1;
  const betAmount = ethers.parseEther("0.1"); // Bet 0.1 Ether (converted to Wei BigInt)

  console.log(`\n--- Placing a Bet ---`);
  console.log(`Contract Address: ${vault.target}`);
  console.log(`Betting from account: ${user1.address}`);
  console.log(`Bet Amount: <span class="math-inline">\{ethers\.formatEther\(betAmount\)\} ETH \(</span>{betAmount.toString()} Wei)`);
  console.log(`Match ID: ${matchId}, Team ID: ${teamId}`);

  // Get initial balance of the user (optional, for logging)
  const initialUserBalance = await ethers.provider.getBalance(user1.address);
  console.log(`User's initial balance: ${ethers.formatEther(initialUserBalance)} ETH`);

  // Call the 'bet' function, connecting with 'user1' and sending Ether
  const tx = await vault.connect(user1).bet(matchId, teamId, {
    value: betAmount
  });

  console.log(`Transaction sent. Hash: ${tx.hash}`);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

  // Get final balance of the user (optional, for logging)
  const finalUserBalance = await ethers.provider.getBalance(user1.address);
  console.log(`User's final balance: ${ethers.formatEther(finalUserBalance)} ETH`);

  // Optional: Verify the bet was stored (requires a getBets function in your contract)
  try {
    const bets = await vault.getBets(matchId);
    console.log(`\n--- Bet Verification ---`);
    console.log(`Number of bets for match ${matchId}: ${bets.length}`);
    if (bets.length > 0) {
      const placedBet = bets[0];
      console.log(`Stored Bet Details:`);
      console.log(`  Amount: ${ethers.formatEther(placedBet.amount)} ETH`);
      console.log(`  Better: ${placedBet.better}`);
      console.log(`  Team ID: ${placedBet.teamId}`);
    }
  } catch (error) {
    console.error("Could not verify bet data. Ensure getBets function is public and correct.");
    console.error(error);
  }

  console.log(`\nBet placed successfully!`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});