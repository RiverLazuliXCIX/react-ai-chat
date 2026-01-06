# React AI Chat

React AI Chat is a minimal demo of streaming from an LLM to a frontend.

## Getting Started

To run this project, you will need to install Python dependencies using

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then install frontend dependencies with

```
npm install
```

You will also need to create a .env file based on the .env.example file, providing an API key for the AI model used. In this
case, that's Gemini - you can get an API key from [here]("https://aistudio.google.com/").

To start the backend server that hosts the health check and chat endpoints, use the following:

```
npm run server
```

Then, start the vite dev server with:

```
npm run dev
```

You should be able to see the health status of the server, and make requests to the LLM. Responses are streamed.
