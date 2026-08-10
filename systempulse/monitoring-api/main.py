from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sys
import os
import asyncio
import time
import urllib.request


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
# Configuration
# ============================================================

PRODUCT_SERVICE_URL = os.getenv(
    "PRODUCT_SERVICE_URL",
    "https://systempulse.onrender.com"
)

COLLECTION_INTERVAL_SECONDS = float(
    os.getenv(
        "COLLECTION_INTERVAL_SECONDS",
        "5"
    )
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
    version="2.2"
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
intelligence_history = []

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
    # Send telemetry to intelligence engine
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

    intelligence_history.append(latest_intelligence)

    if len(intelligence_history) > MAX_HISTORY:
        intelligence_history.pop(0)

    return {
        "telemetry": latest_metric,
        "intelligence": latest_intelligence
    }


# ============================================================
# Background telemetry collector
# ============================================================

async def collect_product_metrics():

    print(
        "[SystemPulse collector] LOOP STARTED",
        flush=True
    )

    print(
        f"[SystemPulse collector] Target: "
        f"{PRODUCT_SERVICE_URL}/products",
        flush=True
    )

    print(
        f"[SystemPulse collector] Interval: "
        f"{COLLECTION_INTERVAL_SECONDS}s",
        flush=True
    )

    while True:

        started = time.perf_counter()

        try:

            url = (
                f"{PRODUCT_SERVICE_URL.rstrip('/')}"
                "/products"
            )

            request = urllib.request.Request(
                url,
                method="GET",
                headers={
                    "Accept": "application/json",
                    "User-Agent": "SystemPulse-Monitoring/2.2"
                }
            )

            status_code = None
            healthy = False

            try:

                with urllib.request.urlopen(
                    request,
                    timeout=15
                ) as response:

                    status_code = response.status

                    response.read()

                    healthy = (
                        200 <= response.status < 300
                    )

            except Exception as request_error:

                print(
                    "[SystemPulse collector] "
                    f"Product request failed: "
                    f"{request_error}",
                    flush=True
                )

            elapsed_ms = (
                time.perf_counter() - started
            ) * 1000.0

            # ------------------------------------------------
            # Product service currently does not expose CPU
            # and memory telemetry.
            #
            # Therefore use the intelligence engine baseline.
            # ------------------------------------------------

            metric = MetricData(
                service="product-service",

                response_time_ms=round(
                    elapsed_ms,
                    2
                ),

                cpu_percent=(
                    intelligence_engine.baseline_cpu
                ),

                memory_percent=(
                    intelligence_engine.baseline_memory
                ),

                status_code=status_code,

                healthy=healthy
            )

            result = process_metric(metric)

            print(
                "[SystemPulse collector] "
                f"Metric collected: "
                f"{elapsed_ms:.2f}ms "
                f"status={status_code} "
                f"healthy={healthy}",
                flush=True
            )

            print(
                "[SystemPulse collector] "
                f"Intelligence: "
                f"risk={result['intelligence'].get('risk')} "
                f"severity={result['intelligence'].get('severity')} "
                f"anomaly={result['intelligence'].get('anomaly')}",
                flush=True
            )

        except Exception as error:

            print(
                "[SystemPulse collector] "
                f"collection error: {error}",
                flush=True
            )

        await asyncio.sleep(
            COLLECTION_INTERVAL_SECONDS
        )


# ============================================================
# Application startup
# ============================================================

@app.on_event("startup")
async def startup_event():

    global collector_task

    print(
        "==================================================",
        flush=True
    )

    print(
        "[SystemPulse] APPLICATION STARTUP",
        flush=True
    )

    print(
        f"[SystemPulse] Product service: "
        f"{PRODUCT_SERVICE_URL}",
        flush=True
    )

    print(
        f"[SystemPulse] Collection interval: "
        f"{COLLECTION_INTERVAL_SECONDS}s",
        flush=True
    )

    # --------------------------------------------------------
    # Start background collector
    # --------------------------------------------------------

    if (
        collector_task is None
        or collector_task.done()
    ):

        collector_task = asyncio.create_task(
            collect_product_metrics()
        )

        print(
            "[SystemPulse] BACKGROUND COLLECTOR CREATED",
            flush=True
        )

    else:

        print(
            "[SystemPulse] Collector already running",
            flush=True
        )

    print(
        "==================================================",
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
        "version": "2.2",
        "collector": (
            "running"
            if (
                collector_task is not None
                and not collector_task.done()
            )
            else "not running"
        ),
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

    return {
        "message": "Metric processed successfully",
        **process_metric(metric)
    }


# ============================================================
# Latest Raw Metric
# ============================================================

@app.get("/api/metrics/latest")
def get_latest_metric():

    if latest_metric is None:

        return {
            "message": "No metrics received yet"
        }

    return latest_metric


# ============================================================
# Metric History
# ============================================================

@app.get("/api/metrics/history")
def get_metric_history():

    return {
        "count": len(metric_history),
        "history": metric_history
    }


# ============================================================
# Latest Intelligence
# ============================================================

@app.get("/api/intelligence/latest")
def get_latest_intelligence():

    if latest_intelligence is None:

        return {
            "message": (
                "No intelligence results available yet"
            )
        }

    return latest_intelligence


# ============================================================
# Intelligence History
# ============================================================

@app.get("/api/intelligence/history")
def get_intelligence_history():

    return {
        "count": len(intelligence_history),
        "history": intelligence_history
    }