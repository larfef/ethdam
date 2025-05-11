import { useState, useEffect } from "react";
import "../index.css";
import Button from "./components/Button";
import Menu from "./components/menu";

interface ChatMessage {
  user: boolean;
  message: string;
}

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

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(true); // State for loading
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    const fetchMatchData = async () => {
      setLoadingMatches(true); // Set loading to true when fetching starts
      await sleep(3000);
      try {
        const response = await fetch(`${import.meta.env.VITE_ROFL_ADDRESS}/api/matches`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Match[] = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching match data:", error);
        // Optionally set an error state here to display an error message
      } finally {
        setLoadingMatches(false); // Set loading to false when fetching is complete
      }
    };

    fetchMatchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newUserMessage: ChatMessage = { user: true, message: userInput };
    setChatLog([...chatLog, newUserMessage]);
    setUserInput("");

    try {
      const response = await fetch(`${import.meta.env.VITE_ROFL_ADDRESS}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { response: string } = await response.json();
      const aiResponseMessage: ChatMessage = {
        user: false,
        message: data.response,
      };
      setChatLog((prevLog) => [...prevLog, aiResponseMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        user: false,
        message: "Error communicating with the AI.",
      };
      setChatLog((prevLog) => [...prevLog, errorMessage]);
    }
  };

  return (
    <div
      className="bg-gradient-to-br  from-gray-900 to-blue-900 min-h-screen py-20
  justify-center items-center flex flex-col"
    >
      <Menu />

      <h1 className="text-white text-3xl font-bold mb-8 tracking-wide uppercase">
        BETTY | Ai powered betting agent
      </h1>
      <div className="w-full px-10">
        <div
          className="bg-gray-800 bg-opacity-75 shadow-lg rounded-t-2xl
      flex flex-col justify-between"
          style={{ height: "20vh", overflowY: "auto" }}
        >
          <div className="mb-4 p-4 ">
            {chatLog.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-t-xl-lg break-words transition-opacity duration-500 ease-in ${
                  msg.user
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-300 self-start"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onLoad={(e) => {
                  (e.target as HTMLDivElement).classList.add("opacity-100");
                }}
              >
                <strong className="font-semibold ">
                  {msg.user ? "You:" : "AI:"}
                </strong>{" "}
                {msg.message}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center ">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Ask for betting insights..."
            className="bg-gray-900 text-gray-400 shadow-inner p-4 rounded-bl-2xl py-3  w-full m focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
        <div className="text-white flex-row flex-wrap  grid grid-cols-3 justify-center gap-4 p-4 mt-4">
          {loadingMatches ? (
            <div className="flex justify-center text-center absolute w-screen items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2">Fetching Games...</span>
            </div>
          ) : (
            matches.map((match) => (
              <Button key={match.match_id} match={match} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
