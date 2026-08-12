# ⚡ SystemPulse

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Real-Time System Observability & Predictive Anomaly Intelligence

### Monitor Smarter. Detect Earlier. Understand Failures.

---

# 📖 Overview

**SystemPulse** is an intelligent system monitoring platform that transforms raw service telemetry into meaningful system intelligence.

Instead of simply displaying metrics, SystemPulse analyzes **response time, CPU usage, memory usage, and telemetry trends** to detect anomalies, calculate risk, determine severity, identify potential root causes, and recommend actions.

**Telemetry → Risk Analysis → Anomaly Detection → Intelligence → Action**

---

# ✨ Features

- Real-time system telemetry collection
- Intelligent anomaly detection
- 0–100 risk scoring
- Early degradation detection
- Trend analysis
- Severity classification
- Root-cause reasoning
- Recommended actions
- Controlled anomaly simulation
- Recovery detection
- Historical intelligence tracking
- Interactive React dashboard
- Dark enterprise observability UI

---

# 🧠 System Intelligence

SystemPulse evaluates multiple system signals simultaneously.

### Metrics Monitored

- Response Time
- CPU Utilization
- Memory Utilization
- Service Health
- Risk Score
- Metric Trends

### Severity Levels

| Risk Score | Severity |
|------------|----------|
| `< 25` | NORMAL |
| `25 – 44` | EARLY WARNING |
| `45 – 69` | WARNING |
| `≥ 70` | CRITICAL |

### Trend States

    MIXED / STABLE
    DETERIORATING
    RECOVERING

### Root Cause Detection

SystemPulse can identify conditions such as:

    Combined resource pressure
    CPU pressure
    Memory pressure
    Latency degradation
    Early latency degradation
    No significant issue

Each detected issue is accompanied by an explanation and recommended action.

---

# 🏗️ Project Architecture

    SYSTEMPULSE
         │
         ▼
    Product Service
    FastAPI :8002
         │
         ▼
    Telemetry Collector
         │
    ┌────┴────────────┐
    │                 │
    ▼                 ▼
    telemetry.csv     Monitoring API
                      :8003
                        │
                        ▼
                Intelligence Engine
                        │
             ┌──────────┼──────────┐
             │          │          │
             ▼          ▼          ▼
           Risk       Trend      Root Cause
         Analysis    Analysis     Reasoning
             │          │          │
             └──────────┼──────────┘
                        │
                        ▼
                System Intelligence
                        │
                        ▼
                  React Frontend
                        │
             ┌──────────┼──────────┐
             ▼          ▼          ▼
        Command      Intelligence  Telemetry
        Center           │
                         ▼
                     Simulator

---

# 🔄 How SystemPulse Works

1. The Product Service generates real application activity.
2. The Collector measures response time, CPU, and memory.
3. Telemetry is sent to the Monitoring API.
4. The Intelligence Engine analyzes incoming metrics.
5. SystemPulse calculates a unified risk score.
6. Anomalies and system trends are identified.
7. The engine determines the likely root cause.
8. A recommended action is generated.
9. The React dashboard visualizes the resulting intelligence.

---

# 🚨 Anomaly Simulation

SystemPulse includes a controlled failure simulator for demonstrating real system degradation.

    HEALTHY
       │
       ▼
    INJECT ANOMALY
       │
       ▼
    DETECT
       │
       ▼
    CRITICAL
       │
       ▼
    RECOVER
       │
       ▼
    HEALTHY

The simulator uses the **actual backend** rather than fake frontend animations.

When slow mode is enabled:

    Response Time
    ~50 ms → ~2000 ms

    Risk
    LOW → CRITICAL

    System
    HEALTHY → ANOMALY

When normal mode is restored, SystemPulse observes the new telemetry and tracks the system back toward `NORMAL`.

---

# 🧠 Intelligence Engine

The `SystemPulseIntelligence` engine acts as the core reasoning layer.

### Input

    response_time_ms
    cpu_percent
    memory_percent

### Processing

    Incoming Metrics
           ↓
    Baseline Comparison
           ↓
    Component Risk
           ↓
    Trend Analysis
           ↓
    Cross-Metric Analysis
           ↓
    Final Risk Score
           ↓
    Severity + Anomaly
           ↓
    Root Cause
           ↓
    Recommended Action

### Output

    Risk
    Anomaly
    Severity
    Trend
    Root Cause
    Explanation
    Recommended Action

---

# 📊 Example Intelligence Result

    {
      "response_time_ms": 2057.35,
      "cpu_percent": 20.8,
      "memory_percent": 78.4,
      "risk": 70.4,
      "anomaly": true,
      "severity": "CRITICAL",
      "trend": "DETERIORATING",
      "root_cause": "Latency degradation",
      "recommended_action": "Investigate slow requests and bottlenecks."
    }

This transforms a raw telemetry reading into an interpretable system decision.

---

# 🖥️ Frontend

SystemPulse uses a **dark enterprise observability interface** designed specifically for monitoring system health.

## Command Center

The main operational dashboard for monitoring the entire system at a glance.

- Overall system health
- Current risk and severity
- Live response time, CPU, and memory
- Latest intelligence result
- Service status

