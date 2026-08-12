# ⚡ SystemPulse

[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)


### Real-Time System Observability & Predictive Anomaly Intelligence

### 📡 Monitor Smarter. Detect Earlier. Understand Failures.

---

# 📖 Overview

**SystemPulse** is an intelligent system monitoring platform that transforms raw service telemetry into meaningful system intelligence.

Instead of simply displaying metrics, SystemPulse analyzes **response time, CPU usage, memory usage and telemetry trends** to detect anomalies, calculate risk, determine severity, identify potential root causes and recommend actions.

The core pipeline is:

**Telemetry → Risk Analysis → Anomaly Detection → Intelligence → Action**

---

# ✨ Features

✅ Real-time system telemetry collection

✅ Intelligent anomaly detection

✅ 0–100 predictive risk scoring

✅ Early degradation detection

✅ Trend analysis

✅ Severity classification

✅ Root-cause reasoning

✅ Action recommendations

✅ Controlled anomaly simulation

✅ Recovery detection

✅ Historical intelligence tracking

✅ Interactive React dashboard

✅ Dark enterprise observability UI

---

# 🧠 System Intelligence

SystemPulse evaluates multiple system signals simultaneously.

### Metrics Monitored

- Response Time
- CPU Utilization
- Memory Utilization
- Service Health
- Risk
- Metric Trends

### Severity Levels

| Risk Score | Severity |
|------------|----------|
| `< 25` | NORMAL |
| `25 – 44` | EARLY WARNING |
| `45 – 69` | WARNING |
| `≥ 70` | CRITICAL |

### Trend States

