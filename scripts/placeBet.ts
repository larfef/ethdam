const { ethers } = require("hardhat");

async function main() {
  // Get signers (accounts) from Hardhat's local test network
  const [owner, user1] = await ethers.getSigners();

  console.log("--- Account Addresses ---");
  console.log("Owner (Deployer):", owner.address);
  console.log("User1 (Another Test Account):", user1.address);
  console.log("-------------------------\n");

  // 1. Deploy the simple Contract
  console.log("Deploying simple Contract...");
  const Simple = await ethers.getContractFactory("Simple");
  // Deploy the contract, passing the owner's address to the constructor
  const simple = await Simple.deploy(owner.address);
  // Wait for the deployment transaction to be mined
  await simple.waitForDeployment();
  const simpleAddress = simple.target; // Get the deployed contract's address
  console.log(`simple deployed to: ${simpleAddress}`);
  console.log(`simple owner set to: ${await simple.owner()}\n`);

  // Define amounts to use in Ether (converted to Wei using ethers.parseEther)
  const DEPOSIT_AMOUNT = ethers.parseEther("1.0"); // 1 ETH
  const WITHDRAW_AMOUNT = ethers.parseEther("0.5"); // 0.5 ETH

  // Helper function to log current balances for readability
  async function logBalances(label) {
    console.log(`\n--- Balances: ${label} ---`);
    const ownerEthBal = await ethers.provider.getBalance(owner.address);
    const user1EthBal = await ethers.provider.getBalance(user1.address);
    const contractEthBal = await simple.getContractBalance(); // Get contract's balance via its method

    console.log(`Owner Balance: ${ethers.formatEther(ownerEthBal)} ETH`);
    console.log(`User1 Balance: ${ethers.formatEther(user1EthBal)} ETH`);
    console.log(`Contract Balance: ${ethers.formatEther(contractEthBal)} ETH`);
    console.log("-------------------------\n");
  }

  // Log initial balances before any transactions
  await logBalances("Initial");

  // 2. Test Receiving ETH (Deposit)
  console.log(`Owner (${owner.address}) sending ${ethers.formatEther(DEPOSIT_AMOUNT)} ETH to Vault...`);
  // Send a transaction from the owner to the vault contract with a value
  const depositTx = await owner.sendTransaction({
    to: simpleAddress,
    value: DEPOSIT_AMOUNT,
  });
  await depositTx.wait(); // Wait for the transaction to be mined
  console.log("Deposit transaction confirmed.");

  await logBalances("After Deposit");

  // Assertions for successful deposit
  const vaultBalanceAfterDeposit = await simple.getContractBalance();
  console.assert(vaultBalanceAfterDeposit === DEPOSIT_AMOUNT, "Vault balance should be equal to deposit amount");
  console.log("ETH deposit verified successfully!");

  // 3. Test Withdrawing ETH (by owner)
  console.log(`Owner (${owner.address}) withdrawing ${ethers.formatEther(WITHDRAW_AMOUNT)} ETH from Vault...`);
  const ownerInitialBalanceBeforeWithdrawal = await ethers.provider.getBalance(owner.address); // Get owner's balance before withdrawal tx
  
  // Call the withdrawEth function from the owner account
  const withdrawalTx = await simple.connect(owner).withdrawEth(WITHDRAW_AMOUNT);
  const receipt = await withdrawalTx.wait(); // Wait for the transaction to be mined and get receipt
  
  // Calculate gas cost for the withdrawal transaction to get accurate balance comparison
  const gasUsed = receipt.gasUsed;
  const gasPrice = receipt.gasPrice;
  const gasCost = gasUsed * gasPrice;

  console.log("Withdrawal transaction confirmed.");

  await logBalances("After Withdrawal");

  // Assertions for successful withdrawal
  const ownerFinalBalanceAfterWithdrawal = await ethers.provider.getBalance(owner.address);
  // Owner's balance should increase by the withdrawn amount, minus the gas cost of the withdrawal transaction
  console.assert(ownerFinalBalanceAfterWithdrawal > ownerInitialBalanceBeforeWithdrawal, "Owner balance should increase after withdrawal");
  // The vault's balance should decrease by the withdrawn amount
  console.assert(vaultBalanceAfterDeposit - WITHDRAW_AMOUNT === await simple.getContractBalance(), "Vault balance should decrease by withdrawal amount");
  console.log("ETH withdrawal verified successfully!");


  // 4. Test Unauthorized Withdrawal (expected to revert)
  console.log("\n--- Testing Unauthorized Withdrawal (expected to revert) ---");
  try {
    console.log(`User1 (${user1.address}) attempting to withdraw ${ethers.formatEther(WITHDRAW_AMOUNT)} ETH...`);
    // Try to call withdrawEth from user1 (not the owner)
    await simple.connect(user1).withdrawEth(WITHDRAW_AMOUNT);
    console.error("ERROR: Unauthorized withdrawal did NOT revert!"); // This line should not be reached
  } catch (error) {
    console.log(`SUCCESS: Unauthorized withdrawal reverted as expected! Error: ${error.message}`);
    // Assert that the error message contains the expected revert reason from Ownable
    console.assert(error.message.includes("OwnableUnauthorizedAccount"), "Error message should indicate unauthorized access");
  }

  // 5. Test Insufficient Balance Withdrawal (expected to revert)
  console.log("\n--- Testing Insufficient Balance Withdrawal (expected to revert) ---");
  const EXCESS_WITHDRAW_AMOUNT = ethers.parseEther("1000.0"); // An amount much larger than available in the vault
  try {
    console.log(`Owner (${owner.address}) attempting to withdraw ${ethers.formatEther(EXCESS_WITHDRAW_AMOUNT)} ETH (excessive amount)...`);
    // Try to call withdrawEth from the owner, but with an excessive amount
    await simple.connect(owner).withdrawEth(EXCESS_WITHDRAW_AMOUNT);
    console.error("ERROR: Insufficient balance withdrawal did NOT revert!"); // This line should not be reached
  } catch (error) {
    console.log(`SUCCESS: Insufficient balance withdrawal reverted as expected! Error: ${error.message}`);
    // Assert that the error message contains the expected revert reason from the contract
    console.assert(error.message.includes("Vault: Insufficient ETH balance"), "Error message should indicate insufficient balance");
  }

  console.log("\nAll tests completed!");
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});