# AI DevOps Risk Analyzer

> AI-inspired deployment risk analysis, test recommendation & deployment decisions — built with a complete modern DevOps architecture.

---

## 🏗️ DevOps Architecture Features

This project isn't just an app *about* DevOps; it's built using industry-standard DevOps practices:

*   **Containerization (Docker)**: Multi-stage Docker builds. The frontend is built with Node and served via an ultra-lightweight Nginx container. The backend runs FastAPI in an optimized Python container.
*   **Continuous Integration (GitHub Actions)**: Automated CI/CD pipeline triggers on every push. It runs `pytest` for the backend, builds the React frontend, and creates production-ready Docker images automatically.
*   **Observability & Monitoring**: Fully integrated Prometheus and Grafana stack. The FastAPI backend exposes a `/metrics` endpoint to monitor HTTP request times, error rates, and API traffic in real-time.
*   **Infrastructure as Code (IaC)**: Includes foundational Terraform scripts (`terraform/`) designed to provision AWS EC2 infrastructure automatically.

---

## 🚀 Quick Start (Docker)

The easiest way to run the entire cluster locally is using Docker Compose:

```bash
# Start Frontend, Backend, Prometheus, and Grafana
docker compose up -d --build
```

### Access the Services:
*   **Web UI (React + Nginx)**: http://localhost:3000
*   **Backend API Docs**: http://localhost:8000/docs
*   **Grafana Dashboards**: http://localhost:3001 (Login: `admin` / `admin`)
*   **Prometheus Metrics**: http://localhost:9090

---

## 🗂️ Project Structure

```text
ai-devops-analyzer/
├── .github/workflows/   ← CI/CD Pipelines (GitHub Actions)
├── backend/             ← FastAPI app, Pytest suite, Prometheus Instrumentator
├── frontend/            ← React UI, Tailwind, Nginx configuration
├── prometheus/          ← Metrics scraping configuration
├── terraform/           ← Infrastructure as Code (AWS)
├── docker-compose.yml   ← Orchestrates all 4 microservices
└── setup.bat            ← Legacy native setup script
```

---

## 🧠 How The Risk Analyzer Works

1.  **Risk Engine**: Analyzes the developer's feature request (keyword weights) and the actual files changed in GitHub.
2.  **Test Engine**: Recommends testing strategies based on the risk score (Low → Unit Test, High → Regression).
3.  **Decision Engine**: Automatically decides to `DEPLOY`, `RETRY`, or `BLOCK` the deployment based on simulated test success rates and risk thresholds.

---

## 🎓 Viva Defense Line

> *"We built a deterministic rule-based system for risk scoring, mimicking ML feature weighting. To make this a true DevOps project, we wrapped the entire application in a microservice architecture using Docker and Nginx, implemented Continuous Integration with GitHub Actions, and established real-time API observability using Prometheus and Grafana."*
