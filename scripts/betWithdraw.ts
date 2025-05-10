import { ethers } from "hardhat";

const BET_AMOUNT_ETH = "0.1";

const MATCH_ID = 1;
const BETTOR1_CHOICE = 1;
const BETTOR2_CHOICE = 2;

async function main() {
  // Get signers
	const deployedVaultAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
  const Vault = await ethers.getContractFactory("Vault");

  const vault = Vault.attach(deployedVaultAddress);

  const [owner, user1] = await ethers.getSigners();
  
  console.log("--- Account Addresses ---");
  console.log("Owner:", owner.address);
  console.log("Bettor1:", user1.address);
  console.log("-------------------------\n");

  // Instantiate the contract

  const betAmountWei = ethers.parseEther(BET_AMOUNT_ETH);

  // Function to get and log balances
  async function logBalances(label) {
    console.log(`\n--- Balances: ${label} ---`);
    const ownerBal = await ethers.provider.getBalance(owner.address);
    const bettor1Bal = await ethers.provider.getBalance(user1.address);
    const contractBal = await ethers.provider.getBalance(deployedVaultAddress);

    console.log(`Owner Balance: ${ethers.formatEther(ownerBal)} ETH`);
    console.log(`Bettor1 Balance: ${ethers.formatEther(bettor1Bal)} ETH`);
    console.log(`Contract Balance: ${ethers.formatEther(contractBal)} ETH`);
    console.log("-------------------------\n");
  }

  await logBalances("Initial");

  // --- Bettor1 places a bet ---
  console.log(`Bettor1 (${owner.address}) is placing a bet on Match ${MATCH_ID} for result ${BETTOR1_CHOICE} with ${BET_AMOUNT_ETH} ETH...`);
  const tx1 = await vault.connect(owner).bet(MATCH_ID, BETTOR1_CHOICE, {
    value: betAmountWei,
  });
  const receipt1 = await tx1.wait();
  console.log(`Bettor1's bet transaction hash: ${tx1.hash}`);
  if (receipt1.status !== 1) {
    console.error("Bettor1's bet transaction failed!");
    process.exit(1);
  }
  console.log("Bettor1's bet confirmed.");
  const gasUsed1 = receipt1.gasUsed;
  const gasPrice1 = receipt1.gasPrice || tx1.gasPrice; // Fallback for older ethers versions or different networks
  const gasCost1 = gasUsed1 * gasPrice1;
  console.log(`Gas cost for Bettor1's bet: ${ethers.formatEther(gasCost1)} ETH`);


  await logBalances("After Bettor1's Bet");

  // --- Bettor2 places a bet ---
  console.log(`Bettor2 (${user1.address}) is placing a bet on Match ${MATCH_ID} for result ${BETTOR2_CHOICE} with ${BET_AMOUNT_ETH} ETH...`);
  const tx2 = await vault.connect(user1).bet(MATCH_ID, BETTOR2_CHOICE, {
    value: betAmountWei,
  });
  const receipt2 = await tx2.wait();
  console.log(`Bettor2's bet transaction hash: ${tx2.hash}`);
   if (receipt2.status !== 1) {
    console.error("Bettor2's bet transaction failed!");
    process.exit(1);
  }
  console.log("Bettor2's bet confirmed.");
  const gasUsed2 = receipt2.gasUsed;
  const gasPrice2 = receipt2.gasPrice || tx2.gasPrice;
  const gasCost2 = gasUsed2 * gasPrice2;
  console.log(`Gas cost for Bettor2's bet: ${ethers.formatEther(gasCost2)} ETH`);

  await logBalances("After Bettor2's Bet (Contract should have total bets)");

	await 
  // // --- Owner calls checkWinner ---
  // // Define the results array: Bettor1 is the winner
  // const resultsToSubmit = [{ matchId: MATCH_ID, result: BETTOR1_CHOICE }];

  // console.log(`Owner (${owner.address}) is calling checkWinner with result: Match ${MATCH_ID} -> Outcome ${BETTOR1_CHOICE}...`);
  // // Ensure the owner is calling checkWinner
  // const tx3 = await vault.connect(owner).checkWinner(resultsToSubmit);
  // const receipt3 = await tx3.wait();
  // console.log(`checkWinner transaction hash: ${tx3.hash}`);
  // if (receipt3.status !== 1) {
  //   console.error("checkWinner transaction failed!");
  //   process.exit(1);
  // }
  // console.log("checkWinner call confirmed.");
  // const gasUsed3 = receipt3.gasUsed;
  // const gasPrice3 = receipt3.gasPrice || tx3.gasPrice;
  // const gasCost3 = gasUsed3 * gasPrice3;
  // console.log(`Gas cost for checkWinner: ${ethers.formatEther(gasCost3)} ETH`);

  // await logBalances("Final (After checkWinner)");

  // console.log("Interaction script finished successfully!");
  // console.log(`Bettor1 (${owner.address}) should have received the winnings (their bet + Bettor2's bet).`);
  // console.log(`Bettor2 (${user1.address}) should have lost their bet.`);
  // console.log(`Contract balance should ideally be 0 (or very small due to dust if division occurs).`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });