import "./App.css";
import { useEffect, useState, useRef } from "react";
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

  const [healthCheckResponse, setHealthCheckResponse] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((result) => setHealthCheckResponse(result.status))
      .catch(() => setHealthCheckResponse("Server unreachable"));
  }, []);

  useEffect(() => {
    if (isLoading && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [completion, isLoading]);

  function scrollToTop() {
    headerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <header ref={headerRef}>
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
        <div ref={bottomRef} id={"ai-response-bottom"}>
          {!isLoading && completion && (
            <button onClick={scrollToTop}>Go to top ⇑</button>
          )}
        </div>
      </main>

      <footer className={`health-check transition-colors duration-700 ${healthCheckResponse === 'healthy' ? 'bg-green-600' : 'bg-red-600'}`}>
        <p>Health check status: {healthCheckResponse}</p>
      </footer>
    </>
  );
}

export default App;
