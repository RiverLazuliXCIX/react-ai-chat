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
    <div
      className={
        "flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gray-900"
      }
    >
      <header ref={headerRef}>
        <h1 className={"text-4xl font-bold dark:text-white"}>React AI Chat</h1>
      </header>
      <main>
        <form
          onSubmit={handleSubmit}
          className="my-8 flex flex-wrap items-center justify-around gap-4 p-4 dark:text-white"
        >
          <label htmlFor="ai-input">Message AI:</label>
          <input
            id="ai-input"
            type="text"
            value={input}
            disabled={isLoading}
            onChange={handleInputChange}
            className="w-2xl rounded-md border-2 p-2"
          />

          <button
            type="submit"
            disabled={isLoading || !input}
            className="cursor-pointer rounded-md border-2 p-2 transition-colors duration-100 ease-in-out hover:bg-gray-300 disabled:opacity-50 dark:hover:bg-gray-700"
          >
            {isLoading ? "Loading..." : "➤"}
          </button>
        </form>

        {error && (
          <p className="whitespace-pre-wrap text-red-500">
            An error occurred: {error.message}
          </p>
        )}
        {(isLoading || completion) && (
          <div
            aria-live="polite"
            className="overflow-scroll rounded-md border-2 border-gray-500 bg-gray-200 p-4 text-left dark:bg-gray-700"
          >
            {isLoading && <PulseLoader color={"bg-gray-500"} />}
            <div className="whitespace-pre-wrap dark:text-white">
              <Streamdown>{completion}</Streamdown>
            </div>
          </div>
        )}
        <div ref={bottomRef} id={"ai-response-bottom"}>
          {!isLoading && completion && (
            <button
              onClick={scrollToTop}
              className="mt-4 cursor-pointer rounded-md border-2 p-2 transition-colors duration-100 ease-in-out hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700"
            >
              Go to top ⇑
            </button>
          )}
        </div>
      </main>

      <footer
        className={`mt-8 rounded-md border border-gray-300 text-white transition-colors duration-700 ${healthCheckResponse === "healthy" ? "bg-green-600" : "bg-red-600"}`}
      >
        <p className="p-2">Health check status: {healthCheckResponse}</p>
      </footer>
    </div>
  );
}

export default App;
