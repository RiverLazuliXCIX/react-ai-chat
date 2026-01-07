import "./App.css";
import { useEffect, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Streamdown } from "streamdown";
import { PulseLoader } from "react-spinners";

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
      .then((result) => setApiResponse(result.status))
      .catch(() => setApiResponse("Server unreachable"));

    const healthCheckElement = document.getElementById("health-check");
    if (apiResponse === "healthy")
      healthCheckElement!.style.backgroundColor = "green";
    else healthCheckElement!.style.backgroundColor = "red";
  }, [apiResponse]);

  useEffect(() => {
    const aiResponse = document.getElementById("ai-response-bottom");

    if (aiResponse === null) return;

    aiResponse.scrollIntoView({ behavior: "smooth" });
  }, [completion]);

  function scrollToTop() {
    const header = document.getElementById("header");

    if (header === null) return;

    header.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header id={"header"}>
        <h1>React AI Chat</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="ai-input">Message AI:</label>
          <input
            id="ai-input"
            type="text"
            value={input}
            disabled={isLoading}
            onChange={handleInputChange}
          />

          <button type="submit" disabled={isLoading || !input}>
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red" }}>An error occurred: {error.message}</p>
        )}

        <div className={"ai-response"}>
          {isLoading && <PulseLoader color={"#fff"}/>}
          <Streamdown>{completion}</Streamdown>
        </div>
        <div id={"ai-response-bottom"}>
          {!isLoading && completion && (
            <button onClick={scrollToTop}>Go to top ⇑</button>
          )}
        </div>
      </main>

      <footer id={"health-check"} className={"health-check"}>
        <p>Health check status: {apiResponse}</p>
      </footer>
    </>
  );
}

export default App;
