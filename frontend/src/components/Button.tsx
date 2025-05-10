import { useRef, useState } from "react";
import "./button.css"
import signTx from "../utils/signTx";

interface bet {
	matchId: bigint;
	teamId: bigint;
	amount: string;
}

const Button = () => {

	const [updatingContract, setUpdatingContract] = useState(false);
	const [selectedTeamId, setSelectedTeamId] = useState(BigInt(1)); // Initialize with a default teamId, e.g., BigInt(1)

	const ref = useRef<HTMLInputElement>(null);


  const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();

		setUpdatingContract(true);

    const betAmount = ref.current?.value || '0';

		const txData: bet = {
			matchId: BigInt(1),
			teamId: BigInt(1),
			amount: betAmount
		}

		try {
			await signTx(txData);
			if (ref.current) {
				ref.current.value = '';
			}
		} catch (error) {
			console.error("Tx failed", error);
		} finally {
			setUpdatingContract(false);
		}
	}

	return (
		<>
							<form onSubmit={handleSubmit}>
					<label htmlFor="betAmount">Bet Amount (ETH): </label>
					<input
					 type="number"
					 id="betAmount"
					 ref={ref}
					 key={1}
					 defaultValue="0"
					 min="0.01"
					 disabled={updatingContract}
					 placeholder="Enter bet amount"
					/>
					<div className="flex justify-center space-x-4 mt-4">
								<button
									type="button" // Important: Set type to "button" to prevent form submission
									className={`
										py-2 px-6 rounded-lg font-semibold transition-colors duration-200
										${selectedTeamId === BigInt(0) 
											? 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700' 
											: 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}
										disabled:opacity-50 disabled:cursor-not-allowed
									`}
									onClick={() => setSelectedTeamId(BigInt(0))}
									disabled={updatingContract}
								>
									Team 0
								</button>
								<button
									type="button" // Important: Set type to "button" to prevent form submission
									className={`
										py-2 px-6 rounded-lg font-semibold transition-colors duration-200
										${selectedTeamId === BigInt(1) 
											? 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700' 
											: 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'}
										disabled:opacity-50 disabled:cursor-not-allowed
									`}
									onClick={() => setSelectedTeamId(BigInt(1))}
									disabled={updatingContract}
								>
									Team 1
								</button>
							</div>
					<button 
						type="submit" 
						className={"button-bet"} 
						disabled={updatingContract}>
							Bet
					</button>
				</form>
		</>
	)
}

export default Button;