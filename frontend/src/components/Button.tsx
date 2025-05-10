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
					 defaultValue="0.01"
					 disabled={updatingContract}
					 placeholder="Enter bet amount"
					/>
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