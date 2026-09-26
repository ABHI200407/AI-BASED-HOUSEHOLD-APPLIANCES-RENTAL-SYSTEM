from django.core.management.base import BaseCommand
import pandas as pd
import os
from ml_recommend.collaborative_engine import CollaborativeFilteringEngine

class Command(BaseCommand):
    help = 'Train the 3 types of Collaborative Filtering models (User-Based, Item-Based, Model-Based SVD)'

    def handle(self, *args, **kwargs):
        dataset_path = 'datasets/kaggle/recommender/personalized_recommendation_dataset.csv'
        if not os.path.exists(dataset_path):
            self.stdout.write(self.style.ERROR(f"Dataset not found at {dataset_path}"))
            return

        self.stdout.write("Loading personalized recommendation dataset...")
        df = pd.read_csv(dataset_path)

        self.stdout.write("Initializing Collaborative Filtering Engine...")
        engine = CollaborativeFilteringEngine(n_components=12)

        self.stdout.write("Fitting:\n  1. User-Based CF (User-User Cosine Similarity)\n  2. Item-Based CF (Item-Item Cosine Similarity)\n  3. Model-Based CF (TruncatedSVD Matrix Factorization)...")
        engine.fit_from_dataframe(df)

        out_path = 'ml_recommend/collaborative_models.pkl'
        engine.save(out_path)

        # Quick test verification
        sample_user = engine.all_users[0]
        sample_item = engine.all_items[0]
        rec_ub = engine.recommend_user_based(sample_user, top_k=3)
        rec_ib = engine.recommend_item_based(sample_item, top_k=3)
        rec_mb = engine.recommend_model_based(sample_user, top_k=3)

        self.stdout.write(self.style.SUCCESS(f"\n[SUCCESS] Collaborative Filtering Engine saved to {out_path}"))
        self.stdout.write(f"  - User-Based CF Recs for {sample_user}: {rec_ub}")
        self.stdout.write(f"  - Item-Based CF Recs for {sample_item}: {rec_ib}")
        self.stdout.write(f"  - Model-Based (SVD) Recs for {sample_user}: {rec_mb}")
