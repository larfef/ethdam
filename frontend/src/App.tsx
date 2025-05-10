import { useState } from "react";
import "../index.css";

import Button from "./components/Button";
import Menu from "./components/menu";
// import VaultArtifact from "../../artifacts/contracts/Vault.sol/Vault.json";
// import {ethers} from "ethers";

// const wallet = new ethers.Wallet(import.meta.env.VITE_SAPPHIRE_ACCOUNT_PK)

// const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);

// const signer = wallet.connect(provider);

function App() {
  interface ChatMessage {
    user: boolean;
    message: string;
  }
  const [userInput, setUserInput] = useState<string>("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newUserMessage: ChatMessage = { user: true, message: userInput };
    setChatLog([...chatLog, newUserMessage]); // Add user message immediately
    setUserInput("");

    try {
      const response = await fetch("http://84.255.245.194:5000/api/chat", {
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
      setChatLog((prevLog) => [...prevLog, aiResponseMessage]); // Add AI response
    } catch (error: any) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        user: false,
        message: "Error communicating with the AI.",
      };
      setChatLog((prevLog) => [...prevLog, errorMessage]); // Add error message
    }
  };
  // const [updatingContract, setUpdatingContract] = useState(false);

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

  // const handleClick = () => {
  // 	setUpdatingContract(true);
  // 	// updateContract();
  // 	setUpdatingContract(false);
  // }

  return (
    <div
      className="bg-gradient-to-br  from-gray-900 to-blue-900 min-h-screen py-20 
	justify-center items-center flex flex-col"
    >
      <Menu /> {/* Assuming you have a Menu component */}
      <div className="text-white">
        <Button />
      </div>
      <h1 className="text-white text-3xl font-bold mb-8 tracking-wide uppercase">
        Esports Bet AI Assistant
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
                className={`mb-2 p-3 rounded-t-xl-lg opacity-100 break-words transition duration-1000 ${
                  msg.user
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-700 text-gray-300 self-start"
                }`}
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
      </div>
    </div>
  );
}
export default App;
