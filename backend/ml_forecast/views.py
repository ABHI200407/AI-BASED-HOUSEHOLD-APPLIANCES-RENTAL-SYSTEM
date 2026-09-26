from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import DemandForecast
import pickle
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from bookings.models import Booking
from appliances.models import Appliance
from users.models import User
from simulation.clock import SimulationClock

class BIDashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        clock = SimulationClock()
        current_time = clock.current_time
        forecast_data = {}
        
        # Try Prophet model if available, else derive from ground-truth demand dataset
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        model_loaded = False
        try:
            with open(model_path, 'rb') as f:
                models = pickle.load(f)
                
            for cat, m in models.items():
                future = m.make_future_dataframe(periods=30)
                forecast = m.predict(future)
                future_forecast = forecast.tail(30)
                
                points = []
                for _, row in future_forecast.iterrows():
                    date_str = row['ds'].strftime('%Y-%m-%d')
                    yhat = max(0, int(row['yhat']))
                    points.append({'date': date_str, 'predicted_demand': yhat})
                forecast_data[cat] = points
            model_loaded = True
        except Exception:
            model_loaded = False

        # Grounded empirical forecasting from datasets/demand_data.csv
        if not model_loaded:
            csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'datasets', 'demand_data.csv')
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                categories = df['category'].unique()
                
                for cat in categories:
                    cat_df = df[df['category'] == cat].sort_values('date').tail(60)
                    mean_val = float(cat_df['active_rentals'].mean())
                    trend = float(np.polyfit(np.arange(len(cat_df)), cat_df['active_rentals'], 1)[0])
                    
                    points = []
                    for day_idx in range(1, 31):
                        fc_date = current_time + timedelta(days=day_idx)
                        predicted = max(5, int(mean_val + (trend * day_idx)))
                        points.append({
                            'date': fc_date.strftime('%Y-%m-%d'),
                            'predicted_demand': predicted
                        })
                        
                        # Audit log
                        try:
                            DemandForecast(
                                category=cat,
                                forecast_date=fc_date,
                                predicted_units=predicted,
                                model_version='timeseries_trend_v1'
                            ).save()
                        except Exception:
                            pass

                    forecast_data[cat] = points
            else:
                forecast_data = {'AC': [], 'Refrigerator': [], 'TV': []}

        # Calculate summary metrics from live MongoDB state
        total_revenue = sum([b.total_amount for b in Booking.objects() if b.total_amount])
        active_bookings = Booking.objects(status__in=['approved', 'active']).count()
        total_appliances = Appliance.objects().count()
        total_customers = User.objects(role='tenant').count()

        return Response({
            'forecasts': forecast_data,
            'summary': {
                'total_categories_tracked': len(forecast_data)
            },
            'total_revenue': round(total_revenue, 2),
            'active_bookings': active_bookings,
            'total_appliances': total_appliances,
            'total_customers': total_customers
        })
