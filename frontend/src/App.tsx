import { useState } from 'react';
import Button from './components/Button';
// import VaultArtifact from "../../artifacts/contracts/Vault.sol/Vault.json";
import {ethers} from "ethers";

// const wallet = new ethers.Wallet(import.meta.env.VITE_SAPPHIRE_ACCOUNT_PK)

// const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);

// const signer = wallet.connect(provider);

function App() {

	const [updatingContract, setUpdatingContract] = useState(false);

	// const updateContract = async () => {

	// 	try {
	// 		const contract = new ethers.Contract(
	// 			import.meta.env.VITE_CONTRACT_ADDRESS,
	// 			VaultArtifact.abi,
	// 			signer
	// 		);

	// 		console.log("Connected to Vault contract:", contract);


	// 		const tx = await contract.storeBetData(ethers.parseEther("0.01"), 3);
			
	// 		const receipt = await tx.wait();

	// 		console.log("Transaction confirmed:", receipt);

	// 		const res = await contract.getBets(3);
			
	// 		res.forEach(bet => {
	// 			console.log("Bet Amount:", ethers.formatEther(bet.amount));
	// 			console.log("Better Address:", bet.better);
	// 		});
		
	// 	} catch (error) {
	// 		console.error("Error connecting to the contract", error);
	// 	}

	// }

	const handleClick = () => {
		setUpdatingContract(true);
		// updateContract();
		setUpdatingContract(false);
	}



  return (
    <>
			<Button>
				<button className={"button-bet"} disabled={updatingContract} onClick={handleClick}>Bet</button>
			</Button>
    </>
  )
}

export default App
