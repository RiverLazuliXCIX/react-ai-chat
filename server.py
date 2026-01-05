from os import path

import uvicorn
from fastapi import FastAPI

app_base = path.dirname(__file__)
app_root = path.join(app_base, '../')

app_host = '127.0.0.1'
app_port = 5000

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("server:app", host=app_host, reload=True, port=app_port)