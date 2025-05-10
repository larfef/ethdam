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

		}
		catch (error) {
			console.error("Error sending transaction", error);
		}
	}
}