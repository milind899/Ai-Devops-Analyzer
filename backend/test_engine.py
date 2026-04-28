"""
Test Recommendation Engine (v2)
Generates specific, honest test recommendations based on:
  - Risk level
  - Actual changed files from GitHub
  - Triggered keywords from requirement text

No simulation. No fake PASS/FAIL. Just actionable recommendations.
"""

AUTH_PATTERNS     = ["auth", "login", "logout", "oauth", "credential", "token", "session", "jwt", "password"]
PAYMENT_PATTERNS  = ["payment", "billing", "stripe", "paypal", "invoice", "checkout", "subscription"]
DATABASE_PATTERNS = ["migration", "schema", "model", "repository", "dao", "database", "/db/"]
SECURITY_PATTERNS = ["security", "encrypt", "decrypt", "hash", "permission", "role", "access_control"]
API_PATTERNS      = ["api", "route", "endpoint", "controller", "view", "handler", "middleware"]
CONFIG_PATTERNS   = ["config", "settings", ".env", "environment", ".yaml", ".yml"]
UI_PATTERNS       = ["component", "page", "screen", "style", ".css", ".scss", "frontend", "ui"]


def _matches(path: str, patterns: list) -> bool:
    return any(p in path for p in patterns)


def categorize_files(changed_files: list) -> dict:
    """Group changed files by risk category."""
    cats = {k: [] for k in ["auth", "payment", "database", "security", "api", "config", "ui", "other"]}

    for f in changed_files:
        path = f["filename"].lower()

        if _matches(path, AUTH_PATTERNS):
            cats["auth"].append(f["filename"])
        elif _matches(path, PAYMENT_PATTERNS):
            cats["payment"].append(f["filename"])
        elif _matches(path, DATABASE_PATTERNS):
            cats["database"].append(f["filename"])
        elif _matches(path, SECURITY_PATTERNS):
            cats["security"].append(f["filename"])
        elif _matches(path, API_PATTERNS):
            cats["api"].append(f["filename"])
        elif _matches(path, CONFIG_PATTERNS):
            cats["config"].append(f["filename"])
        elif _matches(path, UI_PATTERNS):
            cats["ui"].append(f["filename"])
        else:
            cats["other"].append(f["filename"])

    return {k: v for k, v in cats.items() if v}


def generate_recommendations(
    risk_level: str,
    risk_score: float,
    changed_files: list,
    triggered_keywords: list,
) -> list:
    """
    Generate prioritized, specific test recommendations.
    Returns a list of recommendation objects — no fake results.
    """
    recs = []
    cats = categorize_files(changed_files) if changed_files else {}
    kws = triggered_keywords

    # ── Auth / Login ──────────────────────────────────────
    if "auth" in cats or any(k in kws for k in ["auth", "authentication", "password", "oauth", "jwt"]):
        recs.append({
            "type": "Unit Tests — Authentication",
            "priority": "HIGH",
            "reason": "Auth/login code was modified. Any bug here locks out users or creates security holes.",
            "tests": [
                "Test valid credentials → successful login",
                "Test invalid credentials → correct error response",
                "Test expired/invalid token → 401 rejection",
                "Test password hashing/salting correctness",
                "Test role-based access control enforcement",
            ],
        })
        recs.append({
            "type": "Security Tests",
            "priority": "HIGH",
            "reason": "Auth changes must be validated against common attack vectors.",
            "tests": [
                "SQL injection attempts on login endpoint",
                "Brute force protection (rate limiting)",
                "JWT signature tampering test",
                "Session fixation attack test",
            ],
        })

    # ── Payment / Billing ─────────────────────────────────
    if "payment" in cats or any(k in kws for k in ["payment", "billing", "stripe", "paypal"]):
        recs.append({
            "type": "Integration Tests — Payment",
            "priority": "HIGH",
            "reason": "Payment code changes carry direct financial risk.",
            "tests": [
                "Test successful payment with Stripe/PayPal test credentials",
                "Test declined card handling",
                "Test refund and cancellation flow",
                "Test webhook event processing (payment.succeeded, payment.failed)",
                "Test idempotency — duplicate charge prevention",
            ],
        })

    # ── Database / Migration ──────────────────────────────
    if "database" in cats or any(k in kws for k in ["migration", "schema", "database"]):
        recs.append({
            "type": "Integration Tests — Database",
            "priority": "HIGH",
            "reason": "Schema or migration changes can corrupt data or break queries.",
            "tests": [
                "Run migration on staging — verify schema matches expected",
                "Test migration rollback",
                "Verify data integrity after migration",
                "Test all affected ORM queries still return correct results",
            ],
        })

    # ── Security ──────────────────────────────────────────
    if "security" in cats:
        recs.append({
            "type": "Security Tests",
            "priority": "HIGH",
            "reason": "Security-related files were modified.",
            "tests": [
                "Run OWASP Top 10 checklist against modified endpoints",
                "Verify encryption algorithm is up to date",
                "Test permission boundary enforcement",
            ],
        })

    # ── API / Routes ──────────────────────────────────────
    if "api" in cats or risk_level in ["Medium", "High"]:
        recs.append({
            "type": "API Contract Tests",
            "priority": "MEDIUM",
            "reason": "API endpoints were modified — consumers may be affected.",
            "tests": [
                "Test all modified endpoint responses match API contract",
                "Validate request/response JSON schemas",
                "Test HTTP error responses (400, 401, 404, 500)",
                "Test rate limiting behavior",
            ],
        })

    # ── Config / Environment ──────────────────────────────
    if "config" in cats:
        recs.append({
            "type": "Environment Tests",
            "priority": "MEDIUM",
            "reason": "Config files changed — environment-specific behavior may break.",
            "tests": [
                "Verify config loads correctly in dev, staging, prod",
                "Check environment variable fallbacks work",
                "Ensure no secrets are committed to source code",
            ],
        })

    # ── Regression (High risk always) ─────────────────────
    if risk_level == "High":
        recs.append({
            "type": "Regression Tests",
            "priority": "HIGH",
            "reason": "High risk change — must verify no existing functionality is broken.",
            "tests": [
                "Run the full existing automated test suite",
                "Manually test all user flows that touch modified modules",
                "Test all dependent microservices/integrations",
                "Verify no breaking changes to public API contracts",
            ],
        })

    # ── Baseline Unit Tests (always as a minimum) ─────────
    if not recs or risk_level == "Low":
        recs.append({
            "type": "Unit Tests",
            "priority": "LOW" if risk_level == "Low" else "MEDIUM",
            "reason": "Standard minimum testing for any code change.",
            "tests": [
                "Test all modified functions with valid inputs",
                "Test edge cases and boundary conditions",
                "Test error/exception handling paths",
            ],
        })

    return recs
