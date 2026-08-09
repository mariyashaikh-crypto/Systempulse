from fastapi import FastAPI

app = FastAPI(title="SystemPulse User Service")


@app.get("/")
def home():
    return {
        "service": "user-service",
        "status": "running"
    }


@app.get("/users")
def get_users():
    return {
        "service": "user-service",
        "status": "healthy",
        "users": [
            {
                "id": 1,
                "name": "Mariya"
            }
        ]
    }