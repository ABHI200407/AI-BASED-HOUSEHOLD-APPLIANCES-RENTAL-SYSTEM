import os
import json
import pickle
import numpy as np
import pandas as pd
from django.core.management.base import BaseCommand
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, log_loss, confusion_matrix
)
from lightgbm import LGBMClassifier
from sklearn.ensemble import RandomForestClassifier


def engineer_features(df):
    """
    Computes domain-specific behavioral interaction ratios 
    optimized for subscription and durable rental churn prediction.
    """
    df = df.copy()
    
    # Fill missing values
    df['tenure_months'] = pd.to_numeric(df.get('tenure_months', 6), errors='coerce').fillna(6)
    df['monthly_spend'] = pd.to_numeric(df.get('monthly_spend', 1000), errors='coerce').fillna(1000)
    df['active_rentals'] = pd.to_numeric(df.get('active_rentals', 1), errors='coerce').fillna(1)
    df['late_payments'] = pd.to_numeric(df.get('late_payments', 0), errors='coerce').fillna(0)
    df['early_returns'] = pd.to_numeric(df.get('early_returns', 0), errors='coerce').fillna(0)
    df['cart_abandonment'] = pd.to_numeric(df.get('cart_abandonment', 0.2), errors='coerce').fillna(0.2)
    df['days_inactive'] = pd.to_numeric(df.get('days_inactive', 15), errors='coerce').fillna(15)
    df['avg_rating'] = pd.to_numeric(df.get('avg_rating', 4.0), errors='coerce').fillna(4.0)

    # Advanced engineered interaction ratios
    df['inactivity_tenure_ratio'] = df['days_inactive'] / (df['tenure_months'] * 30.0 + 1.0)
    df['late_payment_rate'] = df['late_payments'] / np.maximum(1, df['active_rentals'] + df['late_payments'])
    df['early_return_rate'] = df['early_returns'] / np.maximum(1, df['active_rentals'] + df['early_returns'])
    df['spend_per_tenure'] = df['monthly_spend'] / np.maximum(1, df['tenure_months'])
    df['dissatisfaction_score'] = (5.0 - df['avg_rating']) * (df['early_returns'] + 1) * (df['late_payments'] + 1)
    df['engagement_index'] = (df['active_rentals'] * df['avg_rating']) / (df['days_inactive'] + 1.0)
    df['cart_friction'] = df['cart_abandonment'] * df['days_inactive']

    feature_cols = [
        'tenure_months', 'monthly_spend', 'active_rentals', 'late_payments', 
        'early_returns', 'cart_abandonment', 'days_inactive', 'avg_rating',
        'inactivity_tenure_ratio', 'late_payment_rate', 'early_return_rate',
        'spend_per_tenure', 'dissatisfaction_score', 'engagement_index', 'cart_friction'
    ]
    return df[feature_cols]


