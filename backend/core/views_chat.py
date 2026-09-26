import requests
import re
import json
from django.http import StreamingHttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from appliances.models import Appliance
from bookings.models import Booking

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"
DEFAULT_MODEL = "qwen2.5:0.5b"

def get_best_available_model():
    """
    Dynamically discover installed Ollama models, prioritizing lightweight
    models that run smoothly on CPU within available RAM.
    """
    try:
        res = requests.get(OLLAMA_TAGS_URL, timeout=2)
        if res.status_code == 200:
            installed = [m.get("name") for m in res.json().get("models", [])]
            for candidate in ["qwen2.5:0.5b", "llama3.2:1b", "rentai-llm", "llama3.2:latest", "llama3.2", "qwen2.5:1.5b", "llama3:latest", "llama3"]:
                if candidate in installed:
                    return candidate
                for m in installed:
                    if m.startswith(candidate):
                        return m
            if installed:
                return installed[0]
    except Exception:
        pass
    return DEFAULT_MODEL

from mongoengine.queryset.visitor import Q

def fetch_relevant_appliances(user_message: str):
    """
    Smart context retrieval: pull real appliances from MongoDB
    based on keywords detected in the user's message.
    This is a lightweight keyword-based RAG approach.
    """
    message_lower = user_message.lower()

    CATEGORY_KEYWORDS = {
        'AC': ['ac', 'air condition', 'air-condition', 'cooling', 'cool'],
        'Refrigerator': ['fridge', 'refrigerator', 'freeze', 'freezer'],
        'Washing Machine': ['washing', 'washer', 'laundry'],
        'TV': ['tv', 'television', 'display', 'screen', 'led', '4k'],
        'Microwave': ['microwave', 'oven'],
        'Water Purifier': ['purifier', 'water purifier', 'ro', 'kent'],
        'Air Purifier': ['air purifier', 'hepa', 'dyson'],
        'Geyser': ['geyser', 'water heater', 'hot water'],
        'Kitchen': ['stove', 'gas stove', 'mixer', 'grinder', 'kitchen'],
        'Sofa': ['sofa', 'couch', 'sectional', 'loveseat', 'seating'],
        'Living Room': ['living room', 'coffee table', 'center table', 'tv unit', 'media console'],
        'Bed': ['bed', 'bedroom', 'mattress', 'king bed', 'queen bed'],
        'Storage': ['wardrobe', 'storage', 'closet', 'almirah'],
        'Dining': ['dining', 'dining table', 'dining chairs'],
        'Workstation': ['desk', 'standing desk', 'chair', 'ergonomic', 'office', 'workstation', 'wfh'],
        'Packages': ['package', 'packages', 'combo', '1 bhk', '1bhk', '2 bhk', '2bhk', 'suite'],
    }

    # Find matching categories and terms
    target_categories = []
    matched_terms = []
    for category, kw_list in CATEGORY_KEYWORDS.items():
        for kw in kw_list:
            # Use word boundaries so 'ac' does not match 'machine'
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, message_lower):
                if category not in target_categories:
                    target_categories.append(category)
                matched_terms.append(kw)

    # Also detect price queries
    price_ceiling = None
    price_match = re.search(r'under\s*[₹rs]?\s*(\d+)', message_lower)
    if price_match:
        price_ceiling = float(price_match.group(1))

    # Build query
    try:
        if target_categories or matched_terms:
            query_filter = Q(category__in=target_categories)
            for term in matched_terms[:3]:
                query_filter = query_filter | Q(name__icontains=term) | Q(category__icontains=term)
            qs = Appliance.objects(query_filter, available=True)
            if qs.count() == 0:
                qs = Appliance.objects(available=True)
        else:
            # No specific category — return a broad sample of available appliances
            qs = Appliance.objects(available=True)

        if price_ceiling:
            qs = qs.filter(price_per_day__lte=price_ceiling)

        appliances = list(qs.limit(3))
    except Exception:
        try:
            appliances = list(Appliance.objects(available=True).limit(3))
        except Exception:
            appliances = []

    return appliances


def build_context_block(appliances):
    """Convert queried appliances into a compact text block for the LLM prompt."""
    if not appliances:
        return "No matching inventory currently available."

    lines = []
    for a in appliances:
        line = f"- {a.name} ({a.brand or 'Brand N/A'}): ₹{a.price_per_day}/day, ₹{a.monthly_rent}/month (Deposit: ₹{a.deposit}, {a.location or 'Hyderabad'})"
        lines.append(line)

    return "\n".join(lines)


def get_platform_stats():
    """Fetch summary stats from DB for general questions."""
    try:
        total_appliances = Appliance.objects(available=True).count()
        categories = Appliance.objects(available=True).distinct('category')
        return {
            'total_appliances': total_appliances,
            'categories': list(categories),
        }
    except Exception:
        return {}


@api_view(['POST'])
@permission_classes([AllowAny])
def chat_with_ollama(request):
    user_message = request.data.get('message', '')
    if not user_message:
        return Response({"error": "Message is required"}, status=400)

    stream_mode = request.data.get('stream', False)

    # --- Step 1: Retrieve real data from MongoDB (RAG) ---
    appliances = fetch_relevant_appliances(user_message)
    context_block = build_context_block(appliances)

    # --- Step 2: Build compact RAG prompt for fast CPU inference ---
    system_prompt = f"""You are Rentova AI assistant for appliance rentals in India.
Answer warmly and concisely (2-4 sentences max) based ONLY on this inventory:
{context_block}
Terms: Free delivery & setup, refundable security deposit, cancel anytime."""

    full_prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"

    active_model = get_best_available_model()
    payload = {
        "model": active_model,
        "prompt": full_prompt,
        "stream": stream_mode,
        "options": {
            "temperature": 0.7,
            "num_predict": 150,   # Keep responses concise and fast on CPU
            "num_ctx": 1024,      # Compact context window to fit within available memory
            "num_gpu": 0,         # Force CPU execution to prevent Intel Iris Xe / Vulkan driver crashes
        }
    }

    if stream_mode:
        def stream_generator():
            # Send immediate comment so HTTP 200 headers flush to client without waiting
            yield ": open\n\n"
            try:
                resp = requests.post(OLLAMA_API_URL, json=payload, stream=True, timeout=120)
                resp.raise_for_status()
                for line in resp.iter_lines():
                    if line:
                        chunk = json.loads(line.decode('utf-8'))
                        token = chunk.get('response', '')
                        done = chunk.get('done', False)
                        data_str = json.dumps({'token': token, 'done': done})
                        yield f"data: {data_str}\n\n"
                        if done:
                            break
            except Exception as e:
                err_str = json.dumps({'error': str(e), 'done': True})
                yield f"data: {err_str}\n\n"

        response = StreamingHttpResponse(stream_generator(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response

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