```text
MIXED / STABLE
DETERIORATING
RECOVERING
Root Cause Detection

SystemPulse can identify conditions such as:

Combined resource pressure
CPU pressure
Memory pressure
Latency degradation
Early latency degradation
No significant issue

Each detected issue is accompanied by an explanation and recommended action.

🏗️ Project Architecture
                         SYSTEMPULSE

                              │
                              ▼

                    Product Service
                       FastAPI :8002
                              │
                              ▼
                    Telemetry Collector
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              telemetry.csv      Monitoring API
                                      :8003
                                        │
                                        ▼
                              Intelligence Engine
                                        │
                         ┌──────────────┼──────────────┐
                         │              │              │
                         ▼              ▼              ▼
                       Risk           Trend        Root Cause
                      Analysis       Analysis       Reasoning
                         │              │              │
                         └──────────────┼──────────────┘
                                        │
                                        ▼
                              System Intelligence
                                        │
                                        ▼
                                  React Frontend
                                        │
                         ┌──────────────┼──────────────┐
                         ▼              ▼              ▼
                  Command Center   Intelligence    Telemetry
                                        │
                                        ▼
                                   Simulator


🔄 How SystemPulse Works
The Product Service generates real application activity.
The Collector measures response time, CPU and memory.
Telemetry is sent to the Monitoring API.
The Intelligence Engine analyzes the incoming metrics.
SystemPulse calculates a unified risk score.
Anomalies and system trends are identified.
The engine determines the likely root cause.
A recommended action is generated.
The React dashboard visualizes the intelligence.


🚨 Anomaly Simulation

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

The simulator uses the actual backend rather than fake frontend animations.

Example

When slow mode is enabled:

Response Time
     ↓
~50 ms → ~2000 ms

Risk
     ↓
LOW → CRITICAL

System
     ↓
HEALTHY → ANOMALY

When normal mode is restored, the system observes the telemetry again and returns toward NORMAL.


🧠 Intelligence Engine

The SystemPulseIntelligence engine is the core reasoning layer.

Input
response_time_ms
cpu_percent
memory_percent
Processing
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
Output
Risk
Anomaly
Severity
Trend
Root Cause
Explanation
Recommended Action


📊 Example Intelligence Result
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

🖥️ Frontend

SystemPulse uses a dark enterprise observability interface designed specifically for monitoring system health.

Command Center
Main dashboard for monitoring the entire system at a glance.
Shows overall system health, current risk, severity, and service status.
Displays key live metrics like response time, CPU, and memory.
Provides a quick overview of the latest intelligence result.
Acts as the central control room of SystemPulse.

<img width="1909" height="909" alt="image" src="https://github.com/user-attachments/assets/c092d7d0-8537-48ee-b94d-2c15f914d163" />


Anomaly Simulator
Controlled environment to demonstrate SystemPulse anomaly detection.
Allows the user to inject a performance anomaly into the Product Service.
Shows the lifecycle: Healthy → Detect → Critical → Recover → Healthy.
Every stage is driven by real backend telemetry and intelligence.
Demonstrates how SystemPulse detects and tracks a real degradation.

<img width="1907" height="910" alt="image" src="https://github.com/user-attachments/assets/8b71c52a-b1e6-4063-8876-0bd07d9f2b77" />


Intelligence Engine
Displays the system's interpreted intelligence rather than raw metrics.
Shows risk score, anomaly status, severity, and trend.
Identifies the likely root cause of the detected problem.
Provides an explanation and recommended action.
This is where telemetry is transformed into actionable system intelligence.

<img width="1905" height="906" alt="image" src="https://github.com/user-attachments/assets/1a624bb5-c276-45f4-a5ec-8f7fa704db33" />


Telemetry
Displays the historical telemetry collected from the Product Service.
Tracks response time, CPU utilization, and memory utilization.
Uses charts to visualize metric behavior over time.
Helps identify performance changes and degradation patterns.
Provides the underlying data used by the Intelligence Engine.

<img width="1904" height="911" alt="image" src="https://github.com/user-attachments/assets/3e58dd4c-c693-4bd4-8d2a-8dde91478434" />


🛠️ Tech Stack
Frontend	Backend	Intelligence	Database
React	Python	NumPy	PostgreSQL
Vite	FastAPI	Pandas	psycopg2
Tailwind CSS	Uvicorn	Risk Analysis	CSV
React Router	Pydantic	Trend Analysis	
Recharts		Root Cause Reasoning	
Lucide React			
📂 Project Structure
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
🔌 API Endpoints
Monitoring API
GET  /health
GET  /api/metrics/latest
POST /api/metrics
GET  /api/intelligence/latest
GET  /api/intelligence/history
Product Service
GET  /
GET  /products
GET  /products/{product_id}

POST /simulate/slow
POST /simulate/normal
📸 Screenshots
Command Center

Add Command Center screenshot here

Intelligence Dashboard

Add Intelligence page screenshot here

Telemetry Dashboard

Add Telemetry screenshot here

Anomaly Simulator

Add Simulator screenshot here

⚙️ Installation
Clone Repository
git clone https://github.com/your-username/systempulse.git

cd systempulse
▶️ Run the Backend
Product Service
cd demo-system/product-service

uvicorn main:app --reload --port 8002
Monitoring API
cd systempulse/monitoring-api

uvicorn main:app --host 127.0.0.1 --port 8003 --reload
Telemetry Collector
cd systempulse/collector

python collector.py
💻 Run the Frontend
cd frontend

npm install

npm run dev

Open:

http://localhost:5173
📈 Example Detection Lifecycle
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

All major states are derived from actual telemetry and backend intelligence.

🚀 Future Improvements
Machine-learning-based anomaly detection
Time-series forecasting
Persistent telemetry database
Real-time alert notifications
Incident management
Automated remediation
Distributed service monitoring
Multi-service dependency analysis
Cloud deployment
Production observability integrations


💡 Why SystemPulse?

Traditional monitoring answers:

"What are the metrics?"

SystemPulse aims to answer:

"What is happening, how serious is it, why is it happening, and what should we do?"

🎯 Project Vision

SystemPulse aims to transform traditional monitoring from a passive metrics dashboard into an intelligent decision-support system.

OBSERVE
   ↓
UNDERSTAND
   ↓
ACT

SystemPulse — From system metrics to system intelligence.

##👨‍💻 Author

#Mariya Shaikh

BTech Information Technology Student
