from fastapi import FastAPI
import httpx

app = FastAPI(title="SystemPulse API Gateway")


USER_SERVICE_URL = "http://127.0.0.1:8001"
PRODUCT_SERVICE_URL = "http://127.0.0.1:8002"


@app.get("/")
def home():
    return {
        "service": "api-gateway",
        "status": "running"
    }


@app.get("/users")
async def get_users():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{USER_SERVICE_URL}/users")

    return response.json()


@app.get("/products")
async def get_products():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{PRODUCT_SERVICE_URL}/products")

    return response.json()


@app.get("/products/{product_id}")
async def get_product(product_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{PRODUCT_SERVICE_URL}/products/{product_id}"
        )

    return response.json()
    