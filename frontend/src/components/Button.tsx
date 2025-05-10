import { useRef, useState } from "react";
import "./button.css";
import signTx from "../utils/signTx";

interface Player {
  name: string;
  win_rate_last_10: number;
  role: string;
}

interface Team {
  name: string;
  wins: number;
  rank: number;
  recent_win_rate: number;
  players: Player[];
}

interface Match {
  match_id: string;
  team_a: Team;
  team_b: Team;
  map: string;
  start_time: string;
}

interface Bet {
  matchId: bigint;
  teamId: bigint;
  amount: string;
}

interface ButtonProps {
  match: Match;
}

const Button: React.FC<ButtonProps> = ({ match }) => {
  const [updatingContract, setUpdatingContract] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<bigint | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTeamId === null) {
      alert("Please select a team to bet on.");
      return;
    }

    setUpdatingContract(true);
    const betAmount = ref.current?.value || "0";

    const txData: Bet = {
      matchId: BigInt(parseInt(match.match_id)),
      teamId: selectedTeamId,
      amount: betAmount,
    };

    try {
      await signTx(txData);
      if (ref.current) {
        ref.current.value = "";
      }
    } catch (error) {
      console.error("Tx failed", error);
    } finally {
      setUpdatingContract(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6  text-center justify-center items-center text-white flex flex-col">
      <h3 className="text-xl font-semibold mb-4">Match ID: {match.match_id}</h3>
      <div className="mb-3">
        <p className="text-gray-400 text-sm">Upcoming Match:</p>
        <div className="flex  justify-center items-center text-center ">
          {" "}
          <p className="font-semibold text-blue-400">{match.team_a.name}</p>
          <p className="text-gray-500 text-center">vs</p>
          <p className="font-semibold text-green-400">{match.team_b.name}</p>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-2">Map: {match.map}</p>
      <p className="text-gray-400 text-sm mb-4">
        Start Time: {new Date(match.start_time).toLocaleString()}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div>
          <label
            htmlFor={`betAmount-${match.match_id}`}
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Bet Amount (ETH):
          </label>
          <input
            type="number"
            id={`betAmount-${match.match_id}`}
            ref={ref}
            key={match.match_id}
            defaultValue="0.01"
            min="0.01"
            step="0.01"
            disabled={updatingContract}
            placeholder="Enter bet amount"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`
              flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                selectedTeamId === BigInt(0)
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:shadow-outline focus:outline-none"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:shadow-outline focus:outline-none"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            onClick={() => setSelectedTeamId(BigInt(0))}
            disabled={updatingContract}
          >
            {match.team_a.name}
          </button>
          <button
            type="button"
            className={`
              flex-1 py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${
                selectedTeamId === BigInt(1)
                  ? "bg-green-600 text-white hover:bg-green-700 focus:shadow-outline focus:outline-none"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600 focus:shadow-outline focus:outline-none"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            onClick={() => setSelectedTeamId(BigInt(1))}
            disabled={updatingContract}
          >
            {match.team_b.name}
          </button>
        </div>
        <button
          type="submit"
          className={`
            bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md focus:shadow-outline focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          disabled={updatingContract || selectedTeamId === null}
        >
          {updatingContract
            ? "Betting..."
            : `Place Bet on Match ${match.match_id}`}
        </button>
      </form>
    </div>
  );
};

export default Button;
