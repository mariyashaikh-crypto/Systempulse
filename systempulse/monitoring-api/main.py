cat > systempulse/monitoring-api/main.py <<'PY'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sys
import os
import asyncio
import time

# ============================================================
# Make collector folder importable
# ============================================================

COLLECTOR_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "collector"
    )
)

if COLLECTOR_PATH not in sys.path:
    sys.path.append(COLLECTOR_PATH)

# ============================================================
# Import SystemPulse Intelligence Engine
# ============================================================

from intelligence_engine import SystemPulseIntelligence

# ============================================================
# Product service configuration
# ============================================================

PRODUCT_SERVICE_URL = os.getenv(
    "PRODUCT_SERVICE_URL",
    "https://systempulse.onrender.com"
)

COLLECTION_INTERVAL_SECONDS = float(
    os.getenv("COLLECTION_INTERVAL_SECONDS", "5")
)

# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="SystemPulse Monitoring API",
    description=(
        "Backend API for SystemPulse monitoring, "
        "anomaly detection and predictive intelligence"
    ),
    version="2.1"
)

# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://project-live-b2595.web.app",
    "https://project-live-b2595.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Intelligence Engine
# ============================================================

intelligence_engine = SystemPulseIntelligence()

# ============================================================
# Data Model
# ============================================================

class MetricData(BaseModel):
    service: str
    response_time_ms: float
    cpu_percent: float
    memory_percent: float
    status_code: Optional[int] = None
    healthy: bool


# ============================================================
# Storage
# ============================================================

latest_metric = None
metric_history = []

MAX_HISTORY = 100

latest_intelligence = None

# ============================================================
# Collector state
# ============================================================

collector_task = None


# ============================================================
# Process telemetry
# ============================================================

def process_metric(metric: MetricData):
    global latest_metric
    global latest_intelligence

    # --------------------------------------------------------
    # Store raw telemetry
    # --------------------------------------------------------

    latest_metric = {
        "timestamp": datetime.now().isoformat(),
        **metric.model_dump()
    }

    metric_history.append(latest_metric)

    if len(metric_history) > MAX_HISTORY:
        metric_history.pop(0)

    # --------------------------------------------------------
    # Send telemetry to Intelligence Engine
    # --------------------------------------------------------

    intelligence_result = intelligence_engine.add_telemetry(
        response_time_ms=metric.response_time_ms,
        cpu_percent=metric.cpu_percent,
        memory_percent=metric.memory_percent
    )

    # --------------------------------------------------------
    # Store intelligence result
    # --------------------------------------------------------

    latest_intelligence = {
        "timestamp": datetime.now().isoformat(),
        **intelligence_result
    }

    return {
        "telemetry": latest_metric,
        "intelligence": latest_intelligence
    }


# ============================================================
# Background telemetry collector
# ============================================================

async def collect_product_metrics():
    """
    Continuously calls the deployed product service and measures
    its real response time.

    This is what connects the product-service simulation to the
    SystemPulse intelligence engine.
    """

    global latest_metric
    global latest_intelligence

    import urllib.request

    while True:
        started = time.perf_counter()

        try:
            url = f"{PRODUCT_SERVICE_URL.rstrip('/')}/products"

            request = urllib.request.Request(
                url,
                method="GET",
                headers={
                    "Accept": "application/json",
                    "User-Agent": "SystemPulse-Monitoring/2.1",
                },
            )

            status_code = None
            healthy = False

            try:
                with urllib.request.urlopen(
                    request,
                    timeout=10
                ) as response:
                    status_code = response.status
                    response.read()
                    healthy = 200 <= response.status < 300

            except Exception:
                healthy = False

            elapsed_ms = (
                time.perf_counter() - started
            ) * 1000.0

            # ------------------------------------------------
            # Use the existing baseline values from the
            # intelligence engine.
            #
            # Product service currently does not expose
            # CPU/memory telemetry, so keep those values at
            # the established baseline.
            # ------------------------------------------------

            metric = MetricData(
                service="product-service",
                response_time_ms=elapsed_ms,
                cpu_percent=intelligence_engine.baseline_cpu,
                memory_percent=intelligence_engine.baseline_memory,
                status_code=status_code,
                healthy=healthy,
            )

            process_metric(metric)

        except Exception as error:
            # Collector must stay alive even if one polling
            # attempt fails.
            print(
                f"[SystemPulse collector] "
                f"collection error: {error}",
                flush=True
            )

        await asyncio.sleep(COLLECTION_INTERVAL_SECONDS)


# ============================================================
# Application startup
# ============================================================

@app.on_event("startup")
async def startup_event():
    global collector_task

    if collector_task is None:
        collector_task = asyncio.create_task(
            collect_product_metrics()
        )

    print(
        "[SystemPulse collector] Started",
        flush=True
    )

    print(
        f"[SystemPulse collector] "
        f"Target: {PRODUCT_SERVICE_URL}/products",
        flush=True
    )

    print(
        f"[SystemPulse collector] "
        f"Interval: {COLLECTION_INTERVAL_SECONDS}s",
        flush=True
    )


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def root():
    return {
        "system": "SystemPulse",
        "service": "monitoring-api",
        "status": "online",
        "version": "2.1",
        "collector": "active",
        "product_service": PRODUCT_SERVICE_URL,
    }


# ============================================================
# Health Endpoint
# ============================================================

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "monitoring-api",
        "timestamp": datetime.now().isoformat()
    }


# ============================================================
# Receive Metrics
# ============================================================

@app.post("/api/metrics")
def receive_metrics(metric: MetricData):
    """
    Manual telemetry ingestion endpoint.

    Existing clients can still POST metrics directly.
    """

    return {
        "message": "Metric processed successfully",
        **process_metric(metric)
    }


# ============================================================
# Get Latest Raw Metric
# ============================================================

@app.get("/api/metrics/latest")
def get_latest_metric():

    if latest_metric is None:
        return {
            "message": "No metrics received yet"
        }

    return latest_metric


# ============================================================
# Get Latest Intelligence Result
# ============================================================

@app.get("/api/intelligence/latest")
def get_latest_intelligence():

    if latest_intelligence is None:
        return {
            "message": "No intelligence results available yet"
        }

    return latest_intelligence


# ============================================================
# Get Intelligence History
# ============================================================

@app.get("/api/intelligence/history")
def get_intelligence_history():

    return {
        "count": len(metric_history),
        "history": metric_history
    }
PY