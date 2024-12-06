import { useState } from "react"

interface IChatHistory {
  role: string;
  parts: Array<{ text: string }>;
}

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<IChatHistory>>([]);

  const surpriseOptions = [
    "Who won the latest Nobel Peace Prize?",
    "Where does pizza come from?",
    "How do you make a BLT sandwich?",
  ];

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const option = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await fetch('http://localhost:8000/gemini', option);
      const data = await response.text();
      console.log(data);

      setChatHistory((oldChatHistory) => ([
        ...oldChatHistory,
        {
          role: "user",
          parts: [{text: value}],
        },
        {
          role: "model",
          parts: [{text: data}],
        },
      ]))
    }
    catch (error) {
      console.log(error);
      setError("Something went wrong!");
    }
  }

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  }

  return (
    <div className="app">
      <p>What do you want to know?</p>
      <p>
        <button 
          className="surprise"
          onClick={surprise}
          disabled={chatHistory.length > 0}
        >
            Surprise me
        </button>
      </p>
      <div className="input-container">
        <input 
          value={value} 
          type="text" 
          placeholder="When is Christmas?"
          onChange={(e) => {
            setValue(e.target.value)
          }} 
        />
        { !error && <button onClick={getResponse}>Ask me</button>}
        { error && <button onClick={clear}>Clear</button>}
      </div>
      { error && <p>{error}</p>}
      <div className="search-result">
        { chatHistory.map((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">{chatItem.role} : {chatItem.parts[0].text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
