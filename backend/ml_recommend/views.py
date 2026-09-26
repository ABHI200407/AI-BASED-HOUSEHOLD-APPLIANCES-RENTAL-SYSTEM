from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from appliances.models import Appliance
from users.models import User
from .models import RecommendationLog
import pickle
import os
import random

MEDIA_BASE = "http://localhost:8000"
FALLBACK_IMAGES = {
    'AC': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    'Refrigerator': 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80',
    'Washing Machine': 'https://images.unsplash.com/photo-1626806787461-102c1a7f1b05?w=600&q=80',
    'TV': 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=600&q=80',
    'Microwave': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80',
    'Fan': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    'Geyser': 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
}

BADGES = {
    'AC': 'Summer Pick',
    'Refrigerator': 'Energy Smart',
    'Washing Machine': 'Most Rented',
    'TV': 'Top Rated',
    'Microwave': 'WFH Ready',
    'default': 'Popular',
}

def resolve_image(appliance):
    """Get the best available image URL for an appliance."""
    if appliance.image_url:
        return appliance.image_url
    if appliance.images:
        img = appliance.images[0]
        if img.startswith('http'):
            return img
        return f"{MEDIA_BASE}{img}"
    return FALLBACK_IMAGES.get(appliance.category, FALLBACK_IMAGES['default'])

def appliance_to_card(appliance):
    """
    Map a MongoDB Appliance document to the shape expected
    by the frontend ProductCard component.
    """
    monthly = appliance.monthly_rent if appliance.monthly_rent else round(appliance.price_per_day * 30 * 0.7)
    return {
        'id':       str(appliance.id),
        'name':     appliance.name,
        'category': appliance.category,
        'brand':    appliance.brand or '',
        # ProductCard uses `price` for monthly display
        'price':    monthly,
        'price_per_day': appliance.price_per_day,
        'deposit':  appliance.deposit,
        'rating':   str(round(appliance.rating, 1)),
        'badge':    BADGES.get(appliance.category, BADGES['default']),
        'tenure':   'from 1 month',
        'location': appliance.location or 'Pan-India',
        # Single image field ProductCard expects
        'image':    resolve_image(appliance),
        'images':   appliance.images,
        'available': appliance.available,
        'description': appliance.description or '',
    }


class RecommendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_id):
        # --- 1. Try loading the trained ML model ---
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        try:
            with open(model_path, 'rb') as f:
                model_artifact = pickle.load(f)
            top_categories = [c['category'] for c in model_artifact.get('categories', [])][:3]
        except Exception:
            top_categories = []

        # --- 2. Fallback: prioritize categories by booking history of this user ---
        if not top_categories:
            try:
                from bookings.models import Booking
                user_obj = User.objects(id=tenant_id).first()
                if user_obj:
                    past_bookings = Booking.objects(tenant_id=user_obj).order_by('-start_date').limit(10)
                    seen_cats = []
                    for b in past_bookings:
                        try:
                            cat = b.appliance_id.category
                            if cat not in seen_cats:
                                seen_cats.append(cat)
                        except Exception:
                            pass
                    top_categories = seen_cats[:3]
            except Exception:
                top_categories = []

        # --- 3. Ultimate fallback: highest-rated available appliances ---
        if not top_categories:
            top_categories = ['AC', 'Refrigerator', 'Washing Machine', 'TV']

        # --- 4. Fetch appliances ---
        # Primary: from recommended categories
        primary = list(Appliance.objects(
            category__in=top_categories,
            available=True
        ).order_by('-rating').limit(6))

        # Fill remaining slots with other top-rated appliances
        primary_ids = [str(a.id) for a in primary]
        secondary = []
        if len(primary) < 6:
            secondary = list(Appliance.objects(
                available=True,
                id__nin=primary_ids
            ).order_by('-rating').limit(6 - len(primary)))

        appliances = primary + secondary

        # --- 5. Log recommendations ---
        user_obj = User.objects(id=tenant_id).first()
        if user_obj and appliances:
            for app in appliances[:3]:  # only log top 3
                try:
                    RecommendationLog(
                        tenant_id=user_obj,
                        appliance_id=app,
                        score=0.95,
                        method='hybrid'
                    ).save()
                except Exception:
                    pass

        # --- 6. Serialize to ProductCard-compatible shape ---
        data = [appliance_to_card(a) for a in appliances]
        return Response(data)


class PublicRecommendView(APIView):
    """Returns trending appliances for non-logged-in users."""
    permission_classes = [AllowAny]

    def get(self, request):
        appliances = list(Appliance.objects(available=True).order_by('-rating').limit(6))
        if not appliances:
            # If DB empty, return empty list — frontend falls back to static data
            return Response([])
        data = [appliance_to_card(a) for a in appliances]
        return Response(data)
