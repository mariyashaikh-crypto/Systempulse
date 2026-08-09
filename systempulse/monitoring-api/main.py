from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import sys
import os

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
# FastAPI Application
# ============================================================

app = FastAPI(
    title="SystemPulse Monitoring API",
    description=(
        "Backend API for SystemPulse monitoring, "
        "anomaly detection and predictive intelligence"
    ),
    version="2.0"
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
# Root Endpoint
# ============================================================

@app.get("/")
def root():

    return {
        "system": "SystemPulse",
        "service": "monitoring-api",
        "status": "online",
        "version": "2.0"
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


    # --------------------------------------------------------
    # Return complete result
    # --------------------------------------------------------

    return {
        "message": "Metric processed successfully",
        "telemetry": latest_metric,
        "intelligence": latest_intelligence
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