from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from users.models import User
from bookings.models import Booking
from .models import ChurnScore
import pickle
import os
from datetime import datetime
import pandas as pd

class AtRiskCustomersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        try:
            with open(model_path, 'rb') as f:
                clf = pickle.load(f)
        except Exception:
            return Response({'error': 'Model not trained'}, status=500)
            
        at_risk = []
        users = User.objects(role='tenant', is_active=True)
        
        now = datetime.utcnow()
        for u in users:
            bookings = Booking.objects(tenant_id=u)
            freq = bookings.count()
            if freq == 0:
                continue
                
            last_booking = bookings.order_by('-created_at').first()
            recency = (now - last_booking.created_at).days
            monetary = sum([b.total_amount for b in bookings if b.total_amount])
            
            # Predict
            features = pd.DataFrame([{
                'recency_days': recency,
                'frequency_count': freq,
                'monetary_total': monetary
            }])
            
            # Predict churn prob
            churn_prob = clf.predict_proba(features)[0][1]
            is_churned = clf.predict(features)[0]
            
            if is_churned == 1 or churn_prob > 0.5:
                # Log it
                ChurnScore(
                    tenant_id=u,
                    risk_score=churn_prob,
                    risk_level='High',
                    recency_days=recency,
                    frequency_count=freq,
                    monetary_total=monetary
                ).save()
                
                at_risk.append({
                    'user_id': str(u.id),
                    'email': u.email,
                    'full_name': getattr(u, 'full_name', ''),
                    'risk_score': round(churn_prob, 2),
                    'recency_days': recency,
                    'frequency_count': freq,
                    'monetary_total': monetary
                })
                
        return Response(at_risk)
