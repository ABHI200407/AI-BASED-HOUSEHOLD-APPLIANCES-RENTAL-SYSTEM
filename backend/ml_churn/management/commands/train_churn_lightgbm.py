from django.core.management.base import BaseCommand
import pandas as pd
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import pickle
import json
import os

class Command(BaseCommand):
    help = 'Train Customer Churn Prediction using LightGBM Classifier with SHAP/Feature Importances'

    def handle(self, *args, **kwargs):
        # 1. Prefer rental-specific dataset if available, fallback to general retail churn
        rental_path = 'datasets/kaggle/churn/rental_churn_dataset.csv'
        retail_path = 'datasets/kaggle/churn/online_retail_customer_churn.csv'

        if os.path.exists(rental_path):
            self.stdout.write(f"Loading rental-specific churn dataset from {rental_path}...")
            df = pd.read_csv(rental_path)
            feature_cols = [c for c in df.columns if c not in ['churn', 'customer_id', 'User_ID']]
            X = df[feature_cols]
            y = df['churn']
        else:
            self.stdout.write(f"Loading retail churn dataset from {retail_path}...")
            df = pd.read_csv(retail_path)
            df['recency_days'] = df['Last_Purchase_Days_Ago']
            df['frequency_count'] = df['Num_of_Purchases']
            df['monetary_total'] = df['Total_Spend']
            df['is_churned'] = df['Target_Churn'].astype(int)
            feature_cols = ['recency_days', 'frequency_count', 'monetary_total']
            X = df[feature_cols]
            y = df['is_churned']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        self.stdout.write("Training LightGBM Classifier (Gradient Boosting with leaf-wise tree growth)...")
        model = lgb.LGBMClassifier(
            n_estimators=150,
            learning_rate=0.05,
            num_leaves=31,
            class_weight='balanced',
            random_state=42,
            verbosity=-1
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        # Feature importances for explainability (XAI)
        feature_importance = dict(zip(feature_cols, [round(float(v), 2) for v in model.feature_importances_]))
        sorted_importance = dict(sorted(feature_importance.items(), key=lambda x: x[1], reverse=True))

        metrics = {
            'algorithm': 'LightGBM Classifier',
            'dataset': rental_path if os.path.exists(rental_path) else retail_path,
            'features': feature_cols,
            'accuracy': float(accuracy_score(y_test, y_pred)),
            'precision': float(precision_score(y_test, y_pred, zero_division=0)),
            'recall': float(recall_score(y_test, y_pred, zero_division=0)),
            'f1': float(f1_score(y_test, y_pred, zero_division=0)),
            'roc_auc': float(roc_auc_score(y_test, y_prob)),
            'feature_importance': sorted_importance
        }

        with open('ml_churn/metrics_lightgbm.json', 'w') as f:
            json.dump(metrics, f, indent=4)

        out_path = 'ml_churn/model_lightgbm.pkl'
        with open(out_path, 'wb') as f:
            pickle.dump(model, f)

        self.stdout.write(self.style.SUCCESS(f"\n[SUCCESS] LightGBM Churn model saved to {out_path}"))
        self.stdout.write(f"  - Accuracy: {metrics['accuracy']*100:.2f}%")
        self.stdout.write(f"  - ROC-AUC:  {metrics['roc_auc']*100:.2f}%")
        self.stdout.write(f"  - Precision:{metrics['precision']*100:.2f}%")
        self.stdout.write(f"  - Recall:   {metrics['recall']*100:.2f}%")
        self.stdout.write(f"  - F1-Score: {metrics['f1']:.4f}")
        self.stdout.write(f"  - Top Explainability Drivers (XAI): {list(sorted_importance.items())[:4]}")
