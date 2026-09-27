import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_datasets():
    os.makedirs('datasets', exist_ok=True)
    
    # 1. Recommendation Dataset
    # tenant_id, appliance_category, view_count, booking_count, rating
    print("Generating recommendation dataset...")
    n_users = 100
    categories = ['AC', 'Refrigerator', 'Washing Machine', 'Microwave', 'TV']
    recs = []
    for uid in range(1, n_users + 1):
        for cat in categories:
            if np.random.rand() > 0.3: # 70% chance a user interacted with a category
                recs.append({
                    'tenant_id': f'user_{uid}',
                    'category': cat,
                    'view_count': np.random.randint(1, 20),
                    'booking_count': np.random.randint(0, 5),
                    'rating': np.random.randint(1, 6) if np.random.rand() > 0.5 else None
                })
    pd.DataFrame(recs).to_csv('datasets/recommendation_data.csv', index=False)

    # 2. Demand Forecasting Dataset
    # date, category, active_rentals
    print("Generating forecasting dataset...")
    start_date = datetime(2023, 1, 1)
    dates = [start_date + timedelta(days=i) for i in range(365)]
    forecasts = []
    for d in dates:
        for cat in categories:
            # seasonal + random
            base = 50
            if cat == 'AC' and d.month in [5, 6, 7, 8]:
                base += 50
            active = int(base + np.random.normal(0, 10))
            forecasts.append({
                'date': d.strftime('%Y-%m-%d'),
                'category': cat,
                'active_rentals': max(0, active)
            })
    pd.DataFrame(forecasts).to_csv('datasets/demand_data.csv', index=False)

    # 3. Churn Dataset
    # tenant_id, days_since_last_booking, total_bookings, total_spent, is_churned
    print("Generating churn dataset...")
    churn_data = []
    for uid in range(1, n_users + 1):
        recency = np.random.randint(1, 365)
        frequency = np.random.randint(1, 20)
        monetary = frequency * np.random.uniform(20, 100)
        
        # High recency and low freq -> higher churn probability
        churn_prob = 0.1
        if recency > 90:
            churn_prob += 0.4
        if frequency < 3:
            churn_prob += 0.2
            
        churned = 1 if np.random.rand() < churn_prob else 0
        churn_data.append({
            'tenant_id': f'user_{uid}',
            'recency_days': recency,
            'frequency_count': frequency,
            'monetary_total': round(monetary, 2),
            'is_churned': churned
        })
    pd.DataFrame(churn_data).to_csv('datasets/churn_data.csv', index=False)
    print("Done generating synthetic datasets in backend/datasets/")

if __name__ == '__main__':
    generate_datasets()
