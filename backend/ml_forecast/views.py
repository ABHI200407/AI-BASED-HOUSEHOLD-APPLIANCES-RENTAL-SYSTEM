from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import DemandForecast
import pickle
import os
from datetime import datetime
from bookings.models import Booking
from appliances.models import Appliance
from users.models import User

class BIDashboardView(APIView):
    permission_classes = [AllowAny] # Admin protection typically goes here

    def get(self, request):
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        forecast_data = {}
        
        try:
            with open(model_path, 'rb') as f:
                models = pickle.load(f)
                
            for cat, m in models.items():
                future = m.make_future_dataframe(periods=30)
                forecast = m.predict(future)
                # Just take the last 30 days (future)
                future_forecast = forecast.tail(30)
                
                # Format for recharts
                points = []
                for _, row in future_forecast.iterrows():
                    date_str = row['ds'].strftime('%Y-%m-%d')
                    yhat = max(0, int(row['yhat']))
                    points.append({'date': date_str, 'predicted_demand': yhat})
                    
                    # Log to DB
                    DemandForecast(
                        category=cat,
                        forecast_date=row['ds'],
                        predicted_units=yhat,
                        model_version='1.0'
                    ).save()
                    
                forecast_data[cat] = points
                
        except Exception as e:
            # Fallback if no model
            print("Error loading Prophet model:", e)
            forecast_data = {'AC': [], 'TV': []}

        # Calculate summary metrics
        total_revenue = sum([b.total_amount for b in Booking.objects(status__in=['approved', 'active', 'returned'])])
        active_bookings = Booking.objects(status__in=['approved', 'active']).count()
        total_appliances = Appliance.objects().count()
        total_customers = User.objects(role='tenant').count()

        return Response({
            'forecasts': forecast_data,
            'summary': {
                'total_categories_tracked': len(forecast_data)
            },
            'total_revenue': total_revenue,
            'active_bookings': active_bookings,
            'total_appliances': total_appliances,
            'total_customers': total_customers
        })
