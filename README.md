# ⚡ SystemPulse

## AI-Powered System Observability & Anomaly Detection Platform

<p align="center">

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
<img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/FastAPI-API-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"/>

</p>

<p align="center">

<img src="https://img.shields.io/badge/Monitoring-Real--Time-2563EB?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Anomaly-Detection-EF4444?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Deployment-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>

</p>

<p align="center">
  📊 <b>Monitor Smarter. Understand Faster. Act Earlier.</b>
</p>

<p align="center">
  SystemPulse transforms raw system metrics into meaningful insights,<br/>
  helping developers detect problems before they become incidents.
</p>

---

## 🌐 Live Project

### 🚀 [Open SystemPulse](https://project-live-b2595.web.app)

🎥 **YouTube Demo:** [ADD_YOUR_YOUTUBE_LINK]

💻 **GitHub:** https://github.com/mariyashaikh-crypto/Systempulse

---

# 📖 Overview

**SystemPulse** is a full-stack system observability platform built to monitor backend services and turn system metrics into actionable information.

Instead of simply displaying CPU, memory and latency numbers, SystemPulse analyzes them to identify:

- 🚨 Anomalies
- ⚠️ Risk levels
- 📈 Performance trends
- 🔍 Possible root causes
- 💡 Recommended actions
- 💚 Service health

### The goal is simple:

> **Don't just show what's happening. Explain what it means.**

---

# 🧠 How SystemPulse Works

```text
        SYSTEM METRICS
              │
              ▼
     ┌─────────────────┐
     │  Data Collection │
     └────────┬────────┘
              ▼
     ┌─────────────────┐
     │  Risk Analysis  │
     └────────┬────────┘
              ▼
     ┌─────────────────┐
     │    Anomaly      │
     │    Detection    │
     └────────┬────────┘
              ▼
     ┌─────────────────┐
     │ Trend Analysis  │
     └────────┬────────┘
              ▼
     ┌─────────────────┐
     │  Root Cause +   │
     │ Recommendation  │
     └────────┬────────┘
              ▼
       📊 SYSTEMPULSE
⚡ Core Features
📊 System Monitoring
Track important system metrics including:
Response latency
CPU usage
Memory usage
Service health
Historical performance
🚨 Anomaly Detection
Automatically identifies unusual system behavior and classifies potential issues.
⚠️ Risk & Severity Analysis
SystemPulse converts monitoring data into understandable risk levels and severity states.
🧠 Root-Cause Insights
Instead of only reporting an anomaly, the system provides a possible explanation for the issue.
💡 Recommended Actions
Each detected problem can include a suggested next step for investigation.
📈 Trend Detection
Analyze whether the system is:
Recovering
Stable
Degrading
Experiencing latency spikes
💚 Service Monitoring
Monitor the health of backend services and APIs from a centralized dashboard.
🔥 Example Detection
SystemPulse can transform raw telemetry like:
{
  "response_time_ms": 235.06,
  "cpu_percent": 14.0,
  "memory_percent": 78.0,
  "risk": 43.49,
  "anomaly": true
}
into something meaningful:
🚨 EARLY WARNING

Root Cause
Latency degradation

Explanation
Response latency is significantly above
the healthy baseline.

Recommended Action
Investigate slow requests, database operations,
network delays and bottlenecks.
From raw metrics → to actionable intelligence.
🖥️ Dashboard
Overview
�
Services
�
Monitoring
�
Analytics
�
Add your screenshots to the screenshots/ folder using the filenames above.
🏗️ Architecture
                    ┌────────────────────┐
                    │   React + Vite     │
                    │   Tailwind CSS     │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   FastAPI Backend  │
                    │   Monitoring API   │
                    └───────┬─────┬──────┘
                            │     │
                    ┌───────┘     └────────┐
                    ▼                       ▼
             ┌─────────────┐        ┌──────────────┐
             │ PostgreSQL  │        │ Product      │
             │  Database   │        │ Service      │
             └─────────────┘        └──────────────┘
                            │
                            ▼
                    📊 Monitoring Engine
🛠️ Tech Stack
Frontend
⚛️ React
⚡ Vite
🎨 Tailwind CSS
🧩 Lucide Icons
Backend
🐍 Python
🚀 FastAPI
🔌 REST APIs
Database
🐘 PostgreSQL
Deployment
🔥 Firebase Hosting
☁️ Render
🐙 GitHub
📁 Project Structure
Systempulse/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   ├── public/
│   ├── firebase.json
│   └── package.json
│
├── demo-system/
│
├── systempulse/
│
├── .gitignore
└── README.md
🚀 Run Locally
git clone https://github.com/mariyashaikh-crypto/Systempulse.git

cd Systempulse/frontend

npm install

npm run dev
Production Build
npm run build
☁️ Deployment
The frontend is deployed using Firebase Hosting.
The backend services are deployed separately and communicate with the frontend through configured API endpoints and environment variables.
🌐 Production
https://project-live-b2595.web.app⁠�
🎯 Why SystemPulse?
Traditional monitoring gives developers numbers.
SystemPulse tries to give them answers.
WHAT?
  ↓
Anomaly detected

HOW SERIOUS?
  ↓
Risk + Severity

WHY?
  ↓
Root Cause

WHAT NEXT?
  ↓
Recommended Action
Detect → Understand → Act
🔮 Future Improvements
🔔 Real-time notifications
📧 Email alerts
💬 Slack / Discord integrations
🤖 Advanced anomaly models
📊 Custom dashboards
👥 Authentication & team monitoring
📝 Incident management
📱 Mobile monitoring experience
🎥 Project Demo
▶️ Watch SystemPulse in Action
YouTube Demo
The walkthrough covers the dashboard, service health, monitoring metrics, anomaly detection, risk analysis, historical data and the deployed application.
👨‍💻 Author
Shaik Mariya
Full-Stack Developer building projects around AI, intelligent systems, monitoring and modern web technologies.
🔗 GitHub:
https://github.com/mariyashaikh-crypto⁠