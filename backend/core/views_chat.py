import requests
import re
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from appliances.models import Appliance
from bookings.models import Booking

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3"


def fetch_relevant_appliances(user_message: str):
    """
    Smart context retrieval: pull real appliances from MongoDB
    based on keywords detected in the user's message.
    This is a lightweight keyword-based RAG approach.
    """
    message_lower = user_message.lower()

    # --- Detect intent keywords ---
    CATEGORY_KEYWORDS = {
        'AC': ['ac', 'air condition', 'air-condition', 'cooling', 'cool'],
        'Refrigerator': ['fridge', 'refrigerator', 'freeze', 'cooler'],
        'Washing Machine': ['washing', 'washer', 'laundry', 'wash machine'],
        'TV': ['tv', 'television', 'display', 'screen'],
        'Microwave': ['microwave', 'oven', 'microwave oven'],
        'Geyser': ['geyser', 'water heater', 'hot water'],
        'Fan': ['fan', 'ceiling fan'],
        'Laptop': ['laptop', 'computer', 'notebook'],
    }

    # Find matching categories
    target_categories = []
    for category, kw_list in CATEGORY_KEYWORDS.items():
        if any(kw in message_lower for kw in kw_list):
            target_categories.append(category)

    # Also detect price queries
    price_ceiling = None
    price_match = re.search(r'under\s*[₹rs]?\s*(\d+)', message_lower)
    if price_match:
        price_ceiling = float(price_match.group(1))

    # Build query
    try:
        if target_categories:
            qs = Appliance.objects(category__in=target_categories, available=True)
        else:
            # No specific category — return a broad sample of available appliances
            qs = Appliance.objects(available=True)

        if price_ceiling:
            qs = qs.filter(price_per_day__lte=price_ceiling)

        appliances = list(qs.limit(8))
    except Exception:
        appliances = []

    return appliances


def build_context_block(appliances):
    """Convert queried appliances into a structured text block for the LLM prompt."""
    if not appliances:
        return "No appliances are currently available matching that query."

    lines = []
    for a in appliances:
        line = (
            f"- {a.name} ({a.brand or 'Brand N/A'}) | Category: {a.category} | "
            f"₹{a.price_per_day}/day | Monthly: ₹{a.monthly_rent} | "
            f"Deposit: ₹{a.deposit} | Location: {a.location or 'Pan-India'} | "
            f"Rating: {a.rating}⭐"
        )
        if a.description:
            line += f" | {a.description[:80]}"
        lines.append(line)

    return "\n".join(lines)


def get_platform_stats():
    """Fetch summary stats from DB for general questions."""
    try:
        total_appliances = Appliance.objects(available=True).count()
        categories = Appliance.objects(available=True).distinct('category')
        total_bookings = Booking.objects.count()
        return {
            'total_appliances': total_appliances,
            'categories': list(categories),
            'total_bookings': total_bookings,
        }
    except Exception:
        return {}


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_with_ollama(request):
    user_message = request.data.get('message', '')
    if not user_message:
        return Response({"error": "Message is required"}, status=400)

    # --- Step 1: Retrieve real data from MongoDB (RAG) ---
    appliances = fetch_relevant_appliances(user_message)
    context_block = build_context_block(appliances)
    stats = get_platform_stats()

    stats_text = ""
    if stats:
        stats_text = (
            f"\n\nPlatform Overview:\n"
            f"- Total available appliances: {stats.get('total_appliances', 'N/A')}\n"
            f"- Categories available: {', '.join(stats.get('categories', []))}\n"
            f"- Total bookings made: {stats.get('total_bookings', 'N/A')}"
        )

    # --- Step 2: Build enriched RAG prompt ---
    system_prompt = f"""You are Rentova's AI assistant — a smart, friendly, and knowledgeable rental concierge.

Rentova is a premium household appliance rental platform in India. Users can rent appliances daily, weekly, or monthly with free delivery and setup.

REAL-TIME APPLIANCE DATA FROM OUR DATABASE:
{context_block}
{stats_text}

INSTRUCTIONS:
- Always answer using the REAL DATA provided above. Do NOT invent appliances or prices.
- When quoting prices, use the exact ₹ values from the data.
- If the user asks about something not in the data, say "We don't currently have that available" — don't make up information.
- Be concise, warm, and helpful. Use simple language.
- If recommending appliances, list 2-3 best options with their price and key features.
- Rental policies: Free delivery & setup, cancel anytime, security deposit refunded on return in good condition.
"""

    full_prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"

    # --- Step 3: Call local Ollama ---
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": full_prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 200,   # Keep responses concise and fast on CPU
            "num_ctx": 2048,      # Smaller context window = faster inference
        }
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        reply = data.get('response', "I'm sorry, I couldn't generate a response.")

        return Response({
            "response": reply.strip(),
            "context_used": len(appliances),  # debug: how many appliances were injected
        })

    except requests.exceptions.ConnectionError:
        return Response({
            "error": "⚠️ Ollama is not running. Please start it by running: ollama serve",
        }, status=503)
    except requests.exceptions.Timeout:
        return Response({
            "error": "⚠️ Ollama took too long to respond. Try a shorter question or restart Ollama.",
        }, status=504)
    except requests.exceptions.RequestException as e:
        return Response({
            "error": f"⚠️ Failed to connect to Ollama: {str(e)}",
        }, status=503)
