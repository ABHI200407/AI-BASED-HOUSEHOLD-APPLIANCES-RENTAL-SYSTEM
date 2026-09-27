"""
Production Collaborative Filtering Engine for Appliance Rental Platform.
Implements the 3 fundamental paradigms of Collaborative Filtering:
1. User-Based Collaborative Filtering (UBCF - Cosine similarity over tenant interaction vectors)
2. Item-Based Collaborative Filtering (IBCF - Cosine similarity over appliance co-rental vectors)
3. Model-Based Collaborative Filtering (Biased FunkSVD / Latent Factor Matrix Factorization)
   Formula: r_hat(u, i) = mu + b_u + b_i + p_u^T * q_i
"""

import os
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD


class CollaborativeFilteringEngine:
    def __init__(self, n_components=15, lr=0.01, reg=0.05, n_epochs=12):
        self.n_components = n_components
        self.lr = lr
        self.reg = reg
        self.n_epochs = n_epochs
        
        # Interaction structures
        self.user_item_matrix = None
        self.item_user_matrix = None
        self.user_similarity_df = None
        self.item_similarity_df = None
        self.predicted_ratings_df = None
        
        # Biased SVD parameters
        self.global_mean = 3.5
        self.user_biases = {}
        self.item_biases = {}
        self.user_factors = {}
        self.item_factors = {}
        
        # Inventory indexes
        self.all_items = []
        self.all_users = []
        self.item_category_map = {}

    def fit_from_dataframe(self, df):
        """
        Builds interaction matrices and fits all 3 Collaborative Filtering types.
        Expects columns: ['User_ID', 'Item_ID', 'Rating'] (and optional 'Category')
        """
        sub_df = df[['User_ID', 'Item_ID', 'Rating']].dropna().copy()
        sub_df['Rating'] = pd.to_numeric(sub_df['Rating'], errors='coerce').fillna(3.5)

        if 'Category' in df.columns:
            self.item_category_map = df.groupby('Item_ID')['Category'].first().to_dict()

        self.global_mean = float(sub_df['Rating'].mean())

        # Sample for matrix efficiency if dataset exceeds standard footprint
        if len(sub_df['User_ID'].unique()) > 2000:
            top_users = sub_df['User_ID'].value_counts().head(2000).index
            sub_df = sub_df[sub_df['User_ID'].isin(top_users)]

        pivot = sub_df.pivot_table(index='User_ID', columns='Item_ID', values='Rating', fill_value=0)
        self.user_item_matrix = pivot
        self.item_user_matrix = pivot.T
        self.all_users = list(pivot.index)
        self.all_items = list(pivot.columns)

        # -------------------------------------------------------------
        # 1. User-Based Collaborative Filtering (User Cosine Matrix)
        # -------------------------------------------------------------
        user_sim = cosine_similarity(self.user_item_matrix)
        self.user_similarity_df = pd.DataFrame(
            user_sim, 
            index=self.user_item_matrix.index, 
            columns=self.user_item_matrix.index
        )

        # -------------------------------------------------------------
        # 2. Item-Based Collaborative Filtering (Item Cosine Matrix)
        # -------------------------------------------------------------
        item_sim = cosine_similarity(self.item_user_matrix)
        self.item_similarity_df = pd.DataFrame(
            item_sim, 
            index=self.item_user_matrix.index, 
            columns=self.item_user_matrix.index
        )

        # -------------------------------------------------------------
        # 3. Model-Based Collaborative Filtering: Biased FunkSVD (SGD)
        # -------------------------------------------------------------
        user_map = {u: idx for idx, u in enumerate(self.all_users)}
        item_map = {it: idx for idx, it in enumerate(self.all_items)}

        n_u = len(self.all_users)
        n_i = len(self.all_items)
        k = self.n_components

        # Initialize latent matrices and bias vectors
        np.random.seed(42)
        P = np.random.normal(0, 0.05, (n_u, k))
        Q = np.random.normal(0, 0.05, (n_i, k))
        bu = np.zeros(n_u)
        bi = np.zeros(n_i)

        # Non-zero observed training records
        records = []
        for _, row in sub_df.iterrows():
            u, it, r = row['User_ID'], row['Item_ID'], float(row['Rating'])
            if u in user_map and it in item_map:
                records.append((user_map[u], item_map[it], r))

        # SGD Stochastic Optimization
        mu = self.global_mean
        lr = self.lr
        reg = self.reg

        for _ in range(self.n_epochs):
            np.random.shuffle(records)
            for u_idx, i_idx, r in records:
                pred = mu + bu[u_idx] + bi[i_idx] + np.dot(P[u_idx], Q[i_idx])
                err = r - pred
                bu[u_idx] += lr * (err - reg * bu[u_idx])
                bi[i_idx] += lr * (err - reg * bi[i_idx])
                p_old = P[u_idx].copy()
                P[u_idx] += lr * (err * Q[i_idx] - reg * P[u_idx])
                Q[i_idx] += lr * (err * p_old - reg * Q[i_idx])

        # Store parameters
        for u, idx in user_map.items():
            self.user_biases[u] = float(bu[idx])
            self.user_factors[u] = P[idx]

        for it, idx in item_map.items():
            self.item_biases[it] = float(bi[idx])
            self.item_factors[it] = Q[idx]

        # Precompute full reconstructed matrix for O(1) latency serving
        pred_matrix = np.clip(
            mu + bu[:, np.newaxis] + bi[np.newaxis, :] + np.dot(P, Q.T),
            1.0, 5.0
        )
        self.predicted_ratings_df = pd.DataFrame(
            pred_matrix, 
            index=self.all_users, 
            columns=self.all_items
        )

    # =========================================================================
    # Recommendation Methods
    # =========================================================================

    def predict_rating(self, user_id, item_id):
        """Production zero-latency rating estimation for arbitrary (user, item) pair."""
        mu = self.global_mean
        b_u = self.user_biases.get(user_id, 0.0)
        b_i = self.item_biases.get(item_id, 0.0)
        
        if user_id in self.user_factors and item_id in self.item_factors:
            dot = np.dot(self.user_factors[user_id], self.item_factors[item_id])
            return float(np.clip(mu + b_u + b_i + dot, 1.0, 5.0))
        return float(np.clip(mu + b_u + b_i, 1.0, 5.0))

    def recommend_user_based(self, user_id, top_k=5):
        """Type 1: User-Based Collaborative Filtering (K-Nearest Tenants)."""
        if self.user_similarity_df is None or user_id not in self.user_similarity_df.index:
            return self._popular_items(top_k)

        sim_users = self.user_similarity_df[user_id].sort_values(ascending=False).iloc[1:6]
        user_seen = self.user_item_matrix.loc[user_id]
        unseen_items = user_seen[user_seen == 0].index

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
        return recommended_items if recommended_items else self._popular_items(top_k)

    def recommend_item_based(self, target_item_id, top_k=5):
        """Type 2: Item-Based Collaborative Filtering (Co-rental Affinity)."""
        if self.item_similarity_df is None or target_item_id not in self.item_similarity_df.index:
            return self._popular_items(top_k)

        sim_items = self.item_similarity_df[target_item_id].sort_values(ascending=False).iloc[1:top_k+1]
        return list(sim_items.index)

    def recommend_model_based(self, user_id, top_k=5):
        """Type 3: Biased Model-Based Matrix Factorization."""
        if self.predicted_ratings_df is not None and user_id in self.predicted_ratings_df.index:
            user_preds = self.predicted_ratings_df.loc[user_id]
            user_seen = self.user_item_matrix.loc[user_id]
            unseen = user_seen[user_seen == 0].index
            candidate_pool = unseen if len(unseen) >= top_k else self.predicted_ratings_df.columns
            return list(user_preds[candidate_pool].sort_values(ascending=False).head(top_k).index)
        
        # Cold start fallback using learned item biases
        if self.item_biases:
            sorted_items = sorted(self.item_biases.items(), key=lambda x: x[1], reverse=True)
            return [it for it, _ in sorted_items[:top_k]]
        return self._popular_items(top_k)

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
