"""
Collaborative Filtering Engine for Appliance Rental Platform.
Implements the 3 fundamental types of Collaborative Filtering:
1. User-Based Collaborative Filtering (UBCF)
2. Item-Based Collaborative Filtering (IBCF)
3. Model-Based Collaborative Filtering (MBCF - TruncatedSVD / Matrix Factorization)
"""

import os
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

class CollaborativeFilteringEngine:
    def __init__(self, n_components=10):
        self.n_components = n_components
        self.user_item_matrix = None
        self.item_user_matrix = None
        self.user_similarity_df = None
        self.item_similarity_df = None
        self.svd_model = None
        self.predicted_ratings_df = None
        self.all_items = []
        self.all_users = []
        self.item_category_map = {}

    def fit_from_dataframe(self, df):
        """
        Builds interaction matrices and fits all 3 Collaborative Filtering types.
        Expects columns: ['User_ID', 'Item_ID', 'Rating'] (and optional 'Category')
        """
        # Clean & deduplicate
        sub_df = df[['User_ID', 'Item_ID', 'Rating']].dropna()
        if 'Category' in df.columns:
            cat_map = df.groupby('Item_ID')['Category'].first().to_dict()
            self.item_category_map = cat_map

        # Build pivot table: User x Item
        # Sample to a reasonable matrix size if very large
        if len(sub_df['User_ID'].unique()) > 2000:
            top_users = sub_df['User_ID'].value_counts().head(2000).index
            sub_df = sub_df[sub_df['User_ID'].isin(top_users)]

        pivot = sub_df.pivot_table(index='User_ID', columns='Item_ID', values='Rating', fill_value=0)
        self.user_item_matrix = pivot
        self.item_user_matrix = pivot.T
        self.all_users = list(pivot.index)
        self.all_items = list(pivot.columns)

        # -------------------------------------------------------------
        # 1. User-Based Collaborative Filtering (User Similarity Matrix)
        # -------------------------------------------------------------
        user_sim = cosine_similarity(self.user_item_matrix)
        self.user_similarity_df = pd.DataFrame(
            user_sim, 
            index=self.user_item_matrix.index, 
            columns=self.user_item_matrix.index
        )

        # -------------------------------------------------------------
        # 2. Item-Based Collaborative Filtering (Item Similarity Matrix)
        # -------------------------------------------------------------
        item_sim = cosine_similarity(self.item_user_matrix)
        self.item_similarity_df = pd.DataFrame(
            item_sim, 
            index=self.item_user_matrix.index, 
            columns=self.item_user_matrix.index
        )

        # -------------------------------------------------------------
        # 3. Model-Based Collaborative Filtering (TruncatedSVD Matrix Factorization)
        # -------------------------------------------------------------
        n_comps = min(self.n_components, min(pivot.shape) - 1)
        self.svd_model = TruncatedSVD(n_components=n_comps, random_state=42)
        user_factors = self.svd_model.fit_transform(pivot.values)
        item_factors = self.svd_model.components_
        
        # Reconstruct approximate rating matrix R_hat = U * Sigma * V^T
        pred_ratings = np.dot(user_factors, item_factors)
        self.predicted_ratings_df = pd.DataFrame(
            pred_ratings, 
            index=pivot.index, 
            columns=pivot.columns
        )

    # =========================================================================
    # Recommendation Methods
    # =========================================================================

    def recommend_user_based(self, user_id, top_k=5):
        """
        Type 1: User-Based Collaborative Filtering
        Finds top similar users, identifies items they rented/rated highly that
        the target user has not yet interacted with.
        """
        if user_id not in self.user_similarity_df.index:
            # Fallback to general popular items if user not in training matrix
            return self._popular_items(top_k)

        # Top 5 most similar users (excluding self)
        sim_users = self.user_similarity_df[user_id].sort_values(ascending=False).iloc[1:6]
        user_seen = self.user_item_matrix.loc[user_id]
        unseen_items = user_seen[user_seen == 0].index

        # Weighted score by user similarity
        scores = {}
        for sim_user, sim_weight in sim_users.items():
            if sim_weight <= 0:
                continue
            sim_user_ratings = self.user_item_matrix.loc[sim_user, unseen_items]
            for item, rating in sim_user_ratings.items():
                if rating > 0:
                    scores[item] = scores.get(item, 0.0) + (sim_weight * rating)

        sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        recommended_items = [item for item, _ in sorted_items[:top_k]]
        if not recommended_items:
            return self._popular_items(top_k)
        return recommended_items

    def recommend_item_based(self, target_item_id, top_k=5):
        """
        Type 2: Item-Based Collaborative Filtering
        Finds items with the highest cosine similarity vector to the target item.
        "Users who rented this appliance also rented..."
        """
        if target_item_id not in self.item_similarity_df.index:
            return self._popular_items(top_k)

        sim_items = self.item_similarity_df[target_item_id].sort_values(ascending=False).iloc[1:top_k+1]
        return list(sim_items.index)

    def recommend_model_based(self, user_id, top_k=5):
        """
        Type 3: Model-Based Collaborative Filtering (SVD Latent Factorization)
        Predicts missing ratings using decomposed low-rank latent dimensions.
        """
        if user_id not in self.predicted_ratings_df.index:
            return self._popular_items(top_k)

        user_preds = self.predicted_ratings_df.loc[user_id]
        # Exclude items the user has already rented/rated
        user_seen = self.user_item_matrix.loc[user_id]
        unseen_items = user_seen[user_seen == 0].index
        top_preds = user_preds[unseen_items].sort_values(ascending=False).head(top_k)
        return list(top_preds.index)

    def _popular_items(self, top_k=5):
        """Cold-start fallback: top-rated items by overall average."""
        if self.item_user_matrix is not None:
            avg_ratings = self.item_user_matrix.replace(0, np.nan).mean(axis=1)
            return list(avg_ratings.sort_values(ascending=False).head(top_k).index)
        return self.all_items[:top_k]

    def save(self, filepath):
        with open(filepath, 'wb') as f:
            pickle.dump(self, f)

    @staticmethod
    def load(filepath):
        with open(filepath, 'rb') as f:
            return pickle.load(f)
