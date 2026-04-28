import os
import json
from google import genai
from google.genai import types

async def calculate_risk(
    requirement: str,
    repo_url: str,
    branch: str,
    github_data: dict = None,
) -> dict:
    """
    Unified risk score calculation using real Gemini LLM.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")
    
    # Initialize modern Google GenAI SDK
    client = genai.Client(api_key=api_key)

    github_used = github_data is not None and bool(github_data.get("changed_files"))
    changed_files = github_data.get("changed_files", []) if github_used else []

    payload_to_analyze = f"""
    Requirement: {requirement}
    Branch: {branch}
    Files Changed: {json.dumps(changed_files, indent=2)}
    """

    system_instruction = '''
    You are an expert DevOps AI. Your task is to analyze an incoming software deployment and assign a Risk Score. 
    I will provide you with the User Requirement, the target Git branch, and the actual Files Changed on GitHub.
    Analyze the file types modified, change sizes, and the overall goal of the ticket to determine deployment risk.

    You MUST return your response strictly as a valid JSON object without any additional text or markdown formatting. The JSON must have the following exact keys:
    {
      "risk_score": <Float between 0.0 and 1.0>,
      "risk_level": <"Low", "Medium", or "High">,
      "confidence": <Float between 0.0 and 1.0 representing your confidence in this analysis>,
      "triggered_keywords": <Array of 3 to 5 strings highlighting the most risky aspects or keywords in the requirement/files>,
      "risky_files": <Array of strings containing the exact filenames that pose the highest risk of failure>
    }
    '''

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[payload_to_analyze],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
            )
        )
        
        # Parse the JSON response directly
        data = json.loads(response.text)
        
        # Ensure fallback for UI compatibility
        return {
            "risk_score": round(data.get("risk_score", 0.5), 2),
            "risk_level": data.get("risk_level", "Medium"),
            "confidence": round(data.get("confidence", 0.5), 2),
            "triggered_keywords": data.get("triggered_keywords", []),
            "risky_files": data.get("risky_files", []),
            "github_used": github_used,
        }
    except Exception as e:
        print(f"LLM Error: {e}")
        # Safe fallback if AI messes up the format or API fails
        return {
            "risk_score": 0.50,
            "risk_level": "Medium",
            "confidence": 0.10, # Very low confidence because it's a fallback
            "triggered_keywords": ["LLM fallback"],
            "risky_files": [],
            "github_used": github_used,
        }
