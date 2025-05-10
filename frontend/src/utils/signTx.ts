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

			if (receipt.events) { // For newer ethers.js versions (v5 and above)
				// Ethers.js often provides a more convenient 'events' array
				// which already has parsed events for events defined in your contract's ABI.
				const betEvent = receipt.events.find(event => event.event === "BetEvent");
		
				if (betEvent) {
					console.log("BetEvent emitted (using receipt.events):");
					console.log("From:", betEvent.args._from);
					console.log("Match ID:", betEvent.args._matchId.toString());
					console.log("Team ID:", betEvent.args._teamId.toString());
					console.log("Amount:", betEvent.args.amount.toString());
				}
			} else {
				console.log("No logs or events found in the transaction receipt.");
			}
		
		}
		catch (error) {
			console.error("Error sending transaction", error);
		}
	}
}