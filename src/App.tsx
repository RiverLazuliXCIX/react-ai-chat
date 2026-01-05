import './App.css'
import {useEffect, useState} from "react";

function App() {
    const [apiResponse, setApiResponse] = useState("");

    useEffect(() => {
        fetch("/api/health")
            .then((response) => response.json())
            .then((result) => setApiResponse(JSON.stringify(result)));
    }, []);

    return (
        <div>
            <h1>{apiResponse}</h1>
        </div>
    );
}

export default App
