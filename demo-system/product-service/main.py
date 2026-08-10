from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SystemPulse Product Service")

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://project-live-b2595.web.app",
        "https://project-live-b2595.firebaseapp.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():

    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")
    )

# ============================================================
# FAILURE SIMULATION
# ============================================================

SIMULATE_DELAY = False

# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "service": "product-service",
        "status": "running"
    }

# ============================================================
# GET ALL PRODUCTS
# ============================================================

@app.get("/products")
def get_products():

    # Simulate a slow service
    if SIMULATE_DELAY:
        time.sleep(2)

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, price FROM products ORDER BY id"
    )

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return {
        "service": "product-service",
        "status": "healthy",
        "products": [
            {
                "id": product[0],
                "name": product[1],
                "price": float(product[2])
            }
            for product in products
        ]
    }

# ============================================================
# GET SINGLE PRODUCT
# ============================================================

@app.get("/products/{product_id}")
def get_product(product_id: int):

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT id, name, price FROM products WHERE id = %s",
        (product_id,)
    )

    product = cursor.fetchone()

    cursor.close()
    connection.close()

    if product is None:
        return {
            "error": "Product not found"
        }

    return {
        "id": product[0],
        "name": product[1],
        "price": float(product[2])
    }

# ============================================================
# ENABLE FAILURE SIMULATION
# ============================================================

@app.post("/simulate/slow")
def simulate_slow():

    global SIMULATE_DELAY

    SIMULATE_DELAY = True

    return {
        "message": "Slow mode enabled",
        "delay_seconds": 2
    }

# ============================================================
# DISABLE FAILURE SIMULATION
# ============================================================

@app.post("/simulate/normal")
def simulate_normal():

    global SIMULATE_DELAY

    SIMULATE_DELAY = False

    return {
        "message": "Normal mode enabled"
    }