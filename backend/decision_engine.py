"""
Deployment Decision Engine (v2)
Decisions based on risk level + number of high-priority test recommendations.

PROCEED = low risk, safe to deploy after unit tests
REVIEW  = medium risk, run all recommended tests first
BLOCK   = high risk, do not deploy until critical tests are done
"""


def make_decision(risk_level: str, recommendations: list) -> dict:
    high_count = sum(1 for r in recommendations if r.get("priority") == "HIGH")

    if risk_level == "Low":
        return {
            "decision": "PROCEED",
            "message": "Low risk change. Safe to deploy after running unit tests.",
            "action": "Run recommended unit tests, then deploy.",
        }
    elif risk_level == "Medium":
        return {
            "decision": "REVIEW",
            "message": f"Medium risk detected. {high_count} high-priority test suite(s) must be completed.",
            "action": "Complete all recommended tests. Deploy only after all pass.",
        }
    else:  # High
        return {
            "decision": "BLOCK",
            "message": f"High risk change. {high_count} critical test suite(s) required before deployment.",
            "action": "Do NOT deploy. Complete all HIGH priority tests and have code reviewed first.",
        }
