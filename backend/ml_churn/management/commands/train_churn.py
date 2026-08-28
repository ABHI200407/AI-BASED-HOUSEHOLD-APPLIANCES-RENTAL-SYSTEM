from django.core.management.base import BaseCommand
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle
import json

class Command(BaseCommand):
    help = 'Train the churn prediction Random Forest model'

    def handle(self, *args, **kwargs):
        self.stdout.write("Loading churn dataset...")
        df = pd.read_csv('datasets/kaggle/churn/online_retail_customer_churn.csv')
        df['recency_days'] = df['Last_Purchase_Days_Ago']
        df['frequency_count'] = df['Num_of_Purchases']
        df['monetary_total'] = df['Total_Spend']
        df['is_churned'] = df['Target_Churn'].astype(int)
        
        self.stdout.write("Training Random Forest Classifier...")
        
        X = df[['recency_days', 'frequency_count', 'monetary_total']]
        y = df['is_churned']
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        clf = RandomForestClassifier(n_estimators=100, random_state=42)
        clf.fit(X_train, y_train)
        
        y_pred = clf.predict(X_test)
        
        metrics = {
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1': float(f1_score(y_test, y_pred, zero_division=0))
        }
        
        with open('ml_churn/metrics.json', 'w') as f:
            json.dump(metrics, f, indent=4)
            
        out_path = 'ml_churn/model.pkl'
        with open(out_path, 'wb') as f:
            pickle.dump(clf, f)
            
        self.stdout.write(self.style.SUCCESS(f"Churn model saved to {out_path} with metrics: {metrics}"))
