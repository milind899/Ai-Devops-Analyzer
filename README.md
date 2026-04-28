# AI DevOps Risk Analyzer

AI-inspired deployment risk analysis, test recommendation, and deployment decision engine built with a complete modern DevOps architecture.

---

## DevOps Architecture Features

This project is built using industry-standard DevOps practices:

*   **Containerization (Docker)**: Utilizes multi-stage Docker builds. The frontend is compiled with Node and served via an optimized Nginx container. The backend runs FastAPI in a dedicated Python container.
*   **Continuous Integration (GitHub Actions)**: Automated CI/CD pipelines trigger on every push, running automated `pytest` suites for the backend, building the React frontend, and generating production-ready Docker images.
*   **Observability & Monitoring**: Fully integrated Prometheus and Grafana stack. The FastAPI backend exposes a `/metrics` endpoint to monitor HTTP request times, error rates, and API traffic in real-time.
*   **Infrastructure as Code (IaC)**: Includes foundational Terraform scripts (`terraform/`) designed to provision scalable cloud infrastructure automatically.

---

## Quick Start (Docker)

The recommended way to run the entire cluster locally is using Docker Compose:

```bash
# Start Frontend, Backend, Prometheus, and Grafana
docker compose up -d --build
```

### Access the Services:
*   **Web UI (React + Nginx)**: http://localhost:3000
*   **Backend API Docs**: http://localhost:8000/docs
*   **Grafana Dashboards**: http://localhost:3001 (Login: admin / admin)
*   **Prometheus Metrics**: http://localhost:9090

---

## Project Structure

```text
ai-devops-analyzer/
├── .github/workflows/   - CI/CD Pipelines (GitHub Actions)
├── backend/             - FastAPI app, Pytest suite, Prometheus Instrumentator
├── frontend/            - React UI, Tailwind CSS, Nginx configuration
├── prometheus/          - Metrics scraping configuration
├── terraform/           - Infrastructure as Code templates
├── docker-compose.yml   - Orchestrates all microservices
└── setup.bat            - Legacy native setup script
```

---

## How The Risk Analyzer Works

1.  **Risk Engine**: Analyzes the developer's feature request context alongside the actual files changed in the provided GitHub repository.
2.  **Test Engine**: Recommends appropriate testing strategies based on the calculated risk score (e.g., Low Risk triggers Unit Tests, High Risk triggers Regression Suites).
3.  **Decision Engine**: Automatically renders a final pipeline decision (DEPLOY, RETRY, or BLOCK) based on simulated test success rates and risk thresholds.
