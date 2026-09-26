import os
import pandas as pd
from datetime import datetime
from django.conf import settings
from django.contrib.auth.hashers import make_password
from users.models import User
from appliances.models import Appliance
from .models import SourceCustomer, SourceInteraction, DataProvenance

DATASET_PATHS = {
    'rental_churn': os.path.join(settings.BASE_DIR, 'datasets', 'kaggle', 'churn', 'rental_churn_dataset.csv'),
    'recommender': os.path.join(settings.BASE_DIR, 'datasets', 'kaggle', 'recommender', 'personalized_recommendation_dataset.csv'),
    'demand': os.path.join(settings.BASE_DIR, 'datasets', 'demand_data.csv'),
}

class DatasetIngestionService:
    """Ingests raw CSV datasets into Layer 1 (Source) and projects into Layer 2 (Application)."""

    @classmethod
    def ingest_rental_customers(cls, max_records=200):
        """
        Reads rental_churn_dataset.csv, populates SourceCustomer (Layer 1)
        and projects verified tenant profiles into User (Layer 2) with DataProvenance.
        """
        path = DATASET_PATHS['rental_churn']
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset not found at {path}")

        df = pd.read_csv(path)
        if max_records:
            df = df.head(max_records)

        seeded_users = 0
        for _, row in df.iterrows():
            cid = str(row['customer_id']).strip()
            
            # 1. Store immutable Layer 1 SourceCustomer
            src_cust = SourceCustomer.objects(source_customer_id=cid).first()
            if not src_cust:
                src_cust = SourceCustomer(
                    source_dataset='kaggle/churn/rental_churn_dataset.csv',
                    source_customer_id=cid,
                    tenure_months=float(row.get('tenure_months', 0)),
                    monthly_spend=float(row.get('monthly_spend', 0)),
                    active_rentals=int(row.get('active_rentals', 0)),
                    late_payments=int(row.get('late_payments', 0)),
                    early_returns=int(row.get('early_returns', 0)),
                    cart_abandonment=float(row.get('cart_abandonment', 0)),
                    days_inactive=float(row.get('days_inactive', 0)),
                    avg_rating=float(row.get('avg_rating', 0)),
                    observed_churn=int(row.get('churn', 0)),
                    imported_at=datetime.utcnow()
                ).save()

            # 2. Project into Layer 2 Application User
            tenant_email = f"{cid.lower()}@rentai.sim"
            user = User.objects(email=tenant_email).first()
            if not user:
                user = User(
                    email=tenant_email,
                    password=make_password('simpass123'),
                    full_name=f"Tenant {cid}",
                    role='tenant',
                    phone=f"+91 9800{seeded_users:06d}",
                    address=f"Unit {100 + seeded_users}, Metro Avenue, Bangalore",
                    kyc_status='verified',
                    kyc_id_type='Aadhaar',
                    kyc_id_number=f"SIM-{cid}",
                    is_active=True,
                    date_joined=datetime.utcnow()
                ).save()

                # 3. Record Data Provenance
                DataProvenance(
                    entity_type='Customer',
                    entity_id=str(user.id),
                    data_origin='source',
                    source_dataset='kaggle/churn/rental_churn_dataset.csv',
                    source_record_id=cid,
                    metadata={
                        'tenure_months': float(row.get('tenure_months', 0)),
                        'observed_churn': int(row.get('churn', 0)),
                        'avg_rating': float(row.get('avg_rating', 0))
                    }
                ).save()
                seeded_users += 1

        return {
            'status': 'success',
            'seeded_users': seeded_users,
            'total_source_customers': SourceCustomer.objects.count()
        }

    @classmethod
    def ingest_interactions(cls, max_records=2000):
        """Ingests interaction dataset to establish empirical category & preference distributions."""
        path = DATASET_PATHS['recommender']
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset not found at {path}")

        df = pd.read_csv(path, nrows=max_records)
        ingested = 0

        # Ingest interactions in bulk / loop
        for _, row in df.iterrows():
            uid = str(row['User_ID'])
            iid = str(row['Item_ID'])
            cat = str(row['Category'])

            # Only sample or check if not already present
            if not SourceInteraction.objects(user_id=uid, item_id=iid).first():
                SourceInteraction(
                    source_dataset='kaggle/recommender/personalized_recommendation_dataset.csv',
                    user_id=uid,
                    item_id=iid,
                    category=cat,
                    rating=float(row.get('Rating', 0)),
                    price=float(row.get('Price', 0)),
                    location=str(row.get('Location', '')),
                    platform=str(row.get('Platform', '')),
                    imported_at=datetime.utcnow()
                ).save()
                ingested += 1

        return {
            'status': 'success',
            'ingested_interactions': ingested,
            'total_source_interactions': SourceInteraction.objects.count()
        }

    @classmethod
    def compute_empirical_distributions(cls):
        """
        Derives realistic empirical distributions from the real source interactions
        to drive the behavior simulation without fabrication.
        """
        interactions = SourceInteraction.objects()
        if interactions.count() == 0:
            # Fallback to direct reading from CSV if DB collection is light
            path = DATASET_PATHS['recommender']
            df = pd.read_csv(path, nrows=5000)
        else:
            df = pd.DataFrame([{
                'category': i.category,
                'rating': i.rating,
                'price': i.price
            } for i in interactions[:5000]])

        cat_counts = df['category'].value_counts(normalize=True).to_dict()
        avg_ratings = df.groupby('category')['rating'].mean().to_dict()
        avg_prices = df.groupby('category')['price'].mean().to_dict()

        return {
            'category_weights': cat_counts,
            'category_avg_ratings': avg_ratings,
            'category_avg_prices': avg_prices
        }
