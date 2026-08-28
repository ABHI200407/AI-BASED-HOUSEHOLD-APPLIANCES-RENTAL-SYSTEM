from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from appliances.models import Appliance
from users.models import User
from .models import RecommendationLog
import pickle
import os

class RecommendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, tenant_id):
        # Load the mock artifact
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        try:
            with open(model_path, 'rb') as f:
                model_artifact = pickle.load(f)
        except Exception:
            # Fallback if model not trained yet
            model_artifact = {'categories': []}

        # For demo purposes, just pick the top 3 categories from the artifact or default ones
        top_categories = [c['category'] for c in model_artifact.get('categories', [])][:3]
        if not top_categories:
            top_categories = ['AC', 'Refrigerator', 'TV']
            
        # Fetch appliances in those categories
        appliances = Appliance.objects(category__in=top_categories, available=True).limit(5)
        
        user = User.objects(id=tenant_id).first()
        data = []
        for app in appliances:
            if user:
                # Log it
                RecommendationLog(
                    tenant_id=user,
                    appliance_id=app,
                    score=0.95,
                    method='content_based'
                ).save()
                
            data.append({
                'id': str(app.id),
                'name': app.name,
                'category': app.category,
                'price_per_day': app.price_per_day,
                'images': app.images
            })
            
        return Response(data)