class Command(BaseCommand):
    help = 'Production LightGBM Customer Churn Pipeline with domain feature engineering and cross-validation'

    def add_arguments(self, parser):
        parser.add_argument('--model', type=str, default='both', choices=['lightgbm', 'rf', 'both'])

    def handle(self, *args, **options):
        model_choice = options.get('model', 'both')
        self.stdout.write(self.style.NOTICE(f"=== Production Churn Pipeline [Model: {model_choice.upper()}] ==="))

        csv_path = 'datasets/kaggle/churn/rental_churn_dataset.csv'
        if not os.path.exists(csv_path):
            csv_path = 'datasets/churn_data.csv'

        self.stdout.write(f"Loading dataset from: {csv_path}")
        raw_df = pd.read_csv(csv_path)

        # Target column
        target_col = 'churn' if 'churn' in raw_df.columns else 'Target_Churn'
        if target_col not in raw_df.columns:
            target_col = 'is_churned'
        y = raw_df[target_col].astype(int)

        # Feature engineering
        X = engineer_features(raw_df)
        self.stdout.write(f"Generated {len(X.columns)} engineered features across {len(X)} customer records.")

        # 5-Fold Stratified Cross Validation
        skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        cv_metrics = {'accuracy': [], 'precision': [], 'recall': [], 'f1': [], 'auc': []}

        scale_pos = float((len(y) - sum(y)) / max(1, sum(y)))

        for train_idx, test_idx in skf.split(X, y):
            X_tr, X_val = X.iloc[train_idx], X.iloc[test_idx]
            y_tr, y_val = y.iloc[train_idx], y.iloc[test_idx]

            fold_clf = LGBMClassifier(
                n_estimators=150,
                learning_rate=0.03,
                num_leaves=15,
                max_depth=4,
                min_child_samples=10,
                subsample=0.8,
                colsample_bytree=0.8,
                reg_alpha=0.1,
                reg_lambda=1.0,
                scale_pos_weight=scale_pos,
                random_state=42,
                verbose=-1
            )
            fold_clf.fit(X_tr, y_tr)
            preds = fold_clf.predict(X_val)
            probs = fold_clf.predict_proba(X_val)[:, 1]

            cv_metrics['accuracy'].append(accuracy_score(y_val, preds))
            cv_metrics['precision'].append(precision_score(y_val, preds, zero_division=0))
            cv_metrics['recall'].append(recall_score(y_val, preds, zero_division=0))
            cv_metrics['f1'].append(f1_score(y_val, preds, zero_division=0))
            cv_metrics['auc'].append(roc_auc_score(y_val, probs))

        # Final Holdout Evaluation (80/20) for serializable artifacts
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=y)

        # 1. Fit Final Production LightGBM
        final_lgbm = LGBMClassifier(
            n_estimators=150,
            learning_rate=0.03,
            num_leaves=15,
            max_depth=4,
            min_child_samples=10,
            subsample=0.8,
            colsample_bytree=0.8,
            reg_alpha=0.1,
            reg_lambda=1.0,
            scale_pos_weight=scale_pos,
            random_state=42,
            verbose=-1
        )
        final_lgbm.fit(X_train, y_train)

        lgbm_pred = final_lgbm.predict(X_test)
        lgbm_prob = final_lgbm.predict_proba(X_test)[:, 1]
        cm_lgbm = confusion_matrix(y_test, lgbm_pred).tolist()

        feature_importances = dict(zip(X.columns, [float(x) for x in final_lgbm.feature_importances_]))
        sorted_features = sorted(feature_importances.items(), key=lambda x: x[1], reverse=True)

        # Bundle model with feature extractor for clean zero-config inference
        pipeline_artifact = {
            'model': final_lgbm,
            'feature_cols': list(X.columns),
            'scale_pos_weight': scale_pos,
            'engineer_fn': engineer_features
        }

        with open('ml_churn/model_lightgbm.pkl', 'wb') as f:
            pickle.dump(pipeline_artifact, f)
        with open('ml_churn/model.pkl', 'wb') as f:
            pickle.dump(pipeline_artifact, f)

        # 2. Fit Benchmark Random Forest
        rf = RandomForestClassifier(n_estimators=150, max_depth=6, random_state=42)
        rf.fit(X_train, y_train)
        rf_pred = rf.predict(X_test)
        rf_prob = rf.predict_proba(X_test)[:, 1]
        cm_rf = confusion_matrix(y_test, rf_pred).tolist()

        # Build production metrics dictionary
        all_metrics = {
            'status': 'Production Ready',
            'dataset': 'Kaggle Rental Churn Dataset (rental_churn_dataset.csv)',
            'samples_count': len(raw_df),
            'features_count': len(X.columns),
            'cross_validation_5_fold': {
                'accuracy': round(float(np.mean(cv_metrics['accuracy'])), 4),
                'precision': round(float(np.mean(cv_metrics['precision'])), 4),
                'recall': round(float(np.mean(cv_metrics['recall'])), 4),
                'f1_score': round(float(np.mean(cv_metrics['f1'])), 4),
                'roc_auc': round(float(np.mean(cv_metrics['auc'])), 4)
            },
            'models': {
                'LightGBM': {
                    'accuracy': round(float(accuracy_score(y_test, lgbm_pred)), 4),
                    'precision': round(float(precision_score(y_test, lgbm_pred, zero_division=0)), 4),
                    'recall': round(float(recall_score(y_test, lgbm_pred, zero_division=0)), 4),
                    'f1_score': round(float(f1_score(y_test, lgbm_pred, zero_division=0)), 4),
                    'roc_auc': round(float(roc_auc_score(y_test, lgbm_prob)), 4),
                    'log_loss': round(float(log_loss(y_test, lgbm_prob)), 4),
                    'confusion_matrix': {
                        'tn': cm_lgbm[0][0], 'fp': cm_lgbm[0][1],
                        'fn': cm_lgbm[1][0], 'tp': cm_lgbm[1][1]
                    },
                    'top_feature_drivers': sorted_features[:5]
                },
                'RandomForest': {
                    'accuracy': round(float(accuracy_score(y_test, rf_pred)), 4),
                    'precision': round(float(precision_score(y_test, rf_pred, zero_division=0)), 4),
                    'recall': round(float(recall_score(y_test, rf_pred, zero_division=0)), 4),
                    'f1_score': round(float(f1_score(y_test, rf_pred, zero_division=0)), 4),
                    'roc_auc': round(float(roc_auc_score(y_test, rf_prob)), 4),
                    'log_loss': round(float(log_loss(y_test, rf_prob)), 4),
                    'confusion_matrix': {
                        'tn': cm_rf[0][0], 'fp': cm_rf[0][1],
                        'fn': cm_rf[1][0], 'tp': cm_rf[1][1]
                    }
                }
            }
        }

        with open('ml_churn/metrics.json', 'w') as f:
            json.dump(all_metrics, f, indent=4)

        self.stdout.write(self.style.SUCCESS(f"\n[+] Production LightGBM Churn Pipeline Saved to ml_churn/model_lightgbm.pkl"))
        self.stdout.write(self.style.SUCCESS(f"[+] Metrics and Evaluation Results Saved to ml_churn/metrics.json\n"))

        self.stdout.write(f"{'Evaluation Metric':<25} | {'LightGBM (Test)':<18} | {'LightGBM (5-Fold CV)':<22} | {'Random Forest':<15}")
        self.stdout.write("-" * 85)
        for m in ['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc']:
            lgbm_t = f"{all_metrics['models']['LightGBM'][m]:.4f}"
            lgbm_cv = f"{all_metrics['cross_validation_5_fold'][m]:.4f}"
            rf_t = f"{all_metrics['models']['RandomForest'][m]:.4f}"
            self.stdout.write(f"{m.upper():<25} | {lgbm_t:<18} | {lgbm_cv:<22} | {rf_t:<15}")
