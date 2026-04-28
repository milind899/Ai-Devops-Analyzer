from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200

def test_analyze_endpoint_missing_fields():
    response = client.post("/analyze", json={"repo_url": "test"})
    assert response.status_code == 422
