import "./App.css";
import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";

function App() {
  const {
    input,
    completion,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/chat",
    headers: { "Content-Type": "application/json" },
    streamProtocol: "text",
  });

  const [apiResponse, setApiResponse] = useState("");

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((result) => setApiResponse(JSON.stringify(result)))
      .catch(() => setApiResponse("Server unreachable"));
  }, []);

  useEffect(() => {
    console.log("completion updated:", completion);
  }, [completion]);

  return (
    <div>
      <h1>React AI Chat</h1>
      <p>Health check status:</p>
      <code>{apiResponse}</code>

      <h2>Enter text below!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ask-input">Message AI:</label>
        <input
          id="ask-input"
          type="text"
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
        />

        <button type="submit" disabled={isLoading || !input}>
          {isLoading ? "Thinking..." : "Submit"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }}>An error occurred: {error.message}</p>
      )}
      <p>{completion}</p>
    </div>
  );
}

export default App;
