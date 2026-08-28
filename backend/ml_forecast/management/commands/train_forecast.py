from django.core.management.base import BaseCommand
import pandas as pd
from prophet import Prophet
import pickle

class Command(BaseCommand):
    help = 'Train the demand forecasting Prophet model'

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading demand dataset...")
        df = pd.read_csv('datasets/kaggle/forecasting/sales_data.csv')
        
        self.stdout.write("Training Prophet models per category...")
        df['category'] = df['Category']
        df['date'] = pd.to_datetime(df['Date'])
        # Group by category and date, sum demand
        grouped = df.groupby(['category', 'date'])['Demand'].sum().reset_index()
        # Take top 5 categories
        top_cats = grouped['category'].value_counts().head(5).index
        grouped = grouped[grouped['category'].isin(top_cats)]
        
        models = {}
        for cat in grouped['category'].unique():
            cat_df = grouped[grouped['category'] == cat][['date', 'Demand']].rename(columns={'date': 'ds', 'Demand': 'y'})
            m = Prophet()
            m.fit(cat_df)
            models[cat] = m
            self.stdout.write(f"  Trained Prophet for {cat}")
            
        out_path = 'ml_forecast/model.pkl'
        with open(out_path, 'wb') as f:
            pickle.dump(models, f)
            
        self.stdout.write(self.style.SUCCESS(f"Forecast models saved to {out_path}"))
