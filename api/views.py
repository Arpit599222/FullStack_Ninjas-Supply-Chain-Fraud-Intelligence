import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def chatbot(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            message = body.get("message", "")
            data = body.get("data", {})
            
            seller_id = data.get("seller_id", "Unknown")
            warehouse_id = data.get("warehouse_id", "Unknown")
            risk_score = data.get("risk_score", "Unknown")
            transaction_pattern = data.get("transaction_pattern", "Unknown")
            connected_nodes = data.get("connected_nodes", "Unknown")
            
            prompt = f"""You are an intelligent chatbot for a Supply Chain Fraud Detection system.

Analyze the data and answer the user's query.

User Query: {message}

Data:
Seller ID: {seller_id}
Warehouse ID: {warehouse_id}
Risk Score: {risk_score}
Transaction Pattern: {transaction_pattern}
Connected Nodes: {connected_nodes}

Respond in a conversational tone, clearly explaining the fraud risk level (High/Medium/Low) and the reason."""

            api_key = getattr(settings, 'GEMINI_API_KEY', '')
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
            
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ]
            }
            
            response = requests.post(url, headers={"Content-Type": "application/json"}, json=payload, timeout=30)
            response.raise_for_status()
            
            res_json = response.json()
            reply = res_json["candidates"][0]["content"]["parts"][0]["text"]
            
            return JsonResponse({"reply": reply, "is_fallback": False})
            
        except requests.exceptions.HTTPError as he:
            try:
                error_body = he.response.json()
                api_error = error_body.get('error', {}).get('message', str(he))
                fallback = f"Google AI Studio Error: {api_error}"
            except:
                fallback = f"Google AI API Error: {str(he)}"
            
            print("GEMINI API ERROR:", fallback)
            return JsonResponse({"reply": fallback, "is_fallback": True})
        except Exception as e:
            fallback = f"Backend Error: {str(e)}"
            return JsonResponse({"reply": fallback, "is_fallback": True})
            
    return JsonResponse({"error": "Method not allowed"}, status=405)
