import os
from kaggle.api.kaggle_api_extended import KaggleApi
import zipfile

api = KaggleApi()
api.authenticate()

datasets = {
    'alfarisbachmid/personalized-recommendation-systems-dataset': 'recommender',
    'atomicd/retail-store-inventory-and-demand-forecasting': 'forecasting',
    'hassaneskikri/online-retail-customer-churn-dataset': 'churn'
}

base_dir = r"C:\Users\coding\Desktop\PROJECT\SDC2\backend\datasets\kaggle"
os.makedirs(base_dir, exist_ok=True)

for dataset, subfolder in datasets.items():
    print(f"Downloading {dataset}...")
    target_dir = os.path.join(base_dir, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    api.dataset_download_files(dataset, path=target_dir, unzip=True)
    print(f"Finished {dataset}.")

print("All downloads and extractions complete.")
