# AI DevOps Risk Analyzer

> AI-inspired deployment risk analysis, test recommendation & deployment decisions — built with FastAPI + React.

---

## 🚀 One-Command Start

```bash
# Windows
setup.bat
```

This will:
1. Create Python virtual environment
2. Install all Python + Node dependencies
3. Start backend on `http://localhost:8000`
4. Start frontend on `http://localhost:3000`
5. Open the browser automatically

---

## 🗂️ Project Structure

```
ai-devops-analyzer/
├── backend/
│   ├── main.py            ← FastAPI app + API routes
│   ├── risk_engine.py     ← Rule-based risk scoring
│   ├── test_engine.py     ← Test recommendation + simulation
│   ├── decision_engine.py ← Deployment decision logic
│   └── requirements.txt
├── frontend/
│   └── src/
│       └── App.jsx        ← Full React UI (wizard + results + history)
└── setup.bat              ← One-click setup
```

---

## 🧠 How It Works

| Module | Logic |
|--------|-------|
| **Risk Engine** | Keyword weights (deterministic) — `payment`, `auth`, `security` → higher risk |
| **Test Engine** | Low → Unit Test · Medium → Integration · High → Regression |
| **Decision** | PASS → DEPLOY · FAIL+Low → RETRY · FAIL+High → BLOCK |

---

## 🛠️ Manual Start

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 📡 API

**POST** `http://localhost:8000/analyze`

```json
{
  "requirement": "Add Stripe payment gateway for subscriptions",
  "repo_url": "https://github.com/myorg/backend",
  "branch": "main"
}
```

**Response:**
```json
{
  "risk_score": 0.65,
  "risk_level": "Medium",
  "confidence": 0.35,
  "triggered_keywords": ["payment", "stripe"],
  "test_type": "Integration Test",
  "test_result": "PASS",
  "pass_rate": 0.91,
  "coverage": 0.84,
  "tests_run": 78,
  "deployment_decision": "DEPLOY"
}
```

---

## 🎓 Viva Defense Line

> *"We used a rule-based system that mimics feature weighting in machine learning models, due to lack of real DevOps training data. The system is deterministic for risk scoring — same input always produces the same risk output — while test simulation uses controlled randomness to model real-world test uncertainty."*
