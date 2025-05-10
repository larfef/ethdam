import {ethers} from "ethers";
import VaultArtifact from "../../../artifacts/contracts/Vault.sol/Vault.json";


export default async function signTx(txData) {

  console.log("signTx function started.");
	if (window.ethereum)
		{
			try {
				const provider = new ethers.BrowserProvider(window.ethereum);
				const signer = await provider.getSigner();
				const contract = new ethers.Contract(
				import.meta.env.VITE_CONTRACT_ADDRESS,
				VaultArtifact.abi,
				signer
			);

			console.log("Connected to Vault contract:", contract);

			const tx = await contract.bet(txData.matchId, txData.teamId, {
				value: ethers.parseEther(txData.amount)
			});
			
			const receipt = await tx.wait();

			console.log("Transaction confirmed:", receipt);

			if (receipt.logs && receipt.logs.length > 0) {
				let betEventFound = false;
				for (const log of receipt.logs) {

						const parsedLog = contract.interface.parseLog(log);
	
						if (parsedLog && parsedLog.name === "BetEvent") {
							betEventFound = true;
							console.log("🎉 BetEvent emitted and parsed successfully!");
							console.log("  From:", parsedLog.args._from);
							console.log("  Match ID:", parsedLog.args._matchId.toString());
							console.log("  Team ID:", parsedLog.args._teamId.toString());
							console.log("  Amount:", parsedLog.args.amount.toString());
						}
				}
	
				if (!betEventFound) {
					console.log("No BetEvent found in the transaction logs for this contract.");
				}
			} else {
				console.log("No logs found in the transaction receipt.");
			}
	
		}
		catch (error) {
			console.error("Error sending transaction", error);
		}
	}
}