Acts as the **central control room** of SystemPulse.

---

## Anomaly Simulator

A controlled environment for demonstrating SystemPulse anomaly detection.

- Inject a performance anomaly
- Monitor real-time system degradation
- Observe Healthy → Detect → Critical → Recover
- Uses real backend telemetry and intelligence
- Demonstrates the complete monitoring lifecycle

---

## Intelligence Engine

The intelligence-focused view of SystemPulse.

- Risk score and anomaly status
- Severity and trend
- Root cause identification
- Explanation of the detected issue
- Recommended corrective action

This is where raw telemetry becomes **actionable system intelligence**.

---

## Telemetry

The historical monitoring view of the system.

- Response-time history
- CPU utilization
- Memory utilization
- Metric trends over time
- Historical observations used by the Intelligence Engine

---

# 🛠️ Tech Stack

| Frontend | Backend | Intelligence | Database |
|----------|---------|--------------|----------|
| React | Python | NumPy | PostgreSQL |
| Vite | FastAPI | Pandas | psycopg2 |
| Tailwind CSS | Uvicorn | Risk Analysis | CSV |
| React Router | Pydantic | Trend Analysis | |
| Recharts | | Root Cause Reasoning | |
| Lucide React | | | |

---

# 📂 Project Structure

    systempulse/
    │
    ├── demo-system/
    │   └── product-service/
    │       └── main.py
    │
    ├── systempulse/
    │   │
    │   ├── collector/
    │   │   ├── collector.py
    │   │   ├── intelligence_engine.py
    │   │   ├── anomaly_detector.py
    │   │   ├── degradation_detector.py
    │   │   ├── root_cause_engine.py
    │   │   └── telemetry.csv
    │   │
    │   └── monitoring-api/
    │       └── main.py
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── config/
    │   │   ├── hooks/
    │   │   ├── layouts/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── utils/
    │   │
    │   ├── index.html
    │   ├── package.json
    │   └── vite.config.js
    │
    └── README.md

---

# 🔌 API Endpoints

## Monitoring API

    GET  /health
    GET  /api/metrics/latest
    POST /api/metrics
    GET  /api/intelligence/latest
    GET  /api/intelligence/history

## Product Service

    GET  /
    GET  /products
    GET  /products/{product_id}

    POST /simulate/slow
    POST /simulate/normal

---

# 📸 Screenshots

## Command Center

<img width="1909" height="909" alt="SystemPulse Command Center" src="https://github.com/user-attachments/assets/c092d7d0-8537-48ee-b94d-2c15f914d163" />

---

## Anomaly Simulator

<img width="1907" height="910" alt="SystemPulse Anomaly Simulator" src="https://github.com/user-attachments/assets/8b71c52a-b1e6-4063-8876-0bd07d9f2b77" />

---

## Intelligence Dashboard

<img width="1905" height="906" alt="SystemPulse Intelligence Dashboard" src="https://github.com/user-attachments/assets/1a624bb5-c276-45f4-a5ec-8f7fa704db33" />

---

## Telemetry Dashboard

<img width="1904" height="911" alt="SystemPulse Telemetry Dashboard" src="https://github.com/user-attachments/assets/3e58dd4c-c693-4bd4-8d2a-8dde91478434" />

---

# ⚙️ Installation

## Clone Repository

    git clone https://github.com/your-username/systempulse.git
    cd systempulse

---

# ▶️ Run the Backend

## Product Service

    cd demo-system/product-service
    uvicorn main:app --reload --port 8002

## Monitoring API

    cd systempulse/monitoring-api
    uvicorn main:app --host 127.0.0.1 --port 8003 --reload

## Telemetry Collector

    cd systempulse/collector
    python collector.py

---

# 💻 Run the Frontend

    cd frontend
    npm install
    npm run dev

Open:

    http://localhost:5173

---

# 📈 Example Detection Lifecycle

    NORMAL
       │
       ▼
    Inject Anomaly
       │
       ▼
    DETECT
       │
       ▼
    CRITICAL
       │
       ▼
    Restore System
       │
       ▼
    RECOVER
       │
       ▼
    NORMAL

All major states are derived from **actual telemetry and backend intelligence**.

---

# 🚀 Future Improvements

- Machine-learning-based anomaly detection
- Time-series forecasting
- Persistent telemetry database
- Real-time alert notifications
- Incident management
- Automated remediation
- Distributed service monitoring
- Multi-service dependency analysis
- Cloud deployment
- Production observability integrations

---

# 💡 Why SystemPulse?

Traditional monitoring answers:

> **"What are the metrics?"**

SystemPulse aims to answer:

> **"What is happening, how serious is it, why is it happening, and what should we do?"**

---

# 🎯 Project Vision

SystemPulse aims to transform traditional monitoring from a passive metrics dashboard into an **intelligent decision-support system**.

    OBSERVE
       ↓
    UNDERSTAND
       ↓
    ACT

### SystemPulse — From System Metrics to System Intelligence.

---

# 👨‍💻 Author

**Mariya Shaikh**

BTech Information Technology Student

---

### ⭐ If you found this project useful, consider starring the repository.
