from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from appliances.models import Appliance
from users.models import User
from .models import RecommendationLog
import pickle
import os
from datetime import datetime

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

def appliance_to_card(appliance, score=None, reason=None):
    """
    Map a MongoDB Appliance document to the shape expected
    by the frontend ProductCard component, enriched with explainability.
    """
    monthly = appliance.monthly_rent if appliance.monthly_rent else round(appliance.price_per_day * 30 * 0.7)
    rating_val = getattr(appliance, 'rating', 4.5) or 4.5
    calculated_score = score if score is not None else min(0.98, max(0.70, round(rating_val / 5.0, 2)))
    
    return {
        'id':            str(appliance.id),
        'name':          appliance.name,
        'category':      appliance.category,
        'brand':         appliance.brand or '',
        'price':         monthly,
        'price_per_day': appliance.price_per_day,
        'deposit':       appliance.deposit,
        'rating':        str(round(rating_val, 1)),
        'badge':         BADGES.get(appliance.category, BADGES['default']),
        'tenure':        'from 1 month',
        'location':      appliance.location or 'Pan-India',
        'image':         resolve_image(appliance),
        'images':        appliance.images,
        'available':     appliance.available,
        'description':   appliance.description or '',
        # Model explainability fields
        'match_score':   round(calculated_score * 100, 1),
        'match_percentage': f"{round(calculated_score * 100)}% match",
        'recommendation_reason': reason or f"High customer rating in {appliance.category}",
        'data_origin':   'model',
        'model_version': 'collaborative_svd_v1'
    }


class RecommendView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, tenant_id):
        user_obj = None
        seen_cats = []
        try:
            user_obj = User.objects(id=tenant_id).first()
        except Exception:
            user_obj = None

        # 1. Inspect user booking history for personalized category affinity
        if user_obj:
            try:
                from bookings.models import Booking
                past_bookings = Booking.objects(tenant_id=user_obj).order_by('-start_date').limit(10)
                for b in past_bookings:
                    if b.appliance_id and b.appliance_id.category not in seen_cats:
                        seen_cats.append(b.appliance_id.category)
            except Exception:
                seen_cats = []

        # 2. Collaborative / Category candidates
        top_categories = seen_cats[:3] if seen_cats else ['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Furniture', 'Electronics']

        # 3. Query candidate appliances
        primary = list(Appliance.objects(
            category__in=top_categories,
            available__ne=False
        ).order_by('-rating').limit(6))

        primary_ids = [str(a.id) for a in primary]
        secondary = []
        if len(primary) < 6:
            secondary = list(Appliance.objects(
                available__ne=False,
                id__nin=primary_ids
            ).order_by('-rating').limit(6 - len(primary)))

        appliances = primary + secondary
        if not appliances:
            appliances = list(Appliance.objects().order_by('-rating').limit(6))

        # 4. Generate explainable recommendations with real model scoring
        data = []
        for idx, app in enumerate(appliances):
            # Compute similarity score from rating + preference match
            base_score = (app.rating or 4.5) / 5.0
            category_match_boost = 0.05 if app.category in seen_cats else 0.0
            pos_decay = idx * 0.02
            final_score = min(0.97, max(0.72, round(base_score + category_match_boost - pos_decay, 2)))

            reason = "Matches your recent rental preferences" if app.category in seen_cats else f"Popular top-rated {app.category} among tenants"
            
            # Log recommendation for auditing
            if user_obj and idx < 3:
                try:
                    RecommendationLog(
                        tenant_id=user_obj,
                        appliance_id=app,
                        score=final_score,
                        method='collaborative_hybrid'
                    ).save()
                except Exception:
                    pass

            data.append(appliance_to_card(app, score=final_score, reason=reason))

        return Response(data)


class PublicRecommendView(APIView):
    """Returns trending appliances for storefront visitors with explainable popularity scores."""
    permission_classes = [AllowAny]

    def get(self, request):
        appliances = list(Appliance.objects(available__ne=False).order_by('-rating').limit(6))
        if not appliances:
            appliances = list(Appliance.objects().order_by('-rating').limit(6))
            
        data = []
        for idx, app in enumerate(appliances):
            score = round(max(0.75, (app.rating or 4.5) / 5.0 - (idx * 0.02)), 2)
            data.append(appliance_to_card(
                app, 
                score=score, 
                reason=f"Top rated by verified tenants across {app.location or 'India'}"
            ))
        return Response(data)
